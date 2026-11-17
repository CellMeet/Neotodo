"""Switching categories patches the page instead of reloading it.

Every render used to replace `#stage` with one `innerHTML` write. Moving the
reader to another category therefore re-created the whole page — the note sheet
with its live textarea, the AI card, the split handles, every card and every
wallpaper pane — which is why a switch looked and felt like a page load even
though only the task board had changed.

Three things keep that cost away now:

* `paintStageBoard()` patches the mounted page: only the title and the task
  board are printed again, and the note sheet is refilled in place;
* the Doing card's state key no longer carries the selected category, so the
  hidden card (rows and baked wallpaper) is not rebuilt just to move its
  `active` marker — that marker is a class flip;
* `select_category` answers with a `slim` acknowledgement instead of echoing
  the whole notebook back. On a large notebook that response was several
  megabytes, decoded and installed on the UI thread right after the switch.
"""
from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import app


def block_after(text: str, marker: str, stop: str) -> str:
    assert marker in text, f"missing marker: {marker}"
    return text.split(marker, 1)[1].split(stop, 1)[0]


def check_stage_is_patched(app_js: str) -> None:
    stage = block_after(app_js, "function renderStage()", "\nfunction setCompletedSubtasksOpen")
    assert "paintStageBoard(stage, headMarkup, boardMarkup)" in stage, (
        "renderStage no longer patches the mounted page"
    )
    assert "if (!paintStageBoard(stage, headMarkup, boardMarkup)) {" in stage, (
        "the full stage write is not the fallback any more"
    )
    # Only two full writes may remain: the empty-notebook page and the
    # first-paint fallback. A category switch must not take either.
    assert stage.count("stage.innerHTML") == 2, (
        "the stage is still replaced outside the empty-board and first-paint fallbacks"
    )
    assert "if (paintedNotes === null) renderNotesPanel();" in stage, (
        "the carried-over note sheet is never refilled"
    )

    helper = block_after(app_js, "function paintStageBoard(", "\nfunction renderStage(")
    assert 'stage.querySelector(":scope > .page-body")' in helper
    assert 'body?.querySelector(":scope > .todos-section")' in helper
    assert 'body.querySelector(":scope > #notes-half")' in helper, (
        "the note sheet is not recognised as permanent chrome"
    )
    assert 'body.querySelector(":scope > #agent-terminal")' in helper, (
        "the AI card is not recognised as permanent chrome"
    )
    assert "head.outerHTML = headMarkup" in helper
    assert "board.innerHTML = boardMarkup" in helper
    assert "stage.innerHTML" not in helper, "the helper still tears the page down"


def check_doing_card_does_not_rebuild_on_category(app_js: str) -> None:
    key = block_after(app_js, "function doingPeekStateKey(", "\n/** The subtask column's own box")
    assert "state.selectedCategoryId" not in key, (
        "the selected category still rebuilds the hidden Doing card"
    )
    update = block_after(app_js, "function updateDoingPeek(", "\nfunction openDoingPeek")
    assert 'head.dataset.categoryId === state.selectedCategoryId' in update, (
        "the Doing card does not move its active marker in place"
    )
    assert 'item.classList.toggle(' in update


def check_select_category_is_slim(app_js: str) -> None:
    calls = app_js.count('silentAction("select_category"')
    slim_calls = app_js.count('silentAction("select_category", { slim: true,')
    assert calls >= 1, "no category switch asks the backend to remember the choice"
    assert calls == slim_calls, (
        "a category switch still downloads the whole notebook back"
    )

    # The fire-and-forget writes are on the same path: switching flushes a dirty
    # note before it repaints, and that write must not pull the notebook down.
    persist = block_after(app_js, "async function persistAction(", "\n}")
    assert "slim: true" in persist, (
        "a note/settings write still echoes the whole notebook"
    )


def check_store_answers_slim() -> None:
    with tempfile.TemporaryDirectory() as temp:
        path = Path(temp) / "NeoTodo.json"
        path.write_text(
            json.dumps({
                "categories": [
                    {"id": "c1", "name": "One", "todos": []},
                    {"id": "c2", "name": "Two", "todos": []},
                ],
                "settings": {},
            }),
            encoding="utf-8",
        )
        store = app.Store(path)
        writes = []
        with mock.patch.object(app, "save_data", side_effect=lambda *a, **k: writes.append(1)):
            slim = store.action({"action": "select_category", "id": "c2", "slim": True})
        assert slim.get("ok") is True, slim
        assert "state" not in slim, "the slim answer still echoes the notebook"
        assert writes == [1], "the remembered category is not written once"
        assert store.data["selected_category"] == "c2"

        full = store.action({"action": "select_category", "id": "c1"})
        assert full.get("ok") is True and "state" in full, (
            "a normal action lost its state answer"
        )
        assert full["state"]["selected_category"] == "c1"

        # A slim request that fails still explains itself with the board it is
        # talking about; only the success path is trimmed.
        bad = store.action({"action": "select_category", "id": "missing", "slim": True})
        assert bad.get("ok") is False and "state" in bad

        assert len(json.dumps(slim)) < 200, "the acknowledgement is not small"
        assert len(json.dumps(full)) > len(json.dumps(slim)) * 10


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    check_stage_is_patched(app_js)
    check_doing_card_does_not_rebuild_on_category(app_js)
    check_select_category_is_slim(app_js)
    check_store_answers_slim()
    print("category switches patch the page and answer without the whole notebook")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
