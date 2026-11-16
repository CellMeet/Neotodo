"""The top hidden surfaces pop out the moment their trigger is reached.

Both pieces of chrome at the top of the window are hover reveals:

* the Head Bar island leaves the top border when the pointer reaches the clock;
* the top tools box slides down when the pointer reaches the top band.

They used to spend most of their travel in a long tail (0.46s spring for the
island), so a quick pointer move across the top looked like the box was still
arriving after the pointer had already left. Opening now finishes in well under a fifth of a
second, with no overshoot that keeps the surface moving.
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

    # The winning top-tools transition is the only top-tools block that marks
    # its transition `!important`, so pick it by that marker instead of by
    # position (other work can add more top-tools rules).
    tail = re.search(
        r"\.top-tools\s*\{[^}]*transition:[^}]*!important[^}]*\}",
        style,
    )
    assert tail, "the fast top-tools transition is missing"
    speed = re.search(
        r"transition:\s*opacity\s+([\d.]+)s\s+\w+,\s*"
        r"transform\s+([\d.]+)s\s+cubic-bezier\(([^)]+)\)\s*!important",
        tail.group(0),
    )
    assert speed, "the fast top-tools transition is missing"
    assert seconds(speed.group(1)) <= 0.06, speed.group(1)
    assert seconds(speed.group(2)) <= 0.08, speed.group(2)
    control = [float(part.strip()) for part in speed.group(3).split(",")]
    assert control[1] <= 1 and control[3] <= 1, control

    print("the top hidden surfaces open in under a fifth of a second")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
