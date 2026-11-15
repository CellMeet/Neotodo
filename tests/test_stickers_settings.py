"""Settings → Stickers keeps the badge names and nothing else.

The tab used to explain itself: a "stored in the notebook" label, a hint under
each badge name ("The trophy that counts finished tasks") and a footnote about
where the picture lives and when the tomato appears. All of that is gone, and
so is the header line — the page name now sits in the top row beside the close
button. Only the achievement names and their buttons remain.

Two rules follow the same idea: a plugin achievement (the Pomodoro tomato)
only lists while its plugin owns a header slot, and every preview is painted
at the real header badge's size rather than on a blown-up card.
"""
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class StickerSettingsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        cls.stickers_body = cls.app_js.split("function stickersSettings()", 1)[1].split("function soundSettings()", 1)[0]
        cls.css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    def test_explaining_header_line_is_gone(self) -> None:
        self.assertNotIn(
            "The picture on each achievement. Pick any image and it sits on that badge.",
            self.stickers_body,
        )
        self.assertNotIn("settings-head", self.stickers_body)

    def test_cards_show_only_the_badge_name(self) -> None:
        self.assertIn("sticker-setting-name", self.stickers_body)
        self.assertNotIn("sticker-setting-hint", self.stickers_body)
        self.assertNotIn("The trophy that counts finished tasks", self.stickers_body)
        self.assertNotIn("The tomato that counts focus rounds", self.stickers_body)

    def test_footnote_and_storage_label_are_gone(self) -> None:
        self.assertNotIn("sticker-footnote", self.stickers_body)
        self.assertNotIn("stored in the notebook", self.stickers_body)
        self.assertNotIn(
            "A sticker is saved inside NeoTodo, so it stays with the notebook even if the original picture moves.",
            self.stickers_body,
        )
        self.assertNotIn("The tomato needs the Pomodoro plugin switched on.", self.stickers_body)

    def test_pomodoro_sticker_waits_for_its_plugin(self) -> None:
        # Only achievements that own a header slot are listed; the tomato joins
        # the list when the Pomodoro plugin is switched on.
        self.assertIn("const targets = availableStickerTargets();", self.stickers_body)
        self.assertNotIn("Plugin off", self.stickers_body)
        availability = self.app_js.split("function stickerTargetAvailable(target)", 1)[1].split("}", 1)[0]
        self.assertIn("pluginEnabled(target.plugin)", availability)

    def test_preview_copies_the_header_badge_size(self) -> None:
        self.assertIn("function headerStickerBox(target)", self.app_js)
        box_body = self.app_js.split("function headerStickerBox(target)", 1)[1].split("}", 1)[0]
        self.assertIn("offsetWidth", box_body)
        self.assertIn("offsetHeight", box_body)
        self.assertIn("const box = headerStickerBox(target);", self.stickers_body)
        self.assertIn('style="width:${box.width}px;height:${box.height}px"', self.stickers_body)
        preview = self.css.split(".sticker-setting-preview {", 1)[1].split("}", 1)[0]
        self.assertIn("width: 109px;", preview)
        self.assertIn("height: 56px;", preview)
        self.assertNotIn("height: 118px;", self.css)


if __name__ == "__main__":
    unittest.main()
