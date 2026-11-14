/* ==========================================================================
   NOTE HANDLE — gestures for .notes-handle-bottom ONLY.
   --------------------------------------------------------------------------
   Interaction model (no timers):
     - hover across the line: top->bottom closes, bottom->top opens
       (equivalent to a click on the line)
     - press + release without moving: click, toggles the note
     - press + move: drag, adjusts note height
     - press + pull up on the closed door: opens the note and stretches it
       from the bottom in one gesture (the line follows the pointer)
   Independent state from the AI handle on purpose.
   ========================================================================== */

(function () {
  const handle = document.querySelector(".notes-handle-bottom");
  if (!handle || handle.dataset.noteGesture === "1") return;
  handle.dataset.noteGesture = "1";

  let session = null;
  let hoverY = null;
  let lastLineY = null;
  let lastCross = 0;

  const getPanel = () => document.querySelector("#notes-half");
  // The desk starts at the page baseline (right below the task list). The note
  // may fill that area but never climb into the tasks, so the drag stops there
  // instead of lifting the sheet off its bottom edge.
  const deskBaseline = () => {
    const layer = document.querySelector(".page-body");
    const todos = document.querySelector(".todos-section");
    if (!layer) return 0;
    const rect = layer.getBoundingClientRect();
    const top = todos ? todos.getBoundingClientRect().bottom - rect.top : 0;
    return Math.max(0, Math.round(top));
  };
  const openNow = () => !notesHidden && !notesClosing;
  const toggle = () => {
    deskHandleSwipeSuppress = performance.now() + 500;
    if (openNow()) hideNotesPanel();
    else {
      showNotesPanel();
      protectDeskHandles(420);
    }
  };

  const closeNote = () => {
    deskHandleSwipeSuppress = performance.now() + 500;
    hideNotesPanel();
  };
  const openNote = () => {
    deskHandleSwipeSuppress = performance.now() + 500;
    showNotesPanel();
    protectDeskHandles(420);
  };

  const lineInfo = () => {
    const r = handle.getBoundingClientRect();
    const cs = getComputedStyle(handle);
    const visible = r.bottom > 0 && r.top < window.innerHeight - 2
      && parseFloat(cs.opacity) > 0.01 && cs.pointerEvents !== "none";
    return { r, visible, y: r.top + r.height / 2 };
  };

  // Hover crossing over the handle: the same as clicking it.
  document.addEventListener("pointermove", (event) => {
    if (event.buttons) { hoverY = event.clientY; return; }
    const y = event.clientY;
    if (hoverY == null) { hoverY = y; return; }
    const prev = hoverY;
    hoverY = y;
    const { r, visible, y: lineY } = lineInfo();
    if (!visible) { lastLineY = null; return; }
    if (lastLineY != null && Math.abs(lineY - lastLineY) > 6) {
      lastLineY = lineY;
      hoverY = y;
      return;
    }
    lastLineY = lineY;
    if (event.clientX < r.left - 24 || event.clientX > r.right + 24) return;
    const now = performance.now();
    if (now - lastCross < 250) return;
    if (prev < lineY && y >= lineY) {
      if (openNow() && now > deskHandleProtectUntil) { lastCross = now; closeNote(); }
    } else if (prev > lineY && y <= lineY) {
      if (!openNow()) { lastCross = now; openNote(); }
    }
  }, { passive: true });

  const begin = (event) => {
    if (session) return;
    if (event.button !== undefined && event.button !== 0) return;
    const touch = event.touches && event.touches[0];
    const x = event.clientX ?? touch?.clientX;
    const y = event.clientY ?? touch?.clientY;
    if (x == null || y == null) return;
    const { r, visible } = lineInfo();
    if (!visible) return;
    if (x < r.left - 12 || x > r.right + 12 || y < r.top - 14 || y > r.bottom + 14) return;

    const target = event.target;
    if (target?.closest?.("button, a, input, textarea, select, [contenteditable]")
      && !target.closest?.(".notes-handle-bottom")) return;

    event.stopPropagation();
    const panel = getPanel();
    const desk = agentDeskRect();
    const panelRect = panel?.getBoundingClientRect();
    session = {
      panel,
      desk,
      startTop: panelRect && desk ? Math.max(0, panelRect.top - desk.top) : 0,
      baselineTop: deskBaseline(),
      // A closed sheet has no box to pull, so the upward drag opens it first.
      closed: notesHidden || !panelRect || panelRect.height <= 0,
      minHeight: desk ? Math.min(220, Math.max(120, desk.height * 0.28)) : 120,
      x0: x,
      y0: y,
      lastDx: 0,
      lastDy: 0,
      moved: false,
      resizing: false,
      finished: false,
    };
  };

  const applyResize = (dy) => {
    const g = session;
    if (!g || !g.panel || !g.desk) return;
    const maxTop = Math.max(0, g.desk.height - g.minHeight);
    const minTop = Math.min(g.baselineTop || 0, maxTop);
    // Whole pixels: fractional top/height made the sheet repaint its blurred
    // paper edges on every event instead of landing on the raster grid.
    const top = Math.round(Math.max(minTop, Math.min(maxTop, g.startTop + dy)));
    const height = Math.round(g.desk.height - top);
    g.panel.style.setProperty("top", `${top}px`, "important");
    g.panel.style.setProperty("height", `${height}px`, "important");
    g.panel.style.setProperty("bottom", "auto", "important");
    handle.style.setProperty("top", `${Math.round(g.desk.top + top + 6)}px`, "important");
  };

  // Pointer events arrive faster than the screen refreshes (a mouse drag also
  // delivers a mousemove twin for every pointermove). Committing the new box
  // once per frame leaves the main thread time to paint, which is why the AI
  // line feels lighter even though both gestures share this code shape.
  let resizeFrame = 0;
  let pendingDy = 0;
  const commitResize = () => {
    resizeFrame = 0;
    if (!session) return;
    applyResize(pendingDy);
  };
  const scheduleResize = (dy) => {
    pendingDy = dy;
    if (!resizeFrame) resizeFrame = requestAnimationFrame(commitResize);
  };

  const move = (x, y) => {
    const g = session;
    if (!g || g.finished) return;
    g.lastDy = y - g.y0;
    g.lastDx = x - g.x0;
    if (Math.hypot(g.lastDx, g.lastDy) <= 6) return;
    g.moved = true;
    if (!g.panel || !g.desk) return;
    if (!g.resizing) {
      // Pulling a closed door upward opens the note under the pointer instead
      // of resizing a hidden box. Downward movement keeps the door closed.
      if (g.closed && !openNow()) {
        if (g.lastDy >= 0) return;
        g.resizing = true;
        // Mark the drag before opening: the sheet-geometry observer re-applies
        // the remembered height on body class changes unless a drag is active.
        document.body.classList.add("desk-handle-resizing");
        AudioFX.startLeafStretch();
        showNotesPanel(true);
        g.panel = getPanel();
        g.desk = agentDeskRect() || g.desk;
        if (!g.panel || !g.desk) {
          g.resizing = false;
          document.body.classList.remove("desk-handle-resizing");
          AudioFX.stopLeafStretch();
          return;
        }
        // Start from the shortest allowed sheet so the line follows the finger
        // in a straight 1:1 pull from the bottom door.
        g.startTop = Math.max(g.baselineTop || 0, g.desk.height - g.minHeight);
        g.closed = false;
        handle.classList.remove("handle-vanish");
      } else {
        g.resizing = true;
        AudioFX.startLeafStretch();
        document.body.classList.add("desk-handle-resizing");
      }
      g.panel.classList.add("panel-handle-resizing");
      g.panel.style.setProperty("transition", "none", "important");
      g.panel.style.setProperty("will-change", "top, height");
      handle.style.setProperty("transition", "none", "important");
    }
    scheduleResize(g.lastDy);
  };

  const finish = () => {
    const g = session;
    if (!g || g.finished) return;
    g.finished = true;
    // Commit the last pending frame first, so the drop point is never lost.
    if (resizeFrame) {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = 0;
      applyResize(pendingDy);
    }
    document.body.classList.remove("desk-handle-resizing");
    g.panel?.classList.remove("panel-handle-resizing");
    if (g.panel) {
      g.panel.style.removeProperty("transition");
      g.panel.style.removeProperty("will-change");
    }
    handle.style.removeProperty("transition");
    session = null;
    if (g.resizing) {
      AudioFX.stopLeafStretch();
      deskHandleSwipeSuppress = performance.now() + 400;
      protectDeskHandles(420);
      noteSheetRememberCurrentHeight();
      positionDeskHandles();
      return;
    }
    if (!g.moved) {
      toggle();
      return;
    }
    deskHandleSwipeSuppress = performance.now() + 400;
  };

  const coords = (event) => {
    const touch = event.touches && event.touches[0];
    return { x: event.clientX ?? touch?.clientX, y: event.clientY ?? touch?.clientY };
  };
  const onMove = (event) => {
    if (event.type === "touchmove") event.preventDefault();
    if (!session) return;
    const { x, y } = coords(event);
    if (x == null || y == null) return;
    move(x, y);
  };
  const onUp = () => finish();

  document.addEventListener("pointerdown", begin, true);
  document.addEventListener("mousedown", begin, true);
  document.addEventListener("touchstart", begin, true);
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("mousemove", onMove, { passive: true });
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("pointerup", onUp);
  document.addEventListener("pointercancel", onUp);
  document.addEventListener("mouseup", onUp);
  document.addEventListener("touchend", onUp);
  document.addEventListener("touchcancel", onUp);
})();

