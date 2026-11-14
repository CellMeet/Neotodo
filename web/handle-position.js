/* ==========================================================================
   HANDLE POSITION — shared layout only.
   --------------------------------------------------------------------------
   This file owns where the two door lines sit, how they vanish/reappear and
   how a closed neighbour tucks under the bottom border. It contains NO
   gesture state; the AI and the note each have their own gesture file:
       ai-handle.js    -> only .desk-handle-ai
       note-handle.js  -> only .notes-handle-bottom
   ========================================================================== */

let deskHandleSwipeSuppress = 0;

// While this timestamp is in the future, a hover-crossing must not close a
// panel. Opening or moving a panel calls protectDeskHandles(420).
let deskHandleProtectUntil = 0;
function protectDeskHandles(ms = 420) {
  deskHandleProtectUntil = performance.now() + ms;
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
  const stripHover = document.body.classList.contains("desk-strip-hover");

  const aiTucked = !aiOpen && notesOpen;
  const notesTucked = !notesOpen && aiOpen;
  const aiTop = aiRect ? aiRect.top : (aiTucked ? (stripHover ? closedTop : tuckedTop) : closedTop);
  const notesTop = notesRect ? notesRect.top : (notesTucked ? (stripHover ? closedTop : tuckedTop) : closedTop);

  DeskHandle.tuck("ai", aiTucked);
  DeskHandle.tuck("note", notesTucked);
  DeskHandle.place("ai", aiCenter, aiTop);
  DeskHandle.place("note", notesCenter, notesTop);
  if (performance.now() - notesSwipeLineAt > 60) refreshNotesSwipeLine();
}
