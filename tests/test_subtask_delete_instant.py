"""Deleting a subtask answers the click; it never waits for the reply.

A delete used to hide the row and then save through `action()`, which rebuilt
the whole stage when the answer landed: the board, the note and the AI console
were thrown away and printed again about 100ms after the gesture. On a real
board that read as a stutter — the row was gone, then the page coughed.

A delete is now the row leaving the lane in the same frame: the rows are
removed, the freed lines pass to the lane's fillers, the next row inherits the
bold mark and the local copy loses the subtask. The save travels behind the
gesture through `silentAction`, which never repaints, and only a failure puts
the board back.

The same rule holds for every way in: the fan's right-click, the row menu's
Cut (which now hides the row before the clipboard answers) and an emptied
inline rename.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def block_after(text: str, marker: str, stop: str) -> str:
    assert marker in text, f"missing marker: {marker}"
    return text.split(marker, 1)[1].split(stop, 1)[0]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")

    # --- the delete itself never runs the board render ---------------------
    delete = block_after(
        app_js,
        "function deleteSubtaskRows(rows) {",
        "\nfunction deleteSelectedSubtasks(",
    )
    assert 'action("delete_subtasks"' not in delete, (
        "the delete still saves through action(), whose reply rebuilds the stage"
    )
    assert 'silentAction("delete_subtasks"' in delete, "the delete does not save at all"
    assert "row.remove();" in delete, "the row is still only hidden, not taken out of the lane"
    assert "row.style.display" not in delete, "the delete still leaves a hidden row behind"
    assert "refillSubtaskLane" in delete, "the freed line never returns to the lane"
    assert "syncNextSubtaskRow();" in delete, "the bold mark can stay on the row that left"
    # The local copy has to lose the row too: a later render must not print it.
    assert "todo.subtasks = (todo.subtasks || []).filter(" in delete, (
        "the local board still holds the deleted subtask"
    )
    assert "if (doingPeekOpen) updateDoingPeek();" in delete, (
        "a tucked Doing card is rebuilt behind the click, or an open one keeps the row"
    )
    assert "if (trashOpen) renderTrashDrawer();" in delete, (
        "an open trash card never prints the row that was just deleted"
    )

    # --- the freed row hands its rule to a filler --------------------------
    refill = block_after(app_js, "function refillSubtaskLane(list) {", "\n}")
    assert "TASK_VISIBLE_ROWS - list.children.length" in refill, (
        "the lane is no longer kept seven unit rows tall"
    )
    assert "current-subtask-filler" in refill

    # --- every way in goes through that one delete -------------------------
    menu = block_after(app_js, "function showCurrentSubtaskMenu(", "function showHistoryMenu(")
    assert "deleteSubtaskRows([row])" in menu
    cut = block_after(menu, "const cut = async () => {", "\n  };")
    hide_at = cut.index('row.style.display = "none";')
    copy_at = cut.index("await copyToClipboard(subtask.name)")
    assert hide_at < copy_at, "Cut still waits for the clipboard before the row leaves"
    assert 'row.style.display = "";' in cut, "a failed copy can no longer bring the row back"

    rename = block_after(app_js, "const remove = () => {", "\n  };")
    assert "deleteSubtaskRows([row])" in rename, "an emptied rename still saves through action()"
    assert 'action("delete_subtask"' not in app_js, (
        "the old full-render delete is still reachable"
    )

    print("a deleted subtask leaves the lane on the click, without a board repaint")
    return 0


if __name__ == "__main__":
    sys.exit(main())
