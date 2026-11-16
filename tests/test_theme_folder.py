"""Appearance → Theme keeps its shelf actions as small folder chips.

The Theme → Manage row no longer offers "Open folder" / "+ New theme": it has
Import .zip and one folder icon that opens the theme shelf. Wallpaper → Manage
keeps its three options, then the same folder icon opens the folder the picked
wallpaper lives in. Both fold-out panels sit tight against the next section
instead of closing with a hairline and a wide gap.
"""
import shutil
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    # Theme → Manage: Import .zip plus one folder icon. The old text buttons
    # and the in-place custom-theme creator are gone.
    theme_body = app_js.split("function themeSettings()", 1)[1].split("function fontSettings()", 1)[0]
    manage = theme_body.split("const managePanel = themeManageOpen", 1)[1].split("const themeRow", 1)[0]
    assert "open-theme-packs-folder" in manage
    assert "theme-folder-button" in manage
    assert "FOLDER_GLYPH" in manage
    assert "Open folder" not in manage
    assert "new-custom-theme" not in manage
    assert "+ New theme" not in manage

    # The same folder mark opens the wallpaper shelf; the three wallpaper
    # options stay, and the name menu uses the single down arrow of the Theme
    # row instead of a pair of up/down arrows.
    wallpaper = app_js.split("function wallpaperSettingsSection()", 1)[1].split(
        "function iconSettingsSection()", 1)[0]
    assert "open-wallpaper-folder" in wallpaper
    assert "theme-folder-button" in wallpaper
    assert "data-action=\"wallpaper-back\"" in wallpaper
    assert "data-action=\"toggle-wallpaper-blur\"" in wallpaper
    assert "data-action=\"toggle-wallpaper-cards\"" in wallpaper
    assert "const chevron = `<svg class=\"theme-menu-chevron\"" in wallpaper
    assert "M8 10l4-4 4 4M8 14l4 4 4-4" not in wallpaper, "the wallpaper menu still has two arrows"
    assert 'data-action="open-wallpaper-folder"' in app_js
    assert "WALLPAPER_RECENT_LIMIT = 6;" in app_js

    # The manage panels are the tail of their row: no closing hairline and a
    # small gap before the next section.
    manage_css = css.split(".theme-settings-row.theme-manage-open + .theme-manage-panel {", 1)[1]
    manage_css = manage_css.split("}", 1)[0]
    assert "border-bottom: 0;" in manage_css, "Theme → Manage still closes with a hairline"
    assert "margin-bottom: 16px;" in manage_css, "Theme → Manage still leaves a wide gap"
    wallpaper_css = css.split(".wallpaper-manage-panel {", 1)[1].split("}", 1)[0]
    assert "margin-bottom: 16px;" in wallpaper_css, "Wallpaper → Manage still leaves a wide gap"
    assert ".theme-folder-glyph" in css and ".wallpaper-manage-options .theme-folder-button" in css

    # Opening the theme folder fills an empty shelf with the bundled packs once,
    # so the reader can inspect and delete real theme folders. The marker keeps
    # a deliberate deletion from coming back.
    assert "def seed_bundled_theme_packs()" in (ROOT / "app.py").read_text(encoding="utf-8")
    root = Path(tempfile.mkdtemp(prefix="neotodo-theme-folder-test-"))
    try:
        app.THEME_PACKS_DIR = root / "theme-packs"
        app.PANE_THEME_SHELVES = {"note": root / "note-theme", "ai": root / "ai-theme"}
        app.seed_bundled_theme_packs()
        seeded = sorted(p.name for p in app.THEME_PACKS_DIR.iterdir() if p.is_dir())
        assert seeded, "the theme shelf is still empty"
        assert (app.THEME_PACKS_DIR / ".bundled-packs-seeded").exists()
        removed = seeded[0]
        shutil.rmtree(app.THEME_PACKS_DIR / removed)
        app.seed_bundled_theme_packs()
        assert not (app.THEME_PACKS_DIR / removed).exists(), "a deleted pack came back"
    finally:
        shutil.rmtree(root, ignore_errors=True)

    print("theme and wallpaper folders use one chip and sit tight against the next section")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
