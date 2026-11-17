"""The top hidden surfaces pop out the moment their trigger is reached.

Two pieces of chrome sit at the top of the window:

* the Head Bar island leaves the top border when the pointer reaches the clock;
* the top tools box replaces the header when the pointer reaches the top band.

The island used to spend most of its travel in a long tail (0.46s spring), so a
quick pointer move across the top looked like the box was still arriving after
the pointer had already left. It now opens in well under a fifth of a second.

The tools box is not a slide at all any more. It used to travel down out of the
border while the header row — wordmark, clock, achievement counters — stayed
painted underneath (very visible through a wallpaper, where the bar is
transparent). It is a state swap now: the bar is either out or not, and the old
header row leaves the paper on the same frame the settings icons arrive.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def seconds(value: str) -> float:
    return float(value.rstrip("s"))


def main() -> int:
    head_bar = (ROOT / "web" / "plugins" / "head-bar" / "head-bar.css").read_text(encoding="utf-8")
    style = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")

    # The island block owns one transition: opacity + the vertical travel.
    island = head_bar.split(".head-bar-island {", 1)[1].split("}", 1)[0]
    motion = re.search(
        r"transition:\s*opacity\s+([\d.]+)s\s+\w+,\s*"
        r"transform\s+([\d.]+)s\s+cubic-bezier\(([^)]+)\)",
        island,
    )
    assert motion, "the island lost its hover transition"
    assert seconds(motion.group(1)) <= 0.10, motion.group(1)
    assert seconds(motion.group(2)) <= 0.16, motion.group(2)
    # A spring with an overshoot above 1 keeps moving after it has arrived.
    control = [float(part.strip()) for part in motion.group(3).split(",")]
    assert len(control) == 4, control
    assert control[1] <= 1 and control[3] <= 1, control
    assert "will-change: opacity, transform" in island, "the island is not promoted for the pop"

    # --- the top tools box is a cut, never a slide -------------------------
    bar = style.split("\n.top-tools {", 1)[1].split("}", 1)[0]
    assert "transition: none;" in bar, "the top bar still eases in"
    assert "transform: none;" in bar, "the top bar still travels out of the border"
    assert "translateY" not in bar, "the top bar still slides"

    opened = style.split("\n.top-edge:hover ~ .top-tools,", 1)[1].split("}", 1)[0]
    assert "opacity: 1;" in opened and "pointer-events: auto;" in opened
    assert "transform: none;" in opened, "the open bar still slides into place"
    assert "translateY" not in opened, "the open bar still slides into place"
    assert "transition: none;" in opened, "the open bar still eases in"

    # The winning block is the only .top-tools rule that shouts `!important`;
    # pick it by that marker so later tuning rules cannot hide the cut.
    tail = re.search(r"\.top-tools\s*\{[^}]*!\s*important[^}]*\}", style)
    assert tail, "the instant top-tools rule is missing"
    assert "transition: none !important" in tail.group(0), tail.group(0)
    assert "translateY" not in tail.group(0), "the top bar still slides"

    # --- the old header row leaves on that same frame ----------------------
    swap = re.search(
        r"body\.top-tools-open \.notebook-head \.nt-brand,[^{]*\{([^}]*)\}",
        style,
    )
    assert swap, "the header row is not swapped out with the top bar"
    declarations = swap.group(1)
    assert "visibility: hidden !important" in declarations, declarations
    assert "opacity: 0 !important" in declarations, declarations
    assert "transition: none !important" in declarations, declarations
    for part in ("#header-clock", ".head-right"):
        assert part in swap.group(0), f"the top bar leaves {part} behind"

    # app.js marks the swap on <body>; the CSS reads that one class.
    assert 'classList.add("top-tools-open")' in app_js
    assert 'classList.remove("top-tools-open")' in app_js

    print("the top hidden surfaces open in under a fifth of a second, and the bar swaps with the header")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
