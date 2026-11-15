"""Smoke-test the bundled theme packs and the zip/install/export pipeline.

The actual user data directory is never touched: the test points the theme
shelves at a temporary folder before installing anything.
"""
import base64
import io
import json
import sys
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def main() -> int:
    catalog = app.normalize_theme_catalog(
        json.loads((ROOT / "web" / "theme-packs" / "community-catalog.json").read_text(encoding="utf-8"))
    )
    assert catalog and catalog["themes"], "bundled catalog is empty"
    assert app.normalize_theme_chrome({
        "baseline": "#abc",
        "row": "#123456",
        "submit": "not-a-colour",
    }) == {"baseline": "#aabbcc", "row": "#123456"}
    assert app.normalize_theme_chrome({}) is None
    ids = [entry["id"] for entry in catalog["themes"]]
    for theme_id in ids:
        pack = app.bundled_theme_pack(theme_id)
        assert pack is not None, f"{theme_id} has no readable theme.json"
        assert pack["palette"]["paper"].startswith("#")
        assert pack["palette"]["ink"].startswith("#")
        assert app.theme_pack_asset_path(theme_id, "preview.svg") is not None
        # Every bundled pack ships a notebook palette and an AI console palette,
        # including the colour of their rules and drag handles.
        assert pack["note"]["rule"].startswith("#"), f"{theme_id} has no note rule colour"
        assert pack["ai"]["line"].startswith("#"), f"{theme_id} has no AI rule colour"
        # A bundled pack also owns the page chrome: underline, add accent and
        # the selected-cell wash ride along with the wallpaper.
        for key in app.THEME_CHROME_KEYS:
            assert pack["chrome"] and pack["chrome"].get(key, "").startswith("#"), (
                f"{theme_id} has no chrome.{key}"
            )

    root = Path(tempfile.mkdtemp(prefix="neotodo-theme-test-"))
    try:
        app.THEME_PACKS_DIR = root / "packs"
        app.THEME_EXPORTS_DIR = root / "exports"
        app.NOTE_THEMES_DIR = root / "note-theme"
        app.AI_THEMES_DIR = root / "ai-theme"
        app.PICTURES_DIR = root / "pictures"
        app.SOUNDS_DIR = root / "sounds"
        for folder in (app.THEME_PACKS_DIR, app.THEME_EXPORTS_DIR, app.NOTE_THEMES_DIR, app.AI_THEMES_DIR, app.PICTURES_DIR, app.SOUNDS_DIR):
            folder.mkdir(parents=True, exist_ok=True)

        # The notebook and the console read their palettes from their own
        # folders, never from the app theme shelf.
        app.PANE_THEME_SHELVES["note"] = app.NOTE_THEMES_DIR
        app.PANE_THEME_SHELVES["ai"] = app.AI_THEMES_DIR

        installed = app.install_bundled_theme("linen-garden")
        assert installed["wallpaper"] == "wallpaper.svg"
        assert installed["chrome"]["highlight"].startswith("#")
        assert [pack["id"] for pack in app.discover_theme_packs()] == ["linen-garden"]
        note_themes = app.discover_pane_themes("note")
        ai_themes = app.discover_pane_themes("ai")
        assert [theme["id"] for theme in note_themes] == ["linen-garden"]
        assert [theme["id"] for theme in ai_themes] == ["linen-garden"]
        assert note_themes[0]["palette"] == installed["note"]
        assert ai_themes[0]["palette"] == installed["ai"]
        assert (app.NOTE_THEMES_DIR / "linen-garden.json").is_file()
        assert (app.AI_THEMES_DIR / "linen-garden.json").is_file()

        # A hand-written notebook palette in note-theme/ is a user file: an app
        # theme install or removal must leave it alone.
        mine = app.write_pane_theme("note", {
            "id": "my-paper",
            "name": "My paper",
            "palette": {"paper": "#fffdf6", "ink": "#2a2620"},
        })
        assert mine.is_file()
        assert app.write_pane_theme("ai", {
            "id": "my-console",
            "name": "My console",
            "palette": {"bg": "#101216", "ink": "#e8eaf0"},
        }).is_file()
        assert {theme["id"] for theme in app.discover_pane_themes("note")} == {"linen-garden", "my-paper"}

        custom = app.save_theme_pack({
            "name": "Line Test",
            "theme": {
                "paper": "#fff7ee",
                "ink": "#2b2118",
                "line": "#7cc2b0",
                "accent": "#d17a53",
            },
        })
        assert custom["palette"]["line"] == "#7cc2b0"
        custom_folder = app.THEME_PACKS_DIR / custom["id"]
        assert (custom_folder / "theme.json").is_file()
        assert (custom_folder / "preview.svg").is_file()
        assert {pack["id"] for pack in app.discover_theme_packs()} == {"linen-garden", custom["id"]}
        app.uninstall_theme_pack(custom["id"])
        assert [pack["id"] for pack in app.discover_theme_packs()] == ["linen-garden"]

        settings = {
            "postcard": "linen-garden",
            "resolved_postcard": "linen-garden",
            "wallpaper_mode": "static",
            "wallpaper_static": "theme:linen-garden",
        }
        app.sanitize_wallpaper_settings(settings)
        assert settings["resolved_postcard"] == "linen-garden"
        assert settings["wallpaper_static"] == "theme:linen-garden"

        (app.PICTURES_DIR / "mine.jpg").write_bytes(b"wallpaper")
        (app.SOUNDS_DIR / "click.wav").write_bytes(b"sound")
        icon = "data:image/png;base64," + base64.b64encode(b"icon").decode("ascii")
        exported = app.export_theme_pack({
            "name": "Round Trip",
            "id": "round-trip",
            "theme": installed["palette"],
            "chrome": installed["chrome"],
            "note": installed["note"],
            "ai": installed["ai"],
            "wallpaper": "/user-pictures/mine.jpg",
            "sounds": {"type": "/user-sounds/click.wav"},
            "icons": {"completed": icon},
        })
        archive_path = Path(exported["path"])
        assert archive_path.is_file()
        with zipfile.ZipFile(archive_path) as archive:
            names = set(archive.namelist())
        assert {"theme.json", "preview.svg", "wallpaper.jpg", "sounds/type.wav", "icons/completed.png"} <= names

        round_trip = app.install_theme_archive(archive_path.read_bytes())
        assert round_trip["id"] == "round-trip"
        assert round_trip["wallpaper"] == "wallpaper.jpg"
        assert round_trip["sounds"] == {"type": "sounds/type.wav"}
        assert round_trip["icons"] == {"completed": "icons/completed.png"}
        assert round_trip["note"] == installed["note"]
        assert round_trip["ai"] == installed["ai"]
        assert round_trip["chrome"] == installed["chrome"]
        assert app.read_pane_theme("note", "round-trip")["palette"] == installed["note"]
        assert app.read_pane_theme("ai", "round-trip")["palette"] == installed["ai"]

        try:
            app.install_theme_archive(b"not a zip")
        except ValueError:
            pass
        else:
            raise AssertionError("invalid archives must be rejected")

        collision = io.BytesIO()
        with zipfile.ZipFile(collision, "w") as archive:
            archive.writestr("theme.json", json.dumps({
                "id": "tokyo",
                "name": "Fake Tokyo",
                "theme": {"paper": "#ffffff", "ink": "#000000"},
            }))
        try:
            app.install_theme_archive(collision.getvalue())
        except ValueError:
            pass
        else:
            raise AssertionError("built-in theme ids must be reserved")

        assert app.theme_pack_asset_path("round-trip", "../theme.json") is None

        # Removing an app theme drops only the palettes that pack contributed;
        # hand-written note/ai files and other packs stay untouched.
        app.uninstall_theme_pack("linen-garden")
        assert app.read_pane_theme("note", "linen-garden") is None
        assert app.read_pane_theme("ai", "linen-garden") is None
        assert app.read_pane_theme("note", "my-paper") is not None
        assert app.read_pane_theme("ai", "my-console") is not None
        assert app.read_pane_theme("note", "round-trip") is not None
    finally:
        import shutil
        shutil.rmtree(root, ignore_errors=True)
    print(f"{len(ids)} bundled theme packs and the export round-trip passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
