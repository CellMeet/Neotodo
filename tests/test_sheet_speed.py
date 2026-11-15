"""The note and AI sheets rise from the bottom in a tenth of a second.

Both sheets used to slide up over a third of a second with an exponential ease
that spent most of its travel in the last few pixels, so a click on the door
line felt like the panel was still arriving. The notebook now lifts from
translateY(100%) in 0.1s and the AI card opens/closes in the same window; the
close timers that hide the DOM were shortened to match.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def seconds(value: str) -> float:
    return float(value.rstrip("s"))


def main() -> int:
    style = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
    note_theme = (ROOT / "web" / "note-theme.css").read_text(encoding="utf-8")
    js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")

    # The notebook rises bottom-to-top and is done inside 120ms.
    rule = re.search(
        r"\.notes-half\.floating-notes\.sheet-opening\s*\{[^}]*"
        r"animation:\s*notes-sheet-up\s+([\d.]+)s",
        note_theme,
    )
    assert rule, "the notebook opening animation is missing"
    assert seconds(rule.group(1)) <= 0.12

    keyframe = re.search(r"@keyframes notes-sheet-up\s*\{(.*?)\}", note_theme, re.S)
    assert keyframe
    assert "translateY(100%)" in keyframe.group(1)

    # The AI card opens and closes on the same fast clock.
    durations = re.findall(
        r"\.agent-terminal\.sheet-(?:opening|closing)[^{}]*\{[^}]*"
        r"animation-duration:\s*([\d.]+)s !important",
        style,
    )
    assert len(durations) == 2, durations
    assert all(seconds(value) <= 0.12 for value in durations)

    # The timers that remove the classes/hide the panes no longer wait longer
    # than the animation itself needs.
    assert '"notes-solid-opening"), 160);' in js
    assert 'DeskHandle.appear("note", "below");\n  }, 140);' in js
    assert '"sheet-opening"), 140);' in js
    assert 'DeskHandle.appear("ai", "below");\n    saveViewState();\n  }, 140);' in js

    print("the note and AI sheets open and close from the bottom in 0.1s")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
