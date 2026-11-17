"""Settings keeps Card and Stickers as two shelves.

Card holds the four floating surfaces; Stickers sits directly below it and
holds the achievement badges. Both use the same row — picture, name, Change —
and the picture is cropped while it is chosen: the reader drags a selection
box over the photo instead of nudging zoom sliders afterwards.
"""
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class CardSettingsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        cls.card_body = cls.app_js.split("function cardSettingsRow(", 1)[1].split(
            "function soundSettings()", 1
        )[0]
        cls.crop_body = cls.app_js.split("function openCardCropDialog(", 1)[1].split(
            "function cardWallpaperPreviewSource()", 1
        )[0]
        cls.css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    def test_tabs_are_separate_and_stickers_follows_card(self) -> None:
        self.assertIn('data-settings-tab="card">Card</button>', self.app_js)
        self.assertIn('data-settings-tab="stickers">Stickers</button>', self.app_js)
        card_at = self.app_js.index('data-settings-tab="card">Card</button>')
        stickers_at = self.app_js.index('data-settings-tab="stickers">Stickers</button>')
        self.assertLess(card_at, stickers_at)

    def test_card_lists_only_cards(self) -> None:
        card_only = self.app_js.split("function cardSettings()", 1)[1].split(
            "function stickersSettings()", 1
        )[0]
        self.assertIn("CARD_TARGETS.map", card_only)
        self.assertNotIn("availableStickerTargets()", card_only)

    def test_stickers_lists_only_achievements(self) -> None:
        sticker_only = self.app_js.split("function stickersSettings()", 1)[1].split(
            "function soundSettings()", 1
        )[0]
        self.assertIn("availableStickerTargets()", sticker_only)
        self.assertNotIn("CARD_TARGETS.map", sticker_only)

    def test_one_row_with_picture_name_and_change(self) -> None:
        self.assertIn("card-setting-preview", self.app_js)
        self.assertIn("card-setting-name", self.card_body)
        self.assertIn(">Change</button>", self.card_body)
        self.assertNotIn("Choose picture", self.app_js)
        self.assertIn('data-action="choose-wallpaper">Change</button>', self.app_js)

    def test_rows_are_separated_by_a_hairline(self) -> None:
        item = self.css.split(".card-setting-item + .card-setting-item {", 1)[1].split("}", 1)[0]
        self.assertIn("border-top: 1px solid", item)

    def test_cropping_happens_in_a_box_while_choosing(self) -> None:
        self.assertIn("function openCardCropDialog(key, file)", self.app_js)
        self.assertIn('data-crop-selection', self.crop_body)
        self.assertIn('data-crop-handle', self.crop_body)
        self.assertIn("function cropPictureToDataUrl(image, rect, maxEdge)", self.app_js)
        self.assertIn("Drag a box over the part you want to keep.", self.crop_body)
        # The old after-the-fact zoom/position controls are gone.
        self.assertNotIn("data-card-crop", self.app_js)
        self.assertNotIn("card-crop-panel", self.app_js)

    def test_pomodoro_sticker_waits_for_its_plugin(self) -> None:
        availability = self.app_js.split("function stickerTargetAvailable(target)", 1)[1].split("}", 1)[0]
        self.assertIn("pluginEnabled(target.plugin)", availability)

    def test_backend_persists_card_images(self) -> None:
        app_py = (ROOT / "app.py").read_text(encoding="utf-8")
        self.assertIn('CARD_IMAGE_TARGET_IDS = ("pending", "doing", "completed", "trash")', app_py)
        self.assertIn("def sanitize_card_images(raw)", app_py)
        self.assertIn('current["card_images"] = sanitize_card_images', app_py)
        self.assertIn('settings["card_images"] = sanitize_card_images', app_py)


if __name__ == "__main__":
    unittest.main()
