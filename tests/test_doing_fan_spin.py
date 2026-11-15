"""The Doing card keeps its todo list; the fan of working work turns.

The right-edge card stays the plain todo index it has always been: open todos,
expand one to read its pending subtasks. There is no second region above it.
The one addition is motion: a subtask being worked on by an agent marks its row
`agent-running`, and that row's fan turns at exactly the pace of the subtask
column — the shared startFanSpin() ramp — then rests when the run ends.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    # The card is the todo list again: no separate live lane, no extracted row
    # markup, no lifted-feed bookkeeping.
    assert "doing-live" not in app_js
    assert "doing-live" not in css
    assert "function doingLiveRows(" not in app_js
    assert "function doingLiveRowHtml(" not in app_js
    assert "scheduleDoingLiveExpiry(" not in app_js
    assert "DOING_LIVE_FINISHED_MS" not in app_js

    markup = app_js.split("function doingPeekMarkup(", 1)[1].split("function doingPeekStateKey(", 1)[0]
    assert 'class="doing-list"' in markup
    assert "doingTodoHtml" in markup
    assert "doing-kicker" in markup

    # A running subtask row carries the mark; its fan is the shared stand+rotor
    # pair, so the wheel can turn while the stand stays put.
    sub = app_js.split("function doingSubtaskHtml(", 1)[1].split("function doingTodoHtml(", 1)[0]
    assert "agentIsRunning(`subtask:${subtask.id}`)" in sub
    assert '? "agent-running" : ""' in sub
    assert 'doingFanStackHtml()' in sub
    stack = app_js.split("function doingFanStackHtml(", 1)[1].split("function doingSubtaskHtml(", 1)[0]
    assert "fan-static" in stack
    assert "fan-rotor" in stack

    # The spin uses the subtask column's own ramp, so both fans turn at one
    # pace; a tucked-away card keeps its wheels still and stops them on close.
    spin = app_js.split("function syncDoingFanSpins(", 1)[1].split("function updateDoingPeek(", 1)[0]
    assert 'list.querySelectorAll(".doing-sub .fan-rotor")' in spin
    assert 'row?.classList.contains("agent-running")' in spin
    assert "startFanSpin(rotor)" in spin
    assert "stopFanSpin(rotor)" in spin
    assert "syncDoingFanSpins(list, doingPeekOpen);" in app_js
    assert 'syncDoingFanSpins(panel.querySelector(".doing-list"), true);' in app_js
    assert 'syncDoingFanSpins(panel.querySelector(".doing-list"), false);' in app_js
    ramp = app_js.split("function startFanSpin(", 1)[1].split("function stopFanSpin(", 1)[0]
    assert "duration: 320" in ramp

    # The card list is bound as before, and rebuilt rows are rebound.
    assert "function bindDoingCard(list)" in app_js
    assert 'const rows = () => [...list.querySelectorAll(".doing-head, .doing-sub")];' in app_js
    assert "bindDoingCard(list);" in app_js

    # Agent start/stop reaches the card even when the todo's own flag is
    # already true because another subtask is still running.
    key = app_js.split("function doingPeekStateKey(entries)", 1)[1].split("function refreshDoingZone(", 1)[0]
    assert "Object.keys(runningAgentStamps).sort().join" in key

    # The fan base still styles the stand and the wheel used by subtask rows.
    assert ".doing-fan svg" in css
    assert ".fan-stack" in css
    assert ".fan-rotor" in css

    print("the Doing card is a todo list again; working fans turn in place")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
