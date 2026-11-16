"""The Doing card remembers which todo rows the reader left open.

Closing the drawer used to call ``doingExpandedTodoIds.clear()``, so every peek
started from a fully collapsed list. The open rows now live in localStorage and
are restored on the next peek, and on the next launch: the card keeps the shape
the reader left it in.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")

    # --- the open rows survive a close and a relaunch -----------------------
    assert 'const DOING_EXPANDED_KEY = "neotodo.doingExpandedTodoIds.v1";' in app_js
    init = app_js.split("let doingExpandedTodoIds = (() => {", 1)[1].split(
        "function saveDoingExpandedTodoIds()", 1
    )[0]
    assert "localStorage.getItem(DOING_EXPANDED_KEY)" in init
    assert "new Set(saved" in init, "the saved ids must become the live set"
    save = app_js.split("function saveDoingExpandedTodoIds()", 1)[1].split(
        "let doingMarkedTodoId", 1
    )[0]
    assert "localStorage.setItem(DOING_EXPANDED_KEY" in save

    # --- closing the card keeps the rows, it does not fold them ------------
    close = app_js.split("function closeDoingPeek()", 1)[1].split(
        "function pointInDoingZone(", 1
    )[0]
    assert "doingExpandedTodoIds.clear()" not in close, (
        "closing the Doing card must keep the rows the reader left open"
    )

    # A render without entries (first paint, a data reload) must not wipe the
    # saved shape either.
    update = app_js.split("function updateDoingPeek(", 1)[1].split(
        "function openDoingPeek(", 1
    )[0]
    assert "doingExpandedTodoIds.clear()" not in update

    # --- every way of opening/closing a row persists the new shape ---------
    jump = app_js.split("function jumpToDoingTodo(", 1)[1].split(
        "function jumpToDoingSubtask(", 1
    )[0]
    assert "saveDoingExpandedTodoIds();" in jump

    click = app_js.split(
        'const doingExpand = event.target.closest("[data-doing-expand]");', 1
    )[1].split("const doingJump", 1)[0]
    assert "saveDoingExpandedTodoIds();" in click

    # --- the row still renders from the remembered set ----------------------
    todo = app_js.split("function doingTodoHtml(", 1)[1].split(
        "function doingPeekMarkup(", 1
    )[0]
    assert "doingExpandedTodoIds.has(todo.id)" in todo

    print("the Doing card restores the todo rows left open on the last peek")
    return 0


if __name__ == "__main__":
    sys.exit(main())
