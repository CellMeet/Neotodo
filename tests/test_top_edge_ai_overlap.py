"""The hidden top bar gives way to the AI card where the two overlap.

The utility bar opens from a fixed trigger band across the first rows of the
window. A sheet pulled to the top lies in that same strip, and the band sat
above it, so reaching the AI card's head (or its door line) opened the bar
instead of the card. The card now owns the strip it covers, the same way the
Doing drawer ignores a swipe that lands on a sheet: the band's hit box is cut
around the AI card, and a door-line drag keeps the bar shut altogether.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    handles = (ROOT / "web" / "handle-position.js").read_text(encoding="utf-8")
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    style = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    # --- the cut follows the AI card, and only the AI card -----------------
    assert "function syncTopEdgeOverlap()" in handles
    sync = handles.split("function syncTopEdgeOverlap()", 1)[1].split("\n}", 1)[0]
    assert 'document.querySelector("#top-edge")' in sync
    assert 'document.querySelector("#agent-terminal")' in sync
    assert "agentTerminalOpen" in sync
    assert "#notes-half" not in sync, "only the AI card wins the top strip"
    assert "top < height" in sync, "the card must be in the band for a cut to happen"

    # A card flush with the window top leaves the free side a plain strip;
    # otherwise the notch reaches the band's bottom edge so the remaining
    # trigger stays one polygon.
    assert "inset(0 ${width - left}px 0 0)" in sync
    assert "polygon(0 0, ${width}px 0, ${width}px 100%" in sync
    assert "${left}px 100%, 0 100%)" in sync
    assert "if (clip === topEdgeClip) return;" in sync, (
        "the cut is written again on every layout pass"
    )
    assert 'if (clip) document.body.classList.remove("top-tools-open");' in sync, (
        "a bar already on screen must step aside for the card"
    )

    # The band follows the card whenever the sheets are laid out.
    position = handles.split("function positionDeskHandles()", 1)[1].split("\n}", 1)[0]
    assert "syncTopEdgeOverlap();" in position, (
        "the top band is not re-cut by the layout pass"
    )
    # A window resize with only the console open skips the split pass, so the
    # resize handler re-cuts the band itself.
    resize = app_js.split("refreshDoingZone();\n    refreshNotesSwipeLine();", 1)[1].split("});", 1)[0]
    assert "syncTopEdgeOverlap();" in resize, (
        "the top band keeps the old window cut after a resize"
    )
    # The direct height drag writes the sheet box itself; on release the band
    # and the door line take the new edge.
    height_drag = app_js.split(
        "A deliberate height is part of the workspace shape; remember it now so", 1
    )[1].split("};", 1)[0]
    assert "positionDeskHandles();" in height_drag, (
        "the top band keeps the old cut after a direct height drag"
    )

    # --- a door drag owns the pointer, so the bar never flashes ------------
    resizing = handles.split("function setDeskHandleResizing(on)", 1)[1].split("\n}", 1)[0]
    assert 'document.body.classList.remove("top-tools-open");' in resizing
    drag_rule = style.split('body[data-desk-handle-resizing="1"] .top-edge {', 1)[1]
    drag_rule = drag_rule.split("}", 1)[0]
    assert "pointer-events: none !important;" in drag_rule

    # --- the JS swap path refuses the strip the card covers ----------------
    guard = app_js.split("const topEdgeOverAi = (x, y) => {", 1)[1].split("};", 1)[0]
    assert "band.top + band.height" in guard
    assert "y >= rect.top" in guard, "a card parked lower must not shield the bar"
    assert "if (event?.target === topEdgeNode && topEdgeOverAi(event.clientX, event.clientY)) return;" in app_js, (
        "only the bare band defers; hovering the bar itself must still swap in"
    )

    print("the top hidden bar yields to the AI card in the strip they share")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
