"""Working-folder listing and fallback used by the napkin card next to a todo."""
from __future__ import annotations

import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import app


class ProjectFolderTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / "src").mkdir()
        (self.root / "src" / "main.py").write_text("print('hi')\n", encoding="utf-8")
        (self.root / "src" / "nested").mkdir()
        (self.root / "src" / "nested" / "deep.md").write_text("deep\n", encoding="utf-8")
        (self.root / "README.md").write_text("readme\n", encoding="utf-8")
        (self.root / "node_modules").mkdir()
        (self.root / "node_modules" / "noise.js").write_text("", encoding="utf-8")
        (self.root / ".git").mkdir()
        (self.root / ".git" / "config").write_text("", encoding="utf-8")

    def tearDown(self) -> None:
        self.temp.cleanup()

    def test_files_skip_noisy_folders(self):
        files = app.list_folder_files(str(self.root))
        self.assertIn("README.md", files)
        self.assertIn("src/main.py", files)
        self.assertIn("src/nested/deep.md", files)
        self.assertNotIn("node_modules/noise.js", files)
        self.assertFalse(any(name.startswith(".git") for name in files))

    def test_dir_lists_one_level_folders_first(self):
        entries = app.list_folder_dir(str(self.root))
        self.assertEqual([entry["name"] for entry in entries], ["src", "README.md"])
        self.assertTrue(entries[0]["dir"])
        self.assertEqual(entries[0]["count"], 2)
        self.assertEqual(entries[0]["path"], "src")
        self.assertFalse(entries[1]["dir"])

    def test_dir_subpath_keeps_root_relative_paths(self):
        entries = app.list_folder_dir(str(self.root), "src")
        self.assertEqual([entry["path"] for entry in entries], ["src/nested", "src/main.py"])
        nested = app.list_folder_dir(str(self.root), "src/nested")
        self.assertEqual([entry["path"] for entry in nested], ["src/nested/deep.md"])

    def test_dir_rejects_paths_outside_the_folder(self):
        self.assertEqual(app.list_folder_dir(str(self.root), "../.."), [])
        self.assertEqual(app.list_folder_dir(str(self.root), "missing"), [])

    def test_dir_handles_missing_folder(self):
        self.assertEqual(app.list_folder_dir(str(self.root / "gone")), [])

    def test_agent_workspace_uses_the_linked_folder(self):
        self.assertEqual(app.agent_workspace(str(self.root)), self.root.resolve())

    def test_agent_workspace_falls_back_to_the_app_folder(self):
        fallback = Path(os.environ.get("NEOTODO_AGENT_CWD") or app.APP_DIR).expanduser()
        expected = fallback.resolve() if fallback.is_dir() else app.APP_DIR.resolve()
        self.assertEqual(app.agent_workspace(""), expected)
        self.assertEqual(app.agent_workspace(str(self.root / "gone")), expected)


