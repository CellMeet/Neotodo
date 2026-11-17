"""Pulling the note's bottom line must not repaint the notebook.

The door drag used to swap the sheet's surface for a flat paper fill so the
height frames stayed cheap. Glass and Focus take their colour from the frost
and the photograph behind them, so that shortcut flipped the note to solid
parchment for the whole pull, and `contain: paint` made the sheet its own
backdrop root — which left the frost nothing to blur. Keeping the surface,
though, brought the stutter back: the Paper material used to paint five
full-sheet gradients, so every height frame re-rastered the whole note.

The notebook therefore owns one style only: a beige sticky note with white
ruled lines (note-theme.css and note-materials/paper.css), and every other note
palette or surface is gone. This test keeps both halves of the contract: the
surface is not repainted during the gesture, and the Paper surface has only one
cheap rule gradient left to repaint.
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

    # The notebook has one style of its own: the beige `default` sticky note.
    # The old preset shelf (Parchment / Ivory / Rose / Mint) stays deleted.
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    builtins = app_js.split("const NOTE_THEME_BUILTINS = [", 1)[1].split("\n];", 1)[0]
    assert 'id: "default"' in builtins, "the default note style is missing"
    assert 'name: "Default"' in builtins, "the note style is not named default"
    assert "Parchment" not in builtins and "Ivory" not in builtins
    assert "Rose paper" not in builtins and '"Mint"' not in builtins
    assert builtins.count("palette:") == 1, "a second note palette came back"
    assert 'note_theme: "default"' in app_js, "the notebook does not default to default"

    note_theme = (ROOT / "web" / "note-theme.css").read_text(encoding="utf-8")
    assert "--note-theme-paper: #f6e8c4;" in note_theme, "the note paper is not beige"
    assert "--note-theme-rule: rgba(255, 255, 255, 0.90);" in note_theme, "the rules are not white"
    assert "#e8d3a6" not in note_theme, "the old parchment palette is back"

    # The beige page keeps one flat fill plus one repeating rule gradient. No
    # sheet-sized wash is re-rastered on every height frame.
    paper = (ROOT / "web" / "note-materials" / "paper.css").read_text(encoding="utf-8")
    assert "background-color: var(--note-paper, #f6e8c4) !important;" in paper
    assert "repeating-linear-gradient(" in paper, "the white note rules are missing"
    assert "var(--note-rule, rgba(255, 255, 255, 0.90)) 39px 40px" in paper
    assert "radial-gradient" not in paper, "the paper wash re-rastered every drag frame"

    # The first empty line is a ghost prompt, in italic.
    assert 'aria-hidden="true">Write something ...</span>' in app_js
    assert "noteGhostMarkup" in app_js and "syncNoteGhost" in app_js
    assert ".note-ghost {" in note_theme and "font-style: italic;" in note_theme

    app_py = (ROOT / "app.py").read_text(encoding="utf-8")
    assert '"note_theme": "default",' in app_py, "a fresh install does not start on default"
    assert 'settings["note_theme"] = "default"' in app_py

    # A missing or extra brace here would silently drop the drag rules.
    assert css.count("{") == css.count("}"), "the stylesheet is unbalanced"

    print("the beige default note keeps its white rules and drags smoothly")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
