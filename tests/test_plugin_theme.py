"""Every bundled plugin page wears the notebook's live theme.

The control pages under `web/plugins/<id>/` are separate documents, so each one
loads the shared `plugin-theme.js` bridge before its own stylesheet and the
shared `plugin-theme.css` after it. The bridge copies the postcard palette,
page_line, card recipe and font stacks from the host and keeps them in step
through the `neotodo-theme` message; the stylesheet maps them onto each
plugin's private variables.

The magic-hat drawer is checked here too: it is now the same card as the live
subtask sheet — a `卡片` tag, the shared ink-green stroke and page_line row
rules.
"""
from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
PLUGINS = WEB / "plugins"

# Every bundled plugin control page. Palette is absent on purpose: it opens the
# notebook's own Settings sheet and applies the palette snapshot itself.
CONTROL_PAGES = (
    "completed-drawer",
    "fireflies",
    "firelight",
    "forktree",
    "head-bar",
    "lightning",
    "music-player",
    "pindou",
    "pomodoro",
    "storage-box",
    "subtask-search",
)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def css_block(text: str, selector: str) -> str:
    assert selector in text, f"missing selector: {selector}"
    return text.split(selector, 1)[1].split("}", 1)[0]


class PluginThemeBridgeTests(unittest.TestCase):
    def test_shared_bridge_reads_the_host_theme(self) -> None:
        bridge = read(PLUGINS / "plugin-theme.js")
        self.assertIn('root.dataset.ntTheme = isDark ? "dark" : "light"', bridge)
        self.assertIn('root.dataset.postcardDark = isDark ? "true" : "false"', bridge)
        self.assertIn("window.parent.getComputedStyle(host)", bridge)
        self.assertIn('data.type !== "neotodo-theme"', bridge)
        for name in ("--pc-paper", "--page-line-paint", "--subcard-outline", "--display"):
            self.assertIn(name, bridge, name)
        for flag in ("pdDark", "cdDark", "ffDark", "flDark", "lgDark", "mpDark", "ftDark", "hbDark"):
            self.assertIn(flag, bridge, flag)

    def test_shared_stylesheet_maps_every_plugin_palette(self) -> None:
        theme = read(PLUGINS / "plugin-theme.css")
        self.assertIn("html[data-nt-theme]", theme)
        for prefix in ("pd", "cd", "ff", "fl", "lg", "sb", "ss", "mp", "hb", "ft"):
            self.assertIn(f"--{prefix}-paper", theme, prefix)
            self.assertIn(f"--{prefix}-ink", theme, prefix)
            self.assertIn(f"--{prefix}-line", theme, prefix)
        # The page surface is the theme paper, never the plugin's private wash.
        self.assertIn("background-image: none !important;", theme)
        self.assertIn("var(--page-line-paint", theme)
        self.assertIn("var(--subcard-outline", theme)

    def test_every_control_page_loads_the_bridge(self) -> None:
        for plugin_id in CONTROL_PAGES:
            index = read(PLUGINS / plugin_id / "index.html")
            bridge_at = index.find('src="../plugin-theme.js"')
            theme_at = index.find('href="../plugin-theme.css"')
            self.assertGreater(bridge_at, 0, plugin_id)
            self.assertGreater(theme_at, 0, plugin_id)
            # The bridge owns the first paint, so it must run before the plugin
            # reads the parent theme in its own boot script.
            self.assertLess(bridge_at, index.find("<script>", bridge_at), plugin_id)
            # The mapping loads last so it wins over the plugin's dark block.
            css_links = [
                index.find(f'href="{name}"')
                for name in ("plugin.css", "pindou.css", "fireflies.css", "firelight.css",
                             "lightning.css", "forktree.css", "fork-workspace.css")
                if index.find(f'href="{name}"') > 0
            ]
            self.assertTrue(css_links, plugin_id)
            self.assertGreater(theme_at, max(css_links), plugin_id)

    def test_host_message_carries_the_line_and_card_recipe(self) -> None:
        app_js = read(WEB / "app.js")
        block = app_js.split("const PALETTE_THEME_VARS = [", 1)[1].split("];", 1)[0]
        for name in (
            "--pc-paper",
            "--page-line-paint",
            "--page-line-thickness",
            "--subcard-outline",
            "--overlay-radius",
            "--card-lift-page",
            "--display",
        ):
            self.assertIn(f'"{name}"', block, name)
        observer = app_js.split("pluginThemeObserver.observe(document.documentElement", 1)[1]
        for attribute in ("data-postcard-dark", "data-postcard", "data-theme", "data-font", "style"):
            self.assertIn(f'"{attribute}"', observer, attribute)


class TrashCardTests(unittest.TestCase):
    def test_drawer_is_marked_as_a_card_with_its_tag(self) -> None:
        index = read(WEB / "index.html")
        drawer = index.split('<aside class="trash-drawer"', 1)[1].split(">", 1)[0]
        self.assertIn('data-subcard="trash"', drawer)
        self.assertIn('<span class="trash-label" aria-hidden="true">卡片</span>', index)
        self.assertIn('class="trash-label"', index)

    def test_drawer_uses_the_card_border_and_page_line(self) -> None:
        style = read(WEB / "style.css")
        drawer = css_block(style, ".trash-drawer {")
        self.assertIn("var(--overlay-paper", drawer)
        self.assertIn("var(--overlay-radius", drawer)
        self.assertIn("var(--subcard-outline, #2f5d4e)", drawer)
        self.assertIn("var(--card-lift-page", drawer)

        page_line = read(WEB / "page-line.css")
        self.assertIn('html[data-theme="postcard"] .trash-drawer .trash-head,', page_line)
        self.assertIn(
            "border-bottom: var(--page-line-thickness) solid var(--page-line-paint) !important;",
            page_line,
        )

        layers = read(WEB / "wallpaper-layers.css")
        self.assertIn("html[data-wallpaper] .trash-drawer", layers)
        self.assertIn("html[data-wallpaper] [data-subcard] > .trash-label", layers)

        stack = read(WEB / "card-stack.css")
        self.assertIn("body .trash-drawer", stack)
        self.assertIn("html[data-wallpaper] body .trash-drawer", stack)

    def test_drawer_manifest_is_not_a_plugin(self) -> None:
        # The magic hat is built into the notebook: no manifest, no rail button
        # and no community entry may appear for it.
        self.assertFalse((PLUGINS / "trash").exists())
        catalog = json.loads(read(PLUGINS / "community-catalog.json"))
        self.assertNotIn("trash", {entry.get("id") for entry in catalog.get("plugins", [])})


if __name__ == "__main__":
    unittest.main()
