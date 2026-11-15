"""The finished-card row baseline lives in baseline-rule.json, outside every theme.

The hairline inside the finished-subtasks drawer can be solid, a gradient along
the line, or a height ramp. The file is structured, not one colour string, so a
gradient survives a reload and a theme switch cannot repaint it. The page's own
ruled grid, the live subtask lane, the categories spine and the Doing panel all
read the page_line colour (page-line.css) and are not painted here.
"""
import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def main() -> int:
    root = Path(tempfile.mkdtemp(prefix="neotodo-row-baseline-test-"))
    try:
        app.BASELINE_RULE_FILE = root / "baseline-rule.json"

        # Nothing saved yet: a fixed solid rule, never a theme line.
        assert app.read_baseline_row_rule() == app.BASELINE_ROW_DEFAULT

        # Gradient values are normalised and persisted as a structured rule.
        rule = app.write_baseline_row_rule({
            "mode": "gradient",
            "color": "#FF0000",
            "color2": "#00FF88",
            "angle": 35,
        })
        assert rule == {
            "mode": "gradient",
            "color": "#ff0000",
            "color2": "#00ff88",
            "angle": 35,
        }
        saved = json.loads(app.BASELINE_RULE_FILE.read_text(encoding="utf-8"))
        assert saved["rule"] == rule, saved
        assert app.read_baseline_row_rule() == rule

        # Height mode is a first-class mode; bad input can never reach the CSS.
        assert app.normalize_baseline_row_rule({"mode": "height"})["mode"] == "height"
        bad = app.normalize_baseline_row_rule({
            "mode": "blink",
            "color": "red",
            "color2": "url(javascript:1)",
            "angle": 999,
        })
        assert bad["mode"] == "solid"
        assert bad["color"] == app.BASELINE_ROW_DEFAULT["color"]
        assert bad["color2"] == app.BASELINE_ROW_DEFAULT["color2"]
        assert bad["angle"] == 180

        # The state endpoint publishes the rule for the first paint and the
        # action writes the same file, without touching the notebook settings.
        state = app.Store(root / "NeoTodo.json").state()
        assert state["baseline_rule"] == rule, state["baseline_rule"]
        assert "baseline_rule" not in state["settings"]
        result = app.Store(root / "NeoTodo.json").action({
            "action": "save_baseline_rule",
            "rule": {"mode": "height", "color": "#123456", "color2": "#abcdef", "angle": 90},
        })
        assert result["ok"], result
        assert result["state"]["baseline_rule"]["mode"] == "height"

        # The stylesheet paints the finished-card rows only; the page sheet and
        # the Doing panel belong to page_line, so a card setting can never
        # recolour them.
        css = (ROOT / "web" / "baseline-rules.css").read_text(encoding="utf-8")
        assert 'data-baseline-rows="gradient"' in css
        assert 'data-baseline-rows="height"' in css
        assert ".completed-subtask-drawer .current-subtask" in css
        assert "#doing-peek" not in css
        assert ".history-row" not in css
        page_css = (ROOT / "web" / "page-line.css").read_text(encoding="utf-8")
        assert ".history-row" in page_css or "history-half" in page_css
        assert "#doing-peek" in page_css
        index = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
        assert '/baseline-rules.css"' in index
        app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        assert "save_baseline_rule" in app_js
        assert "baseline-rows-gradient" in app_js
        assert "root.dataset.baselineRows = rule.mode;" in app_js
    finally:
        import shutil
        shutil.rmtree(root, ignore_errors=True)
    print("baseline-rule.json keeps the solid/gradient/height row rule")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
