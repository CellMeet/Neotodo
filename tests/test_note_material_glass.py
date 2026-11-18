"""The notebook has exactly one surface: the Glass plate.

Glass is a lifted pane, not a page: the material paints a rounded, bevelled
plate whose shadow separates it from whatever is behind the note, and blurs
that backdrop through it. The reader owns two things on top of it — the frost
blur and the typewriter centre — plus one optional picture, picked with the
same crop dialog as a card picture.

Paper and Focus were removed. A saved paper/focus surface migrates to Glass on
load, the retired stylesheets are gone from the build, and an older data folder
cannot offer them again.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app  # noqa: F401  (the note shelf lives beside the backend)


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def main() -> int:
    app_js = read("web/app.js")

    # One surface, one palette, no pickers.
    assert "activeNoteSurfaceFile" not in app_js, "a second surface resolver came back"
    assert "noteSurfaceChoices" not in app_js, "the surface picker came back"
    assert "noteSurfaceCardMarkup" not in app_js
    assert "data-note-surface-file" not in app_js
    assert 'note_material: "glass"' in app_js
    assert 'settings.note_material = "glass";' in app_js
    assert 'settings.note_material_file = "glass.css";' in app_js
    assert 'settings.note_theme = "glass";' in app_js

    # Glass keeps FocusWriter's typewriter band, and the reader can switch it off.
    assert 'const NOTE_TYPEWRITER_SURFACES = new Set(["glass"]);' in app_js
    assert "Always vertically center" in app_js
    assert 'data-action="toggle-note-center"' in app_js
    assert "note_center: true" in app_js
    assert "settings.note_center = settings.note_center === false;" in app_js

    # A maximise or a fullscreen toggle rebuilds the frost at the new size and
    # re-seats the caret; that is the "the note is a sheet of paper beside the
    # text after fullscreen" fix.
    assert "function refreshNotePlate()" in app_js
    assert "function scheduleNotePlateRefresh(" in app_js
    assert 'pane.classList.add("note-plate-reset");' in app_js
    assert 'document.addEventListener("fullscreenchange", refitNote);' in app_js
    assert 'window.visualViewport?.addEventListener("resize", refitNote);' in app_js

    # Settings → Theme → Note carries the frost slider, the centre switch and
    # the picture row; the surface chips are gone.
    assert 'id="note-blur-range"' in app_js and 'id="note-blur-value"' in app_js
    assert 'cardSettingsRow("note:background", "note", "background", "Glass image"' in app_js
    assert 'settings.note_background_image = data;' in app_js
    assert "Glass picture cleared" in app_js

    glass = read("web/note-materials/glass.css")
    assert 'html[data-note-material="glass"]' in glass
    assert 'html[data-note-material="blur"]' not in glass
    assert "url(" not in glass, "the material paints a picture again"
    # The plate: square, bevelled, lifted.
    assert "border-radius: 0 !important;" in glass
    assert "26px" not in glass, "the plate grew its rounded corners back"
    assert "inset 0 1px 0 rgba(255, 255, 255, 0.90)" in glass, "the lit top edge is gone"
    assert "0 54px 96px -38px rgba(14, 20, 16, 0.50) !important;" in glass, "the lift shadow is gone"
    assert "html[data-note-material=\"glass\"] body .notes-half.floating-notes:" in glass
    # The plate rebuild hook.
    assert ".note-plate-reset::before" in glass
    # The frost is the reader's slider, doubled like FocusWriter's 32px default.
    assert "backdrop-filter: blur(calc(var(--note-blur, 16px) * 2))" in glass
    assert "background-color: rgba(246, 248, 245, 0.42) !important;" in glass
    # The page itself: a centred measure with the typewriter band.
    assert "68ch" in glass
    assert "mask-image:" in glass and "8vh" in glass
    # A chosen picture becomes the pane, still behind the frost.
    assert 'html[data-note-material="glass"][data-note-image="1"]' in glass
    assert "var(--note-bg-image)" in glass
    # A detached note fills its transparent window with the same square plate.
    assert 'html[data-note-material="glass"] body.detached-note #notes-half {' in glass
    assert "inset: 10px !important;" not in glass

    shape = read("web/note-shape.css")
    assert 'data-note-material="glass"' not in shape, "the square rule still fights the plate"
    assert 'data-note-material="paper"' not in shape

    style = read("web/style.css")
    assert 'data-note-material="paper"' not in style, "a removed surface still paints"
    assert 'data-note-material="blur"' not in style
    assert "--note-bg-image" not in style, "a note picture is still painted by the page"
    assert ".material-blur" not in style

    theme = read("web/note-theme.css")
    assert "--note-theme-paper: #eef0ea;" in theme
    assert "--note-theme-ink: #23261f;" in theme
    assert 'data-note-material="paper"' not in theme
    assert 'data-note-material="focus"' not in theme

    index = read("web/index.html")
    assert "/note-materials/glass.css" in index
    assert "/note-materials/paper.css" not in index
    assert "/note-materials/focus.css" not in index
    assert not (ROOT / "web" / "note-materials" / "paper.css").exists()
    assert not (ROOT / "web" / "note-materials" / "focus.css").exists()

    py = read("app.py")
    assert '"note_material": "glass",' in py
    assert '"note_material_file": "glass.css",' in py
    assert '"note_theme": "glass",' in py
    assert '"note_center": True,' in py
    assert "def normalize_note_surface_id(value) -> str:\n    \"\"\"The notebook's only surface is the Glass frost.\"\"\"\n    return \"glass\"" in py
    material_files = py.split("def note_material_file_names()", 1)[1].split("\ndef ", 1)[0]
    assert 'return ["glass.css"]' in material_files
    assert "iterdir" not in material_files, "the shelf is scanned again"
    assert 'for retired in ("paper.css", "focus.css"):' in py

    print("the notebook ships one Glass plate, with the frost, the picture and the centre switch")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
