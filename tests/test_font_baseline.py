"""The Font tab exposes the page baseline as one simple row.

The row is named Baseline and offers only the colour and the width. It writes
through the normal ``save_page_line`` action, so the Font tab and the Palette
plugin always paint from the same page-line.json.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    font_body = app_js.split("function fontSettings()", 1)[1].split(
        "async function loadNoteMaterialFiles()", 1
    )[0]

    # One quiet row, no extra paragraph or explanation.
    assert '<div class="theme-settings-title">Baseline</div>' in font_body
    for control in ("font-baseline-color", "font-baseline-hex", "font-baseline-width"):
        assert f'id="{control}"' in font_body, control
    assert 'id="font-baseline-width-value"' in font_body

    # The row reads and writes the same page_line state as the Palette plugin.
    sync_body = app_js.split("function syncPageLineControls(", 1)[1].split(
        "// Row baseline", 1
    )[0]
    for control in ("font-baseline-color", "font-baseline-hex", "font-baseline-width"):
        assert f'$("#{control}")' in sync_body, control
    assert 'event.target.id === "font-baseline-width"' in app_js
    assert 'savePageLine({ thickness: value })' in app_js
    assert 'savePageLine({ color })' in app_js
    assert 'settingsTab === "font") syncPageLineControls()' in app_js

    print("Font → Baseline adjusts the page-line colour and width")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
