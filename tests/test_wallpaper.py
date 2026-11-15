"""Smoke-test the single wallpaper choice and the postcard export.

The wallpaper is now one folder-backed choice: a picture or a film from the
pictures folder. The built-in postcard scenes are written there once as
ordinary JPEGs. The user data directory is never touched.
"""
import base64
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def main() -> int:
    root = Path(tempfile.mkdtemp(prefix="neotodo-wallpaper-test-"))
    try:
        app.PICTURES_DIR = root / "pictures"
        app.PICTURES_DIR.mkdir(parents=True)

        # --- the postcard art is exported into the pictures folder -----------
        payload = base64.b64encode(b"jpeg-bytes").decode("ascii")
        first = app.save_postcard_art([
            {"name": "postcard-light.jpg", "data": payload},
            {"name": "postcard-dusk.jpg", "data": payload},
        ])
        assert first["saved"] == ["postcard-light.jpg", "postcard-dusk.jpg"], first
        assert first["existing"] == [] and first["failed"] == 0
        assert first["folder"] == str(app.PICTURES_DIR)
        assert (app.PICTURES_DIR / "postcard-light.jpg").read_bytes() == b"jpeg-bytes"

        # A reader edit is never overwritten by a later export.
        (app.PICTURES_DIR / "postcard-light.jpg").write_bytes(b"mine")
        second = app.save_postcard_art([
            {"name": "postcard-light.jpg", "data": payload},
            {"name": "postcard-rain.jpg", "data": payload},
        ])
        assert second["existing"] == ["postcard-light.jpg"], second
        assert second["saved"] == ["postcard-rain.jpg"], second
        assert (app.PICTURES_DIR / "postcard-light.jpg").read_bytes() == b"mine"

        # Bad rows are counted, never written.
        broken = app.save_postcard_art([
            "not-a-dict",
            {"name": "postcard-empty.jpg", "data": ""},
            {"name": "postcard-bad.jpg", "data": "!!not-base64!!"},
        ])
        assert broken["saved"] == [] and broken["failed"] == 3, broken
        assert not (app.PICTURES_DIR / "postcard-bad.jpg").exists()

        # --- the picker reads the same folder --------------------------------
        (app.PICTURES_DIR / "beach.jpg").write_bytes(b"photo")
        (app.PICTURES_DIR / "waves.mp4").write_bytes(b"film")
        (app.PICTURES_DIR / "notes.txt").write_bytes(b"not a picture")
        files = app.picture_file_names()
        assert "beach.jpg" in files["images"]
        assert "postcard-light.jpg" in files["images"]
        assert files["videos"] == ["waves.mp4"], files
        assert files["folder"] == str(app.PICTURES_DIR)

        # --- one choice, with the old static/dynamic fields folded in --------
        legacy = {
            "postcard": "light",
            "resolved_postcard": "light",
            "wallpaper_mode": "dynamic",
            "wallpaper_static": "art:light",
            "wallpaper_dynamic": "waves.mp4",
        }
        app.sanitize_wallpaper_settings(legacy)
        assert legacy["wallpaper"] == "waves.mp4", legacy

        legacy_static = {
            "postcard": "light",
            "resolved_postcard": "light",
            "wallpaper_mode": "static",
            "wallpaper_static": "beach.jpg",
            "wallpaper_dynamic": "waves.mp4",
        }
        app.sanitize_wallpaper_settings(legacy_static)
        assert legacy_static["wallpaper"] == "beach.jpg", legacy_static

        # A client that sends the single field wins, including "none".
        cleared = {
            "postcard": "light",
            "resolved_postcard": "light",
            "wallpaper_mode": "static",
            "wallpaper_static": "beach.jpg",
            "wallpaper": "",
        }
        app.sanitize_wallpaper_settings(cleared, derive_legacy=False)
        assert cleared["wallpaper"] == "", cleared

        # A bare name must still be a real file in the pictures folder.
        missing = {"wallpaper": "ghost.jpg"}
        app.sanitize_wallpaper_settings(missing)
        assert missing["wallpaper"] == "", missing

        # A picture picked by absolute path is remembered even before the file is
        # readable (a mounted drive may come back later); NeoTodo only reads it.
        picked = {"wallpaper": "/tmp/nowhere/photo.png"}
        app.sanitize_wallpaper_settings(picked)
        assert picked["wallpaper"] == "/tmp/nowhere/photo.png", picked

        # Only the files the reader picked are served back to the page. The
        # endpoint never reads an arbitrary path from the web.
        outside = root / "outside.jpg"
        outside.write_bytes(b"photo")
        chosen = {
            "wallpaper": str(outside),
            "wallpaper_recent": [str(outside), str(root / "other.jpg")],
        }
        assert app.wallpaper_file_allowed(str(outside), chosen) == outside
        assert app.wallpaper_file_allowed(str(root / "other.jpg"), chosen) is None
        assert app.wallpaper_file_allowed("/etc/passwd", chosen) is None
        assert app.wallpaper_file_allowed(str(outside), {"wallpaper": ""}) is None

        # Relative names and non-picture extensions are never treated as a
        # picked file, and the recent shelf keeps order without duplicates.
        assert app.sanitize_wallpaper_file_path("photo.jpg") == ""
        assert app.sanitize_wallpaper_file_path(str(root / "notes.txt")) == ""
        recent = app.sanitize_wallpaper_recent([
            str(outside), str(outside), "photo.jpg", str(root / "film.mp4"),
        ])
        assert recent == [str(outside), str(root / "film.mp4")], recent

        # Built-in art and a theme picture are still valid choices, so a first
        # launch keeps the postcard look before the export has finished.
        art = {"wallpaper": "art:light"}
        app.sanitize_wallpaper_settings(art)
        assert art["wallpaper"] == "art:light", art

        # A film is a wallpaper too, and is listed separately in the picker.
        film = {"wallpaper": "waves.mp4"}
        app.sanitize_wallpaper_settings(film)
        assert film["wallpaper"] == "waves.mp4", film
    finally:
        import shutil
        shutil.rmtree(root, ignore_errors=True)

    # The sub-cards are drawn in the browser, so the standard is guarded here:
    # every named surface carries the marker, one engine bakes its picture from
    # the wallpaper under its open box (not from a global copy), a film is baked
    # from its middle frame, and the card is framed like a card instead of being
    # washed grey.
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    index_html = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
    assert "function svgDataUrl(" in app_js, "the SVG data-URL helper is missing"
    assert 'xmlns="http://www.w3.org/2000/svg"' in app_js, "the copied SVG has no namespace"
    assert app_js.count("image.src = svgDataUrl(svg)") >= 1, "a canvas copy still loads a bare SVG"
    assert "encodeURIComponent(svg)" not in app_js, "a canvas copy still builds a raw SVG data URL"

    # The marker is the contract: the floating surfaces are sub-cards, the
    # categories spine is printed on the room, and the top hidden box only
    # borrows the wallpaper (its background) without becoming a card.
    assert 'data-subcard="categories"' not in index_html, "the categories spine is a card again"
    assert '<aside class="index">' in index_html, "the categories spine lost its plain host"
    assert 'data-subcard="top-tools"' not in index_html, "the top hidden box became a card"
    assert 'data-wallpaper-surface="top-tools"' in index_html, (
        "the top hidden box lost its wallpaper background"
    )
    assert '.dataset.subcard = "doing"' in app_js, "the Doing card is not a sub-card"
    assert 'data-subcard="completed"' in app_js, "the finished-subtasks card is not a sub-card"
    assert 'SUBCARD_SELECTOR = "[data-subcard], [data-wallpaper-surface]"' in app_js, (
        "the wallpaper surfaces are not mounted by the pane engine"
    )

    # The picture is cut from the wallpaper where the card will open, and baked
    # before the card is shown.
    assert "function subcardCropSource(" in app_js, "the local wallpaper crop is missing"
    assert "function subcardBox(" in app_js, "a sub-card cannot find its open box"
    assert "function bakeSubcardPaper(" in app_js, "a sub-card picture is never baked"
    assert "schedulePrimeSubcardPapers(0)" in app_js, "the picture is not baked ahead of opening"
    assert "subcardPaperCache" in app_js, "a baked picture is not kept"

    # A film is baked from its paused middle frame and then uses the same path.
    assert "function rasterizeVideoFrameToBitmapUrl(" in app_js, "a film has no frame source"
    video_frame = app_js.split("function rasterizeVideoFrameToBitmapUrl(", 1)[1]
    video_frame = video_frame.split("function ", 1)[0]
    assert "duration / 2" in video_frame, "the film card is not taken from the middle frame"
    assert "seeked" in video_frame, "the film frame is never captured after the seek"
    assert "if (!wallpaper.key || wallpaper.moving) return null;" not in app_js, (
        "a film still skips the bake"
    )

    layers_css = (ROOT / "web" / "wallpaper-layers.css").read_text(encoding="utf-8")
    assert "[data-subcard]" in layers_css, "the marker has no styling contract"

    # A baked picture fills the card; the film window is only a fallback.
    still_media = layers_css.split('.card-wallpaper[data-fit="patch"] > .wallpaper-media', 1)[1]
    still_media = still_media.split("}", 1)[0]
    assert "width: 100%;" in still_media and "height: 100%;" in still_media, (
        "a baked card must fill the card"
    )
    assert "100vw" not in still_media and "transform: none" in still_media, (
        "a baked card must not be a viewport-sized copy"
    )
    film_media = layers_css.split('.card-wallpaper[data-fit="window"] > .wallpaper-media', 1)[1]
    film_media = film_media.split("}", 1)[0]
    assert "100vw" in film_media and "100vh" in film_media, "the film fallback lost its window copy"

    # The floating card is ONE complete picture: full bleed, no mat, no inner
    # hairline, no paper strip, and no border that would read as a black edge.
    media_rule = layers_css.split('#doing-peek > .card-wallpaper[data-fit="patch"] > .wallpaper-media', 1)[1]
    media_rule = media_rule.split("}", 1)[0]
    assert "inset: 0;" in media_rule, "the card picture no longer fills the card"
    assert "width: 100%;" in media_rule and "height: 100%;" in media_rule, (
        "the card picture must fill the card"
    )
    assert "box-shadow: none;" in media_rule, "the picture still paints an inner edge"

    # The card's own 1px border follows the same ink green, so the picture's edge
    # is not left showing a line tinted by whatever is behind the card.
    assert "border-color: var(--subcard-outline, #2f5d4e) !important;" in layers_css, (
        "the card border no longer carries the ink-green stroke"
    )
    assert "0 22px 30px -24px" in layers_css, "the wallpaper fallback lost its lift shadow"

    # Every floating card wears the same fixed stroke: 墨绿 (ink green), not a
    # theme colour, so all the cards in the pile match whatever wallpaper or
    # theme is behind them.
    assert "--subcard-outline: #2f5d4e;" in layers_css, "the sub-card outline is not ink green"
    ring = layers_css.split("html[data-wallpaper] [data-subcard] > .card-wallpaper::after", 1)[1]
    ring = ring.split("}", 1)[0]
    assert "inset 0 0 0 1.5px var(--subcard-outline" in ring, "the card lost its shared stroke"
    assert "linear-gradient" not in ring, "the card is washed again"
    assert "64%, transparent" not in layers_css, "the card is washed grey again"

    # The pile: the living card CSS owns the two depth levels and out-ranks the
    # wallpaper's "one shadow below the card" fallback, so the stack is visible
    # with or without a wallpaper.
    stack_css = (ROOT / "web" / "card-stack.css").read_text(encoding="utf-8")
    assert '/card-stack.css' in index_html, "the card pile stylesheet is not loaded"
    assert "--card-lift-page:" in stack_css, "the finished card has no depth on the page"
    assert "--card-lift-card:" in stack_css, "the Doing card has no depth on the finished card"
    assert "box-shadow: var(--card-lift-page) !important;" in stack_css, (
        "the finished card does not rest on the task page"
    )
    assert "box-shadow: var(--card-lift-card) !important;" in stack_css, (
        "the Doing card does not rest on the finished card"
    )
    # The shadow is thrown down-left, the way paper casts onto the sheet below;
    # there is no coloured edge or second line around the card.
    upper_lift = stack_css.split("--card-lift-card:", 1)[1].split(";", 1)[0]
    assert "-7px 14px" in upper_lift and "-20px 38px" in upper_lift, (
        "the upper card throws no shadow onto the lower sheet"
    )
    assert "sakura" not in stack_css, "a coloured paper edge is back on the card"
    assert "0 2px 0 -1px" not in stack_css and "0 3px 0 -1px" not in stack_css, (
        "the card still paints an edge line under its bottom border"
    )
    # The two cards share the desk without shoving each other aside: opening
    # the Doing card must never move the finished-subtasks card off its column.
    press_aside = [
        line for line in stack_css.splitlines()
        if "completed-subtask-drawer" in line and "{" in line and "doing-peek-open" in line
    ]
    assert not press_aside, "the Doing card still pushes the finished card aside"
    assert "translateX(calc(-1 * min(150px, 11vw)))" not in stack_css, (
        "the finished card still shifts when the Doing card opens"
    )
    assert "border-color: var(--subcard-outline, #2f5d4e) !important;" in stack_css, (
        "the card edge is not painted with the shared ink-green stroke"
    )
    assert "html[data-wallpaper] body #doing-peek" in stack_css, (
        "the pile loses to the wallpaper lift rule"
    )
    # The categories spine is the room, never another sheet in the pile.
    spine_rule = stack_css.split("categories is not a card --- */", 1)[1]
    assert ".index-head," in spine_rule and "border-radius: 0 !important;" in spine_rule, (
        "the categories spine can still look like a card"
    )

    trash = (ROOT / "web" / "style.css").read_text(encoding="utf-8").split(".trash-drawer {", 1)[1]
    trash = trash.split("}", 1)[0]
    assert "#8a6542" in trash, "the magic hat drawer's own border colour changed"
    print("wallpaper choice and the sub-card standard passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
