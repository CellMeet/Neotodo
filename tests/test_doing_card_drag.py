"""The Doing card is picked up by a sideways pull and dropped on either border.

The card belongs to the subtask column, not to the whole page: its two homes
are the column's own left and right borders, and the hover strips stay on those
same borders (their range is the column's width, never the window's). Pulling
the card sideways anywhere on it moves it to the other border while keeping its
size, its height and its vertical position unchanged. A plain click on a row,
a vertical gesture and the small pins keep their own behaviour.

The same drawer also docks to a popped-out note/AI window ("a sub-app" of the
main room): that window has no page desk, so its own border becomes the anchor
and the card keeps the size and screen height it had at home.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    # --- the remembered box ------------------------------------------------
    assert 'const DOING_CARD_TOP_KEY = "neotodo.doingCardTop.v1";' in app_js
    assert 'const DOING_CARD_WIDTH_KEY = "neotodo.doingCardWidth.v1";' in app_js
    remember = app_js.split("function rememberDoingCardBox()", 1)[1].split(
        "function beginDoingPress(", 1
    )[0]
    assert "localStorage.setItem(DOING_CARD_TOP_KEY" in remember
    assert "localStorage.setItem(DOING_CARD_WIDTH_KEY" in remember
    assert "localStorage.setItem(DOING_CARD_HEIGHT_KEY" in remember
    assert "window.screenY" in remember, "the height must be a screen position"

    # --- the borders are the subtask column's, not the page's --------------
    desk = app_js.split("function doingDeskRect()", 1)[1].split("function refreshDoingZone(", 1)[0]
    assert "if (detachedMode)" in desk
    assert "detached: true" in desk
    assert "edgeLeft: 0" in desk and "edgeRight: window.innerWidth" in desk
    assert 'const current = $(".current-half");' in desk, (
        "the drawer must be anchored to the subtask column"
    )
    assert "edgeLeft: currentRect ? currentRect.left" in desk
    assert "edgeRight: currentRect ? currentRect.right" in desk
    assert 'const body = $(".page-body");' in desk, "the main desk is still the page body"
    assert "localStorage.getItem(DOING_CARD_TOP_KEY)" in desk
    assert "saved - screenTop" in desk, "the sub-app keeps the same screen height"

    zone = app_js.split("function refreshDoingZone(", 1)[1].split("function positionDoingPeek(", 1)[0]
    assert "if (desk.detached)" in zone
    assert "DOING_CARD_WIDTH_KEY" in zone, "a sub-app keeps the card's width"
    assert "DOING_CARD_HEIGHT_KEY" in zone, "a sub-app keeps the card's height"
    assert "doingCardTop = Math.round(desk.cardTop);" in zone
    assert "doingCardGap = 0;" in zone, "a sub-app drawer sits flush on its border"
    assert "desk.edgeLeft : desk.edgeRight" in zone, (
        "the hover strip must sit on the subtask column's border"
    )
    # The card size is untouched: the in-page drawer keeps its old box.
    assert "doingCardTop = Math.round(desk.deskTop + 2);" in zone
    assert "doingCardHeight = Math.max(200, Math.round(height - 14));" in zone
    assert "doingCardWidth = Math.round(Math.min(420, Math.max(292, width * 0.46)));" in zone
    assert "rememberDoingCardBox();" in zone, "the closed card still publishes its box"

    # --- the pull never resizes the card ----------------------------------
    place = app_js.split("function positionDoingPeek()", 1)[1].split("function setDoingDockSide(", 1)[0]
    assert "if (doingDrag) return;" in place, "an async repaint must not snap the card back"
    assert "? desk.edgeLeft + doingCardGap" in place
    assert ": desk.edgeRight - doingCardGap - width;" in place

    press = app_js.split("function beginDoingPress(", 1)[1].split("function moveDoingPress(", 1)[0]
    assert 'event.target.closest?.("#doing-peek")' in press, "the whole card can be grabbed"
    assert '".doing-pin, input, textarea, select, a"' in press, "pins keep their own clicks"
    assert "event.button !== 0" in press, "only the left button picks the card up"
    assert "!doingPeekOpen" in press, "the card is grabbed while open"
    # A pointer released outside the window must not lock the card.
    assert "if (doingDrag) endDoingDrag(false);" in press

    threshold = app_js.split("function moveDoingPress(", 1)[1].split("function endDoingPress(", 1)[0]
    assert "Math.abs(dx) < 6" in threshold, "a plain click must stay a click"
    assert "Math.abs(dx) < Math.abs(dy)" in threshold, "a vertical gesture is not a pull"
    assert "beginDoingDrag(press, event);" in threshold

    begin = app_js.split("function beginDoingDrag(", 1)[1].split("function moveDoingDrag(", 1)[0]
    assert "const panel = press.panel;" in begin
    assert "width: rect.width," in begin and "height: rect.height," in begin
    assert "top: rect.top," in begin
    assert "setPointerCapture" in begin

    move = app_js.split("function moveDoingDrag(", 1)[1].split("function endDoingDrag(", 1)[0]
    assert "doingDrag.startLeft + dx" in move
    assert "if (!event.buttons)" in move, "a lost pointerup must not leave the card afloat"
    assert "Math.max(minLeft, Math.min(maxLeft," in move, "a pull must not lose the card"
    assert "desk.edgeLeft - width * 0.5" in move
    assert "desk.edgeRight - width * 0.5" in move
    assert "panel.style.left" in move
    assert "doingDrag.top + doingDrag.height" in move, "the vertical box is frozen"
    assert "panel.style.top" not in move, "a horizontal pull never moves the height"
    assert "panel.style.height" not in move, "a pull never changes the card size"
    assert "panel.style.width" not in move

    end = app_js.split("function endDoingDrag(", 1)[1].split("function finishDoingDrag(", 1)[0]
    assert "const mid = (desk.edgeLeft + desk.edgeRight) / 2;" in end, (
        "the drop picks the subtask column's nearer border"
    )
    assert "doingDragClickUntil" in end, "a pull must not also click the row under it"
    assert 'doing-snapping' in end
    assert "setDoingDockSide(side)" in end
    assert "if (!commit || !drag.moved)" in end, "a plain tap leaves the card where it was"

    # --- the card is the grab bar -----------------------------------------
    assert 'if (event.target.closest?.("#doing-peek")) beginDoingPress(event);' in app_js
    assert 'window.addEventListener("blur", () => {' in app_js
    kicker = css.split("\n.doing-kicker {", 1)[1].split("}", 1)[0]
    assert "cursor: grab;" in kicker
    assert "touch-action: none;" in kicker
    assert "user-select: none;" in kicker
    dragging = css.split(".doing-peek.doing-dragging,", 1)[1].split("}", 1)[0]
    assert "transition: none !important;" in dragging
    assert "transform: none !important;" in dragging
    snapping = css.split(".doing-peek.doing-snapping,", 1)[1].split("}", 1)[0]
    assert "left 0.3s" in snapping, "the dropped card must glide to its border"

    # --- the drawer floats above a popped-out sheet -----------------------
    assert "body.detached-mode #doing-peek {" in css
    detached = css.split("body.detached-mode #doing-peek {", 1)[1].split("}", 1)[0]
    assert "z-index: 10002" in detached, "the card must sit above the detached sheet"

    # --- one drawer, many windows -----------------------------------------
    assert "event.key === DOING_DOCK_SIDE_KEY" in app_js, (
        "a flipped card must settle on the same border in the other window"
    )

    print("the Doing card is dragged between the subtask column's borders")
    return 0


if __name__ == "__main__":
    sys.exit(main())
