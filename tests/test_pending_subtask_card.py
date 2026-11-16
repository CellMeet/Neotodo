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
        cls.layers_css = (ROOT / "web" / "wallpaper-layers.css").read_text(encoding="utf-8")

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
        # Centred on the card and lying on its bottom edge. The strip is placed
        # by `top`, not `bottom`, so an empty lane can tuck the pill above the
        # card's top boundary and pull it back down when a row arrives.
        self.assertIn("left: 50%;", toggle)
        self.assertIn("top: calc(100% - 30px);", toggle)
        self.assertIn("bottom: auto;", toggle)

        line = css_block(self.split_css, ".pending-subtask-line {")
        # One purple for both subtask handles; the old pale lavender read as
        # grey on the warm paper.
        self.assertIn("background: var(--subtask-handle, #A855F7);", line)
        self.assertIn("--subtask-handle: #A855F7;", self.split_css)
        # Above - not on - the bottom line, like the finished-tray handle.
        self.assertRegex(line, r"bottom: \d+px;")
        self.assertIn("transition: max-height", self.split_css)

    def test_empty_lane_keeps_the_handle_tucked_above_the_card(self):
        # Nothing to fold, no handle: the pill waits above the card's clipped
        # top boundary, out of sight and out of reach.
        hidden = css_block(self.split_css, ".pending-subtask-toggle.line-hidden {")
        self.assertIn("top: -30px;", hidden)
        self.assertIn("opacity: 0;", hidden)
        self.assertIn("pointer-events: none;", hidden)
        self.assertIn("@keyframes pending-subtask-line-pull", self.split_css)
        self.assertIn(".pending-subtask-toggle.line-reveal", self.split_css)

        # The handle belongs to the rows: the first row (or the inline add row)
        # is what pulls it out again.
        bind = block_after(self.app_js, "function bindPendingSubtaskToggle(", "\n}\n")
        self.assertIn("syncSubtaskHandleLine(", bind)
        self.assertIn('[data-add-subtask-row]', bind)
        helper = block_after(self.app_js, "function syncSubtaskHandleLine(", "\n}\n")
        self.assertIn('bar.classList.toggle("line-hidden", !show);', helper)
        self.assertIn('bar.classList.add("line-reveal");', helper)

    def test_live_sheet_folds_on_the_near_instant_beat(self):
        # The live card travels the whole task block, so it gets the near-instant
        # beat instead of the old 0.3s crawl: it must unfold and fold in one
        # short wipe, as fast as the rest of the panels.
        card = css_block(self.split_css, ".pending-subtask-card {")
        self.assertIn("max-height 0.12s", card)
        self.assertIn("background-color 0.12s", card)
        # Every layer that leaves during the fold fades on the same beat, so the
        # words and the paper edge arrive together.
        lanes = css_block(self.split_css, ".pending-subtask-card .subtask-lanes {")
        self.assertIn("opacity 0.12s", lanes)
        edge = css_block(self.split_css, ".pending-subtask-card::after {")
        self.assertIn("opacity 0.12s", edge)
        toggle = css_block(
            self.split_css,
            ".pending-subtask-card.collapsed > .pending-subtask-toggle {",
        )
        self.assertIn("transform 0.12s", toggle)

    def test_wallpaper_face_is_clipped_by_the_fold_not_recropped(self):
        # A centred cover fit re-crops the picture inside the shrinking pane, so
        # the wallpaper panned at half the fold's speed. Top-anchored, the moving
        # edge is the only thing that clips the face.
        self.assertIn(
            '#pending-subtask-card > .card-wallpaper[data-fit="patch"] > .wallpaper-media',
            self.layers_css,
        )
        self.assertIn("object-position: 50% 0;", self.layers_css)
        folded = block_after(
            self.layers_css,
            "html[data-wallpaper] #pending-subtask-card.collapsed > .card-wallpaper {",
            "\n}\n",
        )
        self.assertIn("opacity: 0;", folded)
        self.assertIn("opacity 0.12s", folded)

    def test_folded_handle_hides_in_the_top_band_and_follows_the_first_row(self):
        # A folded card has no rows on the page, so its purple line is not left
        # lying there either: it retreats beyond the card's clipped top edge.
        self.assertIn(
            ".pending-subtask-card.collapsed > .pending-subtask-toggle {",
            self.split_css,
        )
        tucked = block_after(self.split_css, "@media (hover: hover) {", "\n}")
        self.assertIn("transform: translateY(-44px);", tucked)
        self.assertIn("opacity: 0;", tucked)
        self.assertIn("pointer-events: none;", tucked)
        # Keyboard focus keeps the line reachable even on a hover-capable sheet.
        self.assertIn(":not(:focus-visible)", tucked)

        # The first row of the column is the handle: entering its band slides
        # the line back out, leaving tucks it away again. A click still unfolds.
        bind = block_after(self.app_js, "function bindPendingSubtaskToggle(", "\n}\n")
        self.assertIn("const peekZone = card.parentElement;", bind)
        self.assertIn("const peekBand = 42;", bind)
        self.assertIn('bar.classList.toggle("peek", inside);', bind)
        self.assertIn("pointerenter", bind)
        self.assertIn("pointerleave", bind)
        # A held edge owns the line and must not be tucked away mid-stretch.
        self.assertIn("const peekPaused = () => bar.classList.contains", bind)
        self.assertIn("if (event.pointerType === \"touch\" || peekPaused()) return;", bind)

    def test_finished_handle_appears_with_the_first_finished_row(self):
        hidden = css_block(
            self.split_css,
            ".completed-subtask-toggle.line-hidden {",
        )
        self.assertIn("transform: translateY(-100%);", hidden)
        self.assertIn("pointer-events: none;", hidden)
        self.assertIn("@keyframes completed-subtask-line-pull", self.split_css)

        bind = block_after(self.app_js, "function bindCompletedSubtasksBar(", "\n}\n")
        self.assertIn("syncSubtaskHandleLine(bar, hasFinishedRows", bind)
        self.assertIn('.current-subtask[data-subtask-id]', bind)
        # A tray left open with no rows closes, so it cannot hide behind a
        # handle that is no longer there.
        self.assertIn("if (!hasFinishedRows && completedSubtasksOpen)", bind)

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
            "html[data-wallpaper][data-wallpaper-cards] body #completed-subtask-drawer {"
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

    def test_card_wears_the_wallpaper_like_every_other_sheet(self):
        # The live subtask card carries the same marker as the finished tray and
        # the Doing card, so the wallpaper pane engine bakes a face for it too.
        self.assertIn('data-subcard="pending"', self.app_js)
        self.assertIn(
            'SUBCARD_FLOATING = new Set(["pending", "doing", "completed", "trash"])',
            self.app_js,
        )
        # The card face keeps the subtask area's 140% sample at its own centre.
        # Every card samples the same object — the bottom wallpaper — so no
        # upper card picks a darker slice from the card below it.
        self.assertIn("SUBCARD_PAPER_REGION = 1.4", self.app_js)
        self.assertIn("function subcardSampleObjectFor(wallpaper)", self.app_js)
        crop = block_after(self.app_js, "function subcardCropSource(", "\n}\n")
        self.assertIn("box.width * region", crop)
        self.assertIn("box.height * region", crop)
        self.assertNotIn("subcardSampleCenter", self.app_js)

        # On a wallpaper the pane is the card's whole face: no paper, no second
        # edge, and the pile keeps the one shared lift.
        self.assertIn(
            "html[data-wallpaper][data-wallpaper-cards] #pending-subtask-card,",
            self.layers_css,
        )
        self.assertIn(
            'html[data-wallpaper] #pending-subtask-card > .card-wallpaper[data-fit="patch"] '
            "> .wallpaper-media,",
            self.layers_css,
        )
        self.assertIn(
            "html[data-wallpaper][data-wallpaper-cards] body #pending-subtask-card {",
            self.card_stack_css,
        )

        # The handle stays pinned to the card's bottom edge, above the picture,
        # and a folded card hides its pane together with its face.
        toggle = block_after(
            self.layers_css,
            "html[data-wallpaper] #pending-subtask-card > .pending-subtask-toggle {",
            "\n}\n",
        )
        self.assertIn("position: absolute;", toggle)
        self.assertIn("z-index: 12;", toggle)
        folded = block_after(
            self.layers_css,
            "html[data-wallpaper] #pending-subtask-card.collapsed > .card-wallpaper {",
            "\n}\n",
        )
        self.assertIn("opacity: 0;", folded)


if __name__ == "__main__":
    unittest.main()
