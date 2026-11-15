#!/usr/bin/env python3
"""Guards for the opt-in Community shop plugin.

Community used to be a Settings modal. It is now an "intheme" plugin with a
hammer rail icon, so these checks keep the manifest, host bridge, rail button,
Available list and retired Settings item in sync without a browser.
"""
from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web"
PLUGIN = WEB / "plugins" / "community"


class CommunityPluginTests(unittest.TestCase):
    def test_manifest_and_assets_exist(self) -> None:
        manifest = json.loads((PLUGIN / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(manifest["id"], "community")
        self.assertEqual(manifest["name"], "社区")
        self.assertEqual(manifest["entry"], "index.html")
        self.assertEqual(manifest["icon"], "community.svg")
        self.assertIn("intheme", manifest.get("tags", []))
        for name in ("index.html", "community.css", "community.js", "community.svg"):
            self.assertTrue((PLUGIN / name).is_file(), name)

    def test_icon_is_the_user_hammer_mark(self) -> None:
        icon = (PLUGIN / "community.svg").read_text(encoding="utf-8")
        self.assertIn('viewBox="0 0 1024 1024"', icon)
        # The hammer path from the user-provided 锤子.svg.
        self.assertIn("M509.911432", icon)

    def test_host_bridge_owns_install_and_theme_state(self) -> None:
        app_js = (WEB / "app.js").read_text(encoding="utf-8")
        self.assertIn("window.NeoTodoCommunity = {", app_js)
        for method in ("installPlugin", "removePlugin", "installTheme", "removeTheme", "applyTheme"):
            self.assertIn(f"{method}(", app_js)
        start = app_js.index("  community: {")
        block = app_js[start:app_js.index("\n  },", start)]
        self.assertIn("defaultInstalled: false", block)
        self.assertIn('"intheme"', block)
        self.assertIn('"/plugins/community/index.html"', block)
        self.assertIn('actionName === "open-community-shop"', app_js)
        self.assertIn("function openCommunityPlugin", app_js)

    def test_settings_community_item_is_gone_and_available_list_exists(self) -> None:
        app_js = (WEB / "app.js").read_text(encoding="utf-8")
        self.assertNotIn("settings-nav-item settings-nav-community", app_js)
        self.assertNotIn('data-action="open-community" aria-label="Open the Community window"', app_js)
        self.assertIn('const available = Object.values(PLUGIN_REGISTRY)', app_js)
        self.assertIn('data-action="install-plugin"', app_js)

    def test_rail_button_and_plugin_page_wiring(self) -> None:
        html = (WEB / "index.html").read_text(encoding="utf-8")
        self.assertIn('data-action="open-community-shop"', html)
        self.assertIn('data-plugin="community"', html)
        self.assertIn('src="/plugins/community/community.svg"', html)

        page = (PLUGIN / "index.html").read_text(encoding="utf-8")
        self.assertIn('data-tab="plugins"', page)
        self.assertIn('data-tab="themes"', page)
        self.assertIn("community.js", page)

        ui = (PLUGIN / "community.js").read_text(encoding="utf-8")
        self.assertIn("/api/plugins/community", ui)
        self.assertIn("/api/themes/community", ui)
        self.assertIn("window.parent.NeoTodoCommunity", ui)
        self.assertIn("data-action=\"install-plugin\"", ui)

    def test_both_catalogs_list_community_the_same_way(self) -> None:
        catalogs = []
        for path in (ROOT / "community" / "catalog.json", WEB / "plugins" / "community-catalog.json"):
            data = json.loads(path.read_text(encoding="utf-8"))
            entry = next(item for item in data["plugins"] if item["id"] == "community")
            catalogs.append([item["id"] for item in data["plugins"]])
            self.assertTrue(entry.get("bundled"))
            self.assertTrue(entry.get("official"))
            self.assertEqual(entry.get("icon"), "community.svg")
            self.assertIn("intheme", entry.get("tags", []))
        self.assertEqual(catalogs[0], catalogs[1])


if __name__ == "__main__":
    unittest.main(verbosity=2)
