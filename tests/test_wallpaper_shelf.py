"""Wallpaper options live in one dedicated folder.

``Choose`` opens the system picker, but the picked file is linked into
``pictures/wallpapers`` so the recent list and the folder button describe the
same entries. Deleting a file in that folder drops the option, while the
reader's original file stays where it was.
"""
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def main() -> int:
    root = Path(tempfile.mkdtemp(prefix="neotodo-wallpaper-shelf-test-"))
    try:
        app.PICTURES_DIR = root / "pictures"
        app.PICTURES_DIR.mkdir(parents=True)
        outside = root / "我的壁纸.jpg"
        outside.write_bytes(b"picture")
        shelf = app.ensure_wallpaper_shelf_dir()
        assert shelf == app.PICTURES_DIR / "wallpapers"
        assert shelf.is_dir()

        settings = {
            "wallpaper": str(outside),
            "wallpaper_recent": [str(outside)],
        }
        assert app.import_wallpaper_shelf(settings) is True
        current = Path(settings["wallpaper"])
        assert current.parent == shelf, (current, shelf)
        assert current.is_file()
        assert settings["wallpaper_recent"] == [str(current)]
        assert outside.is_file(), "the reader's own file was moved or deleted"

        # A second sync reuses the shelf entry instead of making another link.
        assert app.import_wallpaper_shelf(settings) is False
        assert len([item for item in shelf.iterdir() if item.is_file()]) == 1

        # A file deleted from the folder leaves the picker and the active room.
        current.unlink()
        assert app.prune_wallpaper_shelf(settings) is True
        assert settings["wallpaper"] == ""
        assert settings["wallpaper_recent"] == []

        # Missing external options are dropped too, so a deleted candidate
        # never stays in the menu forever.
        still_there = root / "still.jpg"
        still_there.write_bytes(b"still")
        gone = root / "gone.jpg"
        settings = {"wallpaper": str(still_there), "wallpaper_recent": [str(gone)]}
        app.import_wallpaper_shelf(settings)
        assert settings["wallpaper_recent"] == [], settings["wallpaper_recent"]
        assert Path(settings["wallpaper"]).parent == shelf
    finally:
        import shutil
        shutil.rmtree(root, ignore_errors=True)

    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    app_py = (ROOT / "app.py").read_text(encoding="utf-8")
    assert 'data-action="open-wallpaper-folder"' in app_js
    assert 'silentAction("sync_wallpaper_shelf")' in app_js
    assert "import_wallpaper_shelf" in app_js or "adoptWallpaperShelfState" in app_js
    folder_branch = app_py.split('elif name == "open_wallpaper_folder":', 1)[1].split("else:", 1)[0]
    assert "ensure_wallpaper_shelf_dir()" in folder_branch, (
        "the folder button still opens the system wallpaper folder"
    )
    assert "import_wallpaper_shelf" in folder_branch
    assert "prune_wallpaper_shelf" in folder_branch
    assert "WALLPAPER_RECENT_LIMIT = 6" in app_py

    print("wallpaper options live in pictures/wallpapers and deletion prunes them")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
