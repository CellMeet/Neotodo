"""The note and the AI card keep two independent heights.

The two sheets used to share `--agent-terminal-height`, so pulling one door
line resized the other and opening the AI dropped the note on the AI's box.
They now own one variable each:

    --agent-terminal-height   the AI card (viewState.aiHeight)
    --notes-sheet-height      the note (neotodo.notesSheetHeight)

Sizing one must never read the other. This test pins both the stored keys and
the two stylesheet boxes, including the side-by-side split, where the note is
a bottom sheet with its own height instead of a copy of the AI card.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def strip_comments(text: str) -> str:
    return re.sub(r"/\*.*?\*/", "", text, flags=re.S)


def rule_body(css: str, selector: str) -> str:
    """Declarations of the first exact `selector { ... }` rule."""
    marker = selector + " {"
    assert marker in css, f"missing rule: {selector}"
    return css.split(marker, 1)[1].split("}", 1)[0]


def main() -> int:
    note_handle = (ROOT / "web" / "note-handle.js").read_text(encoding="utf-8")
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    page_layout = strip_comments((ROOT / "web" / "page-layout.css").read_text(encoding="utf-8"))
    style = strip_comments((ROOT / "web" / "style.css").read_text(encoding="utf-8"))

    # Two stored values, two variables.
    assert 'const HEIGHT_VAR = "--notes-sheet-height";' in note_handle
    assert 'const HEIGHT_KEY = "neotodo.notesSheetHeight";' in note_handle
    assert 'localStorage.setItem(HEIGHT_KEY, String(height))' in note_handle
    assert "root.style.setProperty(HEIGHT_VAR" in note_handle
    assert 'rememberedAiSheetHeight' in app_js
    assert 'aiHeight: rememberedAiSheetHeight()' in app_js
    assert 'style.setProperty(\n      "--agent-terminal-height"' in app_js

    # The note's own value is what sizes the note, in the page and in a split.
    assert "--page-note-h: min(var(--notes-sheet-height, var(--page-desk-h)), var(--page-desk-h));" in page_layout
    note_base = rule_body(page_layout, ".page-body > #notes-half")
    assert "height: var(--page-note-h);" in note_base
    assert "agent-terminal-height" not in note_base

    note_split = rule_body(
        page_layout, "body.agent-notes-split .page-body > #notes-half:not(.notes-hidden)"
    )
    assert "height: var(--page-note-h) !important;" in note_split
    assert "top: auto !important;" in note_split
    assert "agent-terminal-height" not in note_split

    # The AI card keeps the full split band; only the note is a bottom sheet.
    ai_split = rule_body(page_layout, "body.agent-notes-split .page-body > #agent-terminal")
    assert "height: var(--page-desk-h) !important;" in ai_split

    # The older split skins in style.css must not size the note from the AI
    # variable either: the note's own height (or the desk) is the only input.
    assert "height: var(--notes-sheet-height, var(--page-desk-h)) !important;" in style
    assert "var(--notes-sheet-height, var(--agent-terminal-height" not in style
    assert "  top: auto !important;\n  bottom: var(--page-desk-bottom) !important;\n  height: var(--page-note-h) !important;" in style

    # A side-by-side split lets the note keep its box; only a stacked split or
    # a detached window takes the geometry. Reopening the note then restores
    # the note's own height instead of the AI card's box.
    assert 'if (splitOwnsHeight() || node.classList.contains("notes-hidden"))' in note_handle
    assert "manualBoxInSplit" not in note_handle
    assert "splitActive()" not in note_handle
    assert 'document.body.classList.contains("agent-notes-axis-y")' in note_handle

    # A render clears the note's inline box and NotesDock writes the same
    # numbers back as plain declarations. The geometry pass must then re-assert
    # its own `!important` box instead of trusting the cached numbers, otherwise
    # the stylesheet's split height wins and the note silently changes height.
    apply_geometry = note_handle.split("function applyGeometry()", 1)[1].split(
        "function currentHeight()", 1
    )[0]
    assert 'getPropertyPriority("top") === "important"' in apply_geometry
    assert 'getPropertyPriority("height") === "important"' in apply_geometry

    # Every note-height gesture is remembered: the bottom line pull and the
    # top-edge stretch both write the note's own value.
    assert "noteSheetRememberCurrentHeight()" in note_handle
    assert "window.noteSheetRememberCurrentHeight?.();" in app_js
    assert "notesDock.finishStretch(pendingTop, prepared);" in app_js

    assert page_layout.count("{") == page_layout.count("}")
    print("the note and the AI keep two independent heights")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
