"""The title actions and the hidden top bar take mapped accent inks.

The reader picks a body font colour in Settings → Font. Neither the complete /
slash / add trio nor the hidden top bar repeats that colour: app.js walks the
colour wheel from the font ink, giving the trio the counter-note half a turn
away and the top bar the split-complement 30° nearer. The marks themselves —
including every icon the reader already chose — stay untouched; only the inks
and the press feedback live here.
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
    app_js = (WEB / "app.js").read_text(encoding="utf-8")

    # Every mark the reader chose keeps its shape: the top bar keeps the note,
    # the solid robot, the material gear and the export door; the title keeps
    # its two document icons.
    assert "M20.8 9.2A9.2 9.2 0 1 0 15.4 20.6" in symbol(index, "music")
    robot = symbol(index, "robot-agent")
    assert 'viewBox="0 0 1024 1024"' in robot and "<rect" not in robot
    assert 'fill="currentColor"' in symbol(index, "gear")
    assert 'viewBox="0 0 1024 1024"' in symbol(index, "exit")
    assert 'x="4.4" y="2.4" width="15.2" height="19.2"' in symbol(index, "complete-action")
    assert "M6 2.6h8.6l4.9 4.9v13.9H6Z" in symbol(index, "add-action")

    # A hue map, not a copy of the font ink. Neutral inks anchor on a warm hue.
    accents = app_js.split("function inkAccents(value)", 1)[1].split("\n}", 1)[0]
    # Warm inks answer in cool marks, cool inks in warm marks.
    assert "const warmInk = base < 75 || base > 285;" in accents
    assert "warmInk ? 196 + spread * 24 : 8 + spread * 22" in accents
    assert "warmInk ? actionHue - 30 : actionHue + 28" in accents
    assert "s < 0.16 ? 24 : h" in accents
    assert "hslToHex" in app_js and "hexToHsl" in app_js

    # applyFontSettings publishes the pair on every font-colour change.
    font_body = app_js.split("function applyFontSettings()", 1)[1].split("\n}", 1)[0]
    assert '"--action-ink", accents.action' in font_body
    assert '"--utility-ink", accents.utility' in font_body

    # The ink is only colour: no geometry rules for the marks.
    actions = rule(style, "html[data-theme] .head-title-inner .current-action,\nhtml[data-theme] .head-title-inner .action-slash")
    assert "color: var(--action-ink, var(--pc-accent))" in actions
    utilities = rule(style, "html[data-theme] .top-tools .sound-toggle,\nhtml[data-theme] .top-tools .settings-button,\nhtml[data-theme] .top-tools .exit-button")
    assert "color: var(--utility-ink, var(--pc-accent))" in utilities
    assert ".top-tools .agent-settings-button { color: var(--utility-ink, var(--gold)); }" in style

    # Press feedback: the button sinks, leaves an ink wash on hover/press, and
    # the separator dims while either action is held.
    icon = rule(style, "html[data-theme] .head-title-inner .current-action.icon-action")
    assert "transition: transform" in icon
    assert "background: currentColor" in style.split(
        "html[data-theme] .head-title-inner .current-action.icon-action::after", 1
    )[1].split("}", 1)[0]
    assert "transform: scale(0.88)" in rule(
        style, "html[data-theme] .head-title-inner .current-action.icon-action:active"
    )
    assert "opacity: 0.5" in rule(
        style, "html[data-theme] .head-title-inner .current-actions:active .action-slash"
    )

    print("Mapped inks: title actions and top bar contrast the font colour")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
