"""The left plugin shelf reopens on the plugin the reader left in the middle.

The rail remembers its position in localStorage, but the old build stored a
bare pixel offset. Bundled and community plugin rows mount asynchronously and
a disabled plugin can disappear between launches, so that offset could point at
a different icon. Worse, a short-lived non-scrollable shelf during boot forced
``scrollTop`` back to 0 and the scroll listener wrote that 0 over the saved
position, so the next launch started from the top again.

The rail now stores the facing row's stable key (plugin/action) as well as the
offset, restores by that key, and only a real move by the reader may replace
the record.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def block(source: str, start: str, end: str) -> str:
    assert start in source, f"missing block: {start}"
    return source.split(start, 1)[1].split(end, 1)[0]


def main() -> int:
    js = (ROOT / "web" / "tool-rail-scroll.js").read_text(encoding="utf-8")

    # --- the stored record carries the row, not only pixels ----------------
    assert 'const STORAGE_KEY = "neotodo:toolRailScroll";' in js
    read = block(js, "function readRemembered() {", "function writeRemembered(record) {")
    assert "JSON.parse(raw)" in read, "the row record is never parsed"
    assert 'typeof parsed.row === "string"' in read
    assert "Number(raw) || 0" in read, "the legacy pixel offset is no longer understood"

    write = block(js, "function writeRemembered(record) {", "function scheduleSave()")
    assert "JSON.stringify({" in write
    assert "row: record.row" in write, "the row key is not written to storage"

    # --- the row key is stable across plugin re-renders --------------------
    key = block(js, "function rowKey(node) {", "function centredRowKey() {")
    assert "node.dataset.plugin" in key, "plugin rows must be keyed by plugin id"
    assert "node.dataset.action" in key, "action rows must be keyed by action"
    assert "aria-label" in key, "plain rows need a label fallback"

    centre = block(js, "function nearestRowKey(top) {", "function centredRowKey() {")
    assert "drum.half" in centre and "Math.abs(item.center - centre)" in centre, (
        "the saved row must be the one facing the middle of the glass"
    )
    assert "return nearestRowKey(rail.scrollTop)" in js, (
        "the current row must be read from the live scroll offset"
    )

    # --- restoring prefers the row ----------------------------------------
    restore = block(js, "function applyRemembered(max = maxScroll()) {", "// -------------------------------------------------------------- scrolling ---")
    assert "rowKey(item.node) === savedScroll.row" in restore, (
        "the saved row is not looked up on launch"
    )
    assert "item.center - drum.half" in restore, (
        "the row is not centred in the five-row window"
    )
    assert "clamp(savedScroll.top, 0, max)" in restore, (
        "a row that went away must fall back to the remembered offset"
    )
    assert "nearestRowKey(top) !== savedScroll.row" in restore, (
        "an unchanged plugin list must keep its exact sub-row offset"
    )

    # --- only a real move is written back ----------------------------------
    save = block(js, "function saveNow() {", "function maxScroll() {")
    assert "if (!userMoved) return;" in save, (
        "a programmatic restore (or a collapsed shelf) must not overwrite the row"
    )
    assert "if (maxScroll() <= 0) return;" in save
    assert "row: centredRowKey()" in save

    scroll = block(
        js,
        'rail.addEventListener("scroll", () => {',
        '}, { passive: true });',
    )
    assert "if (userMoved && maxScroll() > 0) scheduleSave();" in scroll, (
        "programmatic scroll events used to save the position, which reset the rail"
    )
    assert "remembered = rail.scrollTop" not in js, (
        "the old unconditional pixel sync is still there"
    )

    # --- a wheel/keyboard move is marked as a real move --------------------
    wheel = block(js, 'rail.addEventListener("wheel", (event) => {', '}, { passive: false });')
    assert "userMoved = true;" in wheel
    keys = block(js, 'rail.addEventListener("keydown", (event) => {', "});")
    assert "ArrowUp" in keys and "PageDown" in keys and "Home" in keys

    # --- quitting writes the settled row -----------------------------------
    assert 'window.addEventListener("pagehide", saveNow);' in js
    assert 'window.addEventListener("beforeunload", saveNow);' in js

    print("the left plugin shelf restores the plugin row left in the middle")
    return 0


if __name__ == "__main__":
    sys.exit(main())
