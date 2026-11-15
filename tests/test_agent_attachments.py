#!/usr/bin/env python3
"""Regression tests for AI context files: pasting must add, never displace."""
from __future__ import annotations

import base64
import importlib.util
import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

spec = importlib.util.spec_from_file_location("neotodo_app_attachments", ROOT / "app.py")
neotodo = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(neotodo)

AGENT_ID = "subtask:test"


class AgentAttachmentTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="neotodo-attachments-"))
        self.addCleanup(shutil.rmtree, self.tmp, True)
        self.agents_file = self.tmp / "agents.json"
        self.agents_file.write_text('{"agents": {}}', encoding="utf-8")
        self._saved = (neotodo.AGENT_FILE, neotodo.AGENT_FILES_DIR)
        neotodo.AGENT_FILE = self.agents_file
        neotodo.AGENT_FILES_DIR = self.tmp / "agent-files"
        self.store = neotodo.AgentStore(self.agents_file)
        self.folder = neotodo.AGENT_FILES_DIR / "subtask_test"

    def tearDown(self):
        neotodo.AGENT_FILE, neotodo.AGENT_FILES_DIR = self._saved

    def paste_bytes(self, name: str, body: bytes, mime: str = "image/png") -> dict:
        return self.store.action({
            "action": "add_files",
            "agent_id": AGENT_ID,
            "attachments": [{
                "name": name,
                "type": mime,
                "data": base64.b64encode(body).decode("ascii"),
            }],
        })

    def paste_paths(self, paths: list[str]) -> dict:
        return self.store.action({
            "action": "add_paths",
            "agent_id": AGENT_ID,
            "paths": [str(path) for path in paths],
        })

    def stored_names(self) -> list[str]:
        data = json.loads(self.agents_file.read_text(encoding="utf-8"))
        files = data["agents"][AGENT_ID].get("files") or []
        return [item["name"] for item in files]

    def test_second_clipboard_image_does_not_replace_the_first(self):
        first = self.paste_bytes("image.png", b"first screenshot")
        second = self.paste_bytes("image.png", b"second screenshot")

        self.assertTrue(first["ok"])
        self.assertTrue(second["ok"])
        self.assertEqual(self.stored_names(), ["image.png", "image-2.png"])
        self.assertEqual((self.folder / "image.png").read_bytes(), b"first screenshot")
        self.assertEqual((self.folder / "image-2.png").read_bytes(), b"second screenshot")

    def test_many_pastes_keep_numbering_up(self):
        for index in range(4):
            result = self.paste_bytes("clip.png", f"shot {index}".encode())
            self.assertTrue(result["ok"])
        self.assertEqual(
            self.stored_names(),
            ["clip.png", "clip-2.png", "clip-3.png", "clip-4.png"],
        )

    def test_two_same_named_files_in_one_paste_both_land(self):
        result = self.store.action({
            "action": "add_files",
            "agent_id": AGENT_ID,
            "attachments": [
                {"name": "photo.png", "type": "image/png",
                 "data": base64.b64encode(b"one").decode("ascii")},
                {"name": "photo.png", "type": "image/png",
                 "data": base64.b64encode(b"two").decode("ascii")},
            ],
        })
        self.assertTrue(result["ok"])
        self.assertEqual(self.stored_names(), ["photo.png", "photo-2.png"])

    def test_pasting_paths_with_the_same_basename_keeps_both(self):
        first_dir = self.tmp / "one"
        second_dir = self.tmp / "two"
        first_dir.mkdir()
        second_dir.mkdir()
        (first_dir / "notes.txt").write_text("first", encoding="utf-8")
        (second_dir / "notes.txt").write_text("second", encoding="utf-8")

        result = self.paste_paths([first_dir / "notes.txt", second_dir / "notes.txt"])

        self.assertTrue(result["ok"])
        self.assertEqual(self.stored_names(), ["notes.txt", "notes-2.txt"])
        self.assertEqual((self.folder / "notes.txt").read_text(encoding="utf-8"), "first")
        self.assertEqual((self.folder / "notes-2.txt").read_text(encoding="utf-8"), "second")

    def test_removing_one_keeps_the_other_pasted_copy(self):
        self.paste_bytes("image.png", b"first screenshot")
        self.paste_bytes("image.png", b"second screenshot")

        result = self.store.action({
            "action": "remove_file",
            "agent_id": AGENT_ID,
            "name": "image.png",
        })

        self.assertTrue(result["ok"])
        self.assertEqual(self.stored_names(), ["image-2.png"])
        self.assertFalse((self.folder / "image.png").exists())
        self.assertEqual((self.folder / "image-2.png").read_bytes(), b"second screenshot")


if __name__ == "__main__":
    unittest.main()
