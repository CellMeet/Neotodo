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

// A plain flag, not a body class. It carries no styles, and a class toggle on
// <body> makes the engine re-match every `body.x ...` rule in the sheet — a
// page-wide invalidation once when the drag starts and again when it ends.
// A data attribute no selector mentions costs nothing.
function setDeskHandleResizing(on) {
  if (on) document.body.dataset.deskHandleResizing = "1";
  else delete document.body.dataset.deskHandleResizing;
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

const DeskHandle = {
  elements: {},
  homes: { ai: null, note: null },
  ensure() {
    this.elements.ai = this.elements.ai || document.querySelector(".desk-handle-ai");
    this.elements.note = this.elements.note || document.querySelector(".notes-handle-bottom");
    return this.elements;
  },
  // Remember the line's closed home before a sheet rises, so closing restores
  // that same spot instead of recomputing a new one from the resized sheet.
  captureHome(kind) {
    const handle = this.ensure()[kind];
    if (!handle) return;
    const r = handle.getBoundingClientRect();
    if (!r.width) return;
    this.homes[kind] = { center: r.left + r.width / 2, top: r.top };
  },
  snapHome(kind) {
    const home = this.homes[kind];
    const handle = this.ensure()[kind];
    if (!home || !handle) return false;
    // A tucked line is parked under the bottom border on purpose and must stay
    // there: snapping it back to the home it had while it was visible would put
    // the closed strip's line back on screen, which is exactly what the closed
    // strip no longer does. The pointer visiting the bottom strip places it.
    // A home remembered while the line was itself hidden is equally useless.
    if (handle.classList.contains("handle-tucked")
      || home.top > window.innerHeight - 2) return false;
    handle.style.setProperty("transition", "none", "important");
    this.place(kind, home.center, home.top);
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
  const ratio = agentSplitRatio;
  const side = agentSplitSide;
  const vertical = side === "notes-top" || side === "notes-bottom";
  const futureCenter = (which) => {
    if (vertical) return bodyRect.left + bodyRect.width * (which === "ai" ? 0.25 : 0.75);
    const aiLeft = side !== "notes-left";
    if (which === "ai") {
      return bodyRect.left + bodyRect.width * (aiLeft ? ratio / 2 : (1 + ratio) / 2);
    }
    return bodyRect.left + bodyRect.width * (aiLeft ? (1 + ratio) / 2 : ratio / 2);
  };
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
  const bothClosed = !aiOpen && !notesOpen;
  const aiCenter = aiRect
    ? aiRect.center
    : (bothClosed && vertical ? bodyRect.left + bodyRect.width * 0.25 : futureCenter("ai"));
  const notesCenter = notesRect
    ? notesRect.center
    : (bothClosed && vertical ? bodyRect.left + bodyRect.width * 0.75 : futureCenter("notes"));

  const closedTop = window.innerHeight - 34;
  const tuckedTop = window.innerHeight + 8;
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
