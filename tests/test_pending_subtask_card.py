"""The live subtask lane is a card of its own.

Unfinished rows are printed on a card: a sheet that appears on top of the page,
with one stroke on all four sides and one corner. It is exactly seven unit rows
tall, so its bottom edge lands on the page baseline.

The purple handle line is the card's bottom edge. Stretched up, the card folds
away completely — no face, no stroke — and the page underneath is its plain
ruled self again, the rows of the page line running straight across the block.

These checks guard the pieces that make that true: the markup (a `card` marker,
no printed label), the four-sided surface, the stretch control, the page rule
that keeps the rows ruled inside the card, and the ruled page that the fold
reveals.
"""
from __future__ import annotations

import sys
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


class PendingSubtaskCardTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        cls.split_css = (ROOT / "web" / "subtask-split.css").read_text(encoding="utf-8")
        cls.page_line_css = (ROOT / "web" / "page-line.css").read_text(encoding="utf-8")
        cls.card_stack_css = (ROOT / "web" / "card-stack.css").read_text(encoding="utf-8")

    def test_lane_is_printed_as_a_card(self):
        card = block_after(
            self.app_js,
            "const pendingCard = (lanes) => `",
            "`;\n",
        )
        # `card` is a marker class, not a printed label: the card carries no
        # text of its own. The old "卡片" tag is gone for good.
        self.assertIn('class="pending-subtask-card card', card)
        self.assertNotIn("pending-subtask-label", card)
        self.assertNotIn("卡片", card)
        self.assertIn("${lanes}", card)
        # The handle rides the card's bottom edge, so it lives inside the sheet
        # right after the rows it folds.
        self.assertIn(
            '${lanes}\n        <button class="pending-subtask-toggle',
            card,
        )
        # Both drawer modes (split lanes and the single combined lane) wrap the
        # unfinished rows in the same card.
        drawer = block_after(self.app_js, "const drawerMarkup = completedDrawerOn", "metaHtml =")
        self.assertEqual(drawer.count("pendingCard(`"), 2)

    def test_card_is_closed_on_all_four_sides(self):
        card = css_block(self.split_css, ".pending-subtask-card {")
        # Seven unit rows: the card never grows past the page's task sheet.
        self.assertIn("height: 100%;", card)
        self.assertIn("max-height: var(--page-task-h", card)
        # One corner, all the way round.
        self.assertIn("border-radius: var(--overlay-radius", card)

        edge = css_block(self.split_css, ".pending-subtask-card::after {")
        self.assertIn("border: 1px solid var(--subcard-outline", edge)
        self.assertNotIn("border-left: 0", edge)

    def test_folded_card_leaves_no_border_behind(self):
        folded = css_block(self.split_css, ".pending-subtask-card.collapsed {")
        self.assertIn("max-height: var(--pending-card-fold", folded)
        # The face goes with the stroke: no paper block is left behind.
        self.assertIn("background-color: transparent;", folded)
        self.assertIn("box-shadow: none;", folded)

        hidden_edge = css_block(self.split_css, ".pending-subtask-card.collapsed::after {")
        self.assertIn("opacity: 0;", hidden_edge)

    def test_fold_reveals_the_pages_own_ruling(self):
        # The ruled grid of the task block is painted by the page itself, so a
        # folded card exposes continuous lines instead of a blank block. The
        # live column must be on the same grid as the finished column.
        grid = block_after(
            self.page_line_css,
            "/* One gradient, painted by the sheet itself.",
            "}",
        )
        self.assertIn(
            "html[data-theme=\"postcard\"] .page-body > .todos-section > .current-half,",
            grid,
        )
        self.assertIn("repeating-linear-gradient", grid)

    def test_handle_rides_the_bottom_edge(self):
        toggle = css_block(self.split_css, ".pending-subtask-toggle {")
        # Centred on the card, lying on its bottom edge.
        self.assertIn("left: 50%;", toggle)
        self.assertIn("bottom: 0;", toggle)

        line = css_block(self.split_css, ".pending-subtask-line {")
        self.assertIn("background: #C8B9FC;", line)
        # Above - not on - the bottom line, like the finished-tray handle.
        self.assertRegex(line, r"bottom: \d+px;")
        self.assertIn("transition: max-height", self.split_css)

    def test_stretching_the_handle_opens_and_folds_the_card(self):
        stretch = block_after(self.app_js, "function bindPendingSubtaskToggle(", "\n}\n")
        self.assertIn('"pointerdown"', stretch)
        self.assertIn('"pointermove"', stretch)
        self.assertIn('"pointerup"', stretch)
        self.assertIn("card.style.maxHeight =", stretch)
        self.assertIn("suppressPendingSubtaskToggleUntil =", stretch)
        self.assertIn("setPendingSubtasksCollapsed(folded)", stretch)

        bind = "bindCompletedSubtasksBar();\n  bindPendingSubtaskToggle();"
        self.assertIn(bind, self.app_js)

        handler = block_after(self.app_js, "function togglePendingSubtasks(", "\n}\n")
        self.assertIn("performance.now() < suppressPendingSubtaskToggleUntil", handler)
        self.assertIn("setPendingSubtasksCollapsed(willCollapse)", handler)

        dispatch = block_after(
            self.app_js,
            'if (actionName === "toggle-pending-subtasks")',
            "\n",
        )
        self.assertIn("togglePendingSubtasks()", dispatch)

    def test_finished_tray_reads_as_a_panel_inside_the_card(self):
        # A panel inside the card throws no shadow onto the card's paper: the
        # lift is replaced by one hairline edge and a faint inner light.
        inset = 'box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.42) !important;'
        self.assertIn(inset, self.card_stack_css)
        # It must be the last word on the tray's shadow: after the page lift and
        # after the wallpaper lift that card-stack.css keeps as fallbacks.
        wallpaper_lift = self.card_stack_css.index(
            "html[data-wallpaper] body .completed-subtask-drawer {"
        )
        self.assertGreater(self.card_stack_css.index(inset), wallpaper_lift)

        # The tray closes when the card folds: a folded card has no room for the
        # panel, and two handles would sit in the same band.
        fold = block_after(self.app_js, "function setPendingSubtasksCollapsed(", "\n}\n")
        self.assertIn("setCompletedSubtasksOpen(false)", fold)
        self.assertIn(
            ".pending-subtask-card.collapsed ~ .completed-subtask-toggle",
            self.split_css,
        )

    def test_rows_keep_their_rule_inside_the_card(self):
        # The page-line selectors walk straight from the column to the lane;
        # the card adds one level, so both chains must exist.
        self.assertIn(
            "> .current-inner > .pending-subtask-card > .subtask-lanes .current-subtask,",
            self.page_line_css,
        )
        self.assertIn(
            "> .current-inner > .pending-subtask-card > .subtask-lanes "
            ".current-subtasks > .current-subtask:last-child,",
            self.page_line_css,
        )


if __name__ == "__main__":
    unittest.main()
