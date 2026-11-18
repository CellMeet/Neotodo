"""The PvZ cherry bomb owns the burst that lands when a whole todo is done.

The idle cherry (`achievement`) already replaces the headphone on a completed
todo without subtasks; the explosion is its own slot so Classical and every
pack that does not draw one keep the plain confetti celebration.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def main() -> int:
    pvs = {pack["id"]: pack for pack in app.discover_icon_themes()}["pvs"]
    assert pvs["icons"]["finishBurst"] == "icons/finish-burst.gif", pvs["icons"]
    assert pvs["icons"]["achievement"] == "icons/achievement-cherry.gif", pvs["icons"]
    for slot in ("finishBurst", "achievement"):
        asset = app.icon_theme_asset_path("pvs", pvs["icons"][slot])
        assert asset is not None and asset.stat().st_size > 0, (slot, pvs["icons"][slot])

    js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    assert '"finishBurst"' in js, "app.js must know the new slot"
    assert "function finishedBurst()" in js, "the burst needs its own helper"
    complete = js.split('if (actionName === "complete")', 1)[1]
    complete = complete.split('if (actionName === "complete-subtask")', 1)[0]
    assert "finishedBurst();" in complete, "completing a todo must fire the burst"
    assert complete.index("finishedBurst();") < complete.index("finishedToast();"), (
        "the burst lands with the toast, not after the repaint"
    )

    css = (ROOT / "web" / "icon-theme.css").read_text(encoding="utf-8")
    assert 'html[data-icon-finish-burst="1"] .finish-burst' in css
    assert "42vw" in css, "the burst is larger than a third of the window's width"
    # The cherry sits beside the squash in the same column, so its finished-row
    # slot has to carry the squash's weight instead of shrinking to 29px.
    assert 'html[data-icon-achievement="1"] .history-row .h-trophy:not(.h-trophy-squash)' in css
    assert 'html[data-icon-achievement="1"] .history-row .h-trophy .moon-icon' in css

    python = (ROOT / "app.py").read_text(encoding="utf-8")
    assert '"finishBurst"' in python, "the manifest reader must accept the slot"
    print("PvZ: the cherry mark and its centred completion burst are wired")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
