"""The live subtask lane is a card of its own.

Unfinished rows are printed on a sheet that is exactly seven unit rows tall,
so its bottom edge lands on the page baseline. The sheet is open on the left:
there is no divider between the finished column and this one, and no left
edge, so the two read as one page; only the right side closes with a rounded
edge. The purple handle line rides the sheet's bottom edge — folded, the sheet
is a short tab whose line sits right under the block's top line.

These checks guard the pieces that make that true: the markup, the stretch
control, the page rule that keeps the rows ruled inside the card, and the
surface that makes the finished tray read as a panel inside the card.
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

    def test_lane_is_printed_as_a_card_with_its_label(self):
        card = block_after(
            self.app_js,
            "const pendingCard = (lanes) => `",
            "`;\n",
        )
        self.assertIn('class="pending-subtask-card', card)
        self.assertIn('class="pending-subtask-label"', card)
        self.assertIn(">卡片</span>", card)
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

    def test_card_is_open_on_the_left(self):
        card = css_block(self.split_css, ".pending-subtask-card {")
        # Seven unit rows: the card never grows past the page's task sheet.
        self.assertIn("height: 100%;", card)
        self.assertIn("max-height: var(--page-task-h", card)
        # No left corner: the sheet runs into the finished column.
        self.assertIn("border-radius: 0 var(--overlay-radius", card)

        edge = css_block(self.split_css, ".pending-subtask-card::after {")
        self.assertIn("border-left: 0;", edge)

        # The column divider is the same line the card's left edge used to sit
        # on; both are gone.
        divider = css_block(
            self.split_css,
            'html[data-theme="postcard"] .page-body > .todos-section > .current-half::before {',
        )
        self.assertIn("display: none !important;", divider)

    def test_handle_rides_the_bottom_edge_and_folds_to_a_tab(self):
        toggle = css_block(self.split_css, ".pending-subtask-toggle {")
        # Centred on the card, lying on its bottom edge.
        self.assertIn("left: 50%;", toggle)
        self.assertIn("bottom: 0;", toggle)

        line = css_block(self.split_css, ".pending-subtask-line {")
        self.assertIn("background: #C8B9FC;", line)
        # Above - not on - the bottom line, like the finished-tray handle.
        self.assertRegex(line, r"bottom: \d+px;")

        # Folded, the card is a short tab: the line ends up right under the
        # block's top line because the edge it rides has travelled up.
        folded = css_block(self.split_css, ".pending-subtask-card.collapsed {")
        self.assertIn("max-height: var(--pending-card-fold", folded)
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

        # The tray closes when the card folds to its tab: a folded card has no
        # room for the panel, and two handles would sit in the same band.
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
