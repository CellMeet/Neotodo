"""The Doing card can be pulled off its border and pinned anywhere on the desk.

The drawer keeps its border homes, but the reader may now grab the card with
the left button and drop it anywhere in the window: the card stays exactly on
that spot (the spot is remembered), floats above the sheets it crosses, and the
close pin turns into the way home. A pinned card's pin glides it back to the
border; a docked card's pin still closes the drawer.

The whole surface is grabbable, but only the kicker pulls in every direction:
a vertical gesture that starts on the rows still scrolls the list.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    # --- the pinned spot is remembered -------------------------------------
    assert 'const DOING_FLOAT_KEY = "neotodo.doingFloatPosition.v1";' in app_js
    init = app_js.split("let doingFloat = (() => {", 1)[1].split(
        "function saveDoingFloat()", 1
    )[0]
    assert "localStorage.getItem(DOING_FLOAT_KEY)" in init
    assert "Number.isFinite(saved.left)" in init
    save = app_js.split("function saveDoingFloat()", 1)[1].split(
        "let doingDrag = null", 1
    )[0]
    assert "localStorage.setItem(DOING_FLOAT_KEY" in save
    assert "localStorage.removeItem(DOING_FLOAT_KEY)" in save, (
        "returning to the border must clear the pinned spot"
    )

    # --- the card is laid out at the pinned box, not on a border -----------
    place = app_js.split("function positionDoingPeek()", 1)[1].split(
        "function setDoingDockSide(", 1
    )[0]
    assert "if (doingFloat) {" in place, "a pinned card owns its box"
    assert "doingFloat.left" in place and "doingFloat.top" in place
    assert "Math.max(6, Math.min(" in place, "the pinned box stays inside the desk"
    assert "if (doingDrag) return;" in place, "a poll must not snap a pulled card back"

    # --- the whole card pulls, the kicker pulls in every direction ---------
    press = app_js.split("function doingPeekMarkup(", 1)[1].split(
        "function doingPeekStateKey(", 1
    )[0]
    assert "doing-drag-tag" not in press, "the corner tag was removed"
    assert "draggable</span>" not in press
    assert 'panel.dataset.draggable = "true";' in app_js, (
        "the open card keeps the marker for scripts"
    )

    threshold = app_js.split("function moveDoingPress(", 1)[1].split(
        "function endDoingPress(", 1
    )[0]
    assert "Math.hypot(dx, dy) < 6" in threshold, "a plain click must stay a click"
    assert "fromKicker" in threshold, "the kicker is the free handle"
    assert "Math.abs(dx) <= Math.abs(dy)" in threshold, (
        "a vertical gesture on the rows still scrolls the list"
    )

    # --- the pull follows both axes ---------------------------------------
    begin = app_js.split("function beginDoingDrag(", 1)[1].split(
        "function paintDoingWallpaperOffset(", 1
    )[0]
    assert "startTop" in begin and "startLeft" in begin
    assert 'panel.style.translate = "0px 0px";' in begin
    assert "cardWallpaperHosts.delete(panel);" in begin, (
        "the open-glide loop must not fight the manual pull"
    )

    move = app_js.split("function moveDoingDrag(", 1)[1].split(
        "function glideDoingPanelBack(", 1
    )[0]
    assert "doingDrag.startLeft + dx" in move
    assert "doingDrag.startTop + dy" in move, "the card follows the pointer vertically"
    assert "window.innerWidth - width - 6" in move
    assert "window.innerHeight - height - 6" in move
    assert "doingDragY = top - doingDrag.startTop;" in move

    flush = app_js.split("function flushDoingDragFrame(", 1)[1].split(
        "function cancelDoingDragFrame(", 1
    )[0]
    assert "panel.style.translate =" in flush, (
        "the frame's card move is one non-inherited transform write"
    )
    assert "--doing-drag-x" not in flush, (
        "an inherited custom property restyled every row on every frame"
    )
    assert "placeCardWallpaper" not in flush, (
        "measuring the card per frame is what made the pull stutter"
    )

    # --- the drop pins the card exactly where it landed -------------------
    end = app_js.split("function endDoingDrag(", 1)[1].split(
        "function syncDoingPinState(", 1
    )[0]
    assert "doingFloat = { left: targetLeft, top: targetTop };" in end
    assert "saveDoingFloat();" in end
    assert "glideDoingPanelBack(panel, slackX, slackY);" in end
    assert "setDoingDockSide(" not in end, "a free drop does not snap to a border"

    # --- the pin is the way home once the card is pinned ------------------
    pin_state = app_js.split("function syncDoingPinState(", 1)[1].split(
        "function returnDoingPeekHome(", 1
    )[0]
    assert "doing-floating" in pin_state
    assert "Return Doing card to its border" in pin_state
    assert '"Close Doing card"' in pin_state

    home = app_js.split("function returnDoingPeekHome(", 1)[1].split(
        "function finishDoingDrag(", 1
    )[0]
    assert "doingFloat = null;" in home
    assert "saveDoingFloat();" in home
    assert "glideDoingPanelBack(panel, from.left - to.left, from.top - to.top);" in home

    click = app_js.split(
        'const doingPin = event.target.closest("[data-doing-pin]");', 1
    )[1].split("const doingExpand", 1)[0]
    assert "if (doingFloat) returnDoingPeekHome();" in click
    assert "else {" in click and "closeDoingPeek();" in click

    # --- CSS: the offset is an inline transform, not a variable -----------
    dragging = css.split(".doing-peek.doing-dragging,", 1)[1].split("}", 1)[0]
    assert "will-change: transform;" in dragging
    assert "--doing-drag-x" not in dragging
    snapping = css.split(".doing-peek.doing-snapping,", 1)[1].split("}", 1)[0]
    assert "translate 0.3s" in snapping
    assert "--doing-drag-x" not in snapping
    assert "#doing-peek.doing-floating" in css, "a pinned card floats above the sheets"
    assert ".doing-drag-tag" not in css, "the corner tag was removed"

    print("the Doing card can be pinned anywhere on the desk and sent home with its pin")
    return 0


if __name__ == "__main__":
    sys.exit(main())
