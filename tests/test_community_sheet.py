"""Community opens as a Settings-like in-app sheet with one finger more paper.

Settings is the reference sheet: it hangs from the page's overlay line, paints
straight onto the notebook (no dim, no frost, no entry fade). Community is the
same kind of sheet, but its paper is one finger wider on all four sides:

  * the top edge rises one --overlay-finger above Settings' top edge (onto the
    page's first ruled line);
  * the left and right edges each gain one finger, centered on the same axis;
  * the foot drops one finger below Settings' foot.

Both sheets derive from the same numbers, so changing the finger width or the
Settings size moves them together. This is the guard for "把社区做成 setting
那样的应用内弹窗，上下左右都多一根手指的宽度".
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def block(css: str, selector: str) -> str:
    marker = f"\n{selector} {{"
    assert marker in css, f"missing {selector} rule"
    body = css.split(marker, 1)[1].split("}", 1)[0]
    return re.sub(r"\s+", " ", body).strip()


def main() -> int:
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
    wallpaper = (ROOT / "web" / "wallpaper-layers.css").read_text(encoding="utf-8")
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")

    # Settings owns the reference geometry: 780 / 620 and one finger of drop.
    assert ".settings-panel { width: min(780px, 94vw); }" in css
    assert "--overlay-finger: 30px;" in css
    assert "height: min(620px, 86vh);" in css

    stage = block(css, ".community-stage")
    # In place on the page, exactly like Settings: no veil, no frost, no fade.
    assert "background: transparent;" in stage
    assert "-webkit-backdrop-filter: none;" in stage
    assert "backdrop-filter: none;" in stage
    assert "animation: none;" in stage
    assert "blur(" not in stage

    # The shared no-dim block keeps every theme's stage clear too.
    no_dim = css.split("/* Settings, Community and achievement sheets", 1)[1]
    no_dim = no_dim.split("}", 1)[0]
    for selector in (
        ".community-stage",
        'html[data-theme="lavender"] .community-stage',
        'html[data-theme="postcard"] .community-stage',
    ):
        assert selector in no_dim
    assert "background: transparent !important;" in no_dim
    assert "backdrop-filter: none !important;" in no_dim
    assert "animation: none !important;" in no_dim

    panel = block(css, ".community-panel")
    # One finger of extra paper on every side of Settings' sheet.
    assert "--community-finger: var(--overlay-finger, 30px);" in panel
    assert "--community-rise: min(var(--community-finger), var(--overlay-top, 24px));" in panel
    assert "position: relative;" in panel
    assert "top: calc(-1 * var(--community-rise));" in panel
    assert (
        "width: min( calc(min(780px, 94vw) + var(--community-finger) * 2), "
        "calc(100vw - 24px) );" in panel
    ), panel
    assert (
        "height: min( calc(min(620px, 86vh) + var(--community-finger) * 2), "
        "calc(100vh - var(--overlay-top, 24px) - 12px + var(--community-rise)) );"
        in panel
    ), panel
    # Paper, not glass, and no entry animation: readable on the first frame.
    assert "background: var(--paper);" in panel
    assert "backdrop-filter" not in panel
    assert "animation: none;" in panel

    # The old frosted-window transition is gone, not merely disabled.
    assert "@keyframes community-stage-in" not in css
    assert "@keyframes community-panel-in" not in css

    # Narrow windows keep the risen top and the extra finger below the fold.
    narrow = css.split(".community-stage { padding: 10px;", 1)[1]
    narrow = narrow.split(".community-brand-copy small", 1)[0]
    narrow = re.sub(r"\s+", " ", narrow)
    assert "--community-finger: var(--overlay-finger, 30px);" in narrow
    assert "--community-rise: min(var(--community-finger), var(--overlay-top, 12px));" in narrow
    assert (
        "height: calc(100vh - var(--overlay-top, 12px) - 12px + "
        "var(--community-rise));" in narrow
    ), narrow

    # A wallpaper keeps the same frosted paper as the Settings sheet.
    assert "html[data-wallpaper] .community-panel," in wallpaper

    # One sheet at a time: opening Community folds Settings away first.
    open_fn = app_js.split("function openCommunity(", 1)[1].split("function closeCommunity(", 1)[0]
    assert open_fn.index("closeSettings();") < open_fn.index("communityModalOpen = true;")

    print("Community is a Settings-like in-app sheet, one finger wider all round")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
