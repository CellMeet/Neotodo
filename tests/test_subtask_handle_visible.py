"""The purple fold line can never be lost behind a sheet.

The subtask card's purple line is the only control that folds the subtask area
away. The card lives in the task block, which paints below the note and AI
sheets, so a raised sheet could cover the line — the area stayed open with no
visible handle. Three guards keep it reachable:

* expanding the card re-reads the lane and shows the line again, so a stale
  "empty lane" state cannot survive the unfold;
* an open finished tray keeps its own handle even when the live card is folded
  (the tray would otherwise be left open with no control);
* while a sheet actually covers the line, a page-level mirror of the same pill
  is drawn above every sheet and folds the card on click.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def main() -> int:
    app_js = read("web/app.js")
    index = read("web/index.html")
    css = read("web/subtask-split.css")

    # The page-level mirror exists and is the same action as the real line.
    assert 'id="pending-subtask-float"' in index
    assert 'data-action="toggle-pending-subtasks"' in index
    assert "pending-subtask-line" in index.split('id="pending-subtask-float"', 1)[1]

    assert "function updatePendingHandleFloat()" in app_js
    assert "function schedulePendingHandleFloat()" in app_js
    assert "function boxesOverlap(" in app_js
    assert 'if (!covered) {\n    mirror.hidden = true;' in app_js
    assert "const covered = sheets.some((sheet) => boxesOverlap(sheet.getBoundingClientRect(), lineRect));" in app_js
    # The mirror follows every layout change that can cover or uncover the line.
    assert app_js.count("schedulePendingHandleFloat();") >= 5
    assert "  bindPendingSubtaskToggle();\n  schedulePendingHandleFloat();" in app_js
    assert "scheduleNotePlateRefresh(110);\n  schedulePendingHandleFloat();" in app_js
    assert "scheduleNotePlateRefresh(90);\n      schedulePendingHandleFloat();" in app_js

    # Unfolding always re-reads the lane and hands the line back.
    assert "function pendingCardHasRows(" in app_js
    assert "if (!pendingSubtasksCollapsed) syncSubtaskHandleLine(bar, pendingCardHasRows());" in app_js

    # The mirror paints above the note (12), the floating note (13) and the
    # split (15), so no sheet can bury it.
    float_rule = css.split(".pending-subtask-float {", 1)[1].split("}", 1)[0]
    assert "position: fixed;" in float_rule
    assert "z-index: 30;" in float_rule
    assert ".pending-subtask-float[hidden] { display: none; }" in css
    assert ".pending-subtask-float:hover .pending-subtask-line" in css

    # An open tray keeps its handle even while the live card is folded.
    assert (
        '.pending-subtask-card.collapsed ~ .completed-subtask-toggle:not(.open)'
        in css
    ), "a folded live card can bury an open finished tray again"

    print("the subtask fold line stays visible and clickable")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
