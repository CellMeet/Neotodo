"""Icon themes are a separate shelf from the paper/wallpaper themes.

The Classical set keeps every original NeoTodo mark. The bundled PvZ set swaps
the requested slots and leaves anything it does not define alone.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def main() -> int:
    themes = {pack["id"]: pack for pack in app.discover_icon_themes()}
    assert "classical" in themes, themes.keys()
    assert "pvs" in themes, themes.keys()
    assert themes["classical"]["icons"] == {}, themes["classical"]

    pvs = themes["pvs"]
    expected = {
        "tissue", "fan", "fanDone", "aiRunning", "aiDone", "aiDoneFinal",
        "achievement", "rowBurn", "fork", "finishBurst",
    }
    assert expected <= set(pvs["icons"]), pvs["icons"]
    # The finished-subtask mark keeps the Classical red check: the PvZ set no
    # longer swaps in the marigold picture there.
    assert "checkDone" not in pvs["icons"], pvs["icons"]
    for slot in expected:
        asset = app.icon_theme_asset_path("pvs", pvs["icons"][slot])
        assert asset is not None and asset.stat().st_size > 0, (slot, pvs["icons"][slot])
    # The history reel pins its rows opaque. That pin must never reach the
    # <use> an icon theme hides, or the old headphone prints over the cherry.
    completed_css = (ROOT / "web" / "completed.css").read_text(encoding="utf-8")
    assert ".h-trophy *:not(use)" in completed_css, "the reel's opacity pin keeps the theme glyph hidden"
    assert ".h-trophy *,\n" not in completed_css, "the reel must not pin the <use> of the trophy"
    print("Icon themes: Classical is original; PvZ maps every requested slot")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
