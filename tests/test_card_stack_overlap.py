"""The three task cards rest on one another with a clear contact shadow.

The live subtask card, the finished-subtasks card and the right-edge Doing card
must read as sheets lying on top of each other. Every card uses one shared
shadow configuration: its ink-green stroke plus a soft down-left shadow thrown
onto the sheet under it. There is no second sheet, no coloured deck edge and no
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

    # --- one shared overlap configuration ------------------------------------
    assert "--card-overlap-shadow:" in stack_css, "the live card has no shared shadow"
    assert "--card-overlap-shadow-left:" in stack_css, "the left-docked shadow is not mirrored"
    assert "--card-lift-page: var(--card-overlap-shadow);" in stack_css, (
        "the plugin bridge no longer resolves to the shared shadow"
    )
    # No deck: the card above rests directly on the card below.
    assert "--card-pile" not in stack_css, "the extra deck sheets are back"
    assert "--card-under-paper" not in stack_css, "a coloured under-sheet is back"
    # The wallpaper faces get a paper wash so they do not merge with the page,
    # but it is a surface step on the card itself, never a second sheet.
    assert "--card-face-wash:" in stack_css
    assert "--card-face-wash-raised:" in stack_css
    assert "--card-face-wash-top:" in stack_css
    assert "var(--card-face-sheen), var(--card-face-wash)" in stack_css
    assert "var(--card-face-wash-raised)" in stack_css
    assert "var(--card-face-wash-top)" in stack_css
    for selector in (
        "#pending-subtask-card > .card-wallpaper::after",
        ".completed-subtask-drawer > .card-wallpaper::after",
        "#doing-peek > .card-wallpaper::after",
        ".trash-drawer > .card-wallpaper::after",
    ):
        assert selector in stack_css, f"the wallpaper face step is missing: {selector}"

    # --- every card uses the same configuration ------------------------------
    live = css_block(stack_css, "body #pending-subtask-card {")
    assert "box-shadow: var(--card-overlap-shadow) !important;" in live
    tray = css_block(stack_css, "body .completed-subtask-drawer {")
    assert "box-shadow: var(--card-overlap-shadow) !important;" in tray
    doing = css_block(stack_css, "body #doing-peek {")
    assert "box-shadow: var(--card-overlap-shadow) !important;" in doing
    folded = css_block(stack_css, "body #pending-subtask-card.collapsed {")
    assert "box-shadow: none !important;" in folded, "the folded tab still drags a shadow behind it"

    # --- the magic-hat card is a card too ------------------------------------
    drawer = index_html.split('<aside class="trash-drawer"', 1)[1].split(">", 1)[0]
    assert 'data-subcard="trash"' in drawer, "the hat card lost its card marker"
    hat_body = index_html.split('<aside class="trash-drawer"', 1)[1].split("</aside>", 1)[0]
    assert "trash-label" not in index_html, "the printed card tag is back"
    assert "卡片" not in hat_body, "the hat card still prints the old card tag"
    assert "trash-label" not in style_css and "trash-label" not in layers_css
    trash = css_block(stack_css, "body .trash-drawer {")
    assert "var(--card-overlap-shadow) !important;" in trash, (
        "the hat card does not use the shared overlap shadow"
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

    print("the cards rest on one another with one clear shadow and no extra sheets")
    return 0


if __name__ == "__main__":
    sys.exit(main())
