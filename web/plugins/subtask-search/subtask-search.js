/* ==========================================================================
   SUBTASK SEARCH PLUGIN — a search drawer that slides out of the subtask edge.
   --------------------------------------------------------------------------
   This plugin owns:
     - its magnifier button in the left tool rail;
     - the horizontal search drawer above the subtask rows;
     - the results list that appears under the field.

   Typing does not reshuffle the live subtask rows any more. Matches are listed
   below the field as ruled rows; clicking one closes the drawer and brings the
   original subtask row back into view. The rail button opens and closes the
   drawer, and the drawer slides down from the top edge of the task block.

   It registers itself with the NeoTodo plugin host so Settings → Plugins can
   turn it on or off like any other plugin. No source file outside this folder
   needs to know what it does.
   ========================================================================== */

(() => {
  "use strict";

  const PLUGIN_ID = "subtask-search";
  const body = document.body;
  if (!body || body.dataset.subtaskSearchBooted === "1") return;
  body.dataset.subtaskSearchBooted = "1";

  const PLUGIN_DEFINITION = {
    id: PLUGIN_ID,
    title: "子任务搜索",
    englishTitle: "Subtask Search",
    version: "1.0.0",
    author: "NeoTodo",
    category: "Interface",
    description: "左栏放大镜卡片可以开关子任务搜索栏。搜索栏从子任务上边框滑出，匹配结果以带底线的行排列在下方；点击结果会回到原来的子任务位置，搜索栏保持打开并清空本次搜索。",
    icon: "/plugins/subtask-search/subtask-search.svg",
    entry: "/plugins/subtask-search/index.html",
    kind: "chrome",
  };

  let query = "";
  let activeTodoId = "";
  let panelOpen = false;
  let syncFrame = 0;
  let resultToken = 0;
  let clearTimer = 0;

  function cancelScheduledClear() {
    if (!clearTimer) return;
    window.clearTimeout(clearTimer);
    clearTimer = 0;
  }

  // ------------------------------------------------------------------------
  // Plugin registration: show up in Settings → Plugins with an on/off switch.
  // ------------------------------------------------------------------------
  function pluginOn() {
    try {
      return typeof pluginEnabled === "function" ? pluginEnabled(PLUGIN_ID) : true;
    } catch (error) {
      return true;
    }
  }

  function registerPlugin() {
    try {
      if (typeof PLUGIN_REGISTRY === "undefined" || !PLUGIN_REGISTRY) return;
      if (!PLUGIN_REGISTRY[PLUGIN_ID]) {
        PLUGIN_REGISTRY[PLUGIN_ID] = { ...PLUGIN_DEFINITION };
      }
      if (typeof applyPluginState === "function") applyPluginState();
    } catch (error) {}
  }

  // ------------------------------------------------------------------------
  // The left rail button, injected next to the other bundled plugins.
  // ------------------------------------------------------------------------
  const railButton = document.createElement("button");
  railButton.type = "button";
  railButton.className = "tool-button subtask-search-button";
  railButton.dataset.plugin = PLUGIN_ID;
  railButton.setAttribute("aria-label", "打开子任务搜索");
  railButton.setAttribute("aria-expanded", "false");
  railButton.title = "子任务搜索";
  railButton.innerHTML = '<img class="subtask-search-rail-icon" src="/plugins/subtask-search/subtask-search.svg" alt="">';

  function mountRailButton() {
    const rail = document.querySelector(".tool-rail");
    if (!rail || rail.querySelector(".subtask-search-button")) return;
    const anchor = rail.querySelector(".pindou-button");
    if (anchor) anchor.after(railButton);
    else rail.appendChild(railButton);

    if (window.MutationObserver) {
      // Settings flips `plugin-hidden` on this button. Mirror that state into
      // the stage immediately instead of waiting for the next render.
      new MutationObserver(scheduleSync).observe(railButton, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
  }

  // ------------------------------------------------------------------------
  // DOM helpers
  // ------------------------------------------------------------------------
  function currentInner() {
    return document.querySelector(".current-half .current-inner[data-current-todo]");
  }

  function currentPanel() {
    return document.querySelector(".current-half > .subtask-search-drawer");
  }

  function currentInput() {
    return currentPanel()?.querySelector(".subtask-search-input") || null;
  }

  // ------------------------------------------------------------------------
  // The search drawer. The field intentionally has no placeholder: the bar is
  // just the bracket and the caret. Results are built below it.
  // ------------------------------------------------------------------------
  function buildPanel() {
    const panel = document.createElement("div");
    panel.className = "subtask-search-drawer";
    panel.dataset.plugin = PLUGIN_ID;
    panel.setAttribute("role", "search");
    panel.setAttribute("aria-label", "子任务搜索");
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = `<div class="subtask-search-bar">
        <img class="subtask-search-field-icon" src="/plugins/subtask-search/subtask-search.svg" alt="">
        <input class="subtask-search-input" type="text" inputmode="search" autocomplete="off" spellcheck="false" aria-label="搜索子任务" enterkeyhint="search">
      </div>
      <div class="subtask-search-results" role="listbox" aria-label="搜索结果"></div>`;

    const input = panel.querySelector(".subtask-search-input");

    input.addEventListener("input", () => {
      cancelScheduledClear();
      query = input.value;
      renderResults();
    });
    input.addEventListener("focus", () => panel.classList.add("is-focused"));
    input.addEventListener("blur", () => panel.classList.remove("is-focused"));
    input.addEventListener("keydown", (event) => {
      if (event.isComposing || event.keyCode === 229) return;
      if (event.key === "Enter") {
        const first = panel.querySelector(".subtask-search-result");
        if (!first) return;
        event.preventDefault();
        event.stopPropagation();
        first.click();
      }
    });

    // Clicking anywhere on the bracket puts the caret in the search field.
    panel.querySelector(".subtask-search-bar").addEventListener("pointerdown", (event) => {
      if (event.target === input) return;
      event.preventDefault();
      input.focus({ preventScroll: true });
    });

    return panel;
  }

  function clearSearch(refocus) {
    cancelScheduledClear();
    query = "";
    const input = currentInput();
    if (input) input.value = "";
    renderResults();
    if (refocus && input) input.focus({ preventScroll: true });
  }

  // ------------------------------------------------------------------------
  // Panel open/close motion. CSS owns the slide; this only flips the state.
  // ------------------------------------------------------------------------
  function refreshLaneScrollers() {
    requestAnimationFrame(() => {
      try {
        if (typeof syncTaskScrollers === "function") syncTaskScrollers();
      } catch (error) {}
      document.querySelectorAll(".subtask-lane[data-lane]").forEach((lane) => {
        try { lane._slimUpdate?.(); } catch (error) {}
      });
    });
  }

  function paintOpenState() {
    const panel = currentPanel();
    if (panel) {
      panel.classList.toggle("open", panelOpen);
      panel.setAttribute("aria-hidden", panelOpen ? "false" : "true");
    }
    body.classList.toggle("subtask-search-open", panelOpen && Boolean(panel));
    railButton.classList.toggle("is-open", panelOpen);
    railButton.setAttribute("aria-expanded", panelOpen ? "true" : "false");
    railButton.setAttribute("aria-label", panelOpen ? "关闭子任务搜索" : "打开子任务搜索");
  }

  function openPanel() {
    if (!currentPanel()) return false;
    cancelScheduledClear();
    panelOpen = true;
    paintOpenState();
    refreshLaneScrollers();
    renderResults();
    const input = currentInput();
    if (input) {
      requestAnimationFrame(() => {
        try {
          input.focus({ preventScroll: true });
          input.select();
        } catch (error) {}
      });
    }
    return true;
  }

  function closePanel({ clear = true, focusRail = false } = {}) {
    panelOpen = false;
    paintOpenState();
    refreshLaneScrollers();
    if (clear) {
      cancelScheduledClear();
      query = "";
      const input = currentInput();
      if (input) input.value = "";
      // Keep the result rows on screen while the drawer slides away, then drop
      // them once it is tucked above the edge.
      clearTimer = window.setTimeout(() => {
        clearTimer = 0;
        renderResults();
      }, 480);
    } else {
      renderResults();
    }
    if (focusRail) {
      try { railButton.focus({ preventScroll: true }); } catch (error) {}
    }
  }

  // ------------------------------------------------------------------------
  // Results: matching rows are gathered from the live lane (including the
  // completed drawer) and rendered as a ruled list below the field. The live
  // rows are never hidden or reordered.
  // ------------------------------------------------------------------------
  function collectRows(inner, terms) {
    const rows = [...inner.querySelectorAll(".current-subtask[data-subtask-id]")];
    const matches = [];
    for (const row of rows) {
      const label = row.querySelector(".sub-name, .sub-name-input");
      const name = String(label?.value ?? label?.textContent ?? "").trim();
      const done = row.classList.contains("done")
        || Boolean(row.closest('.subtask-lane[data-lane="done"]'));
      if (terms.length && !terms.every((term) => name.toLowerCase().includes(term))) continue;
      matches.push({
        id: row.dataset.subtaskId,
        name,
        done,
      });
    }
    return { total: rows.length, matches };
  }

  function resultCheck() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "subtask-search-result-check");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#check-red");
    svg.appendChild(use);
    return svg;
  }

  function renderResults() {
    const panel = currentPanel();
    if (!panel) return;
    const list = panel.querySelector(".subtask-search-results");
    if (!list) return;

    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    panel.classList.toggle("has-query", Boolean(terms.length));

    if (!panelOpen || !terms.length) {
      resultToken += 1;
      list.replaceChildren();
      panel.classList.remove("has-results", "no-results");
      return;
    }

    const inner = currentInner();
    if (!inner) {
      resultToken += 1;
      list.replaceChildren();
      panel.classList.remove("has-results", "no-results");
      return;
    }

    resultToken += 1;
    const token = resultToken;
    const { matches } = collectRows(inner, terms);
    const fragment = document.createDocumentFragment();

    for (const match of matches) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `subtask-search-result${match.done ? " is-done" : ""}`;
      button.dataset.resultId = match.id;
      button.setAttribute("role", "option");

      const name = document.createElement("span");
      name.className = "subtask-search-result-name";
      name.textContent = match.name || "Untitled subtask";
      button.appendChild(name);

      if (match.done) {
        const kind = document.createElement("span");
        kind.className = "subtask-search-result-kind";
        kind.textContent = "已完成";
        button.appendChild(kind);
        button.appendChild(resultCheck());
      } else {
        const go = document.createElement("span");
        go.className = "subtask-search-result-go";
        go.setAttribute("aria-hidden", "true");
        go.textContent = "↗";
        button.appendChild(go);
      }

      button.addEventListener("pointerdown", (event) => event.stopPropagation());
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (token !== resultToken) return;
        jumpToResult(match.id, match.done);
      });
      fragment.appendChild(button);
    }

    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = "subtask-search-empty";
      empty.textContent = "没有匹配的子任务";
      fragment.appendChild(empty);
    }

    list.replaceChildren(fragment);
    panel.classList.toggle("has-results", matches.length > 0);
    panel.classList.toggle("no-results", matches.length === 0);
  }

  // ------------------------------------------------------------------------
  // Jump back to the original row. Completed rows may still be behind the
  // finished-task drawer, so open that first, then centre the row in its lane.
  // ------------------------------------------------------------------------
  function jumpToResult(subtaskId, done) {
    const inner = currentInner();
    const row = inner?.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(String(subtaskId))}"]`);
    if (!row) return;

    const drawer = document.getElementById("completed-subtask-drawer");
    if (done && drawer && !drawer.classList.contains("open")) {
      try {
        if (typeof toggleCompletedSubtasks === "function") toggleCompletedSubtasks(true);
      } catch (error) {}
    }

    // The left rail card is the drawer's switch, so it stays open. The query is
    // cleared right away: this search is finished, and the field is ready for
    // the next one.

    const lane = row.closest(".subtask-lane") || inner;
    const rowRect = row.getBoundingClientRect();
    const laneRect = lane.getBoundingClientRect();
    const rowTop = rowRect.top - laneRect.top + lane.scrollTop;
    const target = Math.max(
      0,
      Math.min(
        rowTop - (lane.clientHeight - row.offsetHeight) / 2,
        Math.max(0, lane.scrollHeight - lane.clientHeight)
      )
    );

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    requestAnimationFrame(() => {
      if (!row.isConnected) return;
      try {
        lane.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
      } catch (error) {
        lane.scrollTop = target;
      }
    });

    row.classList.remove("subtask-search-hit");
    void row.offsetWidth;
    row.classList.add("subtask-search-hit");
    window.setTimeout(() => row.classList.remove("subtask-search-hit"), 1700);

    // The jump means this search is done. Empty the field and the result rows
    // so the next search starts from a clean drawer; the drawer itself stays
    // open and the highlighted row keeps the context visible.
    clearSearch(false);
  }

  // ------------------------------------------------------------------------
  // Keep the drawer in sync with the subtask stage (it is rebuilt on render).
  // ------------------------------------------------------------------------
  function resetView() {
    cancelScheduledClear();
    document.querySelectorAll(".subtask-search-drawer").forEach((node) => node.remove());
    document.querySelectorAll(".subtask-search-hit").forEach((node) => {
      node.classList.remove("subtask-search-hit");
    });
    panelOpen = false;
    query = "";
    activeTodoId = "";
    body.classList.remove("subtask-search-on", "subtask-search-open");
    railButton.classList.remove("is-open");
    railButton.setAttribute("aria-expanded", "false");
    railButton.setAttribute("aria-label", "打开子任务搜索");
    // Removing the drawer gives the lane its row height back; re-check whether
    // it still needs its scrollbar.
    requestAnimationFrame(() => {
      try {
        if (typeof syncTaskScrollers === "function") syncTaskScrollers();
      } catch (error) {}
    });
  }

  function sync() {
    mountRailButton();

    if (!pluginOn()) {
      resetView();
      return;
    }

    const half = document.querySelector(".current-half");
    const inner = half?.querySelector(".current-inner[data-current-todo]");
    if (!half || !inner) {
      resetView();
      return;
    }

    const todoId = inner.dataset.currentTodo || "";
    if (todoId !== activeTodoId) {
      // Moving to another task starts with an empty, closed drawer. The query
      // and open state never carry into a different task's rows.
      activeTodoId = todoId;
      panelOpen = false;
      query = "";
      body.classList.remove("subtask-search-open");
    }

    body.classList.add("subtask-search-on");
    let panel = half.querySelector(":scope > .subtask-search-drawer");
    if (!panel) {
      panel = buildPanel();
      half.insertBefore(panel, inner);
    } else if (panel.nextElementSibling !== inner) {
      half.insertBefore(panel, inner);
    }

    paintOpenState();
    const input = panel.querySelector(".subtask-search-input");
    if (input && input.value !== query) input.value = query;
    renderResults();

    requestAnimationFrame(() => {
      if (!inner.isConnected) return;
      // Keep the task board's slim scrollbar in step if the overlay changed
      // anything about the available lane height.
      try {
        if (typeof syncTaskScrollers === "function") syncTaskScrollers();
      } catch (error) {}
    });
  }

  function scheduleSync() {
    if (syncFrame) return;
    syncFrame = requestAnimationFrame(() => {
      syncFrame = 0;
      sync();
    });
  }

  // ------------------------------------------------------------------------
  // The rail icon is the drawer's front door: tap toggles it open or closed.
  // ------------------------------------------------------------------------
  railButton.addEventListener("pointerdown", (event) => event.stopPropagation());
  railButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    sync();
    if (!currentPanel()) {
      try {
        if (typeof toast === "function") toast("先打开一个有子任务的任务", true);
      } catch (error) {}
      return;
    }
    try {
      if (typeof AudioFX !== "undefined") AudioFX.categoryTap();
    } catch (error) {}
    if (panelOpen) {
      closePanel({ clear: true, focusRail: true });
      return;
    }
    openPanel();
  });

  // Escape clears the field but keeps the drawer open: the left rail card is
  // the only control that closes it.
  document.addEventListener("keydown", (event) => {
    if (!panelOpen || event.key !== "Escape") return;
    if (!event.target.closest?.(".subtask-search-drawer, .subtask-search-button")) return;
    event.preventDefault();
    event.stopPropagation();
    if (query) clearSearch(true);
  }, true);

  // ------------------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------------------
  function boot() {
    registerPlugin();
    mountRailButton();
    try {
      if (typeof applyPluginState === "function") applyPluginState();
    } catch (error) {}

    const stage = document.querySelector("#stage");
    if (stage && window.MutationObserver) {
      // renderStage() replaces the stage's children; the drawer is re-inserted
      // and its open/query state re-applied after every such render.
      new MutationObserver(scheduleSync).observe(stage, { childList: true });
    }

    window.addEventListener("resize", scheduleSync);
    window.addEventListener("orientationchange", scheduleSync);
    document.addEventListener("visibilitychange", scheduleSync);
    scheduleSync();
  }

  boot();
})();
