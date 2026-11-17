"""Every Settings shelf starts on the same left edge.

Stickers sits under Card in the nav, but it used to be pushed in by an extra
16px of padding while its font dropped a size: the word started in a blank
gutter instead of on the shelf edge, so it read as a broken label rather than
a child row. Stickers now uses the plain nav item, which lines its first
letter up with Card, Font, Plugins and the rest.
"""
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class SettingsNavAlignTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        cls.css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    def test_stickers_uses_the_plain_nav_item(self) -> None:
        self.assertIn(
            'class="settings-nav-item ${settingsTab === "stickers" ? "active" : ""}" '
            'data-settings-tab="stickers">Stickers</button>',
            self.app_js,
        )
        self.assertNotIn("settings-nav-sub", self.app_js)

    def test_no_indented_nav_variant_is_left_in_the_stylesheet(self) -> None:
        self.assertNotIn(".settings-nav-item.settings-nav-sub", self.css)

    def test_stickers_still_follows_card(self) -> None:
        card_at = self.app_js.index('data-settings-tab="card">Card</button>')
        stickers_at = self.app_js.index('data-settings-tab="stickers">Stickers</button>')
        self.assertLess(card_at, stickers_at)


if __name__ == "__main__":
    unittest.main()
