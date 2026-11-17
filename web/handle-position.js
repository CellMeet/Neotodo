/* ==========================================================================
   HANDLE POSITION — shared layout only.
   --------------------------------------------------------------------------
   This file owns where the two door lines sit, how they vanish/reappear and
   how a closed line tucks under the bottom border. This file also holds
   the two shared drag flags — "a sheet is being resized" and "this line
   belongs to its gesture" — so the layout pass never fights the pointer, but
   it contains NO gesture math; the AI and the note each have their own
   gesture file:
       ai-handle.js    -> only .desk-handle-ai
       note-handle.js  -> only .notes-handle-bottom
   ========================================================================== */

let deskHandleSwipeSuppress = 0;

// Timestamp of the last time a panel was opened or moved. A hover pass right
// after that must not toggle a door: the line itself has just jumped to a new
// slot, and the same pointer position would read as a crossing. Opening or
// moving a panel calls protectDeskHandles(420).
let deskHandleProtectUntil = 0;
function protectDeskHandles(ms = 420) {
  deskHandleProtectUntil = performance.now() + ms;
}

// A plain flag, not a body class. A class toggle on <body> makes the engine
// re-match every `body.x ...` rule in the sheet — a page-wide invalidation
// once when the drag starts and again when it ends. The flag is read by one
// attribute selector (the top band stands down during a pull), which is a
// single match instead of that page-wide pass.
function setDeskHandleResizing(on) {
  if (on) {
    document.body.dataset.deskHandleResizing = "1";
    // The door drag owns the pointer: never leave the utility bar out over a
    // sheet that is being pulled through the top strip.
    document.body.classList.remove("top-tools-open");
  } else {
    delete document.body.dataset.deskHandleResizing;
  }
}
function deskHandleResizing() {
  return document.body.dataset.deskHandleResizing === "1";
}

// Pointer is in the bottom strip (or the closed line is latched there). This
// used to be a body class no stylesheet used; the class toggle alone re-matched
// every `body.x ...` rule on the page, which is a hitch right where a closed
// door is grabbed.
let deskStripHover = false;
function setDeskStripHover(on) {
  deskStripHover = Boolean(on);
}

// The closed door line has ONE static home: the empty strip just above the
// page's bottom border. It is a fixed number for the current window height, not
// a value read back from a sheet. Reading it back is what made the line park
// wherever the note/AI happened to be when it closed — after a width split the
// panes slide sideways, the close ran against a stale box, and the line stayed
// on the old sheet edge instead of its slot. Both lines share this one static
// value; only a window resize changes it.
const DESK_LINE_SLOT_GAP = 34;
const DESK_LINE_SLOT_TUCKED = 8;
function deskLineClosedTop() {
  return Math.max(0, Math.round(window.innerHeight - DESK_LINE_SLOT_GAP));
}
function deskLineTuckedTop() {
  return Math.round(window.innerHeight + DESK_LINE_SLOT_TUCKED);
}

// Which door line is being dragged right now ("ai" | "note" | null).
// The gesture writes that line's `top` itself, once per animation frame. If the
// shared layout pass below also places it (it runs from split updates, strip
// hover and the followPageLayout loop), the two writers land in the same frame
// and the line visibly trails the pointer. One owner per line.
function deskHandleDragging(kind) {
  const active = document.body.dataset.deskHandleDrag;
  return Boolean(active) && (!kind || active === kind);
}

// A gesture that loses the window (alt-tab, a native menu) can end without its
// pointerup, which would leave a line parked forever under its own writer.
// When the flag is set but no sheet carries the drag class, the gesture is
// already over: hand both the line and the page back to the layout pass.
function healStaleDeskDrag() {
  if (!deskHandleDragging()) return;
  if (document.querySelector(".panel-handle-resizing")) return;
  delete document.body.dataset.deskHandleDrag;
  setDeskHandleResizing(false);
}

// --------------------------------------------------------------------------
// Sheet edge range: the whole window, a magnetic top and a springy floor
// --------------------------------------------------------------------------
// Both sheets are bottom-anchored, so a door drag only writes their top edge.
// That edge travels the whole window now: not just the page body, but the title
// row and the logo bar above it. The subtask block is not a ceiling, and
// neither is the page body.
//
// Two magnets make the ends legible:
//
//   the logo bar   the row under the logo bar is a magnet. An edge pulled into
//                  it fills the strip above in one cut, so a sheet reaches the
//                  window top -- a full-window sheet. Between the page body
//                  top and that row the sheet follows the pointer.
//   last row       the floor. A sheet never shrinks past one ruled row; a pull
//                  below it compresses a short, resisted overshoot and the drop
//                  releases it, so the edge springs back onto the row instead
//                  of stopping dead on a wall.
//
// Every value here is page-body pixels: 0 is the top of the page body, so a
// sheet over the title row and the logo bar has a negative top.
const DOOR_EDGE_ROW = 40;

