"""The achievement sheet paints on the click frame.

The trophy sheet used to fade in over 160ms and schedule its bass swell before
the sheet was inserted, so a click felt slow. The sheet is inserted first, the
fade is gone, and the sound waits for the next painted frame. A long chronicle
also paints only the rows inside its scrollport, which keeps older archives
from slowing the open down.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def main() -> int:
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
    js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")

    # The achievement stage appears with no entrance fade.
    assert re.search(r"\.completed-stage[^{}]*\{[^}]*animation:\s*none !important;", css)

    # Offscreen chronicle rows are skipped by layout and paint.
    row = css.split(".log-line {\n", 1)[1].split("}", 1)[0]
    assert "content-visibility: auto;" in row
    assert "contain-intrinsic-size: auto 36px;" in row
    focus_row = css.split(".focus-line {\n", 1)[1].split("}", 1)[0]
    assert "content-visibility: auto;" in focus_row
    assert "contain-intrinsic-size: auto 42px;" in focus_row

    # The sheet is inserted before the sound is scheduled.
    handler = js.split('if (actionName === "show-completed") {', 1)[1].split("}", 1)[0]
    assert handler.index("openCompletedLog();") < handler.index("afterNextPaint")
    assert "AudioFX.bassFade()" in handler

    # A single helper waits for the next painted frame for every achievement.
    helper = js.split("function afterNextPaint(callback) {", 1)[1].split("}", 1)[0]
    assert helper.count("requestAnimationFrame") == 2
    assert "afterNextPaint(() => AudioFX.guitarPluck());" in js

    print("the achievement sheet paints immediately; its sound waits for the next frame")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
