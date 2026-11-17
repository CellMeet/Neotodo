"""Complete / slash / add wear the title's font ink and answer a click.

The reader picks a body font colour in Settings → Font; the task title paints
with it. The two title actions and their separator now take the same ink, so
the trio no longer breaks away in the theme's submit blue. The marks keep the
shapes the reader already chose (the top hidden bar is not touched at all);
only the ink and the press feedback are new.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"


def symbol(index: str, name: str) -> str:
    body = index.split(f'<symbol id="{name}"', 1)[1]
    return body.split("</symbol>", 1)[0]


def rule(style: str, selector: str) -> str:
    return style.split(selector, 1)[1].split("}", 1)[0]


def main() -> int:
    index = (WEB / "index.html").read_text(encoding="utf-8")
    style = (WEB / "style.css").read_text(encoding="utf-8")

    # The reader's own top-bar marks are left exactly as they were: the music
    # note, the solid robot, the material gear and the export door.
    assert "M20.8 9.2A9.2 9.2 0 1 0 15.4 20.6" in symbol(index, "music")
    robot = symbol(index, "robot-agent")
    assert 'viewBox="0 0 1024 1024"' in robot and "<rect" not in robot
    assert 'fill="currentColor"' in symbol(index, "gear")
    assert 'viewBox="0 0 1024 1024"' in symbol(index, "exit")

    # The title's two document marks keep their shapes too.
    assert 'x="4.4" y="2.4" width="15.2" height="19.2"' in symbol(index, "complete-action")
    assert "M6 2.6h8.6l4.9 4.9v13.9H6Z" in symbol(index, "add-action")

    # Complete / slash / add paint with --pc-ink (the title's font colour, and
    # the same token Settings → Font writes) instead of --submit-color.
    ink = rule(style, "html[data-theme] .head-title-inner .current-action,\nhtml[data-theme] .head-title-inner .action-slash")
    assert "color: var(--pc-ink, var(--ink))" in ink
    assert "text-decoration-color: var(--pc-ink, var(--ink))" in ink
    assert style.count("color: var(--pc-ink, var(--ink))") >= 1

    # Press feedback: the button sinks, leaves an ink wash on hover/press, and
    # the separator dims while either action is held.
    icon = rule(style, "html[data-theme] .head-title-inner .current-action.icon-action")
    assert "transition: transform" in icon
    assert "border-radius: 50%" in icon
    assert "background: currentColor" in style.split(
        "html[data-theme] .head-title-inner .current-action.icon-action::after", 1
    )[1].split("}", 1)[0]
    assert "transform: scale(0.88)" in rule(
        style, "html[data-theme] .head-title-inner .current-action.icon-action:active"
    )
    assert "opacity: 0.18" in rule(
        style, "html[data-theme] .head-title-inner .current-action.icon-action:active::after"
    )
    assert "opacity: 0.5" in rule(
        style, "html[data-theme] .head-title-inner .current-actions:active .action-slash"
    )

    print("Title actions: complete / slash / add share the font ink and press as one")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