/** One ruled row of the page, in px (`--page-line-row`). */
function pageRuledRow() {
  const value = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--page-line-row"),
  );
  return Number.isFinite(value) && value > 0 ? Math.round(value) : DOOR_EDGE_ROW;
}

/** The edge a sheet rests on when it is as short as it may get. */
function doorRestTop(footTop, row = pageRuledRow()) {
  return Math.max(0, Math.round(footTop) - Math.max(1, row));
}

/** How far above the page body a sheet may rise: the title row + logo bar. */
function pageRiseSpan() {
  const body = document.querySelector(".page-body");
  if (!body) return 0;
  return Math.max(0, Math.round(body.getBoundingClientRect().top));
}

/**
 * The two page-body coordinates a rising sheet cares about:
 *   `magnet` the row under the logo bar -- entering it fills the strip above;
 *   `limit`  the window top, the highest edge a sheet may take.
 */
function pageRiseEdge(desk) {
  if (!desk) return { magnet: 0, limit: 0 };
  const pageTop = Math.round(desk.top);
  const head = document.querySelector(".notebook-head");
  const logoBottom = head ? Math.round(head.getBoundingClientRect().bottom) : pageTop;
  return {
    magnet: Math.min(0, logoBottom - pageTop),
    limit: -Math.max(0, pageTop),
  };
}

/**
 * Where the pointer asks the sheet's edge to be, after both magnets.
 * `rawTop` is unclamped; `restTop` is doorRestTop(); `rise` is pageRiseEdge().
 * Returns `{ top, compressed }`: `compressed` means the sheet overshot the
 * floor and the drop has to spring it back onto `restTop`.
 */
function doorEdgeTop(rawTop, restTop, row = pageRuledRow(), rise = null) {
  const top = Math.round(Number(rawTop) || 0);
  const rowHeight = Math.max(1, Math.round(row));
  if (rise) {
    const limit = Math.round(rise.limit);
    // The row under the logo bar: once the edge is inside it the strip above
    // fills in one cut, so the sheet lands on the window top instead of
    // asking for one more careful pull.
    if (top <= Math.round(rise.magnet)) return { top: limit, compressed: false };
    // Never paint past the window top.
    if (top < limit) return { top: limit, compressed: false };
  }
  const rest = Math.max(0, Math.round(restTop));
  if (top <= rest) return { top, compressed: false };
  // Past the last row the edge keeps following the hand with a quarter of the
  // pull, never more than half a row. The drop springs the rest of the way.
  const overshoot = Math.min(rowHeight / 2, (top - rest) * 0.25);
  return { top: Math.round(rest + overshoot), compressed: true };
}

// A risen sheet starts above the page body, so the page must stop clipping at
// its own edges or the title row and the logo bar strip would be cut off. The
// class is owned by the rendered boxes, never by a stored height: a sheet that
// is closed or dropped back under the page body hands the clipping back.
let sheetRisen = false;
let publishedRiseSpan = -1;

function setSheetRisen(on) {
  const next = Boolean(on);
  if (next === sheetRisen) return;
  sheetRisen = next;
  document.body.classList.toggle("sheet-risen", next);
}

function syncSheetRise() {
  const risen = ["#agent-terminal", "#notes-half"].some((selector) => {
    const panel = document.querySelector(selector);
    if (!panel || !panel.offsetWidth || !panel.offsetHeight) return false;
    if (panel.classList.contains("notes-hidden")) return false;
    return panel.offsetTop < 0;
  });
  setSheetRisen(risen);
}

// --------------------------------------------------------------------------
// The hidden top bar gives way to the risen AI card
// --------------------------------------------------------------------------
// The utility bar is opened by a fixed trigger band across the first rows of
// the window (`.top-edge`). A sheet pulled to the top lies in that same strip,
// and the band sits above it: reaching the AI card's head or its door line
// opened the bar instead of the card. The card owns its own surface exactly the
// way the Doing drawer's trigger already gives way to a sheet lying over it, so
// the band's hit box is cut where the card is. The cut is a notch from the
// band's bottom edge, which keeps the remaining trigger one polygon; a card
// flush with the window top leaves a plain strip on its free side. The style is
// written only when the cut actually moves.
let topEdgeClip = "";
function syncTopEdgeOverlap() {
  const edge = document.querySelector("#top-edge");
  if (!edge) return;
  const terminal = document.querySelector("#agent-terminal");
  let clip = "";
  if (agentTerminalOpen && terminal && terminal.offsetWidth) {
    const band = edge.getBoundingClientRect();
    const panel = terminal.getBoundingClientRect();
    const width = Math.round(band.width);
    const height = Math.round(band.height);
    const left = Math.max(0, Math.round(panel.left - band.left));
    const right = Math.min(width, Math.round(panel.right - band.left));
    const top = Math.max(0, Math.round(panel.top - band.top));
    if (width > 0 && height > 0 && right > left && top < height) {
      if (top <= 0) {
        // The card reaches the window top: the whole strip over its width
        // belongs to it, so only the free side stays a trigger.
        clip = left <= 0
          ? `inset(0 0 0 ${right}px)`
          : `inset(0 ${width - left}px 0 0)`;
      } else {
        clip = `polygon(0 0, ${width}px 0, ${width}px 100%, ${right}px 100%, `
          + `${right}px ${top}px, ${left}px ${top}px, ${left}px 100%, 0 100%)`;
      }
    }
  }
  if (clip === topEdgeClip) return;
  topEdgeClip = clip;
  edge.style.clipPath = clip;
  // A bar that was already out now sits over the card: hand the strip back at
  // once instead of waiting for the pointer to leave the band.
  if (clip) document.body.classList.remove("top-tools-open");
}

