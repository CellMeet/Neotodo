#!/usr/bin/env python3
"""Focused tests for the agent run journal (resume after an app restart)."""
from __future__ import annotations

import importlib.util
import json
import os
import shutil
import stat
import sys
import tempfile
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

spec = importlib.util.spec_from_file_location("neotodo_app_resume", ROOT / "app.py")
neotodo = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(neotodo)


def fake_opencode(folder: Path, body: str) -> Path:
    """Write a tiny stand-in for the opencode CLI and return its path."""
    target = folder / "fake-opencode"
    target.write_text("#!/bin/sh\n" + body, encoding="utf-8")
    target.chmod(target.stat().st_mode | stat.S_IEXEC)
    return target


class AgentResumeTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="neotodo-resume-"))
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

    def write_run(self, resumes: int = 0) -> None:
        self.runs_file.write_text(
            json.dumps({"subtask:test": {
                "title": "do work",
                "scope": {"kind": "subtask", "todo": "t"},
                "message": "make it",
                "model": "deepseek/deepseek-flash",
                "mode": "build",
                "resumes": resumes,
            }}),
            encoding="utf-8",
        )

    def messages(self) -> list:
        data = json.loads(self.agents_file.read_text(encoding="utf-8"))
        return data["agents"]["subtask:test"]["messages"]

    def runs(self) -> dict:
        return json.loads(self.runs_file.read_text(encoding="utf-8"))

    def wait_for(self, predicate, timeout: float = 6.0) -> bool:
        deadline = time.time() + timeout
        while time.time() < deadline:
            if predicate():
                return True
            time.sleep(0.05)
        return predicate()

    def test_pending_turn_is_resumed_in_the_same_session(self):
        self.write_agent([
            {"role": "user", "content": "make it"},
            {"role": "assistant", "content": "half done", "pending": True},
        ])
        self.write_run()
        calls = []
        saved_spawn = neotodo.AgentStore._spawn_run
        neotodo.AgentStore._spawn_run = lambda store, **kwargs: calls.append(kwargs)
        self.addCleanup(setattr, neotodo.AgentStore, "_spawn_run", saved_spawn)

        store = neotodo.AgentStore(self.agents_file, resume=True)
        self.assertTrue(self.wait_for(lambda: calls))
        self.assertTrue(calls[0]["resume"])
        self.assertEqual(calls[0]["agent_id"], "subtask:test")
        self.assertEqual(calls[0]["message"], "make it")
        self.assertEqual(calls[0]["history"], [])
        # The streaming turn must survive for the resumed run to fill it.
        self.assertTrue(self.messages()[-1].get("pending"))
        self.assertEqual(self.runs()["subtask:test"]["resumes"], 1)
        self.assertEqual(store.action({"action": "running"})["running"], ["subtask:test"])

    def test_second_instance_never_resumes_another_copy_runs(self):
        self.write_agent([
            {"role": "user", "content": "make it"},
            {"role": "assistant", "content": "half done", "pending": True},
        ])
        self.write_run()
        calls = []
        saved_spawn = neotodo.AgentStore._spawn_run
        neotodo.AgentStore._spawn_run = lambda store, **kwargs: calls.append(kwargs)
        self.addCleanup(setattr, neotodo.AgentStore, "_spawn_run", saved_spawn)

        neotodo.AgentStore(self.agents_file, resume=False)
        time.sleep(0.4)
        self.assertEqual(calls, [])
        self.assertTrue(self.messages()[-1].get("pending"))
        self.assertIn("subtask:test", self.runs())

    def test_settled_turn_drops_the_journal(self):
        self.write_agent([
            {"role": "user", "content": "make it"},
            {"role": "assistant", "content": "done"},
        ])
        self.write_run()
        calls = []
        saved_spawn = neotodo.AgentStore._spawn_run
        neotodo.AgentStore._spawn_run = lambda store, **kwargs: calls.append(kwargs)
        self.addCleanup(setattr, neotodo.AgentStore, "_spawn_run", saved_spawn)

        neotodo.AgentStore(self.agents_file, resume=True)
        time.sleep(0.3)
        self.assertEqual(calls, [])
        self.assertEqual(self.runs(), {})

    def test_orphan_without_journal_settles_as_interrupted(self):
        self.write_agent([
            {"role": "user", "content": "make it"},
            {"role": "assistant", "content": "half done", "pending": True},
        ])
        neotodo.AgentStore(self.agents_file, resume=True)
        last = self.messages()[-1]
        self.assertNotIn("pending", last)
        self.assertIn("已中断", last["content"])

    def test_finished_run_and_pause_remove_the_journal(self):
        fake = fake_opencode(
            self.tmp,
            "echo '{\"type\":\"text\",\"sessionID\":\"ses_fake\",\"part\":{\"text\":\"all done\"}}'\n",
        )
        neotodo.shutil.which = lambda name: str(fake) if name == "opencode" else None
        store = neotodo.AgentStore(self.agents_file, resume=True)
        result = store.action({
            "action": "chat", "agent_id": "subtask:test", "title": "do work",
            "scope": {"kind": "subtask", "todo": "t"}, "message": "make it",
            "model": "deepseek/deepseek-flash", "mode": "build",
        })
        self.assertTrue(result["ok"])
        self.assertTrue(self.runs(), "the run must be journaled while it works")
        self.assertTrue(self.wait_for(lambda: store._load_runs() == {}))
        self.assertEqual(self.messages()[-1]["content"], "all done")
        self.assertIsNone(self.messages()[-1].get("interrupted"))

    def test_pause_marks_the_turn_and_never_resumes_it(self):
        fake = fake_opencode(
            self.tmp,
            "echo '{\"type\":\"text\",\"sessionID\":\"ses_fake\",\"part\":{\"text\":\"working\"}}'\n"
            "sleep 30\n",
        )
        neotodo.shutil.which = lambda name: str(fake) if name == "opencode" else None
        store = neotodo.AgentStore(self.agents_file, resume=True)
        store.action({
            "action": "chat", "agent_id": "subtask:test", "title": "do work",
            "scope": {"kind": "subtask", "todo": "t"}, "message": "make it",
            "model": "deepseek/deepseek-flash", "mode": "build",
        })
        self.assertTrue(self.wait_for(lambda: store._load_runs() != {}, timeout=3.0))
        time.sleep(0.4)
        self.assertTrue(store.action({"action": "interrupt", "agent_id": "subtask:test"})["interrupted"])
        self.assertTrue(self.wait_for(lambda: not store._load_runs()))
        self.assertTrue(self.wait_for(lambda: not self.messages()[-1].get("pending")))
        last = self.messages()[-1]
        self.assertTrue(last.get("interrupted"))
        self.assertNotIn("pending", last)

    def test_closing_the_app_keeps_the_journal(self):
        fake = fake_opencode(
            self.tmp,
            "echo '{\"type\":\"text\",\"sessionID\":\"ses_fake\",\"part\":{\"text\":\"part one\"}}'\n"
            "sleep 30\n",
        )
        neotodo.shutil.which = lambda name: str(fake) if name == "opencode" else None
        store = neotodo.AgentStore(self.agents_file, resume=True)
        store.action({
            "action": "chat", "agent_id": "subtask:test", "title": "do work",
            "scope": {"kind": "subtask", "todo": "t"}, "message": "make it",
            "model": "deepseek/deepseek-flash", "mode": "build",
        })
        time.sleep(0.5)
        store.shutdown()
        time.sleep(0.3)
        self.assertTrue(self.messages()[-1].get("pending"))
        self.assertIn("subtask:test", self.runs())


if __name__ == "__main__":
    unittest.main()
