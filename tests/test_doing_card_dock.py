"""The Doing card is a desk drawer, docked on the left or right border.

It used to open at the top-right of the subtask column, over the task rows and
over whatever pane shared that side. On a split screen (AI on the right) that
covered the subtasks the reader was working on.

The card now lives on the desk, under the page baseline, on the subtask
column's own left or right border: split the screen, put the AI on the right,
and the drawer slides out of the column's right border right next to it
without covering a single subtask row. The reader picks the border from the
card's own kicker (or pulls the card there) and the choice is remembered, like
the AI split side. The hover strip stays where it always was, on the column
border in the task region, so the familiar flick still opens the card.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
    stack_css = (ROOT / "web" / "card-stack.css").read_text(encoding="utf-8")

    # --- the choice is remembered -------------------------------------------
    assert 'const DOING_DOCK_SIDE_KEY = "neotodo.doingDockSide.v1";' in app_js
    assert "localStorage.getItem(DOING_DOCK_SIDE_KEY)" in app_js
    assert "localStorage.setItem(DOING_DOCK_SIDE_KEY, doingDockSide)" in app_js
    state = app_js.split("const DOING_DOCK_SIDE_KEY", 1)[1].split("let doingCardGap", 1)[0]
    assert 'return "right";' in state, "the card must still start on the right"
    assert 'saved === "left" || saved === "right"' in state

    # --- the card box comes from the page, not the window or the task rows ---
    desk = app_js.split("function doingDeskRect()", 1)[1].split("function refreshDoingZone(", 1)[0]
    assert 'const body = $(".page-body");' in desk
    assert 'const tasks = $(".todos-section");' in desk
    assert "tasksRect ? tasksRect.bottom" in desk, "the desk must start at the page baseline"

    zone = app_js.split("function refreshDoingZone(", 1)[1].split("function positionDoingPeek(", 1)[0]
    assert "const desk = doingDeskRect();" in zone
    assert "doingCardTop = Math.round(desk.deskTop + 2);" in zone, (
        "the drawer must start under the baseline, never on the subtask rows"
    )
    assert "doingCardHeight = Math.max(200, Math.round(height - 14));" in zone
    assert ".current-half" not in zone, "the card must not be measured from the task column"
    # The hover strip is unchanged: the column border in the task region.
    assert "top: Math.round(desk.top + 8)," in zone
    assert "bottom: Math.round(desk.deskTop + 4)," in zone
    assert "left: Math.round(edge - 80)," in zone
    assert "right: Math.round(edge + 80)," in zone
    assert 'const edge = doingDockSide === "left" ? desk.edgeLeft : desk.edgeRight;' in zone, (
        "the strip must stay on the subtask column's border, not the page edge"
    )

    # --- both borders, one box ----------------------------------------------
    place = app_js.split("function positionDoingPeek()", 1)[1].split("function setDoingDockSide(", 1)[0]
    assert 'if (!doingZone || !doingDesk) refreshDoingZone();' in place
    assert 'const left = doingDockSide === "left"' in place
    assert "? desk.edgeLeft + doingCardGap" in place
    assert ": desk.edgeRight - doingCardGap - width;" in place
    assert 'panel.style.left = `${Math.round(left)}px`;' in place
    assert 'panel.style.right = "auto";' in place, "a flipped card must drop its old anchor"
    assert ".current-half" not in place

    # --- the dock button in the card's own kicker ----------------------------
    markup = app_js.split("function doingPeekMarkup(", 1)[1].split("function doingPeekStateKey(", 1)[0]
    assert 'data-doing-dock' in markup
    assert "doingDockAria()" in markup
    assert 'data-doing-pin' in markup, "the close pin stays"

    dock_fn = app_js.split("function setDoingDockSide(", 1)[1].split("function bindDoingCard(", 1)[0]
    assert 'const next = side === "left" ? "left" : "right";' in dock_fn
    assert 'document.body.classList.toggle("doing-dock-left", left);' in dock_fn
    assert 'panel.classList.toggle("doing-dock-left", left);' in dock_fn
    assert "doingPeekSignature = \"\";" in dock_fn, "the card must rebuild with the new side"
    assert "refreshDoingZone();" in dock_fn and "positionDoingPeek();" in dock_fn
    assert "syncCardWallpapers();" in dock_fn, "the drawer's wallpaper follows the border"

    click = app_js.split('const doingDock = event.target.closest("[data-doing-dock]");', 1)[1]
    assert "setDoingDockSide(doingDockSide === \"right\" ? \"left\" : \"right\");" in click

    key = app_js.split("function doingPeekStateKey(", 1)[1].split("function doingDeskRect(", 1)[0]
    assert "${doingDockSide}" in key, "a flipped card must be treated as a new card"

    # --- CSS: the mirrored slide, kicker and shadow --------------------------
    assert ".doing-peek.doing-dock-left {" in css
    assert "transform: translateX(calc(-100% - 40px));" in css
    assert ".doing-peek.doing-dock-left.open {" in css
    assert ".doing-peek.doing-dock-left .doing-kicker {" in css
    assert "flex-direction: row-reverse;" in css
    assert ".doing-peek .doing-dock {" in css
    assert "body.doing-dock-left #doing-peek {" in stack_css

    print("the Doing card docks on the desk's left or right border, never on the subtasks")
    return 0


if __name__ == "__main__":
    sys.exit(main())
