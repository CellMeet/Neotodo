"""The floating cards share the live subtask lane's hairline.

`page_line` already owns the rule under every live subtask name. The finished
subtasks drawer and the Doing card are printed on the same sheet, so their row
rules must read the same paint and weight instead of a private theme or card
colour. A row finishing into the drawer must not be seen reprinting its line.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    baseline = (ROOT / "web" / "baseline-rules.css").read_text(encoding="utf-8")

    # The finished-subtasks card paints page_line, whatever stored mode the file
    # still carries.
    assert "--baseline-row-paint: var(--page-line-paint, #333333);" in baseline
    # A fixed 1px weight here made the landed row thinner than the live lane it
    # came from whenever Page line was thicker than one pixel.
    assert "--baseline-row-size: var(--page-line-thickness, 1px);" in baseline
    assert (
        "border-bottom: var(--baseline-row-size) solid var(--baseline-row-paint) !important;"
        in baseline
    )
    for row in baseline.splitlines():
        if "border-bottom" in row:
            assert "--baseline-row-color" not in row, row

    # The shared overlay sheet (Doing card rules and filler) uses the same paint.
    overlay = (ROOT / "web" / "overlay-paper.css").read_text(encoding="utf-8")
    assert "--overlay-line: var(--page-line-paint" in overlay

    page = (ROOT / "web" / "page-line.css").read_text(encoding="utf-8")
    # Every Doing row separator follows the page line.
    assert 'html[data-theme="postcard"] #doing-peek .doing-item,' in page
    assert "border-color: var(--page-line-paint) !important;" in page
    assert "border-width: var(--page-line-thickness) !important;" in page
    # A finished subtask opened in the history lane is the same row.
    assert 'html[data-theme="postcard"] .history-subtask {' in page
    # A finished row changes cards in place, so it never travels as a ghost
    # that has to drop the lane's rule. The finished card prints the row and its
    # line in the same repaint.
    assert ".subtask-flight" not in page

    print("finished and Doing card rows share the page_line paint and weight")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
