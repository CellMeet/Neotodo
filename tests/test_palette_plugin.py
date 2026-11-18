"""The Palette plugin owns the page controls that left the Theme tab.

Settings → Theme keeps the app / note / AI theme selector, the wallpaper and
the note surface (inside Note theme). The page-line, selection-highlight and
finished-row controls live in `/plugins/palette`; the plugin writes through
`window.NeoTodoPalette` so it paints the notebook through the same files and
CSS variables as before.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

PLUGIN = ROOT / "web" / "plugins" / "palette"


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    index = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
    manifest = json.loads((PLUGIN / "manifest.json").read_text(encoding="utf-8"))

    assert manifest["id"] == "palette"
    assert manifest["name"] == "调色板"
    assert manifest["icon"] == "palette.svg"
    assert (PLUGIN / "palette.svg").is_file()
    assert (PLUGIN / "index.html").is_file()
    assert (PLUGIN / "plugin.css").is_file()
    assert (PLUGIN / "plugin.js").is_file()

    assert 'data-action="open-palette"' in index
    assert "/plugins/palette/palette.svg" in index
    assert 'id: "palette"' in app_js
    assert 'if (actionName === "open-palette") { openPluginPanel("palette"); return; }' in app_js
    assert "palette-glyph" in (ROOT / "web" / "plugins" / "plugin-host.css").read_text(encoding="utf-8")

    for method in (
        "read()",
        "setPageLine(patch)",
        "setBaselineRule(patch)",
        "setHighlight(value)",
        "resetHighlight()",
    ):
        assert method in app_js, method
    for note_method in (
        "setNoteSurface(file)",
        "setNoteBackground(value)",
        "setNoteBlur(value)",
        "setNoteBackgroundFile(file)",
    ):
        assert note_method not in app_js, note_method
    assert "window.NeoTodoPalette = {" in app_js
    assert "window.parent.NeoTodoPalette" in (PLUGIN / "plugin.js").read_text(encoding="utf-8")

    theme_body = app_js.split("function themeSettings()", 1)[1].split("function fontSettings()", 1)[0]
    for moved in ("Selection highlight", "Page line layout", "Finished rows"):
        assert moved not in theme_body, moved
    # The Palette plugin lives on the tool rail; Settings does not offer an
    # "Open palette" row or a second switch for it.
    assert "Open palette" not in theme_body
    assert 'data-action="open-palette"' not in theme_body
    # The note surfaces belong to the note pane, not to the page palette: the
    # notebook ships one Glass plate, so there are no surface chips here.
    assert "data-note-surface-file" not in theme_body
    assert "Frost blur" in theme_body
    assert "Glass image" in theme_body

    plugin_html = (PLUGIN / "index.html").read_text(encoding="utf-8")
    for hook in (
        "data-pl-line-color",
        "data-pl-line-thickness",
        "data-pl-line-opacity",
        "data-pl-line-row",
        "data-pl-highlight-color",
        "data-pl-baseline-mode",
    ):
        assert hook in plugin_html, hook
    for removed in ("Note surface", "data-pl-surfaces", "data-pl-glass", "data-pl-blur"):
        assert removed not in plugin_html, removed

    print("the palette plugin owns the page, highlight and row controls")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
