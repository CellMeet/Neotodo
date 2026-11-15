"""The page baseline owns a standalone colour file, outside the theme.

`baseline-color.json` is the only source of the rule colour: changing the
paper, the notebook palette or the AI console palette must never repaint it.
The user data directory is redirected to a temporary folder for the test.
"""
import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def main() -> int:
    root = Path(tempfile.mkdtemp(prefix="neotodo-baseline-test-"))
    try:
        app.BASELINE_COLOR_FILE = root / "baseline-color.json"

        # Nothing saved yet: the fixed neutral default, not the active theme.
        assert app.read_baseline_color() == app.BASELINE_COLOR_DEFAULT

        # Writing normalises the value and creates the standalone file.
        assert app.write_baseline_color("#A1B2C3") == "#a1b2c3"
        saved = json.loads(app.BASELINE_COLOR_FILE.read_text(encoding="utf-8"))
        assert saved == {"color": "#a1b2c3"}, saved
        assert app.read_baseline_color() == "#a1b2c3"

        # A hand-written file may use the old key spellings.
        app.BASELINE_COLOR_FILE.write_text(
            json.dumps({"baseline-color": "#00FF88"}), encoding="utf-8"
        )
        assert app.read_baseline_color() == "#00ff88"
        app.BASELINE_COLOR_FILE.write_text(
            json.dumps({"baseline_color": "#123456"}), encoding="utf-8"
        )
        assert app.read_baseline_color() == "#123456"

        # Invalid values can never reach the CSS variable, on disk or in code.
        for value in ("red", "#12345", "#1234567", "", None, 12, "url(javascript:1)"):
            assert app.normalize_baseline_color(value) == app.BASELINE_COLOR_DEFAULT
        app.BASELINE_COLOR_FILE.write_text(
            json.dumps({"color": "url(javascript:alert(1))"}), encoding="utf-8"
        )
        assert app.read_baseline_color() == app.BASELINE_COLOR_DEFAULT
        # JSON that is not an object is ignored too.
        app.BASELINE_COLOR_FILE.write_text("[]", encoding="utf-8")
        assert app.read_baseline_color() == app.BASELINE_COLOR_DEFAULT

        # The state endpoint publishes the file so the page can paint before
        # Settings is opened, and the notebook settings stay untouched.
        app.write_baseline_color("#654321")
        store = app.Store(root / "NeoTodo.json")
        state = store.state()
        assert state["baseline_color"] == "#654321", state["baseline_color"]
        assert "baseline_color" not in state["settings"]
        assert app.BASELINE_COLOR_FILE.is_file()
        assert (root / "NeoTodo.json") != app.BASELINE_COLOR_FILE

        # The stylesheet no longer derives the page rule from the theme line.
        page_layout = (ROOT / "web" / "page-layout.css").read_text(encoding="utf-8")
        assert "--page-baseline-color: #333333;" in page_layout
        assert "--page-baseline-color: var(--pc-line" not in page_layout
        assert "--page-baseline-color: var(--line" not in page_layout

        # The legacy colour file still exists and stays independent, but the
        # page's dividers moved to the single page_line object. The Palette
        # plugin now owns the picker, so the old settings ids are gone.
        app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        palette_html = (ROOT / "web" / "plugins" / "palette" / "index.html").read_text(encoding="utf-8")
        assert 'id="baseline-color"' not in app_js
        assert 'id="baseline-color"' not in palette_html
        assert 'id="page-line-color"' in palette_html
        assert '"save_page_line"' in app_js
        page_line_css = (ROOT / "web" / "page-line.css").read_text(encoding="utf-8")
        assert "--page-line-paint" in page_line_css
    finally:
        import shutil
        shutil.rmtree(root, ignore_errors=True)
    print("baseline-color.json stays independent from every theme palette")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
