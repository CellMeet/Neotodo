"""`card_line` owns the frame around the floating cards.

The live subtask sheet, the Doing card, the finished-subtasks drawer and the
trash card all carry one reader-chosen outline. Colour and weight live in
card-line.json, outside every theme and outside the notebook settings.
"""
import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def main() -> int:
    root = Path(tempfile.mkdtemp(prefix="neotodo-card-line-test-"))
    try:
        app.CARD_LINE_FILE = root / "card-line.json"

        # Nothing saved yet: the fixed ink-green default, not a theme.
        assert app.read_card_line() == app.CARD_LINE_DEFAULT

        # Colour and weight are normalised and persisted together.
        line = app.write_card_line({"color": "#A1B2C3", "width": 2.5})
        assert line == {"color": "#a1b2c3", "width": 2.5, "enabled": True}, line
        saved = json.loads(app.CARD_LINE_FILE.read_text(encoding="utf-8"))
        assert saved == line, saved
        assert app.read_card_line() == line

        # A partial patch (one control) never resets the other setting.
        patched = app.write_card_line({"width": 1})
        assert patched == {"color": "#a1b2c3", "width": 1, "enabled": True}, patched

        # Bad input can never reach the stylesheet.
        for raw in (
            {"color": "red", "width": 99},
            {"color": "url(javascript:1)", "width": -4},
            {"width": "x"},
            [],
            "nope",
            None,
        ):
            normalized = app.normalize_card_line(raw)
            assert normalized["color"] == app.CARD_LINE_DEFAULT["color"]
            assert app.CARD_LINE_WIDTH_MIN <= normalized["width"] <= app.CARD_LINE_WIDTH_MAX
            assert (normalized["width"] * 2) % 1 == 0

        # The state endpoint publishes the frame for the first paint and the
        # action writes the same file, without touching notebook settings.
        app.write_card_line({"color": "#654321", "width": 2})
        store = app.Store(root / "NeoTodo.json")
        state = store.state()
        assert state["card_line"]["color"] == "#654321", state["card_line"]
        assert "card_line" not in state["settings"]
        result = store.action({
            "action": "save_card_line",
            "card_line": {"width": 3},
        })
        assert result["ok"], result
        assert result["state"]["card_line"]["width"] == 3
        assert result["state"]["card_line"]["color"] == "#654321"

        # The Font tab exposes the row directly under Baseline.
        app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        font_body = app_js.split("function fontSettings()", 1)[1].split(
            "async function loadNoteMaterialFiles()", 1
        )[0]
        assert font_body.index("Baseline") < font_body.index("Card line")
        for control in (
            "font-card-line-color",
            "font-card-line-hex",
            "font-card-line-width",
            "font-card-line-width-value",
        ):
            assert f'id="{control}"' in font_body, control
        assert 'saveCardLine({ color })' in app_js
        assert 'saveCardLine({ width: value })' in app_js
        assert '"save_card_line"' in app_js

        # The card stylesheets read the shared variables instead of a fixed
        # width, so the slider reaches the whole pile.
        for name in ("card-stack.css", "wallpaper-layers.css"):
            css = (ROOT / "web" / name).read_text(encoding="utf-8")
            assert "--subcard-line-width" in css, name
        split = (ROOT / "web" / "subtask-split.css").read_text(encoding="utf-8")
        assert "border: 1px solid var(--subcard-outline, #2f5d4e);" in split
        assert "border-width: var(--subcard-line-width, 1.5px);" in split
    finally:
        import shutil
        shutil.rmtree(root, ignore_errors=True)

    print("card_line owns the floating-card colour and width")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
