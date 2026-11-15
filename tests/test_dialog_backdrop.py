"""Dialogs open over an unchanged notebook, the same way Settings does.

The prompt/confirm scroll used to dim the app and frost everything behind it.
Settings, Community and the achievement sheet already paint straight onto the
page with no veil and no backdrop blur, so a dialog must do the same: when it
pops up the background stays exactly as it was.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def modal_backdrop_blocks(css: str) -> list[str]:
    blocks = [
        re.sub(r"\s+", " ", body).strip()
        for body in re.findall(r"\.modal-backdrop \{(.*?)\}", css, re.S)
    ]
    assert blocks, "missing .modal-backdrop rules"
    return blocks


def main() -> int:
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    for body in modal_backdrop_blocks(css):
        # No frost anywhere, including the RPG scroll override further down.
        assert "blur(" not in body, body
        if "!important" not in body:
            assert "background: transparent;" in body, body
            assert "backdrop-filter: none;" in body, body
            assert "rgba(" not in body, body

    # The shared no-dim block keeps every theme's dialog backdrop clear too.
    no_dim = css.split("/* Settings, Community and achievement sheets", 1)[1]
    no_dim = no_dim.split("}", 1)[0]
    for selector in (
        ".modal-backdrop",
        'html[data-theme="lavender"] .modal-backdrop',
        'html[data-theme="postcard"] .modal-backdrop',
    ):
        assert selector in no_dim, selector
    assert "background: transparent !important;" in no_dim
    assert "backdrop-filter: none !important;" in no_dim

    print("Dialog backdrops stay clear; the notebook does not dim or blur")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
