"""The Glass surface is one reader choice, not the notebook's forced style.

The surface is a transparent pane: the ::before layer blurs whatever is really
behind the note and lays one light wash on top. No preset, custom image or
baked photograph is ever painted, so the material follows any wallpaper and
any note palette. The note's surface file is persisted, so picking Glass does
not bounce back to Paper on the next launch.
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
    assert '{ id: "glass", name: "Glass", english: "Frosted mask", file: "glass.css" }' in app_js
    assert 'if (id === "glass" || id === "blur") return "glass.css";' in app_js
    assert 'return stem.replace(/[^a-z0-9_-]/gi, "") || "paper";' in app_js
    assert 'const NOTE_TYPEWRITER_SURFACES = new Set(["focus", "glass"]);' in app_js
    assert 'note_material: "focus"' in app_js
    # The surface is the reader's; no layer forces it back to paper or glass.
    assert 'settings.note_material = "paper";' not in app_js
    assert 'settings.note_material = materialIdForFile(noteSurfaceFile);' in app_js
    # Settings → Appearance carries the surface chips and the blur slider.
    assert 'id="note-blur-range"' in app_js and 'id="note-blur-value"' in app_js
    assert 'data-note-surface-file=' in app_js

    # Glass is the picture-backed frost: the image is picked with the same
    # crop dialog as a card picture, and Focus stays the image-free default.
    assert 'cardSettingsRow("note:background", "note", "background", "Glass image"' in app_js
    assert 'settings.note_background_image = data;' in app_js
    assert 'if (kind === "note")' in app_js

    glass = read("web/note-materials/glass.css")
    assert 'html[data-note-material="glass"]' in glass
    assert 'html[data-note-material="blur"]' not in glass
    assert "background-image: none !important;" in glass
    assert "url(" not in glass, "the material paints a picture again"
    assert "--note-glass-default" not in glass
    assert "background-color: rgba(242, 244, 242, 0.80) !important;" in glass
    # The blur is the reader's slider, doubled for a 32px FocusWriter default.
    assert "backdrop-filter: blur(calc(var(--note-blur, 16px) * 2)) saturate(0.90) brightness(1.02) !important;" in glass
    assert '.note-live {' in glass and "68ch" in glass
    # The frost also carries FocusWriter's typewriter band.
    assert "mask-image:" in glass and "22vh" in glass
    # A chosen picture becomes the pane, still behind the light frost.
    assert 'html[data-note-material="glass"][data-note-image="1"]' in glass
    assert "var(--note-bg-image)" in glass
    assert "backdrop-filter: none !important;" in glass

    theme = read("web/note-theme.css")
    assert "--note-theme-paper: #eef0ea;" in theme
    assert "--note-theme-ink: #23261f;" in theme
    assert "--note-glass-default" not in theme
    assert 'data-note-material="blur"' not in theme

    style = read("web/style.css")
    assert 'data-note-material="blur"' not in style, "the old blur surface is still painted"
    assert "--note-bg-image" not in style, "a note picture is still painted"
    assert ".material-blur" not in style
    assert 'html[data-note-material="glass"]' in style

    py = read("app.py")
    assert '"note_material": "focus",' in py
    assert "def normalize_note_surface_id" in py
    assert 'settings["note_material"] = "glass"\n' not in py
    print("the Glass surface is a persisted choice with a card-style picture")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
