"""The fork flame stays with its subtask row while the name is edited.

A forked subtask prints a small pixel flame right after its name. Opening the
name for an inline rename swaps the name span for an input; if that input grows
into the row's free space, the flame (and the done check behind it) is pushed to
the row's right edge for as long as the field is open.

These checks guard the fixed geometry: the flame is a fixed-size control that
follows the name, and the rename field only ever takes the name's place.
"""
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def block_after(text: str, marker: str, stop: str) -> str:
    assert marker in text, f"missing marker: {marker}"
    return text.split(marker, 1)[1].split(stop, 1)[0]


def css_block(text: str, selector: str) -> str:
    """The declaration block that starts with `selector {`."""
    assert selector in text, f"missing selector: {selector}"
    return text.split(selector, 1)[1].split("}", 1)[0]


class SubtaskForkFlameTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        cls.style_css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    def test_flame_follows_the_name_in_the_row(self):
        markup = block_after(
            self.app_js,
            "const subtaskRow = (subtask) => {",
            "const fillerRow",
        ).split('return `<div class="current-subtask', 1)[1]
        # The flame is the row's last control, printed after the name, so it can
        # only move when something between the two changes size.
        self.assertLess(markup.index('class="sub-name"'), markup.index("${forkLink}"))
        self.assertIn("${forkLink}", markup)

    def test_flame_is_a_fixed_size_control(self):
        flame = css_block(self.style_css, ".sub-fork-link {")
        # No grow and no shrink: only the row's other items can move it.
        self.assertIn("flex: 0 0 28px;", flame)

    def test_rename_field_does_not_grow_over_the_row(self):
        field = css_block(self.style_css, ".sub-name-input {")
        # The field takes the name's place instead of eating the row's free
        # space, which would shove the flame to the far right while editing.
        self.assertIn("flex: 0 1 auto;", field)
        self.assertIn("max-width: 100%;", field)
        self.assertNotIn("flex: 1 1 auto;", field)

    def test_rename_swaps_only_the_name(self):
        rename = block_after(
            self.app_js,
            "function startSubtaskRename(span, event) {",
            "// The current todo is renamed in place",
        )
        # The field replaces the span in place; the row is not re-rendered, so
        # the flame must keep its position from the CSS alone.
        self.assertIn("input.className = \"sub-name-input\";", rename)
        self.assertIn("span.replaceWith(input);", rename)
        self.assertNotIn("innerHTML", rename)


if __name__ == "__main__":
    unittest.main()
