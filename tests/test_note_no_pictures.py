"""The note is a text page only: it has no picture area and no picture action.

NeoTodo once offered "Add pictures" beside the live note, a gallery of the
added pictures and a picture column in the note body. The feature is gone:
the note renders one full-width text column, the stylesheets keep no picture
rules, and the shared store no longer creates or forwards note pictures for
todos or subtasks. Wallpaper pictures are a separate feature and are not
affected.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    app_py = (ROOT / "app.py").read_text(encoding="utf-8")

    # notesHtml is the only place that builds the note sheet. It must render a
    # single text column, with no picture strip and no image element.
    start = app_js.index("function notesHtml()")
    end = app_js.index("function renderNotesPanel()")
    notes_html = app_js[start:end]
    assert '<div class="notes-body"><div class="note-live" id="note-live">' in notes_html
    assert "note-pictures" not in notes_html
    assert "picture-link" not in notes_html
    assert "<img" not in notes_html
    assert "add-picture" not in notes_html

    # No action anywhere may open the picture picker or the picture gallery.
    for token in (
        "add-picture",
        "show-pictures",
        "add_images",
        "note-pictures",
        "picture-link",
        "noteImages",
        "todoImages",
        "openPictureGallery",
    ):
        assert token not in app_js, token

    # The note's top comment is the contract: every note is text only.
    assert "Every note is text only" in notes_html
    assert "there is no picture column to fill" in notes_html

    # The stylesheets keep no note-picture column or gallery rules.
    for name in ("style.css", "note-theme.css"):
        css = (ROOT / "web" / name).read_text(encoding="utf-8")
        for token in (
            "note-pictures",
            "picture-link",
            "picture-gallery",
            "picture-trash",
            "gallery-thumb",
        ):
            assert token not in css, f"{name}: {token}"

    # The shared store no longer normalizes, archives, restores or forks note
    # pictures. A legacy "image"/"images" key is simply ignored.
    for token in (
        'todo["images"]',
        'subtask["images"]',
        'todo["image"]',
        'subtask["image"]',
        "forked_images",
        "sub_images",
        '"image": ""',
        '"image": str(image or "")',
    ):
        assert token not in app_py, token

    print("the note is text only: no picture area, action or stored note pictures")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
