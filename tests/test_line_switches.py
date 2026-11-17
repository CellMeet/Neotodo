"""Font → Baseline and Font → Card line each have their own switch.

The switch owns the line. Off paints the line away (a transparent page rule, a
zero-weight card frame) and parks the colour and width controls; the chosen
values stay in page-line.json / card-line.json, so switching on brings both the
line and its controls back unchanged. Old files without the flag stay on.
"""
import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def main() -> int:
    root = Path(tempfile.mkdtemp(prefix="neotodo-line-switch-test-"))
    try:
        app.PAGE_LINE_FILE = root / "page-line.json"
        app.BASELINE_COLOR_FILE = root / "baseline-color.json"
        app.BASELINE_RULE_FILE = root / "baseline-rule.json"
        app.CARD_LINE_FILE = root / "card-line.json"

        # Both lines are on out of the box.
        assert app.read_page_line()["enabled"] is True
        assert app.read_card_line()["enabled"] is True

        # Switching off flips only the flag; the colour and weight stay saved.
        off = app.write_page_line({"enabled": False})
        assert off["enabled"] is False, off
        assert off["color"] == app.PAGE_LINE_DEFAULT["color"], off
        assert app.read_page_line()["enabled"] is False
        # Editing a parked control can never turn the line back on.
        assert app.write_page_line({"color": "#123456"})["enabled"] is False
        back = app.write_page_line({"enabled": True})
        assert back["enabled"] is True and back["color"] == "#123456", back

        card_off = app.write_card_line({"enabled": False})
        assert card_off["enabled"] is False, card_off
        assert card_off["width"] == app.CARD_LINE_DEFAULT["width"], card_off
        assert app.write_card_line({"width": 2})["enabled"] is False
        assert app.write_card_line({"enabled": True})["enabled"] is True

        # Old files and hand-edited values: only a real False turns a line off.
        for raw in ({}, {"enabled": "no"}, {"enabled": 0}, [], None):
            assert app.normalize_page_line(raw)["enabled"] is True, raw
            assert app.normalize_card_line(raw)["enabled"] is True, raw
        saved = json.loads(app.PAGE_LINE_FILE.read_text(encoding="utf-8"))
        assert saved["enabled"] is True, saved

        # The Font tab renders a switch at the head of both rows and parks the
        # colour / width inputs while the row is off.
        app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        font_body = app_js.split("function fontSettings()", 1)[1].split(
            "async function loadNoteMaterialFiles()", 1
        )[0]
        assert '"font-baseline-toggle"' in font_body
        assert '"toggle-font-baseline"' in font_body
        assert '"font-card-line-toggle"' in font_body
        assert '"toggle-font-card-line"' in font_body
        assert 'data-action="${action}"' in font_body
        assert 'aria-label="Baseline colour"${locked(baseline.enabled)}' in font_body
        assert 'aria-label="Baseline width"${locked(baseline.enabled)}' in font_body
        assert 'aria-label="Card line colour"${locked(cardline.enabled)}' in font_body
        assert 'aria-label="Card line width"${locked(cardline.enabled)}' in font_body
        assert '${baseline.enabled ? "" : "is-off"}' in font_body
        assert '${cardline.enabled ? "" : "is-off"}' in font_body

        # The actions flip the stored flag through the same save paths.
        assert 'savePageLine({ enabled: !on }, { immediate: true })' in app_js
        assert 'saveCardLine({ enabled: !on }, { immediate: true })' in app_js

        # Off paints the line away without moving the page or the cards.
        assert 'line.enabled ? pageLinePaint(line) : "transparent"' in app_js
        assert 'line.enabled ? line.color : "transparent"' in app_js

        styles = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
        assert ".font-line-toggle" in styles
        assert ".font-settings-row.is-off" in styles
    finally:
        import shutil
        shutil.rmtree(root, ignore_errors=True)

    print("Font switches turn the Baseline and Card line off and park their controls")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
