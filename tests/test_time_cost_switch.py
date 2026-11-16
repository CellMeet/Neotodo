"""Appearance keeps its four display switches inside one Others fold-out.

The Theme tab used to end with separate "Time cost" and "Current time" rows.
Now they live with the top-left logo and top-right achievements switches in a
single collapsed "Others" row; opening it shows the four on/off thumbs as a
list.
"""
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class OthersSettingsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        cls.app_js = app_js
        cls.theme_body = app_js.split("function themeSettings()", 1)[1].split("function fontSettings()", 1)[0]
        cls.css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    def test_others_is_one_fold_out_row(self) -> None:
        self.assertIn("theme-others-section", self.theme_body)
        self.assertIn('data-action="toggle-theme-others"', self.theme_body)
        self.assertIn(">Others</span>", self.theme_body)
        self.assertIn('aria-expanded="${themeOthersOpen ? "true" : "false"}"', self.theme_body)
        self.assertIn('id="theme-others-panel"', self.theme_body)
        # The row is just the name and the chevron: no "3 / 4 on" tally.
        self.assertNotIn("theme-others-count", self.theme_body)
        self.assertNotIn("othersOn", self.theme_body)

    def test_the_four_switches_are_a_list(self) -> None:
        switches = (
            ('"Time cost"', '"toggle-time-cost"'),
            ('"Current time"', '"toggle-show-clock"'),
            ('"Logo"', '"toggle-show-brand"'),
            ('"Achievements"', '"toggle-show-achievements"'),
        )
        for label, action in switches:
            with self.subTest(action=action):
                self.assertIn(f"otherSwitch({label}, {action}", self.theme_body)
        # One helper renders every item, so the list has one switch pattern and
        # one visible On/Off caption beside the thumb.
        self.assertIn('class="sound-switch theme-setting-switch ${on ? "on" : "off"}"', self.theme_body)
        self.assertIn('class="theme-others-state ${on ? "on" : "off"}">${on ? "On" : "Off"}', self.theme_body)
        self.assertIn('<div class="theme-settings-title">${title}</div>', self.theme_body)

    def test_switches_follow_the_saved_state(self) -> None:
        self.assertIn("settings.show_time_cost === true", self.theme_body)
        self.assertIn("settings.show_clock !== false", self.theme_body)
        self.assertIn("settings.show_brand !== false", self.theme_body)
        self.assertIn("settings.show_achievements !== false", self.theme_body)

    def test_task_title_sliders_are_gone(self) -> None:
        self.assertNotIn(">Task title</div>", self.theme_body)
        self.assertNotIn('id="title-offset-range"', self.theme_body)
        self.assertNotIn('id="title-icon-range"', self.theme_body)

    def test_switches_sit_one_more_finger_from_the_edge(self) -> None:
        block = self.css.split(".theme-settings-controls .theme-setting-switch {", 1)[1].split("}", 1)[0]
        self.assertIn("margin-inline-end: 36px;", block)
        self.assertNotIn(".theme-clock-switch", self.css)

    def test_toggles_still_drive_the_app(self) -> None:
        self.assertIn('document.body.classList.toggle("clock-hidden", !settings.show_clock);', self.app_js)
        self.assertIn("settings.show_time_cost = !settings.show_time_cost;", self.app_js)
        self.assertIn('document.body.classList.toggle("brand-hidden", settings.show_brand === false);', self.app_js)
        self.assertIn('document.body.classList.toggle("achievements-hidden", settings.show_achievements === false);', self.app_js)
        self.assertIn('body.brand-hidden .nt-brand', self.css)
        self.assertIn('body.achievements-hidden .head-right [data-achievement]', self.css)


if __name__ == "__main__":
    unittest.main()