/* ==========================================================================
   NOTE SHEET HEIGHT — the note keeps its own box.
   --------------------------------------------------------------------------
   The AI card and the note used to share `--agent-terminal-height`, so
   resizing one moved the other and a tall AI card pushed the note up over the
   subtasks. Here the note owns its geometry:
     - reopening restores the height it had when it was last closed;
     - with no remembered height, it rises to the default line right below the
       subtask area;
     - opening the note snapshots and restores the AI height variable, so the
       AI card never moves with it;
     - side-by-side split keeps each pane's own height; a stacked (top/bottom)
       split owns the geometry, so the note box stands down there.
   ========================================================================== */
(function () {
  const HEIGHT_KEY = "neotodo.notesSheetHeight";
  const BOTTOM_GAP = 40;
  const root = document.documentElement;
  const body = () => document.querySelector(".page-body");
  const panel = () => document.querySelector("#notes-half");
  let shownOnce = false;

  let remembered = (() => {
    try {
      const saved = Number(localStorage.getItem(HEIGHT_KEY));
      if (Number.isFinite(saved) && saved > 0) return saved;
    } catch (error) {}
    return null;
  })();

  const deskHeight = () => Math.max(1, body()?.clientHeight || window.innerHeight);

  // One minimum for both the line gesture and this box. They used to disagree
  // (190px while dragging, 220px remembered), so releasing a full shrink made
  // the sheet jump 30px back up under the finger.
  const minSheetHeight = () => Math.min(220, Math.max(120, deskHeight() * 0.28));

  const clampHeight = (value) => Math.round(
    Math.max(minSheetHeight(), Math.min(Number(value) || 0, deskHeight() - BOTTOM_GAP)),
  );

  const defaultHeight = () => {
    const layer = body();
    const todos = document.querySelector(".todos-section");
    if (!layer) return 0;
    const rect = layer.getBoundingClientRect();
    if (rect.height <= 0) return 0;
    const top = todos ? todos.getBoundingClientRect().bottom - rect.top : rect.height / 2;
    // The note starts at the page baseline and may never grow into the task
    // region, even when the desk is shorter than the 220px minimum.
    const available = Math.max(0, rect.height - top);
    return Math.round(Math.min(clampHeight(available), available));
  };

  /** Height of the desk below the page baseline. */
  const deskAvailable = () => {
    const layer = body();
    const todos = document.querySelector(".todos-section");
    if (!layer) return 0;
    const rect = layer.getBoundingClientRect();
    if (rect.height <= 0) return 0;
    const top = todos ? todos.getBoundingClientRect().bottom - rect.top : rect.height / 2;
    return Math.max(0, rect.height - top);
  };

  const splitActive = () => document.body.classList.contains("detached-note")
    || document.body.classList.contains("agent-notes-axis-y");

  const clearGeometry = (node) => {
    node.style.removeProperty("top");
    node.style.removeProperty("height");
    node.style.removeProperty("bottom");
  };

  function applyGeometry() {
    const node = panel();
    if (!node) return;
    if (splitActive() || node.classList.contains("notes-hidden")) {
      clearGeometry(node);
      return;
    }
    const layer = body();
    if (!layer) return;
    const wanted = clampHeight(remembered == null ? defaultHeight() : remembered);
    const height = Math.round(Math.min(wanted, deskAvailable()));
    if (!height) return;
    const top = Math.max(0, layer.clientHeight - height);
    node.style.setProperty("top", `${top}px`, "important");
    node.style.setProperty("height", `${height}px`, "important");
    node.style.setProperty("bottom", "auto", "important");
  }

  function currentHeight() {
    const node = panel();
    if (!node || splitActive()) return 0;
    const height = node.getBoundingClientRect().height;
    return height > 0 ? clampHeight(height) : 0;
  }

  function rememberFromPanel() {
    const height = currentHeight();
    if (!height) return;
    remembered = height;
    try { localStorage.setItem(HEIGHT_KEY, String(height)); } catch (error) {}
  }

  // Exposed for the bottom door handle's resize gesture.
  window.noteSheetRememberCurrentHeight = rememberFromPanel;

  function install() {
    if (window.__noteSheetGeometry) return;
    window.__noteSheetGeometry = true;

    const show = window.showNotesPanel;
    if (typeof show === "function") {
      window.showNotesPanel = function (...args) {
        // The AI card must keep its own height: snapshot the variable that
        // showNotesPanel() may rewrite, then put it back untouched.
        const previous = root.style.getPropertyValue("--agent-terminal-height");
        const priority = root.style.getPropertyPriority("--agent-terminal-height");
        const result = show.apply(this, args);
        shownOnce = true;
        applyGeometry();
        if (previous) root.style.setProperty("--agent-terminal-height", previous, priority);
        else root.style.removeProperty("--agent-terminal-height");
        requestAnimationFrame(() => {
          if (typeof positionDeskHandles === "function") positionDeskHandles();
        });
        return result;
      };
    }

    const hide = window.hideNotesPanel;
    if (typeof hide === "function") {
      window.hideNotesPanel = function (...args) {
        if (shownOnce && !document.body.classList.contains("notes-hidden")) rememberFromPanel();
        return hide.apply(this, args);
      };
    }

    // A re-render rewrites the panel's inline styles; re-apply the box after it.
    const setup = window.setupNotesPanel;
    if (typeof setup === "function") {
      window.setupNotesPanel = function (...args) {
        const result = setup.apply(this, args);
        applyGeometry();
        return result;
      };
    }

    // Body classes are touched by unrelated hover handlers (the tool drawer
    // re-writes `tools-open` on every mouse move). Re-applying the remembered
    // box during the bottom-line drag was resetting the note to its old height
    // on each frame, which is why the line could be pressed but never pulled.
    const dragging = () => document.body.classList.contains("desk-handle-resizing")
      || document.body.classList.contains("agent-split-resizing")
      || Boolean(panel()?.classList.contains("panel-handle-resizing"));

    new MutationObserver(() => {
      if (dragging()) return;
      applyGeometry();
    }).observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    applyGeometry();
  }

  function boot() {
    if (window.__noteSheetGeometry) return;
    if (typeof window.showNotesPanel === "function") { install(); return; }
    // app.js is parsed after this file; wait for its function declarations.
    let attempts = 0;
    const wait = () => {
      if (window.__noteSheetGeometry) return;
      if (typeof window.showNotesPanel === "function" || attempts++ > 40) { install(); return; }
      setTimeout(wait, 25);
    };
    wait();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener("resize", () => {
    if (window.__noteSheetGeometry) applyGeometry();
  });
})();

