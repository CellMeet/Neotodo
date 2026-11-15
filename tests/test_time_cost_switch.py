"""Time cost and current time are two on/off switches, side by side.

The Theme tab used to fold both display toggles into one row titled "Current
time": a "Time cost" text chip next to the clock switch. That read as if the
switch belonged to the chip. Each toggle now has its own row and its own
Sound-style switch, and both switches sit one more finger clear of the right
edge of the panel.
"""
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class TimeCostSwitchTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        cls.theme_body = app_js.split("function themeSettings()", 1)[1].split("function fontSettings()", 1)[0]
        cls.css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    def row_for(self, title: str) -> str:
        """The settings row whose title is exactly `title`."""
        marker = f'<div class="theme-settings-title">{title}</div>'
        self.assertIn(marker, self.theme_body)
        before = self.theme_body.split(marker, 1)[0]
        start = before.rfind('<div class="settings-section theme-settings-row">')
        end = self.theme_body.find("</div>\n    </div>", self.theme_body.find(marker))
        return self.theme_body[start:end]

    def test_time_cost_has_its_own_switch_row(self) -> None:
        row = self.row_for("Time cost")
        self.assertIn('data-action="toggle-time-cost"', row)
        self.assertIn("sound-switch theme-setting-switch", row)
        self.assertIn('${settings.show_time_cost ? "on" : "off"}', row)
        self.assertIn('${settings.show_time_cost ? "true" : "false"}', row)
        # The old text chip is gone; a switch carries the state now.
        self.assertNotIn("theme-chip", row)
        self.assertIn("Turn time cost", row)

    def test_current_time_keeps_its_own_switch_row(self) -> None:
        row = self.row_for("Current time")
        self.assertIn('data-action="toggle-show-clock"', row)
        self.assertIn("sound-switch theme-setting-switch", row)
        self.assertIn('${settings.show_clock ? "on" : "off"}', row)
        self.assertNotIn("theme-chip", row)

    def test_task_title_sliders_are_gone(self) -> None:
        self.assertNotIn(">Task title</div>", self.theme_body)
        self.assertNotIn('id="title-offset-range"', self.theme_body)
        self.assertNotIn('id="title-icon-range"', self.theme_body)

    def test_switches_sit_one_more_finger_from_the_edge(self) -> None:
        block = self.css.split(".theme-settings-controls .theme-setting-switch {", 1)[1].split("}", 1)[0]
        self.assertIn("margin-inline-end: 36px;", block)
        self.assertNotIn(".theme-clock-switch", self.css)

    def test_toggles_still_drive_the_app(self) -> None:
        self.assertIn('document.body.classList.toggle("clock-hidden", !settings.show_clock);', self.css + (ROOT / "web" / "app.js").read_text(encoding="utf-8"))
        self.assertIn("settings.show_time_cost = !settings.show_time_cost;", (ROOT / "web" / "app.js").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
