/* ==========================================================================
   NOTE HANDLE — gestures for .notes-handle-bottom ONLY.
   --------------------------------------------------------------------------
   Interaction model (no timers):
     - hover across the line bottom->top opens it (equivalent to a click on
       the line). A top->bottom pass never closes the note: only a click does,
       so a pointer travelling down into an open note cannot dismiss it.
     - press + release without moving: click, toggles the note
     - press + move: drag, adjusts note height with the same top/height
       range as the AI line (the default box still starts at the baseline)
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
  const openNow = () => !notesHidden && !notesClosing;
  const toggle = () => {
    deskHandleSwipeSuppress = performance.now() + 500;
    if (openNow()) hideNotesPanel();
    else {
      showNotesPanel();
      protectDeskHandles(420);
    }
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

  // Hover crossing over the handle opens a closed note, the same as clicking
  // it. It never closes one: the sheet is dismissed by a click on its line
  // only, so a pointer travelling down into an open note cannot drop it.
  document.addEventListener("pointermove", (event) => {
    // A press in progress owns the pointer. Pulling the note down crosses its
    // own top line, and a hover read on that same move used to close the sheet
    // mid-drag — the gesture then looked like "the line cannot be pulled".
    // The flag check also keeps an AI-line drag from toggling the note.
    if (event.buttons || session || deskHandleResizing()) { hoverY = event.clientY; return; }
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
    if (prev > lineY && y <= lineY) {
      if (!openNow() && now > deskHandleProtectUntil) { lastCross = now; openNote(); }
    }
  }, { passive: true });

  // Some layouts own the note's box through their own `!important` geometry
  // rule, and a pull there would only last until the release pass restored the
  // rule — the sheet visibly sprang back. Those are:
  //   - a detached OS window: the note IS the window;
  //   - a stacked split (notes above/below the AI): the divider owns both
  //     panes' heights and the AI's top is derived from the note's foot;
  //   - a single-panel dock: CSS pins its top/height.
  // A side-by-side split is NOT one of them: it only divides the width. The AI
  // line already resizes its own pane in that layout, so refusing here made the
  // note line dead exactly where the user needed it (both sheets open, the line
  // parked on the subtask edge). The drag writes an inline `!important` box and
  // note-handle's sheet pass keeps it for the rest of the split.
  const boxOwnedByLayout = () => document.body.classList.contains("detached-note")
    || document.body.classList.contains("agent-notes-axis-y")
    || /(^|\s)single-note-/.test(document.body.className);

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
    // A sheet that is already leaving is not a grab target: its 140ms close
    // timer would hide the panel in the middle of the pull.
    if (notesClosing) return;
    if (boxOwnedByLayout()) return;

    const target = event.target;
    if (target?.closest?.("button, a, input, textarea, select, [contenteditable]")
      && !target.closest?.(".notes-handle-bottom")) return;

    event.stopPropagation();
    const panel = getPanel();
    const desk = agentDeskRect();
    const panelRect = panel?.getBoundingClientRect();
    // Whole pixels from the first frame: a fractional start made the sheet
    // paint its edge on half a device pixel and re-raster on every event.
    const startTop = panelRect && desk
      ? Math.round(Math.max(0, panelRect.top - desk.top))
      : 0;
    session = {
      panel,
      desk,
      startTop,
      // The sheet's own foot, not the desk floor: a bottom-docked note keeps it
      // on the floor, and the small floating card (AI open beside the note)
      // keeps its own. Measuring the bottom once means the drag can never
      // switch layout models and jump back on release.
      startBottom: panelRect && desk ? Math.round(Math.max(startTop + 1, panelRect.bottom - desk.top)) : 0,
      // A closed sheet has no box to pull, so the upward drag opens it first.
      closed: notesHidden || !panelRect || panelRect.height <= 0,
      minHeight: desk ? Math.min(220, Math.max(120, desk.height * 0.28)) : 120,
      x0: x,
      y0: y,
      lastDx: 0,
      lastDy: 0,
      lastTop: null,
      lastHandleTop: null,
      moved: false,
      resizing: false,
      finished: false,
    };
  };

  const applyResize = (dy) => {
    const g = session;
    if (!g || !g.panel || !g.desk) return;
    // `top` follows the pointer; the foot stays where the sheet already ended,
    // so height is derived from the two and the bottom edge is glued.
    const floor = Math.max(1, Math.min(g.desk.height, g.startBottom || g.desk.height));
    const lowestTop = Math.max(0, floor - g.minHeight);
    const top = Math.round(Math.max(0, Math.min(lowestTop, g.startTop + dy)));
    if (top === g.lastTop) return;
    g.lastTop = top;
    const height = Math.max(1, Math.round(floor - top));
    g.panel.style.setProperty("top", `${top}px`, "important");
    g.panel.style.setProperty("height", `${height}px`, "important");
    const handleTop = Math.round(g.desk.top + top + 6);
    if (handleTop !== g.lastHandleTop) {
      g.lastHandleTop = handleTop;
      handle.style.setProperty("top", `${handleTop}px`, "important");
    }
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
      // A render between the press and the first move replaces the sheet node;
      // always resize the one that is on the page now.
      g.panel = getPanel() || g.panel;
      if (!g.panel) return;
      // Pulling a closed door upward opens the note under the pointer instead
      // of resizing a hidden box. Downward movement keeps the door closed.
      if (g.closed && !openNow()) {
        if (g.lastDy >= 0) return;
        g.resizing = true;
        // Claim the line before the sheet rises: the open path measures the
        // page and would otherwise park this door on its default top edge for
        // one frame, and that one-frame jump is what reads as a stutter at the
        // start of a pull. The gesture owns the line from here on.
        setDeskHandleResizing(true);
        document.body.dataset.deskHandleDrag = "note";
        getPanel()?.classList.add("panel-handle-resizing");
        AudioFX.startLeafStretch();
        showNotesPanel(true);
        g.panel = getPanel();
        g.desk = agentDeskRect() || g.desk;
        if (!g.panel || !g.desk) {
          g.resizing = false;
          setDeskHandleResizing(false);
          delete document.body.dataset.deskHandleDrag;
          getPanel()?.classList.remove("panel-handle-resizing");
          AudioFX.stopLeafStretch();
          return;
        }
        // Start from the shortest allowed sheet so the line follows the finger
        // in a straight 1:1 pull from the bottom door.
        g.startTop = Math.max(0, g.desk.height - g.minHeight);
        g.startBottom = Math.max(g.startTop + 1, g.desk.height);
        g.closed = false;
        handle.classList.remove("handle-vanish");
      } else {
        g.resizing = true;
        AudioFX.startLeafStretch();
        setDeskHandleResizing(true);
      }
      g.panel.classList.add("panel-handle-resizing");
      // Now that the sheet carries the drag class, this line belongs to the
      // gesture alone: the shared layout pass must not re-place it mid-frame.
      document.body.dataset.deskHandleDrag = "note";
      g.panel.style.setProperty("transition", "none", "important");
      g.panel.style.setProperty("will-change", "top, height");
      // Written once: repeating it on every frame only dirties the style.
      g.panel.style.setProperty("bottom", "auto", "important");
      // The page rule caps the sheet at the desk height. Lifting that cap for
      // the drag lets `top + height` stay glued to the bottom edge, exactly
      // like the AI card; otherwise the sheet would shrink from below while
      // the line runs away from it.
      g.panel.style.setProperty("max-height", "none", "important");
      handle.style.setProperty("transition", "none", "important");
      handle.style.setProperty("cursor", "ns-resize", "important");
      // Place the first frame in this same task. Opening the note laid down a
      // default box first; letting that box paint for one frame and only then
      // jumping to the drag's short sheet is the double-jump you feel at the
      // very start of a pull. The style block above already removed the
      // transitions, so this write lands before the next paint.
      applyResize(g.lastDy);
      return;
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
    setDeskHandleResizing(false);
    delete document.body.dataset.deskHandleDrag;
    g.panel?.classList.remove("panel-handle-resizing");
    if (g.panel) {
      const panel = g.panel;
      panel.style.removeProperty("will-change");
      // The sheet carries a 0.3s top/height transition for neighbour changes.
      // Hand it back one frame late: if any late pass re-states the box, it must
      // not start an ease out of the box the user just dropped (that settle is
      // the "bounce" at the end of a pull).
      requestAnimationFrame(() => panel.style.removeProperty("transition"));
    }
    handle.style.removeProperty("transition");
    handle.style.removeProperty("cursor");
    session = null;
    if (g.resizing) {
      AudioFX.stopLeafStretch();
      deskHandleSwipeSuppress = performance.now() + 400;
      protectDeskHandles(420);
      // The note's height is its own value: remember this box so the next
      // class change (opening the AI, a re-render) restores exactly it.
      window.noteSheetMarkManualBox?.();
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
   subtasks. The two heights are now two independent values:

     --agent-terminal-height   the AI card, written by the AI line and restored
                               from `viewState.aiHeight`;
     --notes-sheet-height      the note, written by this file and restored from
                               `neotodo.notesSheetHeight`.

   Nothing reads one to size the other. Here the note owns its geometry:
     - reopening restores the height it had when it was last closed;
     - with no remembered height, it fills the desk right below the subtask
       area, so opening or closing the AI card never changes the note's height;
     - opening the note snapshots and restores the AI height variable, so the
       AI card never moves with it;
     - a side-by-side split only divides the width, so the note keeps its own
       height there; a stacked split owns both panes' geometry, because the
       AI's top is derived from the note's foot.
   ========================================================================== */
