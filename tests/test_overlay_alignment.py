"""Settings, the archive and the chronicle clear the header by one finger.

The postcard viewer is centred in the viewport, so its top edge sits at
(100vh - its height) / 2. Settings and the achievement sheets used to float
higher up the page, which made the three frames start at different heights;
they hang from that line minus one ruled notebook row and then drop by
--overlay-finger (roughly one finger), so the sheets read as part of the page
grid, shift with the row height chosen in Settings and clear the header.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def main() -> int:
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    # One height variable for the postcard frame, used by the card itself.
    assert "--postcard-height: min(560px, 80vh);" in css
    assert "height: var(--postcard-height);" in css
    # Responsive card heights flow through the same variable.
    assert "--postcard-height: min(540px, 82vh);" in css
    assert "--postcard-height: calc(96vh - 30px);" in css

    # The sheets' top edge is the centred card's top minus one notebook row,
    # then one finger lower (--page-line-row is the page grid pitch).
    assert "--overlay-finger: 30px;" in css
    assert "calc((100vh - var(--postcard-height)) / 2 - var(--page-line-row, 40px) + var(--overlay-finger))" in css
    assert "clamp(40px, 6vh, 72px)" not in css

    # app.js snaps the same edge onto the page rules and adds that same drop.
    js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    assert 'getPropertyValue("--overlay-finger")' in js
    assert ") || 30;" in js

    # Settings and the chronicle start on that line.
    align = css.split("/* --------------------------------------------------------------------------\n   Overlay alignment", 1)[1]
    assert ".settings-stage,\n.completed-stage {" in align
    assert "align-items: flex-start !important;" in align
    assert "padding-top: var(--overlay-top) !important;" in align

    # The archive sheet is positioned by the same top edge instead of being
    # pulled up by a 50% / -50% transform.
    archive = css.split(".archive-drawer {\n  top:", 1)[1].split("}", 1)[0]
    assert "var(--overlay-top" in archive.split("\n", 1)[0]
    assert "transform: translateX(-50%) scale(.97);" in archive
    assert "translate(-50%, -50%)" not in archive

    print("settings, archive and chronicle clear the header by one finger below the postcard line")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
