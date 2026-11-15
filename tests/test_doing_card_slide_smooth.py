"""The right-border Doing card slides without relayouting the page.

Pulling the card is direct manipulation: the pointer moves it, so the card must
follow at the compositor's pace. The old pull wrote `panel.style.left` on every
pointermove. Every write invalidated layout for a fixed element that carries a
four-layer drop shadow and a wallpaper pane, and the page-wide pointer handlers
then measured themselves again in the same frame (a forced reflow per event) —
that is the stutter.

The pull now moves the card with its own composited `translate` variable, at
most once per animation frame. `left` is committed exactly once, on release.
The drop glide is the same translate going to zero, so neither the pull nor the
snap animates `left`. Nothing else may measure the page while a pull is live.

The rows themselves no longer bob near the pointer either: the "piano" wobble
is gone, so a scroll only plays the list's paper wind.

This test pins those rules in place; the gesture's behaviour (the card lands on
the nearer border, a plain click stays a click) is unchanged.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    # --- the pull moves on the compositor, once per frame -------------------
    move = app_js.split("function moveDoingDrag(", 1)[1].split(
        "function endDoingDrag(", 1
    )[0]
    assert "doingDragX = left - doingDrag.startLeft;" in move, (
        "the pull's distance belongs to the composited offset"
    )
    assert "requestAnimationFrame(flushDoingDragFrame)" in move, (
        "pointer events arrive faster than frames: move the card once per frame"
    )
    assert "panel.style.left" not in move, (
        "writing left per pointermove was the stutter: it relayouts the page"
    )
    assert "panel.style.right" not in move

    flush = app_js.split("function flushDoingDragFrame()", 1)[1].split(
        "function cancelDoingDragFrame(", 1
    )[0]
    assert 'setProperty("--doing-drag-x"' in flush, (
        "the frame writes only the translate variable"
    )
    assert "getBoundingClientRect" not in flush, "a frame must not measure layout"
    assert "panel.style.left" not in flush

    # --- the landing box is committed once, the glide is a translate -------
    end = app_js.split("function endDoingDrag(", 1)[1].split(
        "function finishDoingDrag(", 1
    )[0]
    assert "const targetLeft =" in end, "the drop resolves the landing box first"
    assert end.count("panel.style.left") == 2, (
        "left is committed once for the glide and once for a cancelled pull"
    )
    assert "void panel.offsetWidth" in end, (
        "the committed box must reach the style system before the transition"
    )
    assert end.index("`${slack}px`") < end.index('classList.add("doing-snapping")'), (
        "the drop point must be the transition's starting value; switching the "
        "snapping rule on first would glide up from zero and jump on the spot"
    )
    assert end.index('classList.add("doing-snapping")') < end.index("requestAnimationFrame(() =>"), (
        "the glide starts only after the snapping rule owns the offset"
    )
    assert 'requestAnimationFrame(() => panel.style.setProperty("--doing-drag-x", "0px"))' in end, (
        "the glide is the offset going to zero on the compositor"
    )
    assert "panel.style.removeProperty(\"--doing-drag-x\");" in end, (
        "the offset must be dropped once the card sits on its border"
    )
    assert "if (doingDrag) return;" in end, (
        "a new pull owns the offset and the frame budget; the old glide's timer "
        "must stand down"
    )
    assert "if (doingDrag)" in app_js.split("function updateDoingPeek(", 1)[1].split(
        "const entries = doingEntries();", 1
    )[0], "a polling tick must not rebuild the card mid-pull"

    # --- CSS: the pull and its glide are composited -----------------------
    dragging = css.split(".doing-peek.doing-dragging,", 1)[1].split("}", 1)[0]
    assert "transition: none !important;" in dragging
    assert "translate: var(--doing-drag-x, 0px)" in dragging, (
        "the pull is a composited translate, not a left write"
    )
    assert "will-change: transform;" in dragging, "the card must own a layer while pulled"

    snapping = css.split(".doing-peek.doing-snapping,", 1)[1].split("}", 1)[0]
    assert "translate: var(--doing-drag-x, 0px)" in snapping
    assert "translate 0.3s" in snapping, "the drop glides on the compositor"
    assert "left 0.3s" not in snapping, (
        "animating left would relayout (and repaint the shadow) every frame"
    )

    # --- nothing else measures the page while a pull is live ---------------
    pointer = app_js.split("const processDoingPointer = () => {", 1)[1].split(
        "  window.addEventListener(\"resize\"", 1
    )[0]
    assert "if (doingDrag) return;" in pointer, (
        "the Doing hover strip must not re-measure the column during a pull"
    )
    assert "if (doingDrag) { noteSwipeLastY = event.clientY; return; }" in app_js, (
        "the note swipe must not measure its line during a pull"
    )
    # --- the rows no longer wobble under the pointer ----------------------
    card = app_js.split("function bindDoingCard(", 1)[1].split(
        "function animateDoingReorder(", 1
    )[0]
    assert "AudioFX.cardWind()" in card, "a scroll keeps its paper wind"
    assert "translateY" not in card, "the piano wobble is gone: rows stay still"
    assert "pointermove" not in card, "rows must not follow the pointer"
    assert "requestAnimationFrame" not in card, "no per-frame row animation"

    print("the Doing card slides on one composited layer per pull")
    return 0


if __name__ == "__main__":
    sys.exit(main())
