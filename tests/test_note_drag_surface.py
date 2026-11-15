"""Pulling the note's bottom line must not repaint the notebook.

The door drag used to swap the sheet's surface for a flat paper fill so the
height frames stayed cheap. Glass and Focus take their colour from the frost
and the photograph behind them, so that shortcut flipped the note to solid
parchment for the whole pull, and `contain: paint` made the sheet its own
backdrop root — which left the frost nothing to blur. Keeping the surface,
though, brought the stutter back: the Paper material used to paint five
full-sheet gradients, so every height frame re-rastered the whole note.

The notebook therefore owns one flat white page now (note-theme.css and
note-materials/paper.css), and a preset shelf of note palettes is gone. This
test keeps both halves of the contract: the surface is not repainted during
the gesture, and the Paper surface has nothing sheet-sized left to repaint.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def strip_comments(text: str) -> str:
    """Only declarations matter; the prose may name the properties it avoids."""
    return re.sub(r"/\*.*?\*/", "", text, flags=re.S)


def main() -> int:
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
    note_handle = (ROOT / "web" / "note-handle.js").read_text(encoding="utf-8")

    # The gesture still tags the sheet it is pulling, and only that sheet.
    assert 'g.panel.classList.add("panel-handle-resizing")' in note_handle
    assert "panel-handle-resizing" in css, "the drag state has no stylesheet"

    # The whole door-drag section: from the note surface note to the AI card.
    section = css.split("What a drag must NOT do is repaint", 1)[1]
    section = section.split("The AI card's soft drop shadow", 1)[0]
    # The split starts inside the prose note; drop the rest of that comment.
    section = section.split("*/", 1)[1]
    section = strip_comments(section)

    # The drag never repaints the surface: no flat paper fill, no dropped
    # gradient, no killed frost. That was the "the note changes colour" bug.
    assert "--note-theme-paper" not in section, (
        "the drag paints the note with the theme paper again"
    )
    assert "background-color:" not in section, "the drag overrides the sheet colour"
    assert "background-image: none" not in section, "the drag drops the paper wash"
    assert "background-blend-mode" not in section, "the drag flattens the surface"
    assert "border-image" not in section, "the drag strips the note's frame"
    assert "backdrop-filter" not in section, "the drag removes the frost"
    assert "::before" not in section, "the drag repaints the frosted layer"

    # What is still dropped is only the passive lift, exactly like the top-edge
    # stretch, plus the easing/enter animation of a moving sheet.
    note_rule = section.split(
        "html body .page-body > .notes-half.floating-notes.panel-handle-resizing:not(.notes-hidden) {",
        1,
    )[1].split("}", 1)[0]
    assert "box-shadow: none !important;" in note_rule, "the lift shadow is still paid for"
    assert "transition: none !important;" in note_rule
    assert "animation: none !important;" in note_rule

    # Containment is only safe on the solid paper: it creates a backdrop root,
    # so the frosted materials must not be contained while they are pulled.
    assert "contain: layout paint;" not in note_rule, (
        "the frost lost its backdrop because the sheet is contained"
    )
    paper_rule = section.split(
        'html[data-note-material="paper"] body .page-body > .notes-half.floating-notes'
        ".panel-handle-resizing:not(.notes-hidden) {",
        1,
    )[1].split("}", 1)[0]
    assert "contain: layout paint;" in paper_rule, "the solid sheet lost its containment"

    # The top-edge stretch shares the same trade (shadow only, surface intact),
    # so the two lines of the same sheet behave identically.
    stretch = css.split("/* Make the manual note stretch as cheap as possible to repaint. */", 1)[1]
    stretch = stretch.split("/* Keep the ruled paper behind empty space", 1)[0]
    assert "box-shadow: none !important;" in stretch
    assert "background-color:" not in stretch
    assert "background-image: none" not in stretch

    # The notebook has one palette of its own: a plain white page. The old
    # preset shelf (Parchment / Ivory / Rose / Mint) is deleted.
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    builtins = app_js.split("const NOTE_THEME_BUILTINS = [", 1)[1].split("\n];", 1)[0]
    assert 'id: "white"' in builtins, "the white note theme is missing"
    assert "Parchment" not in builtins and "Ivory" not in builtins
    assert "Rose paper" not in builtins and '"Mint"' not in builtins
    assert builtins.count("palette:") == 1, "a second note palette came back"
    assert 'note_theme: "white"' in app_js, "the notebook does not default to white"

    note_theme = (ROOT / "web" / "note-theme.css").read_text(encoding="utf-8")
    assert "--note-theme-paper: #ffffff;" in note_theme, "the note palette is not white"
    assert "#e8d3a6" not in note_theme, "the parchment palette is back in the note theme"

    # A white page is one flat fill: no sheet-sized gradient or inset wash is
    # re-rastered on every height frame, which is what made the drag stutter.
    paper = (ROOT / "web" / "note-materials" / "paper.css").read_text(encoding="utf-8")
    assert "background-color: var(--note-paper, #ffffff) !important;" in paper
    assert "background-image: none !important;" in paper
    assert "radial-gradient" not in paper, "the paper wash re-rastered every drag frame"

    app_py = (ROOT / "app.py").read_text(encoding="utf-8")
    assert '"note_theme": "white",' in app_py, "a fresh install still starts on parchment"
    assert '(("note_theme", "white"), ("ai_theme", "auto"))' in app_py

    # A missing or extra brace here would silently drop the drag rules.
    assert css.count("{") == css.count("}"), "the stylesheet is unbalanced"

    print("the white note keeps its colour and drags smoothly")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
