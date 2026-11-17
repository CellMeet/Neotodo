"""The AI/note line has one static position.

The note's top edge (the line the door handle rides) and the closed door line
belong to the page, not to a sheet. Opening or closing a pane, or a width
split's translation, used to feed a stale box back into that line, so the note
reopened a little lower every time and its closed line parked wherever the
sheet happened to be. Both are now static page values:

  - note-handle.js publishes `--notes-sheet-line-top` (the foot of the
    task/categories block) and only a real page layout change re-reads it;
  - the note's height is published on every pass, so the split rules can never
    fall back to the full desk for a frame;
  - a stretched height is stored with the line it was taken on, so a layout
    change puts the sheet back on the static line;
  - closing does not snapshot the rendered box;
  - handle-position.js snaps the closed line to `deskLineClosedTop()`, never
    to a remembered home.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    note = (ROOT / "web" / "note-handle.js").read_text(encoding="utf-8")
    handles = (ROOT / "web" / "handle-position.js").read_text(encoding="utf-8")

    # The line is a published static variable and is tracked by the task block.
    assert 'const LINE_TOP_VAR = "--notes-sheet-line-top";' in note
    assert 'root.style.setProperty(LINE_TOP_VAR' in note
    assert 'querySelector(".page-body > .todos-section")' in note
    assert "new ResizeObserver(" in note

    # The note height must be published on every pass, not only after a stretch.
    assert "publishHeight(remembered != null ? remembered : height);" in note

    # A stretch is only valid on the page line it was taken on.
    assert 'localStorage.setItem(HEIGHT_KEY, JSON.stringify({ height, line: rememberedLine }))' in note
    assert 'const HEIGHT_KEY = "neotodo.notesSheetHeight.v2";' in note

    # A close must not snapshot the rendered box again.
    assert "window.hideNotesPanel = function" not in note
    assert "window.noteSheetRememberCurrentHeight = rememberFromPanel;" in note, \
        "the explicit stretch path must keep saving"

    # The closed door line has one static slot, never a remembered home.
    assert "function deskLineClosedTop()" in handles
    assert "function deskLineTuckedTop()" in handles
    assert "this.place(kind, home.center, home.top);" not in handles
    assert "const center = closedLineCenters[kind] != null" in handles
    assert "this.place(kind, center, deskLineClosedTop());" in handles
    assert "const closedTop = deskLineClosedTop();" in handles
    assert "const tuckedTop = deskLineTuckedTop();" in handles

    # The horizontal slot is the neutral 50/50 pair (25% / 75%), not the live
    # divider ratio: dragging the divider changes the note's width and must not
    # decide where the closed line slides down.
    assert "const closedLineCenters = { ai: null, note: null };" in handles
    assert "const aiCenter = aiRect ? aiRect.center : closedLineCenters.ai;" in handles
    assert "const notesCenter = notesRect ? notesRect.center : closedLineCenters.note;" in handles
    assert "const ratio = agentSplitRatio;" not in handles, "the closed slot must not read the live ratio"

    # The pair sits slightly inward of the pane centres (AI right, note left),
    # so the two bars are read as one pair around the middle of the page.
    assert "const CLOSED_SLOT_NUDGE = 0.04;" in handles
    assert "const half = 0.25 - CLOSED_SLOT_NUDGE;" in handles

    print("the AI/note line is one static page value")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