// The horizontal slot each closed door line returns to, in page pixels. The
// layout pass writes it on every frame (it is the neutral 25% / 75% pair, not
// the live divider ratio), and the close reads it so a line that was riding a
// stretched pane still slides down to its original place.
const closedLineCenters = { ai: null, note: null };

const DeskHandle = {
  elements: {},
  homes: { ai: null, note: null },
  ensure() {
    this.elements.ai = this.elements.ai || document.querySelector(".desk-handle-ai");
    this.elements.note = this.elements.note || document.querySelector(".notes-handle-bottom");
    return this.elements;
  },
  // Record the line's box before a sheet rises. The close deliberately does
  // NOT restore this any more (see snapHome): the closed line belongs to the
  // page's static bottom slot, not to wherever the sheet was when it rose.
  captureHome(kind) {
    const handle = this.ensure()[kind];
    if (!handle) return;
    const r = handle.getBoundingClientRect();
    if (!r.width) return;
    this.homes[kind] = { center: r.left + r.width / 2, top: r.top };
  },
  snapHome(kind) {
    const handle = this.ensure()[kind];
    if (!handle) return false;
    // A tucked line is parked under the bottom border on purpose and must stay
    // there: snapping it back to a visible home would put the closed strip's
    // line back on screen, which is exactly what the closed strip no longer
    // does. The pointer visiting the bottom strip places it.
    if (handle.classList.contains("handle-tucked")) return false;
    // One static slot for every close. The old code restored `homes[kind].top`,
    // the spot the line had when the sheet rose. With the note and AI open as a
    // width split that home was the open sheet's own edge, so closing the note
    // left its line on the old sheet top (or just under it) instead of the
    // default bottom — and the next open started from that stray spot. The line
    // now always returns to the page's fixed bottom slot; only the window size
    // (and so the desk) can move that slot.
    const r = handle.getBoundingClientRect();
    // The x slot comes from the neutral pair as well: closing a note that the
    // divider had stretched must not leave its line under that width.
    const center = closedLineCenters[kind] != null
      ? closedLineCenters[kind]
      : r.left + r.width / 2;
    handle.style.setProperty("transition", "none", "important");
    this.place(kind, center, deskLineClosedTop());
    void handle.offsetWidth;
    requestAnimationFrame(() => handle.style.removeProperty("transition"));
    if (kind === "note") refreshNotesSwipeLine();
    return true;
  },
  place(kind, center, top) {
    const handle = this.ensure()[kind];
    if (!handle) return;
    handle.style.setProperty("left", `${Math.round(center)}px`, "important");
    handle.style.setProperty("right", "auto", "important");
    handle.style.setProperty("margin-left", "-48px", "important");
    handle.style.setProperty("transform", "none", "important");
    handle.style.setProperty("top", `${Math.round(top)}px`, "important");
    handle.style.setProperty("bottom", "auto", "important");
  },
  vanish(kind) {
    const handle = this.ensure()[kind];
    if (!handle) return;
    handle.classList.remove("handle-appear-above", "handle-appear-below");
    handle.classList.add("handle-vanish");
  },
  appear(kind, from = "below") {
    const handle = this.ensure()[kind];
    if (!handle) return;
    handle.classList.remove("handle-vanish");
    handle.classList.remove("handle-appear-above", "handle-appear-below");
    handle.classList.add(from === "above" ? "handle-appear-above" : "handle-appear-below");
    setTimeout(() => handle.classList.remove("handle-appear-above", "handle-appear-below"), 240);
  },
  tuck(kind, tucked) {
    const handle = this.ensure()[kind];
    if (handle) handle.classList.toggle("handle-tucked", Boolean(tucked));
  },
  isVanished(kind) {
    const handle = this.ensure()[kind];
    return Boolean(handle && handle.classList.contains("handle-vanish"));
  },
};

