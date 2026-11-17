"""The note keeps a clean right edge: no scrollbar over its paper.

The note's live text column used to show the browser's native vertical
scrollbar against the sheet, which read as a progress bar pinned to the note's
right side. The column still scrolls with the wheel and with keyboard caret
movement, but both the standard and WebKit scrollbar are hidden.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    start = css.index(".note-live {")
    end = css.index(".note-block {", start)
    note_live = css[start:end]

    assert "overflow-y: auto;" in note_live, "the note must keep scrolling"
    assert "scrollbar-width: none;" in note_live, "the note's scrollbar must be hidden"
    assert ".note-live::-webkit-scrollbar" in note_live
    assert "display: none !important;" in note_live

    # Nothing later in the sheet may bring the native bar back on the note.
    for later in (".note-live::-webkit-scrollbar-thumb", ".note-live { scrollbar-width: thin"):
        assert later not in css, later

    print("the note's right edge shows no scrollbar")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
