"""The note caret starts on line one, and a key press carries like a real board.

Two reader reports live here:

* Opening the note left the caret off the first line. The sheet rises by
  changing its box, and a caret placed mid-rise kept the stale offsets; the
  typewriter centre could also scroll a short note that had nowhere to
  scroll. Opening now focuses the first block after the rise and re-seats the
  caret, and the centre refuses to scroll a page that fits.
* Typing was inaudible in a public room. The typing cue is mixed 2.7x hotter
  than the rest of the foley, while background music keeps its own level.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def main() -> int:
    app_js = read("web/app.js")

    # A short note never scrolls itself away from the first line.
    assert "if (scroller.scrollHeight <= scroller.clientHeight + 1) return;" in app_js
    # Opening the sheet hands the caret to the first block once it has risen.
    assert "focusActiveNoteEditor();" in app_js
    assert "setTimeout(() => settleNoteCaret(editor), 30);" in app_js
    # A layout animation ends with the caret placed again.
    assert 'panel.addEventListener("animationend", reseat);' in app_js
    assert 'panel.addEventListener("transitionend", reseat);' in app_js
    # The pane's box is tracked even when GTK skips the window resize event.
    assert "new ResizeObserver(() => {" in app_js

    # Blue-switch loudness for the typing cue only.
    assert "const KEY_GAIN = 2.7;" in app_js
    assert 'playSample("type", 0.44 * KEY_GAIN,' in app_js
    assert "0.045 * KEY_GAIN" in app_js
    # The music player keeps its own volume path.
    assert "audio.volume = 0.55;" in app_js

    index = read("web/index.html")
    drawer = index.split('<aside class="trash-drawer"', 1)[1].split("</aside>", 1)[0]
    assert "plain-x" not in drawer, "the hat card grew its close cross back"
    assert "<small>" not in drawer, "the hat card kept its hint line"
    assert 'data-action="clear-trash"' in drawer
    assert 'aria-expanded="false" aria-controls="trash-drawer"' in index

    # The hat is the card's switch.
    assert "if (trashOpen) closeTrashDrawer();" in app_js
    assert 'setAttribute("aria-expanded", "true")' in app_js
    assert 'setAttribute("aria-expanded", "false")' in app_js

    style = read("web/style.css")
    broom = style.split(".trash-clear {", 1)[1].split("}", 1)[0]
    assert "border: 1.5px solid var(--pc-accent" in broom, "the broom still wears the grey line"
    assert "fill: currentColor;" in style

    print("the note caret starts on line one and the keys are loud")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
