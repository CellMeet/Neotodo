"""The note and AI sheets draw no grey rule along their top edge.

The desk baseline used to be handed to the open sheet: page-layout painted a
`border-top` in the page colour and page-line recoloured the same edge with
`page_line`, so a dark grey line ran across the top of the AI console and the
note. The reader asked for that edge to be removed.

The desk keeps its own baseline below the sheets, but the panes themselves must
declare no top border at all — neither the layout hand-off nor a page_line
recolour.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def strip_comments(text: str) -> str:
    return re.sub(r"/\*.*?\*/", "", text, flags=re.S)


def rule_body(css: str, selector: str) -> str:
    """Declarations of the first exact `selector { ... }` rule."""
    marker = selector + " {"
    assert marker in css, f"missing rule: {selector}"
    return css.split(marker, 1)[1].split("}", 1)[0]


def main() -> int:
    page_layout = strip_comments((ROOT / "web" / "page-layout.css").read_text(encoding="utf-8"))
    page_line = strip_comments((ROOT / "web" / "page-line.css").read_text(encoding="utf-8"))

    # The layout owns the pane box and must not paint a top edge on either sheet.
    sheet_rule = rule_body(
        page_layout,
        ".page-body > #notes-half:not(.notes-hidden),\n.page-body > #agent-terminal.open",
    )
    assert "border-top: 0 !important;" in sheet_rule, sheet_rule
    assert "border-top: 1px" not in sheet_rule, sheet_rule
    assert "--page-baseline-color" not in sheet_rule, sheet_rule

    # page_line may not recolour a pane's edge back into a visible rule.
    pane_line = rule_body(
        page_line,
        'html[data-theme="postcard"] .page-body > #notes-half:not(.notes-hidden),\n'
        'html[data-theme="postcard"] .page-body > #agent-terminal.open',
    )
    assert "border-top-width: 0 !important;" in pane_line, pane_line
    assert "border-top-color" not in pane_line, pane_line
    assert "border-top: var(--page-line-thickness)" not in pane_line, pane_line

    # The empty desk still keeps its baseline; only the sheet edge went away.
    assert "background: var(--page-baseline-color);" in page_layout
    assert page_layout.count("{") == page_layout.count("}")
    assert page_line.count("{") == page_line.count("}")

    print("the note and AI sheets carry no grey top edge")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
