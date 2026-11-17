"""Forktree lives in Settings → Plugins, not on the left tool rail.

The blue mind-map mark used to sit in the hidden left shelf, which made the
sub-app look like a permanent feature and pushed the other rail icons down.
The rail now only keeps notebook tools and plugins that ask for a rail mark;
Forktree is opened from Settings → Plugins → Forktree → Open plugin, where its
on/off switch already lived.

These checks keep the rail free of the mark without deleting the plugin: the
fork store, the context-menu forks and the map itself still work.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web"


class ForktreeRailRemovedTests(unittest.TestCase):
    def test_rail_has_no_forktree_button(self) -> None:
        html = (WEB / "index.html").read_text(encoding="utf-8")
        rail = html.split('<div class="tool-rail"', 1)[1].split("</div>", 1)[0]
        self.assertNotIn("forktree-button", rail)
        self.assertNotIn("forktree-glyph", rail)
        self.assertNotIn('data-action="open-forktree"', rail)
        self.assertNotIn('data-plugin="forktree"', rail)
        # Removing the mark must not remove the neighbouring rows.
        for klass in ("pindou-button", "palette-button", "storage-box-button", "magic-hat-button"):
            self.assertIn(klass, rail)

    def test_plugin_stays_in_the_settings_switch(self) -> None:
        app_js = (WEB / "app.js").read_text(encoding="utf-8")
        registry = app_js.split("const PLUGIN_REGISTRY = {", 1)[1].split("\n};", 1)[0]
        self.assertIn("forktree:", registry)
        self.assertIn('id: "forktree"', registry)
        self.assertIn('entry: "/plugins/forktree/index.html"', registry)
        self.assertIn('icon: "/plugins/forktree/forktree.svg"', registry)
        # A bundled plugin is installed by default, so its row is listed under
        # Settings → Plugins and the detail page offers the open action.
        self.assertNotIn("defaultInstalled: false", registry.split("forktree:", 1)[1].split("},\n  ", 1)[0])
        self.assertIn('data-action="open-plugin"', app_js)
        self.assertIn('data-action="toggle-plugin"', app_js)

    def test_rail_styles_have_no_forktree_mark(self) -> None:
        css = (WEB / "plugins" / "plugin-host.css").read_text(encoding="utf-8")
        self.assertIsNone(re.search(r"\.forktree-(button|glyph)\b", css))

    def test_music_player_keeps_its_slot(self) -> None:
        js = (WEB / "plugins" / "music-player" / "music-player.js").read_text(encoding="utf-8")
        mount = js.split("function mountRailButton() {", 1)[1].split("}", 1)[0]
        self.assertIn("storage-box-button", mount)
        self.assertIn("anchor.before(railButton)", mount)


if __name__ == "__main__":
    unittest.main()
