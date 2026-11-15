"""The AI/note door line hides until the pointer reaches the bottom strip.

The two door lines used to rest 34px above the bottom border all the time, so
a closed workspace still showed a line floating over the empty desk. The line
now lives under the border and only pops up into that same slot while the
pointer visits the bottom strip (the last ruled line of the page).

The note also closed on a hover pass: moving the pointer from above the line
down into the sheet crossed the line and dismissed it, which read as "the note
slides away while I reach for it". A click on the line is the only dismiss
gesture now; a hover can only open.

These are layout/gesture contracts in source, not visuals, so the test pins the
exact branches that implement them.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    handle_position = (ROOT / "web" / "handle-position.js").read_text(encoding="utf-8")
    note_handle = (ROOT / "web" / "note-handle.js").read_text(encoding="utf-8")
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")

    # A closed line is hidden on both sides of the workspace, whatever the
    # other pane is doing; only a strip visit lifts it into its slot.
    assert "const aiTucked = !aiOpen && !stripHover;" in handle_position
    assert "const notesTucked = !notesOpen && !stripHover;" in handle_position
    assert "const closedTop = window.innerHeight - 34;" in handle_position
    assert "const tuckedTop = window.innerHeight + 8;" in handle_position

    # Closing must not snap the line back to the home it had while visible:
    # that would park the closed line on screen again.
    assert 'handle.classList.contains("handle-tucked")' in handle_position
    assert "if (handle.classList.contains(\"handle-tucked\")" in handle_position
    assert "home.top > window.innerHeight - 2" in handle_position

    # The note's hover pass only ever opens. The downward branch and its close
    # helper are gone.
    assert "closeNote" not in note_handle, "the hover pass can still close the note"
    assert "prev < lineY && y >= lineY" not in note_handle
    assert "prev > lineY && y <= lineY" in note_handle, "hover can no longer open"
    assert "if (openNow()) hideNotesPanel();" in note_handle, "a click must still close"

    # The second hover path (the shared note swipe guard) is opening-only too.
    assert "!notesHidden && prevY < lineY - 2 && event.clientY > lineY + 2" not in app_js
    assert "notesHidden && prevY > lineY + 2 && event.clientY < lineY - 2" in app_js

    # Leaving the window clears the strip latch, so a closed line cannot hover
    # over the border with the pointer gone.
    assert 'document.documentElement.addEventListener("mouseleave"' in app_js

    print("closed door lines stay hidden until the pointer visits the bottom strip")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
