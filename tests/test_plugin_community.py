#!/usr/bin/env python3
"""Focused tests for the plugin-community backend helpers."""
from __future__ import annotations

import importlib.util
import io
import json
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

spec = importlib.util.spec_from_file_location("neotodo_app", ROOT / "app.py")
neotodo = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(neotodo)


def plugin_zip(files: dict[str, str]) -> bytes:
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for name, body in files.items():
            archive.writestr(name, body)
    return buffer.getvalue()


def manifest(plugin_id: str = "test-plugin") -> dict:
    return {
        "id": plugin_id,
        "name": "Test Plugin",
        "version": "1.2.3",
        "description": "A test plugin.",
        "icon": "icon.svg",
        "entry": "index.html",
        "author": "Tester",
        "category": "utility",
        "settings": [{"id": "sound", "label": "Sound", "type": "toggle", "default": True}],
    }


class PluginCommunityTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        root = Path(self.temp.name)
        self.old_plugins = neotodo.PLUGINS_DIR
        self.old_web = neotodo.WEB_DIR
        neotodo.PLUGINS_DIR = root / "plugins"
        neotodo.WEB_DIR = root / "web"
        (neotodo.WEB_DIR / "plugins").mkdir(parents=True)

    def tearDown(self) -> None:
        neotodo.PLUGINS_DIR = self.old_plugins
        neotodo.WEB_DIR = self.old_web
        self.temp.cleanup()

    def test_install_discovers_and_removes_plugin(self) -> None:
        data = plugin_zip(
            {
                "test-plugin/manifest.json": json.dumps(manifest()),
                "test-plugin/index.html": "<!doctype html><title>Test</title>",
                "test-plugin/icon.svg": "<svg xmlns='http://www.w3.org/2000/svg'/>",
            }
        )
        installed = neotodo.install_plugin_archive(data, expected_id="test-plugin")
        self.assertEqual(installed["id"], "test-plugin")
        self.assertEqual(installed["source"], "user")
        self.assertTrue((neotodo.PLUGINS_DIR / "test-plugin" / "index.html").is_file())

        plugins = neotodo.discover_plugins()
        self.assertEqual([plugin["id"] for plugin in plugins], ["test-plugin"])
        self.assertEqual(neotodo.plugin_file_path("test-plugin", "index.html").name, "index.html")

        neotodo.uninstall_plugin_files("test-plugin")
        self.assertFalse((neotodo.PLUGINS_DIR / "test-plugin").exists())

    def test_rejects_parent_directory_entries(self) -> None:
        data = plugin_zip(
            {
                "manifest.json": json.dumps(manifest()),
                "index.html": "<!doctype html>",
                "../escape.txt": "nope",
            }
        )
        with self.assertRaises(ValueError):
            neotodo.install_plugin_archive(data)

    def test_rejects_builtin_id_collision(self) -> None:
        builtin = neotodo.WEB_DIR / "plugins" / "pindou"
        builtin.mkdir(parents=True)
        (builtin / "manifest.json").write_text(
            json.dumps({**manifest("pindou"), "name": "Pindou"}), encoding="utf-8"
        )
        (builtin / "index.html").write_text("<!doctype html>", encoding="utf-8")
        (builtin / "icon.svg").write_text("<svg/>", encoding="utf-8")
        data = plugin_zip(
            {
                "manifest.json": json.dumps(manifest("pindou")),
                "index.html": "<!doctype html>",
                "icon.svg": "<svg/>",
            }
        )
        with self.assertRaises(ValueError):
            neotodo.install_plugin_archive(data)

    def test_checksum_is_verified(self) -> None:
        data = plugin_zip(
            {
                "manifest.json": json.dumps(manifest()),
                "index.html": "<!doctype html>",
                "icon.svg": "<svg/>",
            }
        )
        with self.assertRaises(ValueError):
            neotodo.install_plugin_archive(data, expected_sha256="0" * 64)

    def test_plugin_asset_path_traversal_is_rejected(self) -> None:
        self.assertIsNone(neotodo.plugin_file_path("test-plugin", "../../etc/passwd"))
        self.assertIsNone(neotodo.plugin_file_path("../../etc", "passwd"))
        self.assertIsNone(neotodo.plugin_file_path("Bad Id", "index.html"))

    def test_catalog_metadata_is_normalized(self) -> None:
        catalog = neotodo.normalize_catalog(
            {
                "name": "Test Community",
                "plugins": [
                    {
                        "id": "good-plugin",
                        "name": "Good",
                        "version": "2.0.0",
                        "download": "https://example.com/good.zip",
                        "tags": ["one", "two"],
                    },
                    {"id": "Bad Id", "name": "Bad"},
                    {"id": "good-plugin", "name": "Duplicate"},
                ],
            }
        )
        self.assertIsNotNone(catalog)
        self.assertEqual([item["id"] for item in catalog["plugins"]], ["good-plugin"])
        self.assertEqual(catalog["plugins"][0]["download"], "https://example.com/good.zip")

    def test_bundled_entries_fill_a_stale_cache(self) -> None:
        merged = neotodo._merge_bundled_catalog(
            {"name": "Cache", "plugins": [{"id": "old-plugin"}]},
            {
                "name": "Bundled",
                "plugins": [
                    {"id": "old-plugin", "version": "1.0.0"},
                    {"id": "pomodoro", "tags": ["achievement"]},
                ],
            },
        )
        self.assertEqual([item["id"] for item in merged["plugins"]], ["old-plugin", "pomodoro"])

    def test_plugin_switch_state_survives_save_settings(self) -> None:
        cleaned = neotodo.sanitize_plugin_states(
            {
                "lightning": {"installed": True, "enabled": False, "settings": {"bottle": "pink"}},
                "pomodoro": {"installed": False, "enabled": True},
                "Bad Id": {"enabled": True},
                "pindou": {"installed": "yes", "settings": {"sound": True, "bad key": 1}},
            }
        )
        self.assertEqual(cleaned["lightning"]["enabled"], False)
        self.assertEqual(cleaned["lightning"]["settings"], {"bottle": "pink"})
        self.assertEqual(cleaned["pomodoro"], {"installed": False, "enabled": True, "settings": {}})
        self.assertNotIn("Bad Id", cleaned)
        self.assertEqual(cleaned["pindou"], {"settings": {"sound": True}})

    def test_manifest_keeps_choice_setting_rows(self) -> None:
        folder = neotodo.PLUGINS_DIR / "head-bar"
        folder.mkdir(parents=True)
        (folder / "index.html").write_text("<!doctype html>", encoding="utf-8")
        (folder / "manifest.json").write_text(
            json.dumps(
                {
                    **manifest("head-bar"),
                    "settings": [
                        {
                            "id": "bottle",
                            "type": "choice",
                            "label": "Bottle style",
                            "default": "pink",
                            "options": [
                                {"value": "blue", "label": "Blue"},
                                {"value": "pink", "label": "Pink"},
                                {"value": "", "label": "Bad"},
                            ],
                        },
                        {"id": "sound", "type": "toggle", "label": "Sound", "default": True},
                    ],
                }
            ),
            encoding="utf-8",
        )
        discovered = neotodo.discover_plugins()
        self.assertEqual(len(discovered), 1)
        rows = discovered[0]["settings"]
        self.assertEqual([row["id"] for row in rows], ["bottle", "sound"])
        bottle = rows[0]
        self.assertEqual(bottle["type"], "choice")
        self.assertEqual(bottle["default"], "pink")
        self.assertEqual([option["value"] for option in bottle["options"]], ["blue", "pink"])
        self.assertEqual(rows[1]["type"], "toggle")

    def test_choice_setting_survives_save_and_reopen(self) -> None:
        path = Path(self.temp.name) / "NeoTodo.json"
        store = neotodo.Store(path)
        result = store.action(
            {
                "action": "save_settings",
                "settings": {
                    "saved_at": 456,
                    "plugins": {
                        "head-bar": {
                            "installed": True,
                            "enabled": True,
                            "settings": {"bottle": "pink"},
                        }
                    },
                },
            }
        )
        self.assertTrue(result.get("ok"), result)
        reopened = neotodo.Store(path).state()
        self.assertEqual(
            reopened["settings"]["plugins"]["head-bar"]["settings"]["bottle"], "pink"
        )

    def test_save_settings_persists_plugin_switches(self) -> None:
        path = Path(self.temp.name) / "NeoTodo.json"
        store = neotodo.Store(path)
        result = store.action(
            {
                "action": "save_settings",
                "settings": {
                    "saved_at": 123,
                    "plugins": {"lightning": {"installed": True, "enabled": False}},
                },
            }
        )
        self.assertTrue(result.get("ok"), result)
        saved = json.loads(path.read_text(encoding="utf-8"))
        self.assertEqual(saved["settings"]["plugins"]["lightning"]["enabled"], False)
        reopened = neotodo.Store(path).state()
        self.assertEqual(reopened["settings"]["plugins"]["lightning"]["enabled"], False)


if __name__ == "__main__":
    unittest.main(verbosity=2)
