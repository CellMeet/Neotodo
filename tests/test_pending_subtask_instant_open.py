"""The live subtask card appears in one cut, not a slide.

The card used to travel: unfolding grew its `max-height` over a short wipe
while the stroke, the rows and the wallpaper face faded on the same beat. The
reader does not ask for that movement when they click the handle line or when a
task opens, so the card is now a state change: the sheet, its paper, its rows
and its picture cut in on the same frame, exactly like the finished card.

The held-edge stretch is a different gesture — the card follows the pointer —
and keeps working. This test pins both sides of that line.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def rule(css: str, selector: str) -> str:
    assert selector in css, f"missing selector: {selector}"
    return css.split(selector, 1)[1].split("}", 1)[0]


def block_after(text: str, marker: str, stop: str) -> str:
    assert marker in text, f"missing marker: {marker}"
    return text.split(marker, 1)[1].split(stop, 1)[0]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    split_css = (ROOT / "web" / "subtask-split.css").read_text(encoding="utf-8")
    layers_css = (ROOT / "web" / "wallpaper-layers.css").read_text(encoding="utf-8")

    # --- the sheet and every layer on it cut in together -------------------
    card = rule(split_css, "\n.pending-subtask-card {")
    assert "transition: none;" in card, "the live card still animates its fold"
    assert "max-height 0.12s" not in card, "the card still slides its edge"
    assert "background-color 0.12s" not in card, "the paper still fades in"

    edge = rule(split_css, "\n.pending-subtask-card::after {")
    assert "transition: none;" in edge, "the stroke still fades on its own beat"

    lanes = rule(split_css, "\n.pending-subtask-card .subtask-lanes {")
    assert "transition: none;" in lanes, "the rows still fade on their own beat"

    toggle = rule(
        split_css,
        "\n.pending-subtask-card.collapsed > .pending-subtask-toggle {",
    )
    assert "transition: none;" in toggle, "the handle still rides the folded edge"

    # --- the handle is printed with its rows, never pulled out -------------
    assert "pending-subtask-line-pull" not in split_css, (
        "the live handle still plays a pull-out animation"
    )
    helper = block_after(app_js, "function syncSubtaskHandleLine(", "\n}\n")
    assert 'bar.classList.add("line-reveal");' not in helper, (
        "a handle is still started on a pull-out animation"
    )
    assert 'bar.classList.toggle("line-hidden", !show);' in helper

    # --- the wallpaper face leaves with the sheet --------------------------
    folded = block_after(
        layers_css,
        "html[data-wallpaper] #pending-subtask-card.collapsed > .card-wallpaper {",
        "\n}\n",
    )
    assert "opacity: 0;" in folded
    assert "transition: none;" in folded, "the picture still fades on its own beat"
    picture = block_after(
        layers_css,
        "#pending-subtask-card[data-card-picture].collapsed > .card-wallpaper {",
        "\n}\n",
    )
    assert "transition: none;" in picture

    # --- the held edge is still a drag, not a click ------------------------
    stretch = block_after(app_js, "function bindPendingSubtaskToggle(", "\n}\n")
    assert 'card.style.maxHeight = `${height}px`;' in stretch, (
        "the held edge no longer follows the pointer"
    )
    assert 'setPendingSubtasksCollapsed(folded);' in stretch

    print("the live subtask card appears and folds without a slide")
    return 0


if __name__ == "__main__":
    sys.exit(main())
