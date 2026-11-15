/* ==========================================================================
   AI HANDLE — gestures for .desk-handle-ai ONLY.
   --------------------------------------------------------------------------
   Interaction model (no timers):
     - hover across the line: top->bottom closes, bottom->top opens
       (equivalent to a click on the line)
     - press + release without moving: click, toggles AI
     - press + move: drag, adjusts AI height
   Independent state from the note handle on purpose.
   ========================================================================== */

(function () {
  const handle = document.querySelector(".desk-handle-ai");
  if (!handle || handle.dataset.aiGesture === "1") return;
  handle.dataset.aiGesture = "1";

  let session = null;
  let hoverY = null;
  let lastLineY = null;
  let lastCross = 0;

  const getPanel = () => document.querySelector("#agent-terminal");
  const openNow = () => Boolean(agentTerminalOpen);
  const toggle = () => {
    deskHandleSwipeSuppress = performance.now() + 500;
    if (openNow()) closeAgentTerminal();
    else {
      openAgentTerminal();
      protectDeskHandles(420);
    }
  };
  const openAi = () => {
    deskHandleSwipeSuppress = performance.now() + 500;
    openAgentTerminal();
    protectDeskHandles(420);
  };

  const lineInfo = () => {
    const r = handle.getBoundingClientRect();
    const cs = getComputedStyle(handle);
    const visible = r.bottom > 0 && r.top < window.innerHeight - 2
      && parseFloat(cs.opacity) > 0.01 && cs.pointerEvents !== "none";
    return { r, visible, y: r.top + r.height / 2 };
  };

  // Hover-crossing: slide from above to below the top line to close; slide
  // from below to above the bottom line to open.
  document.addEventListener("pointermove", (event) => {
    if (event.buttons) { hoverY = event.clientY; return; }
    const y = event.clientY;
    if (hoverY == null) { hoverY = y; return; }
    const prev = hoverY;
    hoverY = y;
    const { r, visible, y: lineY } = lineInfo();
    if (!visible) { lastLineY = null; return; }
    // If the line itself just moved (panel opened/closed), do not treat the
    // same cursor position as a crossing.
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
      if (!openNow()) { lastCross = now; openAi(); }
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
      && !target.closest?.(".desk-handle-ai")) return;

    event.stopPropagation();
    const panel = getPanel();
    const desk = agentDeskRect();
    const panelRect = panel?.getBoundingClientRect();
    session = {
      panel,
      desk,
      startTop: panelRect && desk ? Math.max(0, panelRect.top - desk.top) : 0,
      minHeight: desk ? Math.min(220, Math.max(120, desk.height * 0.28)) : 120,
      x0: x,
      y0: y,
      lastDx: 0,
      lastDy: 0,
      lastTop: null,
      moved: false,
      resizing: false,
      finished: false,
    };
  };

  const applyResize = (dy) => {
    const g = session;
    if (!g || !g.panel || !g.desk) return;
    const maxTop = Math.max(0, g.desk.height - g.minHeight);
    // Whole pixels: fractional top/height made the blurred paper edges of a
    // split sheet re-raster on every event instead of landing on the grid.
    const top = Math.round(Math.max(0, Math.min(maxTop, g.startTop + dy)));
    if (top === g.lastTop) return;
    g.lastTop = top;
    const height = Math.round(g.desk.height - top);
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
  // once per frame leaves the main thread time to paint, and whole-pixel
  // dedupe skips the frames that would not move the sheet at all.
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
      g.resizing = true;
      AudioFX.startLeafStretch();
      setDeskHandleResizing(true);
      g.panel.classList.add("panel-handle-resizing");
      // The sheet now carries the drag class, so its line belongs to the
      // gesture alone; the shared layout pass must not re-place it mid-frame.
      document.body.dataset.deskHandleDrag = "ai";
      g.panel.style.setProperty("transition", "none", "important");
      g.panel.style.setProperty("will-change", "top, height");
      // Written once: repeating it on every frame only dirties the style.
      g.panel.style.setProperty("bottom", "auto", "important");
      handle.style.setProperty("transition", "none", "important");
      handle.style.setProperty("cursor", "ns-resize", "important");
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
      g.panel.style.removeProperty("transition");
      g.panel.style.removeProperty("will-change");
    }
    handle.style.removeProperty("transition");
    handle.style.removeProperty("cursor");
    session = null;
    if (g.resizing) {
      AudioFX.stopLeafStretch();
      deskHandleSwipeSuppress = performance.now() + 400;
      protectDeskHandles(420);
      positionDeskHandles();
      // The sheet now carries a deliberate box; keep it as the workspace shape
      // so a relaunch restores this exact page.
      if (typeof saveViewState === "function") saveViewState();
      return;
    }
    // No movement at all: a click.
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
