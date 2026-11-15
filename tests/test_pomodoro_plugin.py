#!/usr/bin/env python3
"""Guards for the opt-in pomodoro achievement plugin.

The pomodoro is the first plugin to claim the top-right "achievement" shelf.
These checks keep the manifest tag, the built-in headphone marker and the two
catalog copies in sync without needing a browser.
"""
from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web"
PLUGIN = WEB / "plugins" / "pomodoro"


class PomodoroPluginTests(unittest.TestCase):
    def test_manifest_is_achievement_tagged(self) -> None:
        manifest = json.loads((PLUGIN / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(manifest["id"], "pomodoro")
        tags = {str(tag).lower() for tag in manifest.get("tags", [])}
        self.assertIn("achievement", tags)
        self.assertIn("成就", tags)
        for name in ("index.html", "plugin.css", "plugin.js", "pomodoro.svg"):
            self.assertTrue((PLUGIN / name).is_file(), name)

    def test_pomodoro_starts_opt_in(self) -> None:
        app_js = (WEB / "app.js").read_text(encoding="utf-8")
        start = app_js.index("  pomodoro: {")
        block = app_js[start:app_js.index("\n  },", start)]
        self.assertIn("defaultInstalled: false", block)
        self.assertIn('"achievement"', block)

    def test_header_holds_the_builtin_and_plugin_slots(self) -> None:
        html = (WEB / "index.html").read_text(encoding="utf-8")
        # The headphones carry the built-in achievement marker; the tomato is
        # the opt-in plugin slot next to them.
        self.assertIn('data-achievement="completed"', html)
        self.assertIn('data-achievement-plugin="pomodoro"', html)
        app_js = (WEB / "app.js").read_text(encoding="utf-8")
        # Any tagged plugin gets a slot and pushes the older achievements left.
        self.assertIn("const ACHIEVEMENT_TAGS", app_js)
        self.assertIn("function renderAchievementShelf", app_js)
        self.assertIn("function animateAchievementShift", app_js)

    def test_both_catalogs_list_pomodoro_the_same_way(self) -> None:
        catalogs = []
        for path in (ROOT / "community" / "catalog.json", WEB / "plugins" / "community-catalog.json"):
            data = json.loads(path.read_text(encoding="utf-8"))
            entry = next(item for item in data["plugins"] if item["id"] == "pomodoro")
            catalogs.append([item["id"] for item in data["plugins"]])
            tags = {str(tag).lower() for tag in entry.get("tags", [])}
            self.assertIn("achievement", tags)
            self.assertTrue(entry.get("bundled"))
        self.assertEqual(catalogs[0], catalogs[1])


if __name__ == "__main__":
    unittest.main(verbosity=2)