(function () {
  const HEIGHT_KEY = "neotodo.notesSheetHeight";
  const HEIGHT_VAR = "--notes-sheet-height";
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

  // The note's own height is also published as a root variable. The stylesheet
  // uses it for the split box, so the sheet keeps that exact height even before
  // this file writes its inline box (and while a split clears it).
  const publishHeight = (height) => {
    const value = Math.round(Number(height) || 0);
    if (value > 0) root.style.setProperty(HEIGHT_VAR, `${value}px`);
  };
  if (remembered != null) publishHeight(remembered);

  const deskHeight = () => Math.max(1, body()?.clientHeight || window.innerHeight);

  // One minimum for both the line gesture and this box. They used to disagree
  // (190px while dragging, 220px remembered), so releasing a full shrink made
  // the sheet jump 30px back up under the finger.
  const minSheetHeight = () => Math.min(220, Math.max(120, deskHeight() * 0.28));

  const clampHeight = (value) => Math.round(
    Math.max(minSheetHeight(), Math.min(Number(value) || 0, deskHeight())),
  );

  const defaultHeight = () => {
    const layer = body();
    const todos = document.querySelector(".todos-section");
    if (!layer) return 0;
    const rect = layer.getBoundingClientRect();
    if (rect.height <= 0) return 0;
    const top = todos ? todos.getBoundingClientRect().bottom - rect.top : rect.height / 2;
    // The default note box fills the desk below the page baseline and never
    // grows into the task region. It is the same box the note keeps when the
    // AI opens, so opening the AI can never resize the note.
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

  // A split needs a second look: a side-by-side split only divides the width,
  // so the note keeps its own height there. A stacked split ("notes-top" /
  // "notes-bottom") derives the AI pane's top from the note's foot, and a
  // detached window has no page to resize against. In those two the note's
  // height is not the note's to write, and neither is the AI card's height
  // ever used to size the note: the two live in separate variables.
  const splitOwnsHeight = () => document.body.classList.contains("detached-note")
    || document.body.classList.contains("agent-notes-axis-y");

  const clearGeometry = (node) => {
    node.style.removeProperty("top");
    node.style.removeProperty("height");
    node.style.removeProperty("bottom");
    node.style.removeProperty("max-height");
  };

  let appliedTop = null;
  let appliedHeight = null;

  function applyGeometry() {
    const node = panel();
    if (!node) return;
    // While a door line is dragged (or the split divider is), the gesture owns
    // the box. A re-render, a plugin class change or the opening path used to
    // land here mid-drag and stamp the remembered box back over the pointer's
    // box — the sheet jumped, then settled: the rebound. The gesture commits
    // its last box first and this pass picks it up on the next real change.
    if (deskHandleResizing()
      || document.body.classList.contains("agent-split-resizing")
      || node.classList.contains("panel-handle-resizing")) return;
    // Only a layout that owns both panes' heights may take the box (a stacked
    // split or a detached window). Everywhere else the note keeps its own
    // saved height, including while the AI card is open beside it.
    if (splitOwnsHeight() || node.classList.contains("notes-hidden")) {
      clearGeometry(node);
      appliedTop = null;
      appliedHeight = null;
      return;
    }
    const layer = body();
    if (!layer) return;
    // A remembered height may come from a door-line drag that deliberately
    // lifted the sheet above the page baseline. Only the no-height default is
    // pinned below the task list; a user's own box is restored as-is.
    const base = remembered == null ? defaultHeight() : remembered;
    const height = Math.round(Math.min(clampHeight(base), Math.max(1, deskHeight())));
    const top = Math.max(0, layer.clientHeight - height);
    // Keep the stylesheet's copy of the note height on the user's value, not
    // on a window-clamped one, so a later split or resize restores it whole.
    if (remembered != null) publishHeight(remembered);
    // The page rule caps a sheet at the desk height. Lift that cap when the
    // chosen box reaches above the baseline, so the bottom edge stays on the
    // desk floor instead of leaving a gap under the note.
    if (height > deskAvailable()) node.style.setProperty("max-height", "none", "important");
    else node.style.removeProperty("max-height");
    // The cached numbers alone are not enough: setupNotesPanel() clears the
    // inline box on every render and NotesDock writes the same numbers back
    // with plain declarations. Those lose to the stylesheet's `!important`
    // split box, so the sheet silently dropped to the shared height while this
    // pass thought nothing had changed. Require the important flag as well and
    // re-assert the note's own box.
    if (top === appliedTop && height === appliedHeight
      && node.style.getPropertyValue("top") === `${top}px`
      && node.style.getPropertyPriority("top") === "important"
      && node.style.getPropertyValue("height") === `${height}px`
      && node.style.getPropertyPriority("height") === "important") return;
    appliedTop = top;
    appliedHeight = height;
    node.style.setProperty("top", `${top}px`, "important");
    node.style.setProperty("height", `${height}px`, "important");
    node.style.setProperty("bottom", "auto", "important");
    // The gesture and this box share one line. When a re-render or a resize
    // moves the sheet, bring the door back to its new top edge in the same
    // frame instead of leaving it behind.
    if (typeof positionDeskHandles === "function") {
      requestAnimationFrame(() => positionDeskHandles());
    }
  }

  function currentHeight() {
    const node = panel();
    if (!node || splitOwnsHeight()) return 0;
    const height = node.getBoundingClientRect().height;
    return height > 0 ? clampHeight(height) : 0;
  }

  function rememberFromPanel() {
    const node = panel();
    if (!node || splitOwnsHeight()) return;
    // saveViewState() can run right after a split's classes are removed, before
    // this file re-applies the note's own box. Without an inline box the
    // rendered height might still be the split's full band, and remembering
    // that would throw away the height the user owns.
    if (!node.style.getPropertyValue("top") || !node.style.getPropertyValue("height")) return;
    // The door gesture already wrote an integer box. Remember exactly that
    // number: reading the rendered rect back could land a fraction lower and
    // the restored box would then be a pixel off the one the user dropped.
    const inline = Number.parseFloat(node.style.getPropertyValue("height"));
    const height = clampHeight(Number.isFinite(inline) && inline > 0 ? inline : currentHeight());
    if (!height) return;
    remembered = height;
    publishHeight(height);
    try { localStorage.setItem(HEIGHT_KEY, String(height)); } catch (error) {}
  }

  // Exposed for the bottom door handle's resize gesture.
  window.noteSheetRememberCurrentHeight = rememberFromPanel;
  // Kept for the gesture: the note height is the note's own value, so a manual
  // box simply invalidates the cached pass and the next one re-reads it.
  window.noteSheetMarkManualBox = () => {
    appliedTop = null;
    appliedHeight = null;
  };

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
    const dragging = () => deskHandleResizing()
      || document.body.classList.contains("agent-split-resizing")
      || Boolean(panel()?.classList.contains("panel-handle-resizing"));

    new MutationObserver((records) => {
      if (dragging()) return;
      // Some plugins rewrite the same class value on a loop (an absent token
      // remove still fires the record). Those are not layout changes, so do
      // not let them reset a box the user just dragged.
      if (!records.some((record) => record.oldValue !== document.body.className)) return;
      applyGeometry();
    }).observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true,
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

