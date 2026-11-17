"""Enter in the inline subtask row answers the key, not the round trip.

Adding a subtask used to wait for `/api/action`, which echoed the notebook and
then ran the whole stage render: the row appeared and the page re-printed a
beat later, so Enter felt stuck. The row now prints on the same frame, the save
travels behind it with a `slim` acknowledgement, and only the row's local id is
swapped for the stored one. The local board carries the new subtask too, so the
next render cannot print the page without it.

`action(..., { repaint: false })` is the contract that makes this safe: the
caller already painted, so the reply must not rebuild the board.
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

    # --- Enter takes the instant path --------------------------------------
    keyboard = block_after(
        app_js,
        'if (event.target.id === "subtask-name-input" && !event.isComposing) {',
        'if (event.key === "Escape" && $(".community-stage"))',
    )
    assert "commitNewSubtask(todoId, name);" in keyboard, (
        "Enter still saves through action(), whose reply rebuilds the stage"
    )
    assert 'action("add_subtask"' not in keyboard, (
        "Enter still waits for the round trip before the row exists"
    )

    commit = block_after(
        app_js,
        "async function commitNewSubtask(todoId, name) {",
        "\n/** Reorder the visible subtask rows",
    )
    # The row is printed before the request leaves: the paint comes first.
    assert commit.index("paintSubtaskLane();") < commit.index('await action('), (
        "the new row is only printed after the save answers"
    )
    # The local board owns the row, so a later render still prints it.
    assert "todo.subtasks = [{" in commit, "the local board never gains the new subtask"
    assert "slim: true" in commit, "the save still echoes the whole notebook"
    assert "{ repaint: false }" in commit, "the reply still repaints the stage"
    # The reply only fills in the id, and never paints another task's lane.
    assert "row.id = created;" in commit, "the stored id never replaces the local one"
    assert "list === subtaskLiveList()" in commit, (
        "a late reply can paint this lane over the task now on screen"
    )
    # A failed save hands the text back instead of losing it.
    assert "input.value = name;" in commit, "a failed save drops the typed name"
    assert "adding-subtask-provisional" not in app_js, (
        "the old provisional row is still printed beside the real one"
    )

    # --- action() can be asked not to repaint -------------------------------
    act = block_after(app_js, "async function action(name, payload = {}, { repaint = true } = {}) {", "\nasync function silentAction(")
    guard = act.split("if (!repaint) {", 1)[1].split("\n  }", 1)[0]
    assert "return result;" in guard, "the no-repaint branch still falls through"
    assert "render()" not in guard, "repaint: false still rebuilds the board"
    assert act.count("render();") == 1, "the full render is no longer the single fallback"

    print("Enter adds a subtask on the key press; the save lands behind it")
    return 0


if __name__ == "__main__":
    sys.exit(main())
