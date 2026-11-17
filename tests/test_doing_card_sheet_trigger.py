"""The right-border Doing drawer never slides out from under the note or the AI.

The drawer's hover strip rides the subtask column's border in the task region.
The note is a floating sheet and, when its top edge is pulled up, it covers that
strip; the AI card can be resized against the same edge. A pointer inside either
sheet is doing the reader's work — scrolling, selecting, clicking — so crossing
the sheet must not count as a swipe at the drawer, even where the sheet lies
over the strip. The bare strip still opens the drawer exactly as before.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")

    # --- the point remembers what the pointer was over ----------------------
    assert "let doingPeekPoint = { x: 0, y: 0, target: null };" in app_js
    assert 'doingPeekPoint = { x: event.clientX, y: event.clientY, target: event.target };' in app_js

    # --- both sheets are recognised, and only those two ---------------------
    helper = app_js.split("const doingSheetAt =", 1)[1].split("const processDoingPointer", 1)[0]
    assert '#notes-half, #agent-terminal' in helper, (
        "a pointer is on a sheet only for the note and the AI card"
    )

    # --- the hover entry point gives up before measuring the strip ----------
    pointer = app_js.split('document.addEventListener("pointermove", (event) => {', 1)[1].split(
        "window.addEventListener(\"resize\"", 1
    )[0]
    assert "if (doingSheetAt(event.target)) {" in pointer
    sheet_guard = pointer.split("if (doingSheetAt(event.target)) {", 1)[1].split("}", 1)[0]
    assert "clearTimeout(doingPeekOpenTimer);" in sheet_guard, (
        "a swipe that leaves the strip and lands on a sheet must cancel the pending peek"
    )
    assert "return;" in sheet_guard
    assert pointer.index("if (doingSheetAt(event.target)) {") < pointer.index("refreshDoingZone();"), (
        "the sheet owns the pointer; the strip must not even be re-measured"
    )

    # --- the deferred rAF / 30ms paths re-check the target ------------------
    process = app_js.split("const processDoingPointer = () => {", 1)[1].split(
        'document.addEventListener("pointermove"', 1
    )[0]
    assert "if (!pointInDoingZone(x, y) || doingSheetAt(doingPeekPoint.target))" in process
    timer = process.split("doingPeekOpenTimer = setTimeout(() => {", 1)[1].split("}, 30);", 1)[0]
    assert "if (doingSheetAt(doingPeekPoint.target)) return;" in timer, (
        "the pointer may settle on a sheet during the 30ms wait"
    )
    assert timer.index("if (doingSheetAt(doingPeekPoint.target)) return;") < timer.index("openDoingPeek();"), (
        "the sheet check must run before the drawer opens"
    )

    print("the Doing drawer ignores swipes that land on the note or the AI card")
    return 0


if __name__ == "__main__":
    sys.exit(main())
