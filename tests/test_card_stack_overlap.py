"""The three task cards rest on one another and each keeps its own height.

The live subtask card, the finished-subtasks card and the right-edge Doing card
must read as sheets lying on top of each other. They share the light (top-right)
and the paper, but not one shadow: sharing one number made the pile flat, and a
flat pile is what "the cards do not feel independent" looks like. Each card owns
a rung of the ladder — the live card barely leaves the page, the finished card is
one step up, the Doing card floats over both — and each rung is a tight contact
seam plus two soft layers. There is no second sheet, no coloured deck edge and no
extra paper peeking out from under a card.

The other half of the rule is independence. The Doing card slides out over the
finished card but must not move it; opening the finished card must not move or
disable the Doing card's hover strip. Both cards therefore own their boxes:
app.js measures the Doing strip from the task column (`.current-half`) alone,
and neither open/close path touches the other card.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def block_after(text: str, marker: str, stop: str) -> str:
    assert marker in text, f"missing marker: {marker}"
    return text.split(marker, 1)[1].split(stop, 1)[0]


def css_block(text: str, selector: str) -> str:
    assert selector in text, f"missing selector: {selector}"
    return text.split(selector, 1)[1].split("}", 1)[0]


def main() -> int:
    stack_css = (ROOT / "web" / "card-stack.css").read_text(encoding="utf-8")
    split_css = (ROOT / "web" / "subtask-split.css").read_text(encoding="utf-8")
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    index_html = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
    style_css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
    layers_css = (ROOT / "web" / "wallpaper-layers.css").read_text(encoding="utf-8")

    # --- one pile, one ladder ------------------------------------------------
    # The three cards share the light, the direction and the paper. They do not
    # share one shadow: identical shadows made the pile read as one surface, so
    # each sheet owns its own rung and the height difference is the stack.
    assert "--card-sheet-page:" in stack_css, "the live card has no page rung"
    assert "--card-sheet-card:" in stack_css, "a card resting on a card has no rung"
    assert "--card-sheet-top:" in stack_css, "the Doing card has no top rung"
    assert "--card-sheet-top-left:" in stack_css, "the left-docked Doing card has no mirrored rung"
    # The plugin bridge still receives the old name, now an alias of the middle
    # rung instead of a flat configuration.
    assert "--card-overlap-shadow: var(--card-sheet-card);" in stack_css
    assert "--card-lift-page: var(--card-sheet-page);" in stack_css
    # The rungs must differ, otherwise the pile is flat again.
    def rung(name: str) -> str:
        assert f"  {name}:\n" in stack_css, f"missing rung: {name}"
        return stack_css.split(f"  {name}:\n", 1)[1].split(";", 1)[0].strip()

    page_rung, card_rung, top_rung = (
        rung("--card-sheet-page"),
        rung("--card-sheet-card"),
        rung("--card-sheet-top"),
    )
    assert page_rung != card_rung, "the finished card sits at the live card's height"
    assert card_rung != top_rung, "the Doing card sits at the finished card's height"
    assert page_rung != top_rung, "the Doing card sits at the live card's height"
    # No deck: the card above rests directly on the card below.
    assert "--card-pile" not in stack_css, "the extra deck sheets are back"
    assert "--card-under-paper" not in stack_css, "a coloured under-sheet is back"
    # The wallpaper faces get one shared paper wash so they do not merge with
    # the page, but it is a surface step on the card itself, never a second
    # sheet. The finished card and the Doing card use the live subtask card's
    # wash exactly: heavier per-level washes made them look darkened.
    assert "--card-face-wash:" in stack_css
    assert "--wallpaper-tint" in stack_css, "the 7% wash is not the wallpaper's own colour"
    assert "--card-face-wash-raised:" not in stack_css, "the finished card is washed darker again"
    assert "--card-face-wash-top:" not in stack_css, "the Doing card is washed darker again"
    assert "--card-face-sheen" not in stack_css, "a second light/dark gradient sits on the 7% wash"
    for selector in (
        "#pending-subtask-card > .card-wallpaper::after",
        ".completed-subtask-drawer > .card-wallpaper::after",
        "#doing-peek > .card-wallpaper::after",
        ".trash-drawer > .card-wallpaper::after",
    ):
        assert selector in stack_css, f"the wallpaper face step is missing: {selector}"
        face = css_block(stack_css, selector)
        assert "background: var(--card-face-wash);" in face, (
            f"the card does not use the single shared wash: {selector}"
        )

    # --- every card sits on its own rung of the pile -------------------------
    live = css_block(stack_css, "\nbody #pending-subtask-card {")
    assert "box-shadow: var(--card-sheet-page), var(--card-bevel-page) !important;" in live, (
        "the live card does not lie on the page rung"
    )
    tray = css_block(stack_css, "\nbody .completed-subtask-drawer {")
    assert "box-shadow: var(--card-sheet-card), var(--card-bevel-card) !important;" in tray, (
        "the finished card does not rest one rung above the live card"
    )
    doing = css_block(stack_css, "\nbody #doing-peek {")
    assert "box-shadow: var(--card-sheet-top), var(--card-bevel-top) !important;" in doing, (
        "the Doing card does not float on the top rung"
    )
    # The cut edge is the card's own paper: a lit top edge and a shaded bottom
    # edge on the two sheets that catch the light, a shaded edge on the bottom
    # sheet. No element, no line.
    def bevel(name: str) -> str:
        return stack_css.split(f"  {name}:\n", 1)[1].split(";", 1)[0]

    assert "inset 0 1px 0 rgba(255, 255, 255" in bevel("--card-bevel-card")
    assert "inset 0 1px 0 rgba(255, 255, 255" in bevel("--card-bevel-top")
    assert "inset 0 1px 0 rgba(255, 255, 255" not in bevel("--card-bevel-page")
    folded = css_block(stack_css, "\nbody #pending-subtask-card.collapsed {")
    assert "box-shadow: none !important;" in folded, "the folded tab still drags a shadow behind it"

    # Dark paper keeps the same ladder: without it every card on a dark theme
    # pack merged into the near-black page.
    dark = block_after(stack_css, 'html[data-postcard-dark="true"] {', "\n}")
    for token in (
        "--card-sheet-page:",
        "--card-sheet-card:",
        "--card-sheet-top:",
        "--card-sheet-card-left:",
        "--card-sheet-top-left:",
        "--card-bevel-page:",
        "--card-bevel-card:",
        "--card-bevel-top:",
    ):
        assert token in dark, f"the dark pile lost its rung: {token}"

    # Without a wallpaper the dark page and the dark cards are the same sheet,
    # so a black shadow cannot separate them. The faces step up instead, and
    # the steps follow the ladder: the live card least, the Doing card most.
    def dark_face(selector: str) -> str:
        marker = f'html[data-postcard-dark="true"]:not([data-wallpaper]) body {selector} {{'
        assert marker in stack_css, f"the dark card face rule is missing: {selector}"
        return stack_css.split(marker, 1)[1].split("}", 1)[0]

    page_face = dark_face("#pending-subtask-card")
    top_face = dark_face("#doing-peek")
    assert "color-mix(" in page_face and "color-mix(" in top_face
    for face in (page_face, top_face):
        assert "!important" in face, "a theme background can still repaint the dark card"
    assert page_face != top_face, "the dark Doing card sits at the live card's brightness"

    # --- the magic-hat card is a card too ------------------------------------
    drawer = index_html.split('<aside class="trash-drawer"', 1)[1].split(">", 1)[0]
    assert 'data-subcard="trash"' in drawer, "the hat card lost its card marker"
    hat_body = index_html.split('<aside class="trash-drawer"', 1)[1].split("</aside>", 1)[0]
    assert "trash-label" not in index_html, "the printed card tag is back"
    assert "卡片" not in hat_body, "the hat card still prints the old card tag"
    assert "trash-label" not in style_css and "trash-label" not in layers_css
    trash = css_block(stack_css, "\nbody .trash-drawer {")
    assert "var(--card-sheet-card)" in trash, (
        "the hat card does not rest on the card rung"
    )
    assert "z-index: 155;" in trash, "the hat card paints under the categories spine"
    assert "isolation: isolate;" in trash, "the hat card's coating shares the spine's layer"
    # An opaque paper underlay keeps the spine's pattern from showing through
    # the card when its wallpaper pane has a transparent edge.
    trash_wallpaper = css_block(stack_css, "html[data-wallpaper] body .trash-drawer {")
    assert "background-color: var(--overlay-paper" in trash_wallpaper

    # --- the card's shadow must not be clipped into a grey corner ------------
    spill = css_block(stack_css, 'html[data-theme="postcard"] .current-half,')
    assert "overflow: visible;" in spill, (
        "a clipped shadow leaves the grey block under the live card's corner"
    )
    assert "overflow: hidden;" in split_css, "the card stopped clipping its rows"

    # --- the Doing strip is the column's border, never the finished card -----
    zone = block_after(app_js, "function doingColumnRect(", "\nfunction positionDoingPeek(")
    assert 'const half = $(".current-half");' in zone
    assert "completed" not in zone.lower(), (
        "the Doing hover strip depends on the finished card"
    )
    assert "completedSubtasksOpen" not in zone
    pointer = block_after(app_js, "const processDoingPointer = () => {", "\n  document.addEventListener(\"pointermove\"")
    assert "completed" not in pointer.lower(), (
        "opening the finished card changes the Doing card's trigger"
    )
    assert ".completed-subtask-toggle" not in pointer

    # --- neither open path moves the other card ------------------------------
    completed_open = block_after(app_js, "function setCompletedSubtasksOpen(", "\n/** Click/swipe the handle line")
    assert "positionDoingPeek(" not in completed_open, "opening the tray moves the Doing card"
    assert "refreshDoingZone(" not in completed_open, "opening the tray re-measures the Doing strip"
    assert "doingPeekOpen = " not in completed_open, "opening the tray closes the Doing card"
    doing_open = block_after(app_js, "function openDoingPeek(", "\nfunction closeDoingPeek(")
    assert "setCompletedSubtasksOpen(" not in doing_open, "opening Doing closes the tray"
    assert "completed-subtask-drawer" not in doing_open, "opening Doing touches the tray's box"
    assert "completedSubtasksOpen = " not in doing_open, "opening Doing changes the tray's state"

    # No stylesheet may shift the finished card while the Doing card is out.
    coupled = [
        line for line in stack_css.splitlines()
        if "completed-subtask-drawer" in line and "doing-peek-open" in line
    ]
    assert not coupled, "the Doing card still shoves the finished card aside"
    assert "translateX(calc(-1 * min(150px, 11vw)))" not in split_css

    print("the cards rest on one another, each on its own rung of the pile")
    return 0


if __name__ == "__main__":
    sys.exit(main())
