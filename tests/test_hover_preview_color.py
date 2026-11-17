"""A hovered option previews the reader's selection colour.

The option rows that sit in the theme / font / wallpaper / note-material menus
mark the row under the pointer with the same wash that the chosen row keeps
(`--select-wash-rgb`). They used to borrow the theme accent, so a teal-washed
list flashed a blue or gold ghost on the way to the click. The Doing card rows
and the finished-subtasks drawer use the shared overlay wash, which must follow
the same colour.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def rule(css: str, selector: str) -> str:
    match = re.search(rf"{re.escape(selector)}\s*\{{([^}}]*)\}}", css)
    assert match, f"missing rule {selector}"
    return match.group(1)


def main() -> int:
    style = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    # Every option row in Settings previews the selection wash, never the
    # theme accent that only paints chrome.
    for selector in (
        ".theme-menu-item:hover",
        ".theme-unit-row:hover",
        ".note-material-option:hover",
    ):
        body = rule(style, selector)
        assert "--select-wash-rgb" in body, selector
        assert "--pc-accent" not in body, selector
        assert "color-mix" not in body, selector

    # The Doing card and the finished-subtasks drawer share the overlay sheet;
    # its wash now follows the selection colour with the accent only as a
    # pre-JS fallback.
    overlay = (ROOT / "web" / "overlay-paper.css").read_text(encoding="utf-8")
    wash = rule(overlay, ":root")
    assert "--overlay-wash:" in wash
    assert "var(--select-wash-rgb, var(--overlay-accent-rgb))" in wash

    print("hovered options preview the selection wash")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
