"""Submitting a subtask removes it at once; the finished card stays closed.

The completed row used to be cloned onto a page-level ghost and carried across
to the finished card, then the card was opened and retracted on a timer. That
made a submit read as a card travelling into a tray, and the ghost's stripped
background is what was reported as "the submitted subtask's background card
disappears".

A submit is now just the row leaving the live lane. The finished card is a
review sheet: it stays tucked behind its handle line and is opened by the
reader when they want to look at it. Nothing about the completion moves.

The finished row is still printed with its paper in the same repaint, so the
card and its names never separate, whether the card was already open or is
opened later.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def block_after(text: str, marker: str, stop: str) -> str:
    assert marker in text, f"missing marker: {marker}"
    return text.split(marker, 1)[1].split(stop, 1)[0]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    split_css = (ROOT / "web" / "subtask-split.css").read_text(encoding="utf-8")
    page_css = (ROOT / "web" / "page-line.css").read_text(encoding="utf-8")
    stack_css = (ROOT / "web" / "card-stack.css").read_text(encoding="utf-8")

    # --- the submit is a removal, not a trip -------------------------------
    assert "function flyCompletedRow(" not in app_js, "the row still flies across the page"
    assert "function openCompletedDrawerForRow(" not in app_js
    assert "function revealCompletedDrawer(" not in app_js, (
        "the finished card is still animated by the completion"
    )
    assert "subtask-flight" not in app_js, "a page-level ghost can still carry the row"
    assert "subtask-slot-arriving" not in app_js, "the landed row is still held back"
    assert "risingSubtaskPaper" not in app_js, "the row is still cloned for a trip"
    assert "completionFlightMs" not in app_js and "completionFlightUntil" not in app_js
    assert "previousSubtaskRects" not in app_js, "the submit still measures a gap animation"

    # --- the finished card is never opened or retracted by a submit --------
    assert "else if (risingSubtaskId && !newSubtaskView) completedSubtasksOpen = true;" not in app_js, (
        "a submit still pops the finished card open"
    )
    assert "scheduleCompletedSubtasksAutoClose" not in app_js, (
        "the finished card is still put on a retract timer"
    )
    assert "clearCompletedSubtasksAutoClose" not in app_js
    assert "completedSubtasksAutoCloseTimer" not in app_js
    assert "COMPLETED_DRAWER_DWELL_MS" not in app_js
    assert "COMPLETED_DRAWER_DROP_MS" not in app_js

    rising = block_after(
        app_js,
        "  // A completed subtask leaves the live lane in this repaint and that is all.",
        "\n  setupNotesPanel();",
    )
    assert "justCompletedSubtaskId = null;" in rising
    assert 'doneLane.scrollTop = 0;' in rising, "opening the card later would miss the new row"
    assert "row.animate(" not in rising, "the submit still animates the live lane"
    assert "drawer.animate(" not in rising and "revealCompletedDrawer" not in rising

    # --- the card and its words still come from one repaint ----------------
    stage_tail = block_after(app_js, "  // The stage owns the finished-subtasks card", "\n}\n")
    assert "syncCardWallpapers();" in stage_tail, "the cards do not get their paper in the render pass"
    assert "setTimeout(syncCardWallpapers" not in stage_tail, (
        "a card is still left without its face while a completion settles"
    )
    assert "bakedOnly" not in app_js, "the deferred card-paper path still exists"
    prime = block_after(app_js, "function primeSubcardPapers()", "\n}\n")
    assert "completionFlightUntil" not in prime, "baking still waits for a landing"

    # --- the finished card is opened only by its handle line ----------------
    toggle = block_after(app_js, "function toggleCompletedSubtasks(force) {", "\n}\n")
    assert "setCompletedSubtasksOpen(willOpen);" in toggle
    assert "AudioFX.drawer(willOpen);" in toggle
    assert "if (subtask?.done && pluginEnabled(\"completed-drawer\")) {" in app_js
    reveal = block_after(app_js, "if (subtask?.done && pluginEnabled(\"completed-drawer\")) {", "}")
    assert "setCompletedSubtasksOpen(true);" in reveal
    handle = block_after(app_js, "function syncSubtaskHandleLine(", "\n}\n")
    assert 'bar.classList.add("line-reveal");' not in handle, (
        "the finished card's handle still pulls itself out with an animation"
    )
    assert 'bar.classList.toggle("line-hidden", !show);' in handle

    # --- CSS: the finished card is hidden and shown as one sheet -----------
    assert ".subtask-flight" not in split_css and ".subtask-flight" not in page_css
    assert ".current-subtask.subtask-slot-arriving > *" not in split_css
    assert ".completed-subtask-drawer.flight-target" not in split_css
    closed = block_after(split_css, ".completed-subtask-drawer {", "}")
    assert "opacity: 0;" in closed and "visibility: hidden;" in closed, (
        "the card can leave its row visible while the paper is gone"
    )
    assert "transition: none;" in closed, "the finished card still animates open or closed"
    opened = block_after(split_css, ".completed-subtask-drawer.open {", "}")
    assert "opacity: 1;" in opened and "visibility: visible;" in opened and "transform: none;" in opened
    assert "transition: none;" in opened, "the opened finished card still animates"
    # A selected row's wash belongs to the live lane, not to the finished card;
    # the row still leaves that wash behind when it changes cards.
    assert ".subtask-lane .current-subtask.done.selected" in split_css
    assert "if (wasSelected) selectedSubtaskId = null;" in app_js

    # --- the Doing card never rebuilds or realigns the finished card -------
    update = block_after(app_js, "function updateDoingPeek(", "function openDoingPeek(")
    assert "syncCardWallpaper(panel);" in update
    assert "syncCardWallpapers();" not in update, (
        "expanding the Doing card still repaints the finished card"
    )
    assert "settleCardWallpaper(panel" in update
    open_doing = block_after(app_js, "function openDoingPeek()", "function closeDoingPeek(")
    assert "syncCardWallpaper(panel);" in open_doing
    assert "syncCardWallpapers();" not in open_doing, (
        "opening the Doing card still touches the finished card's wallpaper"
    )
    dock = block_after(app_js, "function setDoingDockSide(", "\n}\n")
    assert "syncCardWallpapers();" not in dock
    assert "syncCardWallpaper(panel);" in dock
    assert "function syncCardWallpaper(host) {" in app_js
    assert "function settleCardWallpaper(host, duration = 440)" in app_js

    # --- independent cards: the drawer stays reachable above the tray ------
    assert "if (completedSubtasksOpen && doingPeekOpen) closeDoingPeek();" not in app_js, (
        "opening the finished tray still dismisses the Doing drawer"
    )
    setter = block_after(app_js, "function setCompletedSubtasksOpen(", "\n  const bar")
    assert "if (open && doingPeekOpen) closeDoingPeek();" not in setter, (
        "opening the finished tray still sends the Doing drawer away"
    )
    opener = block_after(app_js, "function openDoingPeek()", "function closeDoingPeek(")
    assert "if (completedSubtasksOpen) return;" not in opener, (
        "the peek can no longer open while the finished card is open"
    )
    assert "|| completedSubtasksOpen;" not in app_js, (
        "hovering the border no longer peeks while the finished card is open"
    )
    assert 'event.target.closest?.("#completed-subtask-drawer")' not in app_js, (
        "sliding across the finished card still blocks the Doing drawer"
    )
    assert 'elementFromPoint?.(doingPeekPoint.x, doingPeekPoint.y)' not in app_js, (
        "the finished card under the pointer still cancels the peek"
    )

    # --- the Doing card does not shove the finished card aside --------------
    press_aside = [
        line for line in stack_css.splitlines()
        if "completed-subtask-drawer" in line and "{" in line and "doing-peek-open" in line
    ]
    assert not press_aside, "opening the Doing card still offsets the finished card"
    assert "translateX(calc(-1 * min(150px, 11vw)))" not in stack_css

    print("a finished subtask disappears at once and the card stays closed until opened")
    return 0


if __name__ == "__main__":
    sys.exit(main())
