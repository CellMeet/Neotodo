#!/usr/bin/env python3
"""The Windows shell answers the same bridge and backend hooks as Linux.

`windows_app.py` cannot be imported on a Linux box (PySide6 is not part of the
Linux build), so this test reads it as source. It keeps the shell from drifting
away from the `neotodo.local` bridge in `web/app.js`, from the picker callbacks
the backend calls, and from the first-frame gate the page signals.
"""
from __future__ import annotations

import ast
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHELL_SOURCE = (ROOT / "windows_app.py").read_text(encoding="utf-8")
WEB_SOURCE = (ROOT / "web" / "app.js").read_text(encoding="utf-8")


def string_literals(node: ast.AST) -> set[str]:
    return {
        child.value
        for child in ast.walk(node)
        if isinstance(child, ast.Constant) and isinstance(child.value, str)
    }


class WindowsShellParityTests(unittest.TestCase):
    def test_bridge_actions_match_the_web_bridge(self):
        # The page asks the shell for these; a new one in app.js must reach
        # windows_app.py as well.
        for call in ('windowBridge("open"', 'windowBridge("new-window"', 'windowBridge("home"'):
            self.assertIn(call, WEB_SOURCE)
        literals = string_literals(
            next(
                node
                for node in ast.walk(ast.parse(SHELL_SOURCE))
                if isinstance(node, ast.FunctionDef) and node.name == "handle_bridge"
            )
        )
        self.assertIn("home", literals)
        self.assertIn("open", literals)
        self.assertIn("new-window", literals)
        self.assertTrue(any("window/" in item for item in literals))

    def test_detached_sheet_uses_native_drag_and_resize(self):
        for action in ("move", "resize"):
            self.assertIn(f'action == "{action}"', SHELL_SOURCE)
        self.assertIn("startSystemMove", SHELL_SOURCE)
        self.assertIn("startSystemResize", SHELL_SOURCE)

    def test_backend_hooks_are_bound(self):
        for name in ("QUIT_CALLBACK", "FOLDER_PICK_CALLBACK", "FILE_PICK_CALLBACK"):
            self.assertIn(f"backend.{name}", SHELL_SOURCE)
        self.assertIn("cleanup_stale_fork_records", SHELL_SOURCE)
        self.assertIn("shutdown_forks", SHELL_SOURCE)
        self.assertIn("agent_store.shutdown", SHELL_SOURCE)

    def test_window_stays_hidden_until_the_page_is_painted(self):
        self.assertIn("app-painted", WEB_SOURCE)
        self.assertIn("app-painted", SHELL_SOURCE)
        self.assertIn("setWindowOpacity(0.0)", SHELL_SOURCE)

    def test_pickers_are_marshalled_onto_the_gui_thread(self):
        self.assertIn("class UiDispatcher", SHELL_SOURCE)
        self.assertIn("self.ui.call(choose)", SHELL_SOURCE)

    def test_shell_builds_against_shared_backend(self):
        self.assertIn("import app as backend", SHELL_SOURCE)
        tree = ast.parse(SHELL_SOURCE)
        names = {node.name for node in ast.walk(tree) if isinstance(node, ast.ClassDef)}
        self.assertTrue({"NeoTodoWebView", "MainWindow", "DetachedWindow"} <= names)


if __name__ == "__main__":
    unittest.main()
