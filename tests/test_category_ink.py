"""The left Categories index reads the hidden top bar's ink.

The hidden top bar's marks are painted with the mapped utility accent
(``--utility-ink``, published by ``inkAccents`` in app.js). The Categories label
and the category rows now read that same token, so the index and the chrome
always agree when the reader changes the body font colour. Hovering or selecting
a row hands it back to the page ink, the same reveal the top-bar marks use.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"


def rule(style: str, selector: str) -> str:
    return style.split(selector, 1)[1].split("}", 1)[0]


def main() -> int:
    style = (WEB / "style.css").read_text(encoding="utf-8")
    app_js = (WEB / "app.js").read_text(encoding="utf-8")

    # One token feeds both surfaces, so the binding is live: changing the body
    # font colour repaints the top bar and the index together.
    assert '"--utility-ink", accents.utility' in app_js
    assert "color: var(--utility-ink, var(--pc-accent))" in rule(
        style,
        "html[data-theme] .top-tools .sound-toggle,\n"
        "html[data-theme] .top-tools .settings-button,\n"
        "html[data-theme] .top-tools .exit-button",
    )

    index = rule(
        style,
        "html[data-theme] .index-head > span,\n"
        "html[data-theme] .category-item,\n"
        "html[data-theme] .category-item:hover,\n"
        "html[data-theme] .category-item.selected",
    )
    assert "color: var(--utility-ink, var(--pc-ink))" in index
    # Every state stays bound; hover/selection speak through the wash and the
    # left rule, never by recolouring the text back to the page ink.
    assert "--pc-ink))" in index and "color: var(--pc-ink)" not in index
    # The marker label keeps its own hand and outline; only the ink is bound.
    assert "font-family" not in index
    assert "-webkit-text-stroke" not in index

    print("Categories index: the label and rows follow the hidden top bar ink")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