// Swallows the synthetic click that follows a swipe or tap.
document.addEventListener("click", (event) => {
  if (performance.now() < deskHandleSwipeSuppress
    && event.target.closest?.(".desk-handle-ai, .notes-handle-bottom")) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);

function positionDeskHandles() {
  healStaleDeskDrag();
  const body = $(".page-body");
  const aiHandle = $(".desk-handle-ai");
  const notesHandle = $(".notes-handle-bottom");
  const terminal = $("#agent-terminal");
  const notes = $("#notes-half");
  if (!body || !aiHandle || !notesHandle) return;
  const bodyRect = body.getBoundingClientRect();
  // The rise above the page body (title row + logo bar) is a layout fact the
  // sheets' stylesheet ceiling needs. Publish it once per change so a risen
  // sheet can be restored at its real height on the next launch.
  const riseSpan = pageRiseSpan();
  if (riseSpan !== publishedRiseSpan) {
    publishedRiseSpan = riseSpan;
    document.documentElement.style.setProperty("--page-rise-h", `${riseSpan}px`);
  }
  // A sheet dropped back under the page body hands the clipping to the page.
  syncSheetRise();
  // The bar's trigger band follows the AI card through every layout pass.
  syncTopEdgeOverlap();
  const side = agentSplitSide;
  const vertical = side === "notes-top" || side === "notes-bottom";
  const aiOpen = agentTerminalOpen && !agentClosing;
  const notesOpen = !notesHidden && !notesClosing;
  const layerGeometry = (element) => {
    if (!element || !element.offsetWidth) return null;
    return {
      center: bodyRect.left + element.offsetLeft + element.offsetWidth / 2,
      top: bodyRect.top + element.offsetTop + 6,
    };
  };
  const aiRect = aiOpen ? layerGeometry(terminal) : null;
  const notesRect = notesOpen ? layerGeometry(notes) : null;
  // A closed line rests on the page's NEUTRAL slot pair: the place it slides
  // down to when the two panes are split evenly (50/50). It must never follow
  // the live divider ratio — dragging the divider changes the note's width, and
  // the closed line used to slide down under that width instead of its
  // original slot. Both lines share this rule.
  //
  // The slot pair is derived from the pane centres first: the AI bar takes the
  // left quarter and the note bar the right quarter of a 50/50 split (or the
  // opposite quarters when the note is docked on the left). That is only the
  // rough home; each bar is then pulled one finger width toward the middle of
  // the page. On the default notes-right split that is the note line a finger
  // to the left and the AI line a finger to the right, so the two bars read as
  // one pair around the centre and both pop-open targets sit within an easy
  // reach.
  const CLOSED_SLOT_NUDGE = 0.08; // share of the page width, per side
  const CLOSED_SLOT_FINGER = 48; // px: one finger's width, always toward the middle
  const closedCenter = (which) => {
    const half = 0.25 - CLOSED_SLOT_NUDGE;
    const base = vertical
      ? bodyRect.left + bodyRect.width * (which === "ai" ? half : 1 - half)
      : bodyRect.left + bodyRect.width * (
        which === "ai"
          ? ((side !== "notes-left") ? half : 1 - half)
          : ((side !== "notes-left") ? 1 - half : half)
      );
    const middle = bodyRect.left + bodyRect.width / 2;
    return base + (base < middle ? CLOSED_SLOT_FINGER : -CLOSED_SLOT_FINGER);
  };
  closedLineCenters.ai = Math.round(closedCenter("ai"));
  closedLineCenters.note = Math.round(closedCenter("note"));
  const aiCenter = aiRect ? aiRect.center : closedLineCenters.ai;
  const notesCenter = notesRect ? notesRect.center : closedLineCenters.note;

  const closedTop = deskLineClosedTop();
  const tuckedTop = deskLineTuckedTop();
  const stripHover = deskStripHover;

  // A closed door line is hidden by default. It used to rest 34px above the
  // bottom border all the time; now the closed strip is empty and the line pops
  // into that same slot only while the pointer visits the last line at the
  // bottom of the page. An open line always sits on its sheet's top edge.
  const aiTucked = !aiOpen && !stripHover;
  const notesTucked = !notesOpen && !stripHover;
  const aiTop = aiRect ? aiRect.top : (aiTucked ? tuckedTop : closedTop);
  const notesTop = notesRect ? notesRect.top : (notesTucked ? tuckedTop : closedTop);

  DeskHandle.tuck("ai", aiTucked);
  DeskHandle.tuck("note", notesTucked);
  // Leave the line that is being dragged where the gesture put it.
  if (!deskHandleDragging("ai")) DeskHandle.place("ai", aiCenter, aiTop);
  if (!deskHandleDragging("note")) DeskHandle.place("note", notesCenter, notesTop);
  if (performance.now() - notesSwipeLineAt > 60) refreshNotesSwipeLine();
}
