"""The selected category is inked, not filled.

The left spine used to paint a gradient wash under the current category while
also bolding its name and drawing the left rule. Two highlights for one state
made the index read like a column of pressed buttons, and the tint pulled the
row off the paper in every theme. The selected row is now flat: the weight, the
left rule and the square dot carry the state. Hover keeps its quiet preview on
the other rows, but a selected row does not darken under the pointer either.

The wash lived in a dozen per-theme rules plus the ``html[data-select]`` pass
(the Settings → Selection highlight colour). They are neutralised by one late
rule, so it has to stay after all of them and outrank the ``!important``
selection pass.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"

FLAT = (
    "html[data-theme] .category-list .category-item.selected,\n"
    "html[data-theme] .category-list .category-item.selected:hover,\n"
    "html[data-select] .category-list .category-item.selected,\n"
    "html[data-select] .category-list .category-item.selected:hover"
)


def rule(style: str, selector: str) -> str:
    return style.split(selector, 1)[1].split("}", 1)[0]


def main() -> int:
    style = (WEB / "style.css").read_text(encoding="utf-8")

    flat = rule(style, FLAT)
    assert "background: transparent !important;" in flat, (
        "the selected category still paints a wash"
    )
    assert "background-image: none !important;" in flat, (
        "a theme gradient can still show through"
    )
    assert "box-shadow: none !important;" in flat, (
        "the row still glows as if it were filled"
    )

    # The neutraliser must be the last word on the selected row: every theme
    # rule and the data-select pass that writes a background has to come before
    # it. `.category-list` in the selector is what outranks
    # `html[data-select] .category-item.selected` even though both are
    # !important, so check the sub-selector is there too.
    flat_at = style.index(FLAT)
    wash_at = style.index(
        "html[data-select] .category-item.selected {"
    )
    assert wash_at < flat_at, "the selection-highlight pass comes after the flattening rule"
    assert style.count(".category-list .category-item.selected") >= 2
    per_theme = [
        'html[data-theme="postcard"] .category-item.selected {',
        'html[data-theme="lavender"] .category-item.selected {',
        ".category-item.selected {",
    ]
    for marker in per_theme:
        assert style.index(marker) < flat_at, (
            f"a theme wash is declared after the flattening rule: {marker}"
        )

    # The state still reads: the left rule and the dot keep the Categories ink.
    assert "background: var(--utility-ink, var(--pc-ink));" in rule(
        style, "html[data-theme] .category-item.selected::before"
    )
    assert "background: var(--utility-ink, var(--pc-ink));" in rule(
        style, "html[data-theme] .category-item.selected .cat-dot"
    )
    # Hover on the unselected rows keeps its preview wash.
    assert "background: rgba(var(--select-wash-rgb), 0.08) !important;" in rule(
        style, "html[data-select] .category-item:hover"
    )

    print("Categories: the selected row is flat, marked by ink, rule and dot")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
