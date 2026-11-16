#!/usr/bin/env python3
"""Closing the app interrupts every agent; a restart never resumes a run."""
from __future__ import annotations

import importlib.util
import ast
import json
import re
import shutil
import stat
import sys
import tempfile
import threading
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

spec = importlib.util.spec_from_file_location("neotodo_app_shutdown", ROOT / "app.py")
neotodo = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(neotodo)


def fake_opencode(folder: Path, body: str) -> Path:
    """Write a tiny stand-in for the opencode CLI and return its path."""
    target = folder / "fake-opencode"
    target.write_text("#!/bin/sh\n" + body, encoding="utf-8")
    target.chmod(target.stat().st_mode | stat.S_IEXEC)
    return target


class AgentShutdownTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="neotodo-shutdown-"))
        self.addCleanup(shutil.rmtree, self.tmp, True)
        self.agents_file = self.tmp / "agents.json"
        self.runs_file = self.tmp / "agent-runs.json"
        self._saved = (
            neotodo.AGENT_FILE,
            neotodo.AGENT_RUNS_FILE,
            neotodo.AGENT_FILES_DIR,
            neotodo.shutil.which,
            neotodo.AgentStore._session_usage,
            neotodo.AgentStore._available_models,
        )
        neotodo.AGENT_FILE = self.agents_file
        neotodo.AGENT_RUNS_FILE = self.runs_file
        neotodo.AGENT_FILES_DIR = self.tmp / "agent-files"
        neotodo.AgentStore._session_usage = staticmethod(lambda session: {})
        neotodo.AgentStore._available_models = lambda store: ["deepseek/deepseek-flash"]
        self.agents_file.write_text('{"agents": {}}', encoding="utf-8")

    def tearDown(self):
        (
            neotodo.AGENT_FILE,
            neotodo.AGENT_RUNS_FILE,
            neotodo.AGENT_FILES_DIR,
            neotodo.shutil.which,
            neotodo.AgentStore._session_usage,
            neotodo.AgentStore._available_models,
        ) = self._saved

    def write_agent(self, messages: list, session: str = "ses_1") -> None:
        self.agents_file.write_text(
            json.dumps({"agents": {"subtask:test": {
                "title": "do work",
                "model": "deepseek/deepseek-flash",
                "mode": "build",
                "opencode_session": session,
                "messages": messages,
            }}}),
            encoding="utf-8",
        )

    def write_legacy_run(self) -> None:
        self.runs_file.write_text(
            json.dumps({"subtask:test": {
                "title": "do work",
                "scope": {"kind": "subtask", "todo": "t"},
                "message": "make it",
                "model": "deepseek/deepseek-flash",
                "mode": "build",
            }}),
            encoding="utf-8",
        )

    def messages(self) -> list:
        data = json.loads(self.agents_file.read_text(encoding="utf-8"))
        return data["agents"]["subtask:test"]["messages"]

    def wait_for(self, predicate, timeout: float = 6.0) -> bool:
        deadline = time.time() + timeout
        while time.time() < deadline:
            if predicate():
                return True
            time.sleep(0.05)
        return predicate()

    def test_pending_turn_is_settled_not_resumed(self):
        self.write_agent([
            {"role": "user", "content": "make it"},
            {"role": "assistant", "content": "half done", "pending": True},
        ])
        self.write_legacy_run()
        calls = []
        saved_spawn = neotodo.AgentStore._spawn_run
        neotodo.AgentStore._spawn_run = lambda store, **kwargs: calls.append(kwargs)
        self.addCleanup(setattr, neotodo.AgentStore, "_spawn_run", saved_spawn)

        neotodo.AgentStore(self.agents_file)
        time.sleep(0.4)
        self.assertEqual(calls, [])
        last = self.messages()[-1]
        self.assertNotIn("pending", last)
        self.assertIn("已中断", last["content"])
        self.assertTrue(last.get("interrupted"))
        self.assertFalse(self.runs_file.exists())

    def test_legacy_journal_never_starts_a_run(self):
        self.write_agent([
            {"role": "user", "content": "make it"},
            {"role": "assistant", "content": "done"},
        ])
        self.write_legacy_run()
        calls = []
        saved_spawn = neotodo.AgentStore._spawn_run
        neotodo.AgentStore._spawn_run = lambda store, **kwargs: calls.append(kwargs)
        self.addCleanup(setattr, neotodo.AgentStore, "_spawn_run", saved_spawn)

        store = neotodo.AgentStore(self.agents_file)
        time.sleep(0.4)
        self.assertEqual(calls, [])
        self.assertEqual(store.action({"action": "running"})["running"], [])
        self.assertFalse(self.runs_file.exists())
        self.assertEqual(self.messages()[-1]["content"], "done")

    def test_fork_startup_does_not_settle_a_live_run(self):
        self.write_agent([
            {"role": "user", "content": "make it"},
            {"role": "assistant", "content": "half done", "pending": True},
        ])
        neotodo.AgentStore(self.agents_file, settle_pending=False)
        last = self.messages()[-1]
        self.assertTrue(last.get("pending"))
        self.assertNotIn("interrupted", last)

    def test_shutdown_interrupts_a_running_agent(self):
        fake = fake_opencode(
            self.tmp,
            "echo '{\"type\":\"text\",\"sessionID\":\"ses_fake\",\"part\":{\"text\":\"working\"}}'\n"
            "sleep 30\n",
        )
        neotodo.shutil.which = lambda name: str(fake) if name == "opencode" else None
        store = neotodo.AgentStore(self.agents_file)
        store.action({
            "action": "chat", "agent_id": "subtask:test", "title": "do work",
            "scope": {"kind": "subtask", "todo": "t"}, "message": "make it",
            "model": "deepseek/deepseek-flash", "mode": "build",
        })
        self.assertTrue(self.wait_for(
            lambda: self.messages()[-1].get("pending"),
            timeout=3.0,
        ))
        store.shutdown()
        self.assertTrue(self.wait_for(
            lambda: not self.messages()[-1].get("pending"),
            timeout=3.0,
        ))
        last = self.messages()[-1]
        self.assertEqual(last["role"], "assistant")
        self.assertTrue(last.get("interrupted"))
        self.assertNotIn("pending", last)
        self.assertFalse(self.runs_file.exists())
        self.assertTrue(self.wait_for(
            lambda: store.action({"action": "running"})["running"] == [],
            timeout=3.0,
        ))

    def test_finished_run_keeps_its_answer_after_relaunch(self):
        fake = fake_opencode(
            self.tmp,
            "echo '{\"type\":\"text\",\"sessionID\":\"ses_fake\",\"part\":{\"text\":\"all done\"}}'\n",
        )
        neotodo.shutil.which = lambda name: str(fake) if name == "opencode" else None
        store = neotodo.AgentStore(self.agents_file)
        store.action({
            "action": "chat", "agent_id": "subtask:test", "title": "do work",
            "scope": {"kind": "subtask", "todo": "t"}, "message": "make it",
            "model": "deepseek/deepseek-flash", "mode": "build",
        })
        self.assertTrue(self.wait_for(lambda: self.messages()[-1].get("content") == "all done"))
        store.shutdown()
        calls = []
        saved_spawn = neotodo.AgentStore._spawn_run
        neotodo.AgentStore._spawn_run = lambda store, **kwargs: calls.append(kwargs)
        self.addCleanup(setattr, neotodo.AgentStore, "_spawn_run", saved_spawn)
        neotodo.AgentStore(self.agents_file)
        time.sleep(0.3)
        self.assertEqual(calls, [])
        self.assertEqual(self.messages()[-1]["content"], "all done")

    def test_pause_marks_the_turn_and_never_restarts_it(self):
        fake = fake_opencode(
            self.tmp,
            "echo '{\"type\":\"text\",\"sessionID\":\"ses_fake\",\"part\":{\"text\":\"working\"}}'\n"
            "sleep 30\n",
        )
        neotodo.shutil.which = lambda name: str(fake) if name == "opencode" else None
        store = neotodo.AgentStore(self.agents_file)
        store.action({
            "action": "chat", "agent_id": "subtask:test", "title": "do work",
            "scope": {"kind": "subtask", "todo": "t"}, "message": "make it",
            "model": "deepseek/deepseek-flash", "mode": "build",
        })
        self.assertTrue(self.wait_for(
            lambda: self.messages()[-1].get("pending"),
            timeout=3.0,
        ))
        time.sleep(0.4)
        self.assertTrue(store.action({"action": "interrupt", "agent_id": "subtask:test"})["interrupted"])
        self.assertTrue(self.wait_for(lambda: not self.messages()[-1].get("pending")))
        last = self.messages()[-1]
        self.assertTrue(last.get("interrupted"))
        self.assertFalse(self.runs_file.exists())

    def test_immediate_pause_cannot_miss_the_worker(self):
        fake = fake_opencode(
            self.tmp,
            "echo '{\"type\":\"text\",\"sessionID\":\"ses_fake\",\"part\":{\"text\":\"working\"}}'\n"
            "sleep 30\n",
        )
        neotodo.shutil.which = lambda name: str(fake) if name == "opencode" else None
        store = neotodo.AgentStore(self.agents_file)
        for _ in range(3):
            result = store.action({
                "action": "chat", "agent_id": "subtask:test", "title": "do work",
                "scope": {"kind": "subtask", "todo": "t"}, "message": "make it",
                "model": "deepseek/deepseek-flash", "mode": "chat",
            })
            self.assertTrue(result["ok"])
            # No sleep: this is the Popen registration gap that used to be
            # reported as "not running" and let the agent keep going.
            self.assertTrue(store.action(
                {"action": "interrupt", "agent_id": "subtask:test"}
            )["interrupted"])
            self.assertTrue(self.wait_for(
                lambda: not self.messages()[-1].get("pending"),
                timeout=4.0,
            ))
            self.assertTrue(self.messages()[-1].get("interrupted"))
            self.assertNotIn("错误", self.messages()[-1].get("content", ""))
            self.assertTrue(self.wait_for(
                lambda: store.action({"action": "running"})["running"] == [],
                timeout=4.0,
            ))

    def test_pause_during_model_discovery_cannot_be_dropped(self):
        fake = fake_opencode(
            self.tmp,
            "echo '{\"type\":\"text\",\"sessionID\":\"ses_fake\",\"part\":{\"text\":\"working\"}}'\n"
            "sleep 30\n",
        )
        neotodo.shutil.which = lambda name: str(fake) if name == "opencode" else None
        store = neotodo.AgentStore(self.agents_file)
        entered = threading.Event()
        release = threading.Event()
        saved_models = neotodo.AgentStore._available_models

        def slow_models(store_obj):
            entered.set()
            release.wait(5)
            return ["deepseek/deepseek-flash"]

        neotodo.AgentStore._available_models = slow_models
        self.addCleanup(setattr, neotodo.AgentStore, "_available_models", saved_models)

        result = {}

        def chat():
            result["chat"] = store.action({
                "action": "chat", "agent_id": "subtask:test", "title": "do work",
                "scope": {"kind": "subtask", "todo": "t"}, "message": "make it",
                "model": "deepseek/deepseek-flash", "mode": "chat",
            })

        thread = threading.Thread(target=chat)
        thread.start()
        # No run exists yet: the request is still discovering models. Esc must
        # still be remembered and cancel the turn that is about to start.
        self.assertTrue(entered.wait(3.0))
        self.assertTrue(store.action(
            {"action": "interrupt", "agent_id": "subtask:test"}
        )["interrupted"])
        release.set()
        thread.join(timeout=10.0)
        self.assertTrue(self.wait_for(
            lambda: self.messages()[-1].get("interrupted")
        ))
        self.assertTrue(self.wait_for(
            lambda: store.action({"action": "running"})["running"] == [],
            timeout=4.0,
        ))

    def test_new_instruction_starts_after_a_pause(self):
        fake = fake_opencode(
            self.tmp,
            "echo '{\"type\":\"text\",\"sessionID\":\"ses_fake\",\"part\":{\"text\":\"working\"}}'\n"
            "sleep 30\n",
        )
        neotodo.shutil.which = lambda name: str(fake) if name == "opencode" else None
        store = neotodo.AgentStore(self.agents_file)
        store.action({
            "action": "chat", "agent_id": "subtask:test", "title": "do work",
            "scope": {"kind": "subtask", "todo": "t"}, "message": "first",
            "model": "deepseek/deepseek-flash", "mode": "chat",
        })
        self.assertTrue(self.wait_for(lambda: self.messages()[-1].get("pending"), timeout=3.0))
        self.assertTrue(store.action(
            {"action": "interrupt", "agent_id": "subtask:test"}
        )["interrupted"])
        self.assertTrue(self.wait_for(lambda: not self.messages()[-1].get("pending")))
        self.assertTrue(self.wait_for(
            lambda: store.action({"action": "running"})["running"] == [],
            timeout=4.0,
        ))

        # A stale pause flag must not cancel the user's next instruction.
        fake.write_text(
            "#!/bin/sh\n"
            "echo '{\"type\":\"text\",\"sessionID\":\"ses_fake\",\"part\":{\"text\":\"second done\"}}'\n",
            encoding="utf-8",
        )
        result = store.action({
            "action": "chat", "agent_id": "subtask:test", "title": "do work",
            "scope": {"kind": "subtask", "todo": "t"}, "message": "second",
            "model": "deepseek/deepseek-flash", "mode": "chat",
        })
        self.assertTrue(result["ok"])
        self.assertTrue(self.wait_for(
            lambda: self.messages()[-1].get("content") == "second done",
            timeout=5.0,
        ))
        self.assertIsNone(self.messages()[-1].get("interrupted"))

    def test_shutdown_kills_the_agent_grandchildren(self):
        marker = self.tmp / "grandchild.pid"
        fake = fake_opencode(
            self.tmp,
            "sleep 30 &\n"
            f"echo $! > {marker}\n"
            "sleep 30\n",
        )
        neotodo.shutil.which = lambda name: str(fake) if name == "opencode" else None
        store = neotodo.AgentStore(self.agents_file)
        store.action({
            "action": "chat", "agent_id": "subtask:test", "title": "do work",
            "scope": {"kind": "subtask", "todo": "t"}, "message": "make it",
            "model": "deepseek/deepseek-flash", "mode": "chat",
        })
        self.assertTrue(self.wait_for(lambda: marker.exists(), timeout=3.0))
        grandchild = int(marker.read_text(encoding="utf-8").strip())
        self.assertTrue(neotodo.pid_is_alive(grandchild))

        store.shutdown()

        self.assertTrue(self.wait_for(
            lambda: not neotodo.pid_is_alive(grandchild),
            timeout=3.0,
        ))

    def test_closing_rejects_a_new_instruction(self):
        fake = fake_opencode(self.tmp, "sleep 30\n")
        neotodo.shutil.which = lambda name: str(fake) if name == "opencode" else None
        store = neotodo.AgentStore(self.agents_file)
        store.shutdown()
        result = store.action({
            "action": "chat", "agent_id": "subtask:test", "title": "do work",
            "scope": {"kind": "subtask", "todo": "t"}, "message": "make it",
            "model": "deepseek/deepseek-flash", "mode": "chat",
        })
        self.assertFalse(result["ok"])
        self.assertEqual(store.action({"action": "running"})["running"], [])

    def test_closing_releases_a_queued_build_slot(self):
        store = neotodo.AgentStore(self.agents_file)
        store.shutdown()
        # No worker may acquire a build slot and start OpenCode afterwards.
        self.assertFalse(store._acquire_build_slot("subtask:test", "", set()))
        self.assertEqual(store.build_waiting, {})
        self.assertEqual(store.build_active, {})

    def test_read_only_actions_never_start_an_agent(self):
        calls = []
        saved_spawn = neotodo.AgentStore._spawn_run
        neotodo.AgentStore._spawn_run = lambda store, **kwargs: calls.append(kwargs)
        self.addCleanup(setattr, neotodo.AgentStore, "_spawn_run", saved_spawn)
        store = neotodo.AgentStore(self.agents_file)
        store.action({"action": "list"})
        store.action({"action": "running"})
        store.action({"action": "config"})
        store.action({"action": "get", "agent_id": "subtask:test"})
        store.action({"action": "chat", "agent_id": "subtask:test", "message": "   "})
        self.assertEqual(calls, [])

    def test_only_the_chat_action_can_spawn_an_agent(self):
        tree = ast.parse((ROOT / "app.py").read_text(encoding="utf-8"))
        stack = []
        calls = []

        class Finder(ast.NodeVisitor):
            def visit_FunctionDef(self, node):
                stack.append(node.name)
                self.generic_visit(node)
                stack.pop()

            visit_AsyncFunctionDef = visit_FunctionDef

            def visit_Call(self, node):
                if isinstance(node.func, ast.Attribute) and node.func.attr == "_spawn_run":
                    calls.append(list(stack))
                self.generic_visit(node)

        Finder().visit(tree)
        self.assertEqual([entry[-1] for entry in calls], ["action"])

        js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        # Exactly one request asks the backend to start a run, and it lives in
        # sendAgentMessage().
        self.assertEqual(js.count('action: "chat"'), 1)
        # Definition plus two user gestures only: form submit and Enter.
        self.assertEqual(len(re.findall(r"sendAgentMessage\(\)", js)), 3)
        for plugin in (ROOT / "web" / "plugins").rglob("*.js"):
            self.assertNotIn('action: "chat"', plugin.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
