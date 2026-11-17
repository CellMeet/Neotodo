"""The top hidden bar is a swap, not a second bar.

The reader's rule is: the wordmark / clock / achievement counters leave the
header, and the tool icons take their place on the same strip. The bar must
therefore not paint a surface of its own — a `--paper` fill here was the dark
desk colour in the dark palettes, so the swap arrived as a black strip over the
header instead of icons printed on it.

The winning `!important` block is picked by that marker, the same way
tests/test_top_hidden_speed.py finds it, so later tuning rules cannot reintroduce
a fill, an edge or a drop shadow.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def main() -> int:
    style = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
    index_html = (ROOT / "web" / "index.html").read_text(encoding="utf-8")

    # No wallpaper pane may be mounted on the bar: the pane is a second copy
    # of the room's surface and could arrive as a black stale/failed bake.
    bar = re.search(r'<div class="top-tools"[^>]*>', index_html)
    assert bar, "the top hidden bar is missing"
    assert "data-wallpaper-surface" not in bar.group(0), (
        "the top hidden bar requests its own wallpaper background again"
    )
    assert "data-subcard" not in bar.group(0), (
        "the top hidden bar became a wallpaper card again"
    )
    assert re.search(r"\.top-tools\s*>\s*\.card-wallpaper\s*\{\s*display:\s*none\s*!important", style), (
        "a wallpaper pane could paint a second surface behind the tools"
    )

    tail = re.search(r"\.top-tools\s*\{[^}]*!\s*important[^}]*\}", style)
    assert tail, "the instant top-tools rule is missing"
    block = tail.group(0)

    assert re.search(r"background:\s*transparent\s*!important", block), (
        "the top bar paints a background again; the header owns the strip"
    )
    assert re.search(r"border:\s*0\s*!important", block), (
        "the top bar draws its own edge again; the header rule is the only line"
    )
    assert re.search(r"box-shadow:\s*none\s*!important", block), (
        "the top bar drops its own shadow on the page again"
    )

    # The header swap itself still has to happen, or the bar would cover the
    # live wordmark with icons.
    swap = re.search(
        r"body\.top-tools-open \.notebook-head \.nt-brand,[^{]*\{([^}]*)\}",
        style,
    )
    assert swap, "the header row is not swapped out with the top bar"
    for part in ("#header-clock", ".head-right"):
        assert part in swap.group(0), f"the top bar leaves {part} behind"

    print("the top hidden bar adds no surface of its own over the header")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
