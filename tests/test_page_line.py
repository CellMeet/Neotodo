"""`page_line` is the single colour owner of the page's horizontal dividers.

The header, the history lane and the empty desk share one painted grid. The
live subtask lane is different on purpose: every subtask carries its own bottom
rule, so the line travels with the name, and the lane keeps one fixed rule at
its foot so scrolling never leaves the bottom open. The top bar, the categories
spine and the right-hand Doing panel map their rules to the same paint, weight
and pitch, so those regions are never ruled on a private grid. All of it comes
from page-line.json, outside every theme.
"""
import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def main() -> int:
    root = Path(tempfile.mkdtemp(prefix="neotodo-page-line-test-"))
    try:
        app.PAGE_LINE_FILE = root / "page-line.json"
        app.BASELINE_COLOR_FILE = root / "baseline-color.json"
        app.BASELINE_RULE_FILE = root / "baseline-rule.json"

        # Nothing saved yet: the fixed page_line default object, not a theme.
        assert app.read_page_line() == app.PAGE_LINE_DEFAULT

        # Colour and both layout numbers are normalised and persisted together.
        line = app.write_page_line({
            "color": "#A1B2C3",
            "opacity": 0.4,
            "row": 48,
            "thickness": 2,
        })
        assert line == {
            "color": "#a1b2c3",
            "opacity": 0.4,
            "row": 48,
            "thickness": 2,
        }, line
        saved = json.loads(app.PAGE_LINE_FILE.read_text(encoding="utf-8"))
        assert saved == line, saved
        assert app.read_page_line() == line

        # A partial patch (one slider) never resets the other settings.
        patched = app.write_page_line({"color": "#00FF88"})
        assert patched["color"] == "#00ff88"
        assert patched["opacity"] == 0.4
        assert patched["row"] == 48
        assert patched["thickness"] == 2

        # Bad input can never reach the stylesheet.
        for raw in (
            {"color": "red", "opacity": 9, "row": 999, "thickness": -3},
            {"color": "url(javascript:1)"},
            {"opacity": "x", "row": "y", "thickness": "z"},
            [],
            "nope",
            None,
        ):
            normalized = app.normalize_page_line(raw)
            assert 0 <= normalized["opacity"] <= 1
            assert app.PAGE_LINE_ROW_MIN <= normalized["row"] <= app.PAGE_LINE_ROW_MAX
            assert app.PAGE_LINE_THICKNESS_MIN <= normalized["thickness"] <= app.PAGE_LINE_THICKNESS_MAX
            assert normalized["color"] == app.PAGE_LINE_DEFAULT["color"]

        # An existing page-baseline colour seeds page_line once; the read does
        # not write a file, and every later save goes to page-line.json.
        app.PAGE_LINE_FILE.unlink()
        app.BASELINE_COLOR_FILE.write_text(
            json.dumps({"color": "#123456"}), encoding="utf-8"
        )
        assert app.read_page_line()["color"] == "#123456"
        assert not app.PAGE_LINE_FILE.exists()

        # The state endpoint publishes the object for the first paint and the
        # action writes the same file, without touching the notebook settings.
        app.write_page_line({"color": "#654321", "opacity": 1, "row": 40, "thickness": 1})
        store = app.Store(root / "NeoTodo.json")
        state = store.state()
        assert state["page_line"]["color"] == "#654321", state["page_line"]
        assert "page_line" not in state["settings"]
        result = store.action({
            "action": "save_page_line",
            "page_line": {"opacity": 0.25},
        })
        assert result["ok"], result
        assert result["state"]["page_line"]["opacity"] == 0.25
        assert result["state"]["page_line"]["color"] == "#654321"

        # One stylesheet owns every ruled region's colour; the finished-card
        # row rule is separate.
        css = (ROOT / "web" / "page-line.css").read_text(encoding="utf-8")
        assert "repeating-linear-gradient" in css
        assert "--page-line-paint" in css
        assert "--page-task-h: calc(var(--page-line-row) * 7)" in css
        for surface in (".page-head", "history-half", ".page-body::after"):
            assert surface in css, surface
        # The live subtask lane is row-attached: each name carries its own line,
        # and one fixed rule stays at the foot while the lane scrolls.
        assert "border-bottom: var(--page-line-thickness) solid var(--page-line-paint)" in css
        assert ".subtask-lanes .current-subtask" in css
        assert ".current-half::after" in css
        # The top bar, the categories spine and the right-hand Doing panel map
        # their rules to the same paint, weight and row pitch as the page grid.
        assert "html[data-theme=\"postcard\"] .notebook-head" in css
        assert "border-bottom-color: var(--page-line-paint)" in css
        assert "html[data-theme=\"postcard\"] .index-head" in css
        assert "html[data-theme=\"postcard\"] .category-item" in css
        assert "height: var(--page-line-row)" in css
        # Every category row is ruled, but the empty spine below the last
        # category is left blank — no continuation rules are painted there.
        assert "category-list::after" not in css
        assert "html[data-theme=\"postcard\"] .index-foot" in css
        assert "#doing-peek .doing-item" in css
        assert "#doing-peek .doing-head" in css
        assert "min-height: var(--page-line-row)" in css
        assert ".doing-list::after" in css
        assert "transparent 0 var(--page-line-gap)" in css
        # No region keeps a private fixed pitch.
        assert "39px 40px" not in css
        # The spine keeps the page grid for its rows, and its foot is the page's
        # foot; a wallpaper never re-adds a filler in the empty room below.
        spine_rule = css.split('html[data-theme="postcard"] .index {', 1)[1].split("}", 1)[0]
        assert "padding-bottom: 0 !important" in spine_rule
        # A collapsed storage box is zero height, not a 2px frame that pushes
        # every category row off the page line grid.
        storage_css = (
            ROOT / "web" / "plugins" / "storage-box" / "storage-box.css"
        ).read_text(encoding="utf-8")
        assert "box-sizing: border-box" in storage_css
        assert "border: 0 solid transparent" in storage_css
        assert "border-width: 1px" in storage_css
        baseline_css = (ROOT / "web" / "baseline-rules.css").read_text(encoding="utf-8")
        assert ".history-row" not in baseline_css
        assert "#doing-peek" not in baseline_css
        assert ".completed-subtask-drawer .current-subtask" in baseline_css

        index = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
        assert '/page-line.css"' in index
        assert index.index("/baseline-rules.css") < index.index("/page-line.css")

        app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        assert '"save_page_line"' in app_js
        palette_html = (ROOT / "web" / "plugins" / "palette" / "index.html").read_text(encoding="utf-8")
        for control in ("page-line-color", "page-line-opacity", "page-line-row", "page-line-thickness"):
            assert f'id="{control}"' in palette_html, control
        assert 'setProperty("--page-line-paint"' in app_js
        assert 'setProperty("--page-task-h"' in app_js
    finally:
        import shutil
        shutil.rmtree(root, ignore_errors=True)
    print("page_line owns colour and layout for every page divider")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
