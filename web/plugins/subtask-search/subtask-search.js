/* ==========================================================================
   SUBTASK SEARCH PLUGIN — a search drawer that slides out of the subtask edge.
   --------------------------------------------------------------------------
   This plugin owns:
     - its magnifier button in the left tool rail;
     - the horizontal search drawer above the subtask rows;
     - the results list that appears under the field.

   Typing does not reshuffle the live subtask rows any more. Matches are listed
   below the field as ruled rows, newest activity first with a relative time on
   the right. Clicking one keeps the drawer open, selects the original subtask
   exactly like a click on the row does, and brings it back into view. The rail
   button opens and closes the drawer, and the drawer slides down from the top
   edge of the task block.

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
    description: "左栏放大镜卡片可以开关子任务搜索栏。匹配结果按最近活跃时间从上到下排列，右侧显示几分钟、几小时或几天前；已完成子任务也会列出，点击即可跳转并选中它；搜索栏的磨砂模糊可在插件页调整。",
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
  let clockTimer = 0;

  // ------------------------------------------------------------------------
  // The glass blur is the user's setting, tuned on the plugin's own control
  // page (it shares this origin, so the value travels through localStorage).
  // ------------------------------------------------------------------------
  const BLUR_KEY = "neotodo.subtask-search.blur";
  const BLUR_DEFAULT = 26;
  const BLUR_MAX = 80;

  function normalizeBlur(value) {
    const px = Math.round(Number(value));
    if (!Number.isFinite(px)) return BLUR_DEFAULT;
    return Math.max(0, Math.min(BLUR_MAX, px));
  }

  function readBlur() {
    try {
      const raw = localStorage.getItem(BLUR_KEY);
      if (raw === null || raw === "") return BLUR_DEFAULT;
      return normalizeBlur(raw);
    } catch (error) {
      return BLUR_DEFAULT;
    }
  }

  function setSearchBlur(value, persist) {
    const px = normalizeBlur(value);
    if (persist) {
      try { localStorage.setItem(BLUR_KEY, String(px)); } catch (error) {}
    }
    try {
      document.documentElement.style.setProperty("--ss-search-blur", `${px}px`);
    } catch (error) {}
    return px;
  }

  function cancelScheduledClear() {
    if (!clearTimer) return;
    window.clearTimeout(clearTimer);
    clearTimer = 0;
  }

  function startClock() {
    if (clockTimer) return;
    clockTimer = window.setInterval(() => {
      if (!panelOpen) return;
      const input = currentInput();
      if (!input || !input.value.trim()) return;
      renderResults();
    }, 60000);
  }

  function stopClock() {
    if (!clockTimer) return;
    window.clearInterval(clockTimer);
    clockTimer = 0;
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
  // How much room the open drawer takes in the task block. The script writes
  // the measured height into --ss-open-h on .current-half; the stylesheet
  // pushes the whole subtask column down by that exact strip and shortens it
  // the same amount. Because the gap and the pane are always the same size,
  // the search box never overlaps a card in the column, and no card can cover
  // the bottom of the pane. The field-only state is one full row; the results
  // make the strip taller, up to the column height (the list then scrolls).
  // ------------------------------------------------------------------------
  let paneMetricFrame = 0;

  function publishPaneHeight() {
    const half = document.querySelector(".current-half");
    const panel = currentPanel();
    if (!half || !panel) return;
    const height = Math.max(0, Math.round(panel.offsetHeight));
    if (!height) return;
    const next = `${height}px`;
    if (half.style.getPropertyValue("--ss-open-h") !== next) {
      half.style.setProperty("--ss-open-h", next);
    }
  }

  function schedulePaneHeight() {
    if (paneMetricFrame) return;
    paneMetricFrame = requestAnimationFrame(() => {
      paneMetricFrame = 0;
      publishPaneHeight();
    });
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
    schedulePaneHeight();
  }

  function openPanel() {
    if (!currentPanel()) return false;
    cancelScheduledClear();
    panelOpen = true;
    startClock();
    // Empty the rows and measure the field-only pane before the open class is
    // painted: the column and the pane then leave on the same frame at the
    // same height, with no extra measuring frame tugging the rows afterwards.
    renderResults();
    publishPaneHeight();
    paintOpenState();
    refreshLaneScrollers();
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
    stopClock();
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
  // completed drawer), sorted by their latest activity, and rendered as a
  // ruled list below the field. The live rows are never hidden or reordered.
  // ------------------------------------------------------------------------
  function currentTodoData() {
    try {
      return typeof currentTodo === "function" ? currentTodo() : null;
    } catch (error) {
      return null;
    }
  }

  function rowActivityStamp(subtask) {
    if (!subtask) return 0;
    try {
      if (typeof subtaskActivityStamp === "function") {
        const stamp = Number(subtaskActivityStamp(subtask));
        if (Number.isFinite(stamp) && stamp > 0) return stamp;
      }
    } catch (error) {}
    const parse = (value) => {
      const stamp = Date.parse(String(value || ""));
      return Number.isNaN(stamp) ? 0 : stamp;
    };
    return Math.max(parse(subtask.created_at), parse(subtask.completed_at));
  }

  function timeBucket(stamp) {
    if (!stamp) return "is-old";
    const diff = Math.max(0, Date.now() - stamp);
    if (diff < 60 * 60 * 1000) return "is-fresh";
    if (diff < 24 * 60 * 60 * 1000) return "is-recent";
    return "is-old";
  }

  function relativeTimeText(stamp) {
    if (!stamp) return "";
    const diff = Math.max(0, Date.now() - stamp);
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    if (diff < minute) return "刚刚";
    if (diff < hour) return `${Math.max(1, Math.floor(diff / minute))}分钟前`;
    if (diff < day) return `${Math.floor(diff / hour)}小时前`;
    const days = Math.floor(diff / day);
    if (days < 30) return `${Math.max(1, days)}天前`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${Math.max(1, months)}个月前`;
    return `${Math.max(1, Math.floor(days / 365))}年前`;
  }

  function absoluteTimeText(stamp) {
    try {
      const date = new Date(stamp);
      const pad = (value) => String(value).padStart(2, "0");
      return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } catch (error) {
      return "";
    }
  }

  function collectRows(inner, terms) {
    const rows = [...inner.querySelectorAll(".current-subtask[data-subtask-id]")];
    const todo = currentTodoData();
    const dataById = new Map(
      (todo?.subtasks || []).map((subtask) => [String(subtask.id), subtask])
    );
    const matches = [];
    rows.forEach((row, index) => {
      const label = row.querySelector(".sub-name, .sub-name-input");
      const name = String(label?.value ?? label?.textContent ?? "").trim();
      const done = row.classList.contains("done")
        || Boolean(row.closest('.subtask-lane[data-lane="done"]'));
      if (terms.length && !terms.every((term) => name.toLowerCase().includes(term))) return;
      const subtask = dataById.get(String(row.dataset.subtaskId));
      matches.push({
        id: row.dataset.subtaskId,
        name,
        done,
        stamp: rowActivityStamp(subtask),
        order: index,
      });
    });
    // The newest conversation/activity leads the list. DOM order only breaks
    // exact timestamp ties, so completed and unfinished work intermix by time.
    matches.sort((a, b) => b.stamp - a.stamp || a.order - b.order);
    return { matches };
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
      schedulePaneHeight();
      return;
    }

    const inner = currentInner();
    if (!inner) {
      resultToken += 1;
      list.replaceChildren();
      panel.classList.remove("has-results", "no-results");
      schedulePaneHeight();
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

      if (match.done) button.appendChild(resultCheck());

      const time = document.createElement("span");
      time.className = `subtask-search-result-time ${timeBucket(match.stamp)}`;
      time.textContent = relativeTimeText(match.stamp);
      if (match.stamp) time.title = absoluteTimeText(match.stamp);
      button.appendChild(time);

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
    schedulePaneHeight();
  }

  // ------------------------------------------------------------------------
  // Jump back to the original row. Completed rows may still be behind the
  // finished-task drawer, so open that first, then select the row through the
  // app's own row handler (the same path a pointer click takes), and finally
  // centre it in its lane. Selecting here makes the search one action: the
  // note is already on the picked subtask, no second click needed.
  // ------------------------------------------------------------------------
  function rowFor(subtaskId) {
    const inner = currentInner();
    return inner?.querySelector(`.current-subtask[data-subtask-id="${CSS.escape(String(subtaskId))}"]`) || null;
  }

  function selectRow(row) {
    if (!row) return false;
    try {
      if (typeof selectCurrentSubtaskNote === "function") {
        selectCurrentSubtaskNote(row);
        return true;
      }
    } catch (error) {}
    // Older/other shells: replay a real click on the row so the app's own
    // delegated handler performs the selection.
    try {
      row.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
      return true;
    } catch (error) {
      return false;
    }
  }

  function jumpToResult(subtaskId, done) {
    const drawer = document.getElementById("completed-subtask-drawer");
    if (done && drawer && !drawer.classList.contains("open")) {
      try {
        if (typeof toggleCompletedSubtasks === "function") toggleCompletedSubtasks(true);
      } catch (error) {}
    }

    const picked = rowFor(subtaskId);
    if (!picked) return;
    selectRow(picked);

    // The left rail card is the drawer's switch, so it stays open. The query is
    // cleared right away: this search is finished, and the field is ready for
    // the next one.

    // The highlight starts at once, on the row that was just selected.
    picked.classList.remove("subtask-search-hit");
    void picked.offsetWidth;
    picked.classList.add("subtask-search-hit");
    window.setTimeout(() => picked.classList.remove("subtask-search-hit"), 1700);

    // Centre the row in its own lane. This is measured inside the frame because
    // opening the finished-task drawer resets its lane scroll in its own
    // frame; measuring now would aim at the old scroll position. The lane also
    // grows back once the result rows are cleared, so the height it will have
    // when the drawer has shrunk to the field alone is what the row is centred
    // against — otherwise a full-height result list would aim at a 0px lane.
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const openPanelNode = currentPanel();
    const currentPane = openPanelNode ? Math.round(openPanelNode.offsetHeight) : 0;
    const barNode = openPanelNode?.querySelector(".subtask-search-bar");
    const fieldPane = barNode ? Math.round(barNode.getBoundingClientRect().height) + 2 : 0;
    requestAnimationFrame(() => {
      const row = rowFor(subtaskId) || picked;
      if (!row.isConnected) return;
      const lane = row.closest(".subtask-lane") || currentInner();
      if (!lane) return;
      const rowRect = row.getBoundingClientRect();
      const laneRect = lane.getBoundingClientRect();
      const rowTop = rowRect.top - laneRect.top + lane.scrollTop;
      const laneHeight = lane.clientHeight + Math.max(0, currentPane - fieldPane);
      const target = Math.max(
        0,
        Math.min(
          rowTop - (laneHeight - row.offsetHeight) / 2,
          Math.max(0, lane.scrollHeight - laneHeight)
        )
      );
      try {
        lane.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
      } catch (error) {
        lane.scrollTop = target;
      }
    });

    // The jump means this search is done. Empty the field and the result rows
    // so the next search starts from a clean drawer; the drawer itself stays
    // open and the selected row keeps the context visible.
    clearSearch(false);
  }

  // ------------------------------------------------------------------------
  // Keep the drawer in sync with the subtask stage (it is rebuilt on render).
  // ------------------------------------------------------------------------
  function resetView() {
    cancelScheduledClear();
    stopClock();
    document.querySelectorAll(".subtask-search-drawer").forEach((node) => node.remove());
    document.querySelectorAll(".subtask-search-hit").forEach((node) => {
      node.classList.remove("subtask-search-hit");
    });
    panelOpen = false;
    query = "";
    activeTodoId = "";
    body.classList.remove("subtask-search-on", "subtask-search-open");
    const half = document.querySelector(".current-half");
    if (half) half.style.removeProperty("--ss-open-h");
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
      stopClock();
      query = "";
      half.style.removeProperty("--ss-open-h");
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
    schedulePaneHeight();

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

    // Paint the saved blur before the first drawer opens, then follow the
    // control page: it writes localStorage and posts a message.
    setSearchBlur(readBlur(), false);
    window.setSubtaskSearchBlur = (value) => setSearchBlur(value, false);
    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "neotodo-subtask-search-blur") return;
      setSearchBlur(event.data.value, false);
    });
    window.addEventListener("storage", (event) => {
      if (event.key !== BLUR_KEY) return;
      setSearchBlur(event.newValue === null ? BLUR_DEFAULT : event.newValue, false);
    });

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
