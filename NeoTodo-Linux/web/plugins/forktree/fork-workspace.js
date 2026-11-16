/* ==========================================================================
   FORKTREE · fork sub-app (工作台)
   --------------------------------------------------------------------------
   Opening a fork shows a small app of its own, not a NeoTodo page:

     · the forked subtask is the main task (rename / note / complete)
     · its checklist is local to this app
     · any row can be forked again, which opens a deeper sub-app
     · the right-hand 待选区 replaces the achievement shelf: every fork of the
       same NeoTodo todo waits there, and one click switches the app.

   All data lives in fork-store.js; this file only draws and edits it.
   ========================================================================== */

(() => {
  "use strict";

  const Store = window.NeoTodoFork;
  if (!Store) return;

  const FLAME = "/fork-flame.svg";
  // A sub-app opened in its own window is the main use. The plugin panel still
  // embeds the same workspace, so keep both hosts working.
  const standalone = window.parent === window;

  const $ = (selector, root = document) => root.querySelector(selector);

  let root = null;
  let activeId = null;
  let finishedOpen = false;
  let removeArmedAt = 0;
  let noteTimer = 0;
  let booted = false;

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));

  function active() {
    return activeId ? Store.get(activeId) : null;
  }

  function isOpen() {
    return Boolean(root && !root.hidden);
  }

  function formatDay(iso) {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
  }

  function stageSort(a, b) {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return String(b.createdAt).localeCompare(String(a.createdAt));
  }

  // ------------------------------------------------------------------------
  // Pieces
  // ------------------------------------------------------------------------
  function crumbsHtml(branch) {
    const chain = Store.chain(branch);
    const bits = [
      `<button class="fw-crumb" type="button" data-fw-action="open-todo">${
        escapeHtml(branch.source.todoName || "主 NeoTodo")
      }</button>`,
    ];
    for (const step of chain) {
      bits.push('<span class="fw-crumb-sep" aria-hidden="true">›</span>');
      if (step.id === branch.id) {
        bits.push(`<span class="fw-crumb is-current">${escapeHtml(step.name)}</span>`);
      } else {
        bits.push(
          `<button class="fw-crumb" type="button" data-fw-switch="${escapeHtml(step.id)}">${escapeHtml(step.name)}</button>`
        );
      }
    }
    return bits.join("");
  }

  function rowHtml(branch, subtask, done) {
    return `<li class="fw-row${done ? " is-done" : ""}" data-fw-subtask="${escapeHtml(subtask.id)}">
      <button class="fw-check" type="button" data-fw-action="toggle-subtask" aria-pressed="${done}" aria-label="${done ? "标为未完成" : "完成子任务"}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.6l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <input class="fw-row-name" type="text" value="${escapeHtml(subtask.name)}" aria-label="子任务名称" maxlength="400">
      <button class="fw-row-fork" type="button" data-fw-action="fork-subtask">
        <img src="${FLAME}" alt=""><span>Fork</span>
      </button>
      <button class="fw-row-remove" type="button" data-fw-action="remove-subtask" aria-label="删除子任务">×</button>
    </li>`;
  }

  function taskHtml(branch) {
    const progress = Store.progress(branch);
    const pending = branch.subtasks.filter((item) => !item.done);
    const finished = branch.subtasks.filter((item) => item.done);
    const doneCount = finished.length;
    const removeArmed = performance.now() < removeArmedAt;
    return `<section class="fw-task${branch.done ? " is-done" : ""}" data-fw-task>
      <div class="fw-task-head">
        <input class="fw-task-name" type="text" value="${escapeHtml(branch.name)}" maxlength="400" aria-label="子任务名称">
        <button class="fw-done-toggle${branch.done ? " is-on" : ""}" type="button" data-fw-action="toggle-done">
          <span class="fw-done-dot" aria-hidden="true"></span>${branch.done ? "已完成" : "标记完成"}
        </button>
      </div>
      <p class="fw-task-meta">
        ${escapeHtml(branch.source.todoName || "NeoTodo")}
        <span aria-hidden="true">·</span>
        ${escapeHtml(branch.source.subtaskName || branch.name)}
        <span aria-hidden="true">·</span>
        第 ${branch.source.depth || 1} 层
        <span aria-hidden="true">·</span>
        ${formatDay(branch.createdAt)}
        <em class="fw-task-fake">子应用 · 不计入 NeoTodo 成就</em>
      </p>
      <div class="fw-task-openers">
        <button class="fw-opener" type="button" data-fw-action="view-note">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h8.5L19 8v12.5H6z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 3.8V8h4.2M9 12h6M9 15.2h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <span>笔记</span>
        </button>
        <button class="fw-opener" type="button" data-fw-action="view-ai">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5h15v10h-8l-4.2 3v-3H4.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.5 9.2h7M8.5 12h4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <span>AI 对话</span>
        </button>
      </div>
      <div class="fw-progress" role="img" aria-label="子任务进度 ${progress.pct}%">
        <i style="width:${progress.pct}%"></i>
        <span>${progress.done} / ${progress.total}</span>
      </div>

      <div class="fw-add">
        <span class="fw-add-plus" aria-hidden="true">+</span>
        <input class="fw-add-input" type="text" placeholder="加一个子任务，回车确认" maxlength="400" aria-label="新建子任务">
      </div>

      <ul class="fw-list">
        ${pending.map((item) => rowHtml(branch, item, false)).join("")}
        ${pending.length ? "" : `<li class="fw-empty-row">没有待办子任务。加一个，或者直接把它标记完成。</li>`}
      </ul>

      ${doneCount ? `<section class="fw-finished">
        <button class="fw-finished-toggle${finishedOpen ? " is-open" : ""}" type="button" data-fw-action="toggle-finished" aria-expanded="${finishedOpen}">
          <span class="fw-finished-rule" aria-hidden="true"></span>
          <span>已完成 ${doneCount}</span>
          <span class="fw-finished-caret" aria-hidden="true">${finishedOpen ? "▴" : "▾"}</span>
        </button>
        ${finishedOpen ? `<ul class="fw-list fw-list-done">${finished.map((item) => rowHtml(branch, item, true)).join("")}</ul>` : ""}
      </section>` : ""}

      <label class="fw-note-label" for="fw-note">笔记</label>
      <textarea class="fw-note-input" id="fw-note" placeholder="这个子应用自己的笔记…" spellcheck="false">${escapeHtml(branch.note)}</textarea>

      <div class="fw-actions">
        <button class="fw-action" type="button" data-fw-action="open-todo">回到主 NeoTodo</button>
        <button class="fw-action fw-danger${removeArmed ? " is-armed" : ""}" type="button" data-fw-action="remove">
          ${removeArmed ? "再点一次确认删除" : "删除这个分支"}
        </button>
      </div>
    </section>`;
  }

  function stageHtml(branch) {
    const all = Store.todoBranches(branch.source.todoId).slice().sort(stageSort);
    const cards = all.map((item) => {
      const progress = Store.progress(item);
      const depth = item.source.depth || 1;
      const current = item.id === branch.id;
      return `<button class="fw-stage-card${current ? " is-current" : ""}${item.done ? " is-done" : ""}" type="button"
        data-fw-switch="${escapeHtml(item.id)}" style="--fw-depth:${Math.max(0, depth - 1)}">
        <span class="fw-stage-flame" aria-hidden="true"><img src="${FLAME}" alt=""></span>
        <span class="fw-stage-copy">
          <span class="fw-stage-name">${escapeHtml(item.name)}</span>
          <span class="fw-stage-meta">${
            item.fromBranchName
              ? `从 ${escapeHtml(item.fromBranchName)} 分出`
              : escapeHtml(item.source.subtaskName || item.source.todoName || "")
          }</span>
          <span class="fw-stage-bar"><i style="width:${progress.pct}%"></i></span>
        </span>
        <span class="fw-stage-side">
          <span class="fw-stage-count">${progress.done}/${progress.total}</span>
          ${current ? '<span class="fw-stage-tag">当前</span>' : ""}
          ${item.done ? '<span class="fw-stage-tag is-done">完成</span>' : ""}
        </span>
      </button>`;
    });
    return `<aside class="fw-stage" aria-label="待选区">
      <header class="fw-stage-head">
        <h2>待选区</h2>
        <span class="fw-stage-total">${all.length}</span>
      </header>
      <p class="fw-stage-hint">同一个 NeoTodo 的所有 fork 都排在这里，点一下就切换子应用。</p>
      <div class="fw-stage-list">
        <button class="fw-stage-card is-todo" type="button" data-fw-action="open-todo">
          <span class="fw-stage-todo-mark" aria-hidden="true"></span>
          <span class="fw-stage-copy">
            <span class="fw-stage-name">${escapeHtml(branch.source.todoName || "主 NeoTodo")}</span>
            <span class="fw-stage-meta">原来的 NeoTodo 任务</span>
          </span>
          <span class="fw-stage-side"><span class="fw-stage-tag is-todo">主</span></span>
        </button>
        ${cards.join("")}
      </div>
    </aside>`;
  }

  function shellHtml(branch) {
    return `<div class="fw-shell" data-fw-root>
      <header class="fw-head">
        <button class="fw-back" type="button" data-fw-action="back">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5L4 11l6 6M4 11h10a6 6 0 0 1 6 6v1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>分支地图</span>
        </button>
        <div class="fw-brand">
          <span class="fw-mark" aria-hidden="true"><img src="${FLAME}" alt=""></span>
          <div class="fw-brand-copy">
            <span class="fw-kicker">FORK · 子应用</span>
            <h1 class="fw-title">${escapeHtml(branch.name)}</h1>
          </div>
        </div>
        <div class="fw-head-actions">
          <button class="fw-pill" type="button" data-fw-action="open-todo">回到主 NeoTodo</button>
          <button class="fw-icon" type="button" data-fw-action="close" aria-label="关闭 Forktree">×</button>
        </div>
      </header>
      <div class="fw-body">
        <main class="fw-board">
          <nav class="fw-crumbs" aria-label="来源">${crumbsHtml(branch)}</nav>
          ${taskHtml(branch)}
        </main>
        ${stageHtml(branch)}
      </div>
      <div class="fw-viewer" data-fw-viewer hidden>
        <div class="fw-viewer-card" role="dialog" aria-modal="true" aria-labelledby="fw-viewer-title">
          <header class="fw-viewer-head">
            <h2 class="fw-viewer-title" id="fw-viewer-title">笔记</h2>
            <button class="fw-viewer-close" type="button" data-fw-action="close-viewer" aria-label="关闭">×</button>
          </header>
          <div class="fw-viewer-body"></div>
        </div>
      </div>
    </div>`;
  }

  // ------------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------------
  function render(options = {}) {
    const branch = active();
    if (!root) return;
    if (!branch) {
      close();
      return;
    }
    const board = $(".fw-board", root);
    const boardScroll = board ? board.scrollTop : 0;
    const stage = $(".fw-stage-list", root);
    const stageScroll = stage ? stage.scrollTop : 0;

    root.innerHTML = shellHtml(branch);

    const nextBoard = $(".fw-board", root);
    if (nextBoard) nextBoard.scrollTop = options.keepBoardScroll === false ? 0 : boardScroll;
    const nextStage = $(".fw-stage-list", root);
    if (nextStage) nextStage.scrollTop = stageScroll;

    document.documentElement.dataset.fwMode = "fork";

    if (options.focus === "add") {
      const input = $(".fw-add-input", root);
      input?.focus();
    }
  }

  function switchTo(id, options = {}) {
    const branch = Store.get(id);
    if (!branch) {
      close();
      return;
    }
    activeId = branch.id;
    finishedOpen = false;
    removeArmedAt = 0;
    if (standalone) document.title = `NeoTodo · ${branch.name} · 子应用`;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("fork", branch.id);
      url.searchParams.delete("todo");
      window.history.replaceState(null, "", url.pathname + url.search);
    } catch (error) {}
    openShell();
    render(options);
  }

  function openShell() {
    if (!root) return;
    root.hidden = false;
    document.documentElement.dataset.fwMode = "fork";
    // The sub-app has everything it needs in the fork store; do not wait for
    // the map's /api/state fetch before showing the focused task.
    document.documentElement.classList.remove("ft-booting");
  }

  function open(id) {
    if (!id) return;
    switchTo(String(id));
    try { window.focus(); } catch (error) {}
  }

  function close() {
    activeId = null;
    finishedOpen = false;
    removeArmedAt = 0;
    if (root) {
      root.hidden = true;
      root.innerHTML = "";
    }
    document.documentElement.dataset.fwMode = "map";
    if (standalone) document.title = "Forktree · NeoTodo";
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("fork");
      url.searchParams.delete("todo");
      window.history.replaceState(null, "", url.pathname + url.search);
    } catch (error) {}
    window.dispatchEvent(new CustomEvent("neotodo-fork-map-refresh"));
  }

  // ------------------------------------------------------------------------
  // Host bridge
  // ------------------------------------------------------------------------
  function backToTodo() {
    const branch = active();
    if (!branch) return;
    const target = {
      categoryId: branch.source.categoryId || "",
      todoId: branch.source.todoId || "",
      subtaskId: branch.source.subtaskId || "",
    };
    if (window.parent !== window) {
      window.parent.postMessage({ type: "neotodo-forktree-open", target }, window.location.origin);
      return;
    }
    const homeUrl = target.categoryId
      ? `/?category=${encodeURIComponent(target.categoryId)}`
      : "/";
    if (window.NeoTodoAndroid?.home) {
      try {
        window.NeoTodoAndroid.home();
        return;
      } catch (error) {}
    }
    // A fork window is a real app window: go back to the notebook window
    // instead of turning this one into a second main page.
    try {
      const bridge = document.createElement("iframe");
      bridge.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-10px;top:-10px;border:0";
      bridge.src = `https://neotodo.local/home?t=${Date.now()}`;
      document.body.appendChild(bridge);
    } catch (error) {}
    window.setTimeout(() => {
      try { window.close(); } catch (error) {}
      window.setTimeout(() => {
        if (!window.closed) window.location.href = homeUrl;
      }, 420);
    }, 500);
  }

  function closePlugin() {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "neotodo-plugin-close" }, window.location.origin);
      return;
    }
    window.close();
  }

  // ------------------------------------------------------------------------
  // Original note / AI conversation
  // ------------------------------------------------------------------------
  function viewerParts() {
    const viewer = $("[data-fw-viewer]", root);
    return {
      viewer,
      title: viewer ? $(".fw-viewer-title", viewer) : null,
      body: viewer ? $(".fw-viewer-body", viewer) : null,
    };
  }

  function showViewer(title, html) {
    const parts = viewerParts();
    if (!parts.viewer || !parts.body) return;
    if (parts.title) parts.title.textContent = title;
    parts.body.innerHTML = html;
    parts.viewer.hidden = false;
  }

  function closeViewer() {
    const { viewer } = viewerParts();
    if (viewer) viewer.hidden = true;
  }

  function openNoteViewer() {
    const branch = active();
    if (!branch) return;
    // Read the live textarea first: a just-typed line should appear even
    // before the debounced store write lands.
    const input = $(".fw-note-input", root);
    const note = String(input ? input.value : branch.note || "").trim();
    showViewer(
      "笔记",
      note
        ? `<pre class="fw-viewer-text">${escapeHtml(note)}</pre>`
        : `<p class="fw-viewer-empty">这个子任务还没有笔记。</p>`
    );
  }

  async function openAiViewer() {
    const branch = active();
    if (!branch) return;
    const subtaskId = String(branch.source?.subtaskId || "");
    showViewer("AI 对话", `<p class="fw-viewer-empty">正在读取 AI 对话…</p>`);
    if (!subtaskId) {
      showViewer("AI 对话", `<p class="fw-viewer-empty">这个子任务没有原来的 AI 对话。</p>`);
      return;
    }
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", agent_id: `subtask:${subtaskId}` }),
      });
      const data = await response.json();
      const messages = Array.isArray(data?.agent?.messages) ? data.agent.messages : [];
      const visible = messages.filter((message) => (
        message && String(message.content || "").trim()
      ));
      if (!visible.length) {
        showViewer("AI 对话", `<p class="fw-viewer-empty">这个子任务还没有 AI 对话。</p>`);
        return;
      }
      showViewer("AI 对话", `<div class="fw-viewer-log">${visible.map((message) => {
        const role = message.role === "assistant"
          ? "assistant"
          : message.role === "system" ? "system" : "user";
        const label = role === "assistant" ? "AI" : role === "system" ? "系统" : "你";
        return `<article class="fw-viewer-msg is-${role}">
          <b>${label}</b>
          <p>${escapeHtml(String(message.content || ""))}</p>
        </article>`;
      }).join("")}</div>`);
    } catch (error) {
      showViewer("AI 对话", `<p class="fw-viewer-empty">读取 AI 对话失败。</p>`);
    }
  }

  // ------------------------------------------------------------------------
  // Local edits
  // ------------------------------------------------------------------------
  function addSubtask(value) {
    const branch = active();
    const name = String(value || "").trim();
    if (!branch || !name) return;
    Store.addSubtask(branch.id, name);
    render({ focus: "add" });
  }

  function forkSubtask(subtask) {
    const branch = active();
    if (!branch || !subtask) return;
    const child = Store.create({
      name: subtask.name,
      note: "",
      fromBranchId: branch.id,
      source: {
        subtaskId: subtask.id,
        subtaskName: subtask.name,
      },
    });
    if (!child) return;
    switchTo(child.id);
    window.setTimeout(() => {
      const input = $(".fw-add-input", root);
      input?.focus();
    }, 30);
  }

  function armRemove() {
    removeArmedAt = performance.now() + 3600;
    render({ keepBoardScroll: true });
    window.setTimeout(() => {
      if (!isOpen()) return;
      if (performance.now() >= removeArmedAt) {
        const button = $('[data-fw-action="remove"]', root);
        button?.classList.remove("is-armed");
        if (button) button.textContent = "删除这个分支";
      }
    }, 3700);
  }

  function removeActive() {
    const branch = active();
    if (!branch) return;
    const parent = branch.fromBranchId ? Store.get(branch.fromBranchId) : null;
    const fallback = Store.todoBranches(branch.source.todoId)
      .filter((item) => item.id !== branch.id && !Store.chain(item).some((step) => step.id === branch.id))
      .sort(stageSort)[0] || null;
    Store.remove(branch.id);
    if (parent) switchTo(parent.id);
    else if (fallback) switchTo(fallback.id);
    else close();
  }

  // ------------------------------------------------------------------------
  // Events
  // ------------------------------------------------------------------------
  function handleAction(action, row) {
    const branch = active();
    if (!branch || !action) return;
    if (action === "back") { close(); return; }
    if (action === "close") { closePlugin(); return; }
    if (action === "open-todo") { backToTodo(); return; }
    if (action === "toggle-done") { Store.update(branch.id, { done: !branch.done }); render(); return; }
    if (action === "toggle-finished") { finishedOpen = !finishedOpen; render(); return; }
    if (action === "view-note") { openNoteViewer(); return; }
    if (action === "view-ai") { openAiViewer(); return; }
    if (action === "close-viewer") { closeViewer(); return; }
    if (action === "remove") {
      if (performance.now() < removeArmedAt) removeActive();
      else armRemove();
      return;
    }
    if (!row) return;
    const subtask = branch.subtasks.find((item) => item.id === row.dataset.fwSubtask);
    if (!subtask) return;
    if (action === "toggle-subtask") {
      const wasDone = subtask.done;
      Store.updateSubtask(branch.id, subtask.id, { done: !wasDone });
      // Checking a row drops it into the finished shelf and opens it; clearing
      // a row brings it back to the top of the list.
      if (!wasDone) finishedOpen = true;
      render();
      return;
    }
    if (action === "fork-subtask") { forkSubtask(subtask); return; }
    if (action === "remove-subtask") {
      Store.removeSubtask(branch.id, subtask.id);
      render();
    }
  }

  function bind() {
    if (!root) return;

    root.addEventListener("click", (event) => {
      // A click on the dimmed backdrop closes the note / AI viewer.
      if (event.target.matches?.("[data-fw-viewer]")) {
        closeViewer();
        return;
      }
      const switchCard = event.target.closest("[data-fw-switch]");
      if (switchCard) {
        event.preventDefault();
        switchTo(switchCard.dataset.fwSwitch);
        return;
      }
      const trigger = event.target.closest("[data-fw-action]");
      if (!trigger) return;
      event.preventDefault();
      handleAction(trigger.dataset.fwAction, trigger.closest(".fw-row"));
    });

    root.addEventListener("change", (event) => {
      const branch = active();
      if (!branch) return;
      const target = event.target;
      if (target.classList.contains("fw-task-name")) {
        Store.update(branch.id, { name: target.value });
        render({ keepBoardScroll: true });
        return;
      }
      if (target.classList.contains("fw-row-name")) {
        const row = target.closest(".fw-row");
        if (row) Store.updateSubtask(branch.id, row.dataset.fwSubtask, { name: target.value });
      }
    });

    root.addEventListener("keydown", (event) => {
      const target = event.target;
      if (target.classList.contains("fw-add-input")) {
        if (event.key === "Enter") {
          event.preventDefault();
          addSubtask(target.value);
        }
        return;
      }
      if (target.classList.contains("fw-task-name") || target.classList.contains("fw-row-name")) {
        if (event.key === "Enter") {
          event.preventDefault();
          target.blur();
        }
        return;
      }
      if (event.key === "Escape") {
        if (target.matches("input, textarea")) { target.blur(); return; }
        const { viewer } = viewerParts();
        if (viewer && !viewer.hidden) {
          event.preventDefault();
          closeViewer();
          return;
        }
        event.preventDefault();
        close();
      }
    });

    root.addEventListener("input", (event) => {
      const branch = active();
      if (!branch || !event.target.classList.contains("fw-note-input")) return;
      const value = event.target.value;
      clearTimeout(noteTimer);
      noteTimer = window.setTimeout(() => Store.update(branch.id, { note: value }), 280);
    });

    // Switching a row's name should not fire twice after the blur render.
    root.addEventListener("blur", (event) => {
      if (event.target.classList?.contains("fw-note-input")) {
        const branch = active();
        if (branch) Store.update(branch.id, { note: event.target.value });
      }
      if (event.target.classList?.contains("fw-task-name")) {
        const branch = active();
        if (branch && !String(event.target.value).trim()) {
          event.target.value = branch.name;
        }
      }
    }, true);
  }

  // ------------------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------------------
  function boot() {
    root = document.getElementById("ft-workspace");
    if (!root || booted) return;
    booted = true;
    bind();

    let params = null;
    try { params = new URLSearchParams(window.location.search); } catch (error) {}
    const forkId = params?.get("fork") || "";
    const todoId = params?.get("todo") || "";

    if (forkId && Store.get(forkId)) {
      open(forkId);
    } else if (todoId) {
      const latest = Store.todoBranches(todoId).sort(stageSort)[0];
      if (latest) open(latest.id);
    }

    Store.subscribe(() => {
      if (!isOpen()) return;
      if (!activeId) return;
      const focused = document.activeElement;
      if (focused && root.contains(focused) && focused.matches("input, textarea")) return;
      render({ keepBoardScroll: true });
    });

    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "neotodo-forktree-fork" && event.data.branchId) {
        open(String(event.data.branchId));
      }
    });
  }

  window.NeoTodoForkWorkspace = { boot, open, close, isOpen, render, get activeId() { return activeId; } };
  boot();
})();
