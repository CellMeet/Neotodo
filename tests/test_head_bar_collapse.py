"""The collapsed Head Bar room follows the wallpaper, like the right-hand card.

A still wallpaper can be read as one palette, so the collapsed workspace wears
that wallpaper's own theme (the same `--doing-paper` tint and gentle sheet the
Doing card uses for a still picture). A film cannot be read as one palette, so
it keeps its motion and takes the reading mask instead.

The collage is drawn in the browser, so the two failure modes are guarded here:
the page must publish whether the room moves, and the Head Bar stylesheet must
have a separate recipe for each answer. The user data directory is untouched.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def block_after(css: str, selector: str) -> str:
    assert selector in css, f"missing rule: {selector}"
    return css.split(selector, 1)[1].split("}", 1)[0]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")

    # The page publishes the one thing CSS cannot know from `data-wallpaper`.
    assert 'root.setAttribute("data-wallpaper-motion", wallpaper.moving ? "film" : "still")' in app_js, (
        "the wallpaper no longer says whether the room moves"
    )
    assert 'root.removeAttribute("data-wallpaper-motion")' in app_js, (
        "a cleared wallpaper must also clear the motion answer"
    )

    head_bar = (ROOT / "web" / "plugins" / "head-bar" / "head-bar.css").read_text(encoding="utf-8")

    # A still wallpaper: the wallpaper's own theme, at the still-card strength.
    still = block_after(head_bar, "html[data-wallpaper] body.head-bar-collapsed .app-shell {")
    assert "--doing-paper" in still, "the still room ignores the wallpaper theme"
    assert "18%, transparent" in still and "5%, transparent" in still, (
        "the still room must wear the same gentle sheet as the still card"
    )
    assert "backdrop-filter: none" in still, "a still room must not be frosted"
    assert "100vw" not in still, "the collapsed room must stay full-window"

    # A film: the denser reading mask, never the still tint.
    film_selector = 'html[data-wallpaper][data-wallpaper-motion="film"] body.head-bar-collapsed .app-shell {'
    film = block_after(head_bar, film_selector)
    assert "46%, transparent" in film and "24%, transparent" in film, (
        "a film lost its reading mask"
    )
    assert "18%, transparent" not in film, "a film fell back to the still tint"

    # Engines without color-mix() still get a mask, and both recipes keep the
    # card's hairline edge instead of repainting a paper plate.
    assert "@supports not (background: color-mix(in srgb, red 50%, transparent))" in head_bar, (
        "no fallback for engines without color-mix()"
    )
    assert "var(--wallpaper-glass-edge" in still, "the collapsed room lost the card edge"

    print("head bar collapsed wallpaper recipes passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
