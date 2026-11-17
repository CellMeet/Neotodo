"""A row in the Doing card unfolds its subtasks as a short sheet ripple.

The card is rebuilt (innerHTML) whenever any of its state changes, so the old
``.doing-subs`` keyframe could never run: it is disabled by an ``!important``
rule to keep polling repaints from replaying it. Expanding a todo with several
pending subtasks therefore snapped the whole block open at once, while a single
row looked smooth because only the list reorder glided.

The unfold is now a one-off Web Animation fired by the click that opened the
row: the subtask sheet grows from zero to its measured height, and its rows
ripple in a 150ms stagger that is capped so a long list still lands quickly.
Only the opened row animates, the reorder glide stands down while the sheet
grows (it already carries the lower rows), and reduced motion keeps the old
instant cut.

This test pins those rules so a future re-render cannot turn the unfold back
into a snap.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")

    # --- only a fresh unfold asks for the ripple ---------------------------
    assert "let doingUnfoldTodoId = null;" in app_js
    click = app_js.split(
        'const doingExpand = event.target.closest("[data-doing-expand]");', 1
    )[1].split("const doingJump", 1)[0]
    assert "const willUnfold = !doingExpandedTodoIds.has(todoId);" in click
    assert "doingUnfoldTodoId = willUnfold ? todoId : null;" in click, (
        "folding a row back must not replay the unfold animation"
    )
    jump = app_js.split("function jumpToDoingTodo(", 1)[1].split(
        "function jumpToDoingSubtask(", 1
    )[0]
    assert "doingUnfoldTodoId = willUnfold ? todoId : null;" in jump, (
        "the row name is an expander too, so it unfolds the same way"
    )

    # --- the unfold is one row, one measured sheet, one short ripple -------
    unfold = app_js.split("function animateDoingUnfold(", 1)[1].split(
        "/** The fan beside a subtask", 1
    )[0]
    assert 'data-doing-item="${CSS.escape(String(todoId))}"' in unfold, (
        "only the row that was just opened animates"
    )
    assert 'subs.querySelectorAll(".doing-sub")' in unfold
    assert "getBoundingClientRect().height" in unfold, (
        "the sheet grows to the height the rows actually need"
    )
    assert '[{ height: "0px" }, { height: `${height}px` }]' in unfold
    assert "duration: 190" in unfold, "the sheet must land quickly"
    assert "duration: 150" in unfold, "each row lands on its own short beat"
    assert "Math.min(index * step, 110)" in unfold, (
        "a long subtask list must not queue into a slow animation"
    )
    assert 'fill: "backwards"' in unfold, (
        "a delayed row must stay hidden until its turn"
    )
    assert "prefers-reduced-motion: reduce" in unfold

    # --- the render uses it once and skips the double glide ----------------
    update = app_js.split("function updateDoingPeek(", 1)[1].split(
        "function openDoingPeek(", 1
    )[0]
    assert "const unfolded = animateDoingUnfold(nextList, doingUnfoldTodoId);" in update
    assert "doingUnfoldTodoId = null;" in update, "the ripple fires once"
    assert "if (!unfolded) animateDoingReorder(previousTops, nextList);" in update, (
        "a growing sheet already carries the lower rows; gliding them would "
        "move them twice"
    )

    print("the Doing card unfolds multiple subtasks as one short sheet ripple")
    return 0


if __name__ == "__main__":
    sys.exit(main())
