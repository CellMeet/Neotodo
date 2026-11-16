"""Startup paints every floating card with its own wallpaper face.

A wallpaper card is mounted as a copy of the room first and gets its own baked
picture a few frames later. That swap is harmless while the window is hidden,
but it used to happen just after the first visible frame: the live subtask card,
the finished-subtasks card and the Doing card each visibly turned from a window
onto the room into their own sheet, which read as the page still rendering.

`init()` now bakes those faces next to the wallpaper's own first-frame wait and
only then reports the page as ready. These checks guard that contract.
"""
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def block_after(text: str, marker: str, stop: str) -> str:
    assert marker in text, f"missing marker: {marker}"
    return text.split(marker, 1)[1].split(stop, 1)[0]


class CardWallpaperPrewarmTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")

    def test_the_three_visible_cards_are_prewarmed(self):
        prewarm = block_after(
            self.app_js,
            "const CARD_PREWARM_NAMES =",
            "\n",
        )
        for name in ("pending", "doing", "completed"):
            self.assertIn(f'"{name}"', prewarm)

    def test_prewarm_waits_for_own_baked_picture(self):
        body = block_after(
            self.app_js,
            "function prewarmCardWallpaperFaces(",
            "\n}\n",
        )
        # The own card picture is the baked patch, never the live room copy.
        self.assertIn('dataset.fit === "patch"', self.app_js)
        self.assertIn("ensureCardWallpapers();", body)
        self.assertIn("primeSubcardPapers();", body)
        # The Doing card is built on a frame tick; the prewarm must build it
        # rather than let it mount after the bake has finished.
        self.assertIn("updateDoingPeek();", body)
        # A missing wallpaper must never hold startup open forever.
        self.assertIn("wallpaperBitmapCache.has(wallpaper.key)", body)

    def test_startup_waits_for_the_faces_before_going_visible(self):
        init = self.app_js.split("async function init()", 1)[1]
        start = init.index("const cardFacesReady = prewarmCardWallpaperFaces();")
        wallpaper_wait = init.index("await waitForWallpaperFrame();")
        faces_wait = init.index("await cardFacesReady;")
        ready = init.index('document.body.classList.add("app-ready")')
        painted = init.index('document.body.classList.add("app-painted")')
        self.assertLess(start, wallpaper_wait)
        self.assertLess(wallpaper_wait, faces_wait)
        self.assertLess(faces_wait, ready)
        self.assertLess(faces_wait, painted)


if __name__ == "__main__":
    unittest.main()
