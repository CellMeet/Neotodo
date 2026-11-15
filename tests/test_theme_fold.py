"""Settings → Theme is one selector row for the app, note and AI palettes.

The Theme row is the selector itself, with the accent dot and small arrow of a
normal theme dropdown. Its menu uses the same name-and-checkmark list for every
palette and ends with the other palettes ("Note theme ›", "AI theme ›"). Picking
one of those rows swaps the entire Theme row into that palette's selector; it is
not a second panel, tab strip or card grid.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    theme_body = app_js.split("function themeSettings()", 1)[1].split("function fontSettings()", 1)[0]

    # One row owns all three palettes; the row title and value follow the mode.
    assert "let themeFieldMode = " in app_js
    assert "themeFieldMode = \"app\";" in app_js
    assert "const fieldTitle = fieldMode === \"note\" ? \"Note theme\"" in theme_body
    assert "const fieldName = fieldMode === \"note\"" in theme_body
    assert "theme-main-row" in theme_body
    assert "data-theme-field-row" in theme_body
    # The trigger carries the current accent dot and the arrow.
    assert "const fieldAccent = modeAccent(fieldMode);" in theme_body
    assert "menuShell(fieldName, fieldTitle, fieldMenuItems, fieldModeSwitch, fieldAccent)" in theme_body

    # The same menu shows app, note and AI lists; the other palettes are rows
    # at the end with a dot and a small arrow.
    assert "const fieldModeSwitch = " in theme_body
    assert 'class="theme-menu-mode-item"' in theme_body
    assert 'data-theme-field-mode="${mode}"' in theme_body
    assert 'class="theme-menu-mode-arrow"' in theme_body
    assert 'class="theme-menu-sep"' in theme_body
    assert "Note themes" in theme_body
    assert "AI themes" in theme_body
    assert "App themes" in theme_body
    assert "paneMenuItem(choice, \"note\")" in theme_body
    assert "paneMenuItem(choice, \"ai\")" in theme_body
    assert "installedIds.map(installedMenuItem)" in theme_body
    # The row keeps the app-theme Manage button, and gives note/AI a Folder.
    assert 'data-action="toggle-theme-manage"' in theme_body
    assert 'open-ai-themes-folder' in theme_body
    assert 'open-note-themes-folder' in theme_body
    # No extra shelf, segmented strip, card grid or separate App theme row.
    assert "themeSectionPanel" not in theme_body
    assert "theme-pane-toggle" not in theme_body
    assert "theme-pane-tabs" not in theme_body
    assert "theme-pane-grid" not in theme_body
    assert "theme-menu-modes" not in theme_body
    assert "theme-menu-mode.active" not in theme_body
    assert 'theme-settings-title">App theme' not in theme_body
    assert "data-pane-theme-tab" not in theme_body
    assert "themeSectionOpen" not in app_js
    assert "paneThemeTab" not in app_js

    # Switching the palette row reopens the menu on that palette.
    assert 'const themeFieldModeNode = event.target.closest("[data-theme-field-mode]")' in app_js
    assert "themeFieldMode = next === \"note\" || next === \"ai\" ? next : \"app\";" in app_js
    assert 'document.querySelector(".settings-view details[data-theme-menu]")' in app_js
    # The existing theme, note-theme and AI-theme choice handlers still apply.
    assert 'const noteThemeChoice = event.target.closest("[data-note-theme-choice]")' in app_js
    assert 'const aiThemeChoice = event.target.closest("[data-ai-theme-choice]")' in app_js

    # Quiet chrome: accent dots, the list separator and the arrow rows.
    for rule in (
        ".theme-menu-dot",
        ".theme-menu-sep",
        ".theme-menu-mode-item",
        ".theme-menu-mode-arrow",
    ):
        assert rule in css, rule
    assert ".theme-menu-modes" not in css
    assert ".theme-pane-toggle" not in css
    assert ".theme-section-panel" not in css

    print("the Theme row swaps itself between the app, note and AI palette lists")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
