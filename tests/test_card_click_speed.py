"""A card row answers the pointer before it repaints the card.

The three floating cards (the live subtask sheet, the finished-subtasks card
and the Doing drawer) are click targets, and a click on one of their rows is
supposed to move the note and the highlight on that same frame. They used to do
far more than that before yielding:

* clearing a finished-run light rebuilt the whole Doing card's markup (and its
  wallpaper pass) ahead of the note;
* jumping to a Doing row rebuilt the card again just to light one row;
* reprinting the same note threw away the live textarea and its scroll;
* opening the finished card walked every card on the page for its wallpaper;
* the AI console was laid out twice for one selection.

None of that is movement the reader asked for. The click now flips the classes
it needs, keeps the sheet it already printed, and lets the AI console settle
after the click's own paint. The note is the display; the card follows.

A pull, an unfold and a drag keep their own animations, and a real content
change still rebuilds the note and the Doing card exactly once.
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

    # --- the same note is not rebuilt for every click ---------------------
    render = block_after(app_js, "function renderNotesPanel()", "\n}\n")
    assert "notesRenderCache" in app_js, "the note sheet has no cache to compare against"
    assert "cached.html === html" in render, (
        "the note is still thrown away when the click did not change it"
    )
    early = render.split("cached.html === html", 1)[1].split("}", 1)[0]
    assert "return;" in early, "the cached sheet does not stop the rebuild"

    # --- a finished-run light is one class, not a card rebuild ------------
    clear = block_after(app_js, "function clearUnseenAgentSubtask(", "\n}\n")
    assert "syncDoingRowMarks()" in clear, (
        "putting a finished-run light out still rebuilds the Doing card"
    )
    assert "updateDoingPeek(true)" not in clear

    marks = block_after(app_js, "function syncDoingRowMarks(", "\n}\n")
    assert 'classList.toggle("marked", marked)' in marks
    assert 'classList.toggle("has-unseen", unseen)' in marks
    assert "innerHTML" not in marks, "the marker pass still rebuilds the card's markup"

    # --- a Doing jump lights its row in place ----------------------------
    jump_todo = block_after(app_js, "function jumpToDoingTodo(", "\n}\n")
    assert "updateDoingPeek(true)" not in jump_todo, (
        "a Doing row still forces a full card rebuild"
    )
    assert "syncDoingRowMarks()" in jump_todo
    assert "updateDoingPeek();" in jump_todo

    jump_sub = block_after(app_js, "function jumpToDoingSubtask(", "\n}\n")
    assert "updateDoingPeek(true)" not in jump_sub, (
        "a Doing subtask click still forces a full card rebuild"
    )
    assert "syncDoingRowMarks()" in jump_sub
    assert "updateDoingPeek();" in jump_sub
    assert "renderNotesPanel();" in jump_sub, "the note must still follow the click"

    # --- the AI console follows after the click's own frame --------------
    sync = block_after(app_js, "function syncAgentTerminal(", "\n}\n")
    assert "agentTerminalSyncTimer" in sync
    assert "setTimeout(" in sync, (
        "the AI console is still re-laid-out inside the click, before the note paints"
    )
    assert "renderAgentTerminal();" in sync

    # --- the finished card mounts only its own wallpaper -----------------
    completed = block_after(app_js, "function setCompletedSubtasksOpen(", "\n}\n")
    assert "syncCardWallpaper(drawer);" in completed, (
        "opening the finished card still walks every card's wallpaper"
    )
    assert "syncCardWallpapers();" not in completed
    assert "settleCardWallpaper(drawer" in completed

    # --- opening the Doing drawer does not measure its box twice ---------
    opened = block_after(app_js, "function openDoingPeek(", "\n}\n")
    assert opened.count("positionDoingPeek();") == 0, (
        "the drawer is measured once by updateDoingPeek() and again on open"
    )
    assert "clearDoingDragOffset(panel);" in opened
    assert 'panel.classList.add("open");' in opened

    print("card clicks move the marker and the note before the card repaints")
    return 0


if __name__ == "__main__":
    sys.exit(main())
