"""Unfolding the subtask card always hands its purple handle back.

The purple line on the card's bottom edge is the only control that folds the
subtask area away. A render that ran before the lane's rows were printed could
leave `line-hidden` on the bar; opening the card then left it open with no
handle. The unfold path now re-reads the lane, so an open card with rows always
shows the line, and an empty lane keeps it tucked away as before.

The line deliberately stays *below* the note and AI sheets (the task block's
page layer), and the finished-tray rules are left exactly as they were.
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

    # One helper decides whether the handle is useful, and both paths use it.
    assert "function pendingCardHasRows(" in app_js
    helper = app_js.split("function pendingCardHasRows(", 1)[1].split("\n}", 1)[0]
    assert ".current-subtask[data-subtask-id]" in helper
    assert "[data-add-subtask-row]" in helper

    bind = app_js.split("function bindPendingSubtaskToggle(", 1)[1].split("\n}\n", 1)[0]
    assert "syncSubtaskHandleLine(bar, pendingCardHasRows(card));" in bind

    unfold = app_js.split("function setPendingSubtasksCollapsed(", 1)[1].split("\n}", 1)[0]
    assert "if (!pendingSubtasksCollapsed) syncSubtaskHandleLine(bar, pendingCardHasRows());" in unfold

    # The previous attempt is gone: no page-level mirror, no raised layer.
    assert "pending-subtask-float" not in index
    assert "pending-subtask-float" not in app_js
    assert "updatePendingHandleFloat" not in app_js
    assert "pending-subtask-float" not in css

    # The task block still paints below the note and the AI sheet.
    layout = read("web/page-layout.css")
    assert "--page-layer-tasks: 2;" in layout
    assert "--page-layer-note: 12;" in layout
    # The finished tray keeps its original fold rule.
    assert ".pending-subtask-card.collapsed ~ .completed-subtask-toggle {" in css
    assert ".completed-subtask-toggle:not(.open)" not in css

    print("the fold handle comes back when the subtask card opens")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
