"""The Music button answers every click, and Off is really silent.

The note beside the top tools is the Music panel's disclosure button. While the
panel is open, a second click now folds it away instead of only toggling mute;
with the panel closed, the same click keeps its old quick-mute job.

Turning background music off releases the track instead of pausing it. WebKit
can keep the last buffers of a paused HTMLAudioElement alive, which made the
switch look dead even after its state had changed.
"""
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def block_after(text: str, marker: str, stop: str) -> str:
    assert marker in text, f"missing marker: {marker}"
    return text.split(marker, 1)[1].split(stop, 1)[0]


class MusicToggleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        cls.html = (ROOT / "web" / "index.html").read_text(encoding="utf-8")

    def test_note_button_closes_the_open_music_panel(self):
        toggle = block_after(
            self.js,
            '$("#sound-toggle")?.addEventListener("click"',
            "});",
        )
        self.assertIn("if (soundPanel && !soundPanel.hidden)", toggle)
        self.assertIn("closeSoundPanel();", toggle)
        # Closing the panel wins over the old mute action.
        self.assertLess(
            toggle.index("closeSoundPanel();"),
            toggle.index("AudioFX.toggle();"),
        )

    def test_closing_music_off_releases_the_track(self):
        set_enabled = block_after(
            self.js,
            "function setEnabled(next) {",
            "\n  }\n",
        )
        self.assertIn("stop();", set_enabled)
        self.assertNotIn("pause();", set_enabled, "Off still only pauses the track")

    def test_panel_button_reports_its_state(self):
        self.assertIn('id="sound-toggle"', self.html)
        self.assertIn('aria-expanded="false"', self.html)
        self.assertIn('$("#sound-toggle")?.setAttribute("aria-expanded", "true")', self.js)
        self.assertIn('$("#sound-toggle")?.setAttribute("aria-expanded", "false")', self.js)


if __name__ == "__main__":
    unittest.main()
