"""Verify the provider/model SVGs used by the fan badge.

Every mark must be present, non-empty, and painted only with the page ink
(`currentColor`). A hard-coded grey fill used to show up as a grey plate in the
subtask row, so any painted fixed colour is treated as a regression.
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
    print(f"{len(ICONS)} model icons passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
