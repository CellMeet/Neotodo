"""The note and AI sheets reach the whole window, with both ends magnetised.

The two door drags used to stop on the page baseline under the task block: the
stylesheets capped every sheet at the desk height, so a sheet could never cover
the task rows. The range became the page body, and now it is the whole window:
a sheet can be pulled over the title row and the logo bar too.

  - the rise      above the page body a sheet has a negative top; the page and
                  its body hand their clipping over while one is risen, so the
                  title row and the logo bar are not cut off;
  - the magnet    the row under the logo bar fills the strip above in one cut:
                  entering it puts the edge on the window top, so "full" is the
                  whole window and not a pixel hunt at the top border;
  - the floor     a sheet never shrinks past one ruled row. Pulling below it
                  compresses a short, resisted overshoot and the drop releases
                  it (`applyResize(g.lastRest - g.startTop)`), so the edge
                  springs back onto the row instead of stopping dead.

These checks keep that range and both magnets on the shared helper instead of
letting each gesture grow its own numbers again.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    handles = (ROOT / "web" / "handle-position.js").read_text(encoding="utf-8")
    ai = (ROOT / "web" / "ai-handle.js").read_text(encoding="utf-8")
    note = (ROOT / "web" / "note-handle.js").read_text(encoding="utf-8")
    layout = (ROOT / "web" / "page-layout.css").read_text(encoding="utf-8")

    # --- one shared range for both sheets ----------------------------------
    assert "function pageRuledRow()" in handles
    assert '"--page-line-row"' in handles, "the floor must follow the ruled row"
    assert "function doorRestTop(footTop, row = pageRuledRow())" in handles
    assert "function pageRiseSpan()" in handles, "the room above the page body is not measured"
    assert "function pageRiseEdge(desk)" in handles, "the window top is not measured"

    # The region above the page body is the title row plus the logo bar, so the
    # magnet sits on the row under the logo and the limit is the window top.
    rise = handles.split("function pageRiseEdge(", 1)[1].split("\n}", 1)[0]
    assert 'querySelector(".notebook-head")' in rise
    assert "magnet: Math.min(0, logoBottom - pageTop)" in rise
    assert "limit: -Math.max(0, pageTop)" in rise

    # The logo row is a magnet: reaching it fills the strip above in one cut,
    # and the edge can never paint past the window top.
    edge = handles.split("function doorEdgeTop(", 1)[1].split("\n}", 1)[0]
    assert "if (top <= Math.round(rise.magnet)) return { top: limit, compressed: false };" in edge
    assert "if (top < limit) return { top: limit, compressed: false };" in edge
    # The floor is a spring: a quarter of the pull, never more than half a row.
    assert "const overshoot = Math.min(rowHeight / 2, (top - rest) * 0.25);" in edge
    assert "compressed: true" in edge

    # A risen sheet is what lets the page stop clipping; the state is owned by
    # the rendered boxes, never by a stored height.
    assert "let sheetRisen = false;" in handles
    assert "function setSheetRisen(on)" in handles
    assert "document.body.classList.toggle(\"sheet-risen\", next);" in handles
    assert "function syncSheetRise()" in handles
    assert "return panel.offsetTop < 0;" in handles
    assert "syncSheetRise();" in handles.split("function positionDeskHandles()", 1)[1][:900]
    assert 'style.setProperty("--page-rise-h"' in handles

    # --- the AI card -------------------------------------------------------
    assert "rise: pageRiseEdge(desk)," in ai
    assert "const edge = doorEdgeTop(g.startTop + dy, rest, g.row, g.rise);" in ai
    assert "if (edge.top < 0) setSheetRisen(true);" in ai
    # A drop from the overshoot settles on the resting row, so the saved box is
    # the resting one and not the rubber band.
    assert "if (g.resizing && g.compressed && g.lastRest != null) {" in ai
    assert "applyResize(g.lastRest - g.startTop);" in ai
    # The old 28%-of-the-desk minimum is gone: it is what stopped the card from
    # ever reaching the bottom row.
    assert "g.minHeight" not in ai
    assert "0.28" not in ai

    # --- the note sheet ----------------------------------------------------
    assert "rise: pageRiseEdge(desk)," in note
    assert "const edge = doorEdgeTop(g.startTop + dy, rest, g.row, g.rise);" in note
    assert "if (edge.top < 0) setSheetRisen(true);" in note
    assert "if (g.resizing && g.compressed && g.lastRest != null) {" in note
    assert "applyResize(g.lastRest - g.startTop);" in note
    assert "g.minHeight" not in note
    # A closed door still opens at the shortest sheet, which is one row.
    assert "g.startTop = doorRestTop(g.desk.height, g.row);" in note
    # A stored one-row height survives the restore pass, and a risen box is
    # restored with its negative top instead of being pushed back to 0.
    assert "const minSheetHeight = () => Math.max(1, Math.round(pageRuledRow()));" in note
    assert "const maxSheetHeight = () => deskHeight() + pageRiseSpan();" in note
    assert "Math.max(-rise, desk - height)" in note

    # --- the stylesheet ceiling is the window, not the desk -----------------
    head = layout.split(":root {", 1)[1].split("}", 1)[0]
    assert "calc(100% + var(--page-rise-h, 0px))" in head, (
        "the AI card's restored height cannot reach the window top"
    )
    base = layout.split(".page-body > #notes-half,\n.page-body > #agent-terminal {", 1)[1]
    base = base.split("}", 1)[0]
    assert "max-height: calc(100% + var(--page-rise-h, 0px));" in base
    # Only a risen sheet may paint over the header.
    risen = layout.split("html body.sheet-risen .page,", 1)[1].split("}", 1)[0]
    assert "overflow: visible !important;" in risen
    # The note keeps its own variable (the two sheets never share a height).
    assert "--page-note-h: min(var(--notes-sheet-height, var(--page-desk-h)), var(--page-desk-h));" in layout

    assert layout.count("{") == layout.count("}"), "the stylesheet is unbalanced"
    print("the note and AI sheets span the window, over the title row and logo bar")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
