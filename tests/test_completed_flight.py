"""A finished subtask glides into the completed tray instead of jumping there.

The row used to be animated on the real element, inside the finished-subtasks
card — but the drawer and the lane inside it both clip their children, so the
path was cut off at the card edge. What the reader saw was: the row vanishes
from the pending lane, the rows below snap up a frame later, and the finished
row is already sitting in the tray.

The flight is now drawn on a ghost pinned to the page, the landing card is held
still while the row travels, and the gap left behind closes in the same beat.
The Doing card is the upper sheet of the pile, not a hand that shoves the
finished card aside: sliding it out must never move that card off its column.
The finished tray and the Doing drawer are independent cards, so the drawer is
still reachable while the tray is open and slides out above it.
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
    stack_css = (ROOT / "web" / "card-stack.css").read_text(encoding="utf-8")

    # --- the flight is drawn outside the cards that clip --------------------
    fly = block_after(app_js, "function flyCompletedRow(", "\nfunction renderStage(")
    assert "prefers-reduced-motion: reduce" in fly, "the flight ignores reduced motion"
    assert "const ghost = (sourceRow || row).cloneNode(true);" in fly, (
        "the flight no longer reuses the row's own paper"
    )
    assert "document.body.appendChild(ghost)" in fly, (
        "the flying row is still trapped inside the clipping card"
    )
    assert 'ghost.classList.add("subtask-flight")' in fly
    assert "risingSubtaskPaper = row.cloneNode(true)" in app_js, (
        "the row's own paper is not kept for the flight"
    )
    assert 'row.style.visibility = "hidden"' in fly, "the landed row must not show twice"
    assert 'row.style.visibility = ""' in fly, "the real row never comes back after landing"
    # The flight only translates and clips the ghost: animating `width` would
    # lay the row out again on every frame (the source of the stutter).
    assert "const clipRight = Math.max(0, originRect.width - landedRect.width);" in fly
    assert 'clipPath: "inset(0 0 0 0)"' in fly
    assert "clipPath: `inset(0 ${clipRight}px ${clipBottom}px 0)`" in fly
    assert "ghost.style.width = `${originRect.width}px`" in fly, "the ghost keeps its pending width"
    assert "width: `${landedRect.width}px`" not in fly, (
        "the flight still animates width, which lays the row out every frame"
    )
    assert "flight.onfinish = settle;" in fly and "flight.oncancel = settle;" in fly
    assert 'row.style.visibility = "";' in fly and "row.isConnected" in fly
    assert 'check.classList.add("check-in");' in fly, (
        "the check is written while the row is still invisible"
    )
    assert '[{ transform: "scale(1.01)" }, { transform: "none" }]' in fly, (
        "the row appears in the tray without settling"
    )
    # The click answers immediately instead of waiting for the backend.
    assert 'classList.add("subtask-completing")' in app_js
    assert ".current-subtask.subtask-completing" in split_css

    # --- only the row's paper travels: never the accent wash ----------------
    # The pending lane's wash marks where the reader is working. A ghost that
    # kept it dragged a coloured block across the page and handed it to the
    # finished card; the flight must carry the line, fan and name only.
    assert 'ghost.classList.remove("subtask-completing", "selected", "agent-running");' in fly, (
        "the flight still carries the selected row's accent wash"
    )
    wash_guard = block_after(split_css, ".subtask-flight,\n.subtask-flight.selected,", "}")
    assert "background: none !important;" in wash_guard, (
        "a theme wash can still paint the flying row"
    )
    assert "box-shadow: none !important;" in wash_guard
    assert ".subtask-flight::before," in split_css and ".subtask-flight::after {" in split_css, (
        "a pseudo-element wash can still travel with the row"
    )
    # The selection must not follow the row into the finished tray either: that
    # is the same wash, just arriving after the flight instead of during it.
    complete = block_after(
        app_js,
        'if (actionName === "complete-subtask") {',
        'if (actionName === "remove-samples")',
    )
    assert "const wasSelected = selectedSubtaskId === subtaskId;" in complete
    assert "if (wasSelected) selectedSubtaskId = null;" in complete, (
        "the finished row keeps the accent wash in the tray"
    )
    assert "if (wasSelected) selectedSubtaskId = subtaskId;" in complete, (
        "a failed completion would lose the reader's selection"
    )

    # --- the stage wiring: held card, real landing box, one beat ------------
    rising = block_after(app_js, "  if (risingSubtaskId) {\n    justCompletedSubtaskId = null;", "\n  setupNotesPanel();")
    assert 'doneLane.scrollTop = 0;' in rising, "the tray could still scroll under the landing row"
    assert 'drawer.classList.add("flight-target")' in rising, (
        "the opening card still slides through the landing spot"
    )
    assert "flyCompletedRow(flipped, originRect, landedRect, completionFlightMs, risingSubtaskPaper)" in rising
    assert "requestAnimationFrame" not in rising, (
        "the gap still closes a frame after the row leaves"
    )
    assert "row.animate(" in rising and 'duration: 320' in rising
    # The Doing card is rebuilt only after the row has landed: a full rebuild in
    # the flight's first frames is what stole them.
    after = block_after(app_js, "  setupNotesPanel();", "\n  const freshReel")
    assert "setTimeout(updateDoingPeek, completionFlightMs + 40)" in after, (
        "the Doing card still rebuilds during the flight"
    )
    assert "completionFlightUntil = performance.now() + completionFlightMs + 60;" in rising

    # --- the reader's scroll is restored before the flight is measured ------
    lane_restore = block_after(
        app_js,
        "  // Put the reader's scroll back before anything is measured.",
        "  // How long the finished row spends in the air this pass.",
    )
    assert 'if (lane.dataset.lane === "done")' in lane_restore
    assert "lane.scrollTop = previous;" in lane_restore, (
        "the pending lane is still restored a frame after the flight starts"
    )

    # --- the closed AI sheet never forces a layout inside the flight --------
    agent_defer = block_after(
        app_js,
        "  // With the AI sheet closed its element was carried over untouched",
        "  restoreAgentScroll(liveAgentScroll);",
    )
    assert "if (risingSubtaskId && !agentTerminalOpen)" in agent_defer
    assert "setTimeout(() => {" in agent_defer and "renderAgentTerminal();" in agent_defer
    assert "COMPLETED_ROW_FLIGHT_MS + 120" in agent_defer, (
        "the closed AI sheet is still laid out in the flight's first frame"
    )

    # --- heavy card work waits for the landing ------------------------------
    prime = block_after(app_js, "function primeSubcardPapers()", "\nfunction schedulePrimeSubcardPapers(")
    assert "const flightLeft = completionFlightUntil - performance.now();" in prime
    assert "schedulePrimeSubcardPapers(flightLeft + 40);" in prime, (
        "wallpaper baking still runs while the row is in the air"
    )
    stage_tail = block_after(app_js, "  // The stage owns the finished-subtasks card", "\n}\n")
    assert 'syncCardWallpaper($("#completed-subtask-drawer"), { bakedOnly: true });' in stage_tail
    assert "setTimeout(syncCardWallpapers, completionFlightMs + 40);" in stage_tail, (
        "every card still repaints during the flight"
    )

    # --- the Doing card never rebuilds or realigns the finished card --------
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
    assert "function syncCardWallpaper(host, { bakedOnly = false } = {})" in app_js
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

    # --- CSS: the held card and the page-level ghost ------------------------
    assert ".completed-subtask-drawer.flight-target," in split_css
    assert ".completed-subtask-drawer.flight-target.open {" in split_css
    held = block_after(split_css, ".completed-subtask-drawer.flight-target.open {", "}")
    assert "transform: none;" in held
    assert "transition: opacity 0.16s ease;" in held
    assert ".subtask-flight {" in split_css
    ghost_css = block_after(split_css, ".subtask-flight {", "}")
    assert "position: fixed;" in ghost_css and "pointer-events: none;" in ghost_css

    # --- the Doing card does not shove the finished card aside --------------
    press_aside = [
        line for line in stack_css.splitlines()
        if "completed-subtask-drawer" in line and "{" in line and "doing-peek-open" in line
    ]
    assert not press_aside, "opening the Doing card still offsets the finished card"
    assert "translateX(calc(-1 * min(150px, 11vw)))" not in stack_css

    print("the finished row glides into the tray, and both cards stay usable")
    return 0


if __name__ == "__main__":
    sys.exit(main())
