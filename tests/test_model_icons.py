"""Verify the provider/model SVGs used by the fan badge.

Every mark must be present, non-empty, and painted only with the page ink
(`currentColor`). A hard-coded grey fill used to show up as a grey plate in the
subtask row, so any painted fixed colour is treated as a regression.

The badge is also decorative, never text: if it joins a text selection the
selection wash is painted behind its transparent SVG and reads as a brown tile
the exact size of the icon. The stylesheet must keep the badge out of
selections and paint no selection plate behind it.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ICONS = [
    "deepseek", "openai", "anthropic", "claude", "google", "gemini",
    "openrouter", "ollama", "mistral", "meta", "xai", "qwen",
    "zhipu", "moonshot", "groq", "together", "lobehub",
]

MASK_RE = re.compile(r"<mask\b.*?</mask>", re.S)
FIXED_FILL_RE = re.compile(r'fill="(#[0-9A-Fa-f]{3,8})"')


def painted_fills(markup: str) -> list:
    """Fixed-colour fills that actually paint something.

    Masks only cut holes out of the mark, so their white/black fills never
    reach the paper and are allowed.
    """
    return FIXED_FILL_RE.findall(MASK_RE.sub("", markup))


def main() -> int:
    missing = []
    empty = []
    tinted = {}
    for icon in ICONS:
        path = ROOT / "web" / "model-icons" / f"{icon}.svg"
        if not path.is_file():
            missing.append(icon)
            continue
        if path.stat().st_size < 100:
            empty.append(icon)
            continue
        fills = painted_fills(path.read_text(encoding="utf-8"))
        if fills:
            tinted[icon] = fills
    if missing or empty or tinted:
        print(f"missing: {missing}")
        print(f"empty: {empty}")
        print(f"fixed fills (grey plate): {tinted}")
        return 1

    # A selected row used to leave a brown plate behind the transparent mark.
    style = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
    badge = re.search(r"\.sub-agent-model \{[^}]*\}", style)
    assert badge, "the subtask model badge has no style block"
    assert "user-select: none" in badge.group(0), "the model badge may join a text selection"
    assert "-webkit-user-select: none" in badge.group(0), "WebKit may still select the badge"
    assert re.search(
        r"\.sub-agent-model::selection,\s*\.sub-agent-model img::selection\s*\{[^}]*background:\s*transparent",
        style,
    ), "a selected model badge may paint the brown selection plate again"

    print(f"{len(ICONS)} model icons passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
