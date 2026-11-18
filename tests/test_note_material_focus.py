"""The Focus note material reproduces FocusWriter's frosted page.

The reference screenshot is one full-bleed frost: the background photograph is
blurred over the whole page, a translucent wash sits on top and the words are
written straight onto it — no sharp photo frame and no second pane. FocusWriter
renders exactly that in Theme::render(): a blurred copy of the background slice
plus the foreground colour at its opacity. The notebook exposes it as the
`focus` note surface: it must sit in the Settings material list, load its own
stylesheet, and fall back to a bundled photograph when no background is chosen.
"""
import os
import shutil
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def check_seeding() -> None:
    """A shipped material refreshes an untouched copy, never a user edit."""
    root = Path(tempfile.mkdtemp(prefix="neotodo-material-seed-"))
    web_dir = root / "web"
    data_dir = root / "data"
    bundled = web_dir / "note-materials"
    bundled.mkdir(parents=True)
    data_dir.mkdir()
    saved = (app.WEB_DIR, app.NOTE_MATERIALS_DIR)
    try:
        app.WEB_DIR = web_dir
        app.NOTE_MATERIALS_DIR = data_dir
        src = bundled / "focus.css"
        src.write_text("v1", encoding="utf-8")
        old = time.time() - 500
        os.utime(src, (old, old))
        app.ensure_note_materials_dir()
        dest = data_dir / "focus.css"
        assert dest.read_text(encoding="utf-8") == "v1"

        # A newer shipped file replaces the untouched seeded copy.
        src.write_text("v2", encoding="utf-8")
        os.utime(src, (time.time(), time.time()))
        app.ensure_note_materials_dir()
        assert dest.read_text(encoding="utf-8") == "v2"

        # A copy the user edited after the build stays theirs.
        dest.write_text("mine", encoding="utf-8")
        future = time.time() + 60
        os.utime(dest, (future, future))
        app.ensure_note_materials_dir()
        assert dest.read_text(encoding="utf-8") == "mine"
    finally:
        app.WEB_DIR, app.NOTE_MATERIALS_DIR = saved
        shutil.rmtree(root, ignore_errors=True)


def main() -> int:
    focus = ROOT / "web" / "note-materials" / "focus.css"
    assert focus.is_file(), focus
    css = focus.read_text(encoding="utf-8")

    # The card is a transparent pane: it never carries a picture of its own.
    card_start = css.index('html[data-note-material="focus"] .notes-half.floating-notes {')
    card = css[card_start:].split("}", 1)[0]
    assert "background-image: none !important;" in card
    assert "border-radius: 0" in card
    assert "backdrop-filter: none !important" in card

    # FocusWriter's recipe, with no picture baked in: the note is transparent
    # and the ::before blurs whatever is behind it, then lays one flat wash.
    frost_start = css.index('html[data-note-material="focus"] .notes-half.floating-notes::before')
    frost = css[frost_start:].split("}", 1)[0]
    assert "background-color: var(--note-focus-fill);" in frost
    assert "backdrop-filter: blur(var(--note-focus-blur, 32px))" in frost
    assert "linear-gradient" not in frost
    assert "note-noise" not in css
    assert "::after" not in css
    # No photograph is required: the card itself stays transparent.
    assert "background-color: transparent !important;" in card
    # A heavy blur, like FocusWriter's 32px theme blur, from the shared slider.
    assert "--note-focus-blur: calc(var(--note-blur, 16px) * 2);" in css
    assert "--note-focus-fill: rgba(246, 248, 247, 0.50);" in css

    # Focus is the default surface and never paints the Glass picture: the
    # image exists only for Glass.
    assert "var(--note-bg-image)" not in css

    # A dark note palette frosts with ink instead of milk.
    assert 'html[data-note-material="focus"][data-note-dark="true"]' in css

    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    assert 'note_material: "focus"' in app_js
    assert '{ id: "focus", name: "Focus", english: "FocusWriter-style glass pane", file: "focus.css" }' in app_js
    # The focus frost works on the real backdrop: it never falls back to a
    # baked note picture, and the typewriter centre lives in app.js.
    assert "centerNoteCaret" in app_js
    assert 'NOTE_TYPEWRITER_SURFACES = new Set(["focus", "glass"])' in app_js
    # The surface picker lives in Settings → Theme → Note theme, not in the
    # page-wide Palette plugin.
    assert "data-note-surface-file=" in app_js
    assert "glass.css" in app_js
    assert 'noteMaterialFiles = ["paper.css", "glass.css", "focus.css"]' in app_js

    index = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
    assert '/note-materials/focus.css' in index

    # The note theme file carries the Focus surface with the other built-ins:
    # the palette owns its ink, hairlines and accent.
    # The FocusWriter measure and the fading band are part of the surface.
    assert 'html[data-note-material="focus"] .page-body .notes-half.floating-notes .note-live' in css
    assert "mask-image:" in css
    assert "26vh" in css
    note_theme = (ROOT / "web" / "note-theme.css").read_text(encoding="utf-8")
    assert 'html[data-note-material="focus"] body .page-body .notes-half.floating-notes {' in note_theme
    assert "--note-ink: var(--note-theme-ink) !important;" in note_theme

    app_py = (ROOT / "app.py").read_text(encoding="utf-8")
    assert "ensure_note_materials_dir" in app_py
    assert 'WEB_DIR / "note-materials"' in app_py

    check_seeding()
    print("the focus note material keeps the FocusWriter full-bleed frost")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