class ProjectFilesActionTests(unittest.TestCase):
    """The napkin card asks the backend where each todo really works."""

    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / "src").mkdir()
        (self.root / "README.md").write_text("readme\n", encoding="utf-8")
        self.patches = [
            mock.patch.dict(os.environ, {"NEOTODO_AGENT_CWD": str(self.root)}),
            mock.patch.object(app, "load_data", side_effect=lambda *_args, **_kwargs: {
                "categories": [], "settings": {}, "archive": [], "trash": [],
            }),
            mock.patch.object(app, "save_data", lambda data, *_args, **_kwargs: None),
        ]
        for patch in self.patches:
            patch.start()
        self.store = app.Store(Path(self.root) / "data.json")
        category = self.store.action({"action": "add_category", "name": "AI DIY"})
        created = self.store.action({
            "action": "add_todo",
            "category_id": category["created"],
            "name": "Neotodo",
        })
        self.todo_id = created["created"]

    def tearDown(self) -> None:
        for patch in reversed(self.patches):
            patch.stop()
        self.temp.cleanup()

    def test_unlinked_todo_is_listed_in_the_default_workspace(self):
        result = self.store.action({"action": "project_files", "id": self.todo_id})
        self.assertTrue(result["ok"])
        self.assertFalse(result["linked"])
        self.assertEqual(result["folder"], str(app.agent_workspace()))
        self.assertTrue(result["exists"])
        self.assertIn("src", [entry["name"] for entry in result["entries"]])
        self.assertEqual(self.store.state()["default_project_folder"], str(self.root.resolve()))

    def test_linked_todo_lists_that_folder(self):
        bind = self.store.action({
            "action": "bind_project_folder",
            "id": self.todo_id,
            "path": str(self.root),
        })
        self.assertTrue(bind["ok"])
        result = self.store.action({"action": "project_files", "id": self.todo_id})
        self.assertTrue(result["linked"])
        self.assertTrue(result["linked_exists"])
        self.assertEqual(result["folder"], str(self.root.resolve()))
        self.assertEqual([entry["name"] for entry in result["entries"]], ["src", "README.md"])

    def test_missing_linked_folder_reports_the_default_workspace(self):
        linked = self.root / "linked-project"
        linked.mkdir()
        self.store.action({
            "action": "bind_project_folder",
            "id": self.todo_id,
            "path": str(linked),
        })
        linked.rmdir()
        result = self.store.action({"action": "project_files", "id": self.todo_id})
        self.assertTrue(result["linked"])
        self.assertFalse(result["linked_exists"])
        self.assertEqual(result["folder"], str(self.root.resolve()))
        self.assertIn("src", [entry["name"] for entry in result["entries"]])

    def test_open_project_folder_reveals_it_in_the_system_manager(self):
        bound = self.store.action({
            "action": "bind_project_folder",
            "id": self.todo_id,
            "path": str(self.root),
        })
        self.assertTrue(bound["ok"])
        with mock.patch.object(app, "reveal_in_file_manager") as reveal:
            result = self.store.action({"action": "open_project_folder", "id": self.todo_id})
        self.assertTrue(result["ok"])
        reveal.assert_called_once_with(self.root.resolve())

    def test_open_project_folder_works_without_a_current_todo(self):
        with mock.patch.object(app, "reveal_in_file_manager") as reveal:
            result = self.store.action({"action": "open_project_folder", "id": ""})
        self.assertTrue(result["ok"])
        reveal.assert_called_once_with(app.agent_workspace())


class RevealInFileManagerTests(unittest.TestCase):
    """The napkin never draws its own file list: the desktop selects the folder."""

    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.folder = self.root / "NeoTodo"
        self.folder.mkdir()

    def tearDown(self) -> None:
        self.temp.cleanup()

    def test_commands_select_the_folder_inside_its_parent(self):
        available = {"gdbus", "nautilus", "dolphin", "nemo", "caja", "xdg-open"}
        with mock.patch.object(
            app.shutil, "which", side_effect=lambda name: f"/usr/bin/{name}" if name in available else None,
        ):
            commands = app.file_manager_reveal_commands(self.folder)
        self.assertIn("org.freedesktop.FileManager1.ShowItems", commands[0])
        self.assertIn(f"['{self.folder.as_uri()}']", commands[0])
        self.assertIn(["/usr/bin/nautilus", "--select", str(self.folder)], commands)
        # The last resort opens the parent, so the folder is visible to pick.
        self.assertIn(["/usr/bin/xdg-open", str(self.root)], commands)
        self.assertNotIn(["/usr/bin/xdg-open", str(self.folder)], commands)

    def test_a_missing_folder_reveals_its_closest_existing_parent(self):
        gone = self.root / "gone" / "project"
        with mock.patch.object(
            app.shutil, "which", side_effect=lambda name: "/usr/bin/xdg-open" if name == "xdg-open" else None,
        ):
            commands = app.file_manager_reveal_commands(gone)
        # The nearest surviving folder (the temp root) is selected in its own
        # parent, so the reader sees it highlighted instead of an empty error.
        self.assertEqual(commands, [["/usr/bin/xdg-open", str(self.root.parent)]])



if __name__ == "__main__":
    unittest.main()
