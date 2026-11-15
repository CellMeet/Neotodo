"""The Doing card is a plain todo index: no statistics on its right edge.

Every todo row used to end with a pending/total counter (`2/5`) hard against
the card's right border. The card reads as a list of names; the numbers were
noise there, so the row keeps only the mark, the name and, when expanded, the
pending subtasks.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    style = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
    overlay = (ROOT / "web" / "overlay-paper.css").read_text(encoding="utf-8")

    todo = app_js.split("function doingTodoHtml(", 1)[1].split("function doingPeekMarkup(", 1)[0]
    assert "doing-count" not in todo, "the todo row must not print a counter"
    assert 'class="doing-name"' in todo
    assert 'class="doing-subs"' in todo, "expanding a row still lists its pending subtasks"

    assert ".doing-count" not in style
    assert ".doing-count" not in overlay

    print("the Doing card keeps names only; the right-edge counter is gone")
    return 0


if __name__ == "__main__":
    sys.exit(main())
