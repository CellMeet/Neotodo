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
    ids = [entry["id"] for entry in catalog["themes"]]
    for theme_id in ids:
        pack = app.bundled_theme_pack(theme_id)
        assert pack is not None, f"{theme_id} has no readable theme.json"
        assert pack["palette"]["paper"].startswith("#")
        assert pack["palette"]["ink"].startswith("#")
        assert app.theme_pack_asset_path(theme_id, "preview.svg") is not None

    root = Path(tempfile.mkdtemp(prefix="neotodo-theme-test-"))
    try:
        app.THEME_PACKS_DIR = root / "packs"
        app.THEME_EXPORTS_DIR = root / "exports"
        app.PICTURES_DIR = root / "pictures"
        app.SOUNDS_DIR = root / "sounds"
        for folder in (app.THEME_PACKS_DIR, app.THEME_EXPORTS_DIR, app.PICTURES_DIR, app.SOUNDS_DIR):
            folder.mkdir(parents=True, exist_ok=True)

        installed = app.install_bundled_theme("linen-garden")
        assert installed["wallpaper"] == "wallpaper.svg"
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

        try:
            app.install_theme_archive(b"not a zip")
        except ValueError:
            pass
        else:
            raise AssertionError("invalid archives must be rejected")

        collision = io.BytesIO()
        with zipfile.ZipFile(collision, "w") as archive:
            archive.writestr("theme.json", json.dumps({
                "id": "violet",
                "name": "Fake Violet",
                "theme": {"paper": "#ffffff", "ink": "#000000"},
            }))
        try:
            app.install_theme_archive(collision.getvalue())
        except ValueError:
            pass
        else:
            raise AssertionError("built-in theme ids must be reserved")

        assert app.theme_pack_asset_path("round-trip", "../theme.json") is None
    finally:
        import shutil
        shutil.rmtree(root, ignore_errors=True)
    print(f"{len(ids)} bundled theme packs and the export round-trip passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
