#!/usr/bin/env python3
"""Fork windows are children of the notebook and close with it.

Right-clicking a subtask starts a fork app. That fork must share the
notebook's process tree (no detached session), and quitting the notebook must
stop the fork and the agents it started instead of leaving a test process
behind.
"""
from __future__ import annotations

import importlib.util
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import unittest
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

spec = importlib.util.spec_from_file_location("neotodo_app_fork_child", ROOT / "app.py")
neotodo = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(neotodo)


def write_fork_file(folder: Path) -> Path:
    now = datetime.now().isoformat(timespec="seconds")
    fork_id = "abcdef0123456789abcdef0123456789"
    data = {
        "categories": [{
            "id": "0123456789abcdef0123456789abcdef",
            "name": "Fork",
            "color": "#7aa2f7",
            "todos": [{
                "id": "fedcba9876543210fedcba9876543210",
                "name": "Forked subtask",
                "done": False,
                "created_at": now,
                "completed_at": None,
                "subtasks": [],
            }],
            "fork_app": True,
        }],
        "selected_category": "0123456789abcdef0123456789abcdef",
        "opened_category": "0123456789abcdef0123456789abcdef",
        "selected_todo": None,
        "archive": [],
        "trash": [],
        "settings": {},
        "fork": {"id": fork_id, "created_at": now, "source": {}},
    }
    path = folder / f"{fork_id}.json"
    path.write_text(json.dumps(data), encoding="utf-8")
    return path


@unittest.skipUnless(os.name == "posix", "POSIX process-tree semantics")
class ForkChildProcessTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="neotodo-fork-child-"))
        self.addCleanup(shutil.rmtree, self.tmp, True)
        self.home = self.tmp / "home"
        fork_dir = self.home / ".local/share/neotodo/forks"
        fork_dir.mkdir(parents=True)
        self._saved_env = {
            key: os.environ.get(key) for key in ("HOME", "NEOTODO_FORK_NO_WINDOW")
        }
        os.environ["HOME"] = str(self.home)
        os.environ["NEOTODO_FORK_NO_WINDOW"] = "1"
        self._saved_fork_dir = neotodo.FORK_DIR
        neotodo.FORK_DIR = fork_dir
        self.addCleanup(self._restore)

    def _restore(self):
        neotodo.stop_fork_processes(timeout=1.0)
        neotodo.FORK_DIR = self._saved_fork_dir
        for key, value in self._saved_env.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value

    def test_fork_runs_as_child_in_notebook_session(self):
        path = write_fork_file(neotodo.FORK_DIR)
        record = neotodo.spawn_fork_app_process(path)
        self.assertIsNotNone(record)
        fork_id = path.stem
        process = neotodo.FORK_PROCS.get(fork_id)
        self.assertIsNotNone(process)
        self.assertIsNone(process.poll())
        # Not detached: the fork lives in the notebook's session and process
        # group, so it is a child rather than an independent test process.
        self.assertEqual(os.getsid(process.pid), os.getsid(0))
        self.assertEqual(os.getpgid(process.pid), os.getpgid(0))
        self.assertTrue(neotodo.port_is_live(record["port"]))
        self.assertEqual(record["pid"], process.pid)
        self.assertEqual(record["parent_pid"], os.getpid())

    def test_quitting_notebook_stops_fork_and_clears_record(self):
        path = write_fork_file(neotodo.FORK_DIR)
        record = neotodo.spawn_fork_app_process(path)
        self.assertIsNotNone(record)
        fork_id = path.stem
        process = neotodo.FORK_PROCS[fork_id]
        record_path = neotodo.FORK_DIR / f"{fork_id}.server.json"
        self.assertTrue(record_path.exists())

        neotodo.shutdown_forks()

        self.assertIsNotNone(process.wait(timeout=5))
        self.assertFalse(record_path.exists())
        self.assertNotIn(fork_id, neotodo.FORK_PROCS)
        self.assertFalse(neotodo.port_is_live(record["port"]))

    def test_stale_record_with_dead_parent_is_dropped(self):
        path = write_fork_file(neotodo.FORK_DIR)
        fork_id = path.stem
        dead = subprocess.Popen([sys.executable, "-c", "pass"])
        dead.wait()
        record_path = neotodo.FORK_DIR / f"{fork_id}.server.json"
        record_path.write_text(json.dumps({
            "pid": 999999,
            "parent_pid": dead.pid,
            "port": 9,
            "started_at": datetime.now().isoformat(timespec="seconds"),
        }), encoding="utf-8")

        self.assertIsNone(neotodo.read_fork_server_record(fork_id))
        self.assertFalse(record_path.exists())

    def test_orphaned_fork_leaves_when_parent_disappears(self):
        dead = subprocess.Popen([sys.executable, "-c", "pass"])
        dead.wait()
        script = (
            "import importlib.util, sys\n"
            f"spec = importlib.util.spec_from_file_location('nfw', {str(ROOT / 'app.py')!r})\n"
            "mod = importlib.util.module_from_spec(spec)\n"
            "sys.modules['nfw'] = mod\n"
            "spec.loader.exec_module(mod)\n"
            "mod._watch_fork_parent()\n"
            "import time\n"
            "time.sleep(30)\n"
        )
        env = {**os.environ, "NEOTODO_PARENT_PID": str(dead.pid)}
        child = subprocess.Popen([sys.executable, "-c", script], env=env)
        try:
            child.wait(timeout=20)
        finally:
            if child.poll() is None:
                child.kill()
        self.assertIsNotNone(child.returncode)


if __name__ == "__main__":
    unittest.main()
