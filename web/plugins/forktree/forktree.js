/* ==========================================================================
   FORKTREE · 分支地图
   --------------------------------------------------------------------------
   Reads the current NeoTodo state and draws one left-to-right mind map:

       NeoTodo → categories → todos → subtasks → forks → …

   Every card knows which category / todo / subtask it belongs to. Clicking a
   card posts that target back to the host, which closes the plugin and opens
   the matching task page. The map can be panned, zoomed, collapsed and
   searched, and it follows the active postcard theme.
   ========================================================================== */

(() => {
  "use strict";

  const NODE_WIDTH = 216;
  const COLUMN_GAP = 76;
  const ROW_GAP = 13;
  const PAD_X = 38;
  const PAD_Y = 38;
  const MIN_ZOOM = 0.24;
  const MAX_ZOOM = 1.8;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const els = {
    viewport: $("#ft-viewport"),
    canvas: $("#ft-canvas"),
    lines: $("#ft-lines"),
    nodes: $("#ft-nodes"),
    loading: $("#ft-loading"),
    empty: $("#ft-empty"),
    error: $("#ft-error"),
    errorText: $("#ft-error-text"),
    search: $("#ft-search"),
    searchCount: $("#ft-search-count"),
    zoomLabel: $("#ft-zoom-label"),
    statCategories: $("#ft-stat-categories"),
    statTodos: $("#ft-stat-todos"),
    statSubtasks: $("#ft-stat-subtasks"),
    statForks: $("#ft-stat-forks"),
    refresh: $('[data-ft-action="refresh"]'),
  };

  let rootNode = null;
  let nodeById = new Map();
  let allNodes = [];
  let collapsed = new Set();
  let savedCollapsed = null;
  let searching = false;
  let searchQuery = "";
  let matches = [];
  let bounds = { width: 0, height: 0 };
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let viewTouched = false;
  let hasLoaded = false;
  let loading = false;
  let suppressClickUntil = 0;
  let resizeFrame = 0;

  const counts = { categories: 0, todos: 0, subtasks: 0, forks: 0 };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[character]));
  }

  function addToMap(map, key, value) {
    if (!key) return;
    let list = map.get(key);
    if (!list) {
      list = [];
      map.set(key, list);
    }
    list.push(value);
  }

  // ------------------------------------------------------------------------
  // Theme: follow the notebook's postcard paper, ink and accent colours.
  // ------------------------------------------------------------------------
  function syncTheme() {
    try {
      if (window.parent === window) return;
      const parentRoot = window.parent.document.documentElement;
      document.documentElement.dataset.ftDark =
        parentRoot.dataset.postcardDark === "true" ? "true" : "false";
      const styles = window.parent.getComputedStyle(parentRoot);
      for (const [source, target] of [
        ["--pc-paper", "--ft-paper"],
        ["--pc-paper2", "--ft-paper2"],
        ["--pc-ink", "--ft-ink"],
        ["--pc-muted", "--ft-muted"],
        ["--pc-border", "--ft-border"],
        ["--pc-line", "--ft-line"],
      ]) {
        const value = styles.getPropertyValue(source).trim();
        if (value) document.documentElement.style.setProperty(target, value);
      }
    } catch (error) {}
  }

  window.addEventListener("message", (event) => {
    if (event.data?.type !== "neotodo-theme") return;
    document.documentElement.dataset.ftDark = event.data.dark ? "true" : "false";
    syncTheme();
  });

  // ------------------------------------------------------------------------
  // Data → tree
  // ------------------------------------------------------------------------
  function buildTree(data) {
    const categories = Array.isArray(data?.categories) ? data.categories : [];
    const forksBySubtask = new Map();
    const extrasByRoot = new Map();

    for (const category of categories) {
      if (!category || typeof category !== "object") continue;
      const from = category.forked_from;
      if (from && typeof from === "object" && from.subtask_id) {
        addToMap(forksBySubtask, String(from.subtask_id), category);
      }
      if (category.fork_root) addToMap(extrasByRoot, String(category.fork_root), category);
    }

    const consumed = new Set();
    counts.categories = categories.length;
    counts.todos = 0;
    counts.subtasks = 0;
    counts.forks = 0;

    const root = {
      id: "root",
      kind: "root",
      name: "NeoTodo",
      kicker: "WORKSPACE",
      meta: "",
      categoryId: "",
      todoId: "",
      subtaskId: "",
      color: "#4e7ad2",
      done: false,
      current: false,
      children: [],
      height: 0,
      x: 0,
      y: 0,
      subtreeHeight: 0,
      visibleChildren: [],
    };

    function categoryNode(category, kind) {
      if (!category || consumed.has(category.id)) return null;
      consumed.add(category.id);

      const todos = Array.isArray(category.todos) ? category.todos : [];
      const openTodo = todos.find((todo) => todo && !todo.done) || null;
      const doneCount = todos.filter((todo) => todo?.done).length;
      const node = {
        id: `${kind === "branch" ? "branch" : "cat"}:${category.id}`,
        kind,
        name: category.name || "Untitled category",
        kicker: kind === "branch" ? "CATEGORY · IN FORK" : "CATEGORY",
        meta: `${todos.length} 个任务${doneCount ? ` · ${doneCount} 完成` : ""}`,
        categoryId: String(category.id || ""),
        todoId: "",
        subtaskId: "",
        color: category.color || "#4e7ad2",
        done: false,
        current: false,
        children: [],
        height: 0,
        x: 0,
        y: 0,
        subtreeHeight: 0,
        visibleChildren: [],
      };
      node.children = todos
        .map((todo) => todoNode(todo, category, openTodo))
        .filter(Boolean);
      return node;
    }

    function todoNode(todo, category, openTodo) {
      if (!todo) return null;
      const subtasks = Array.isArray(todo.subtasks) ? todo.subtasks : [];
      const doneSubs = subtasks.filter((subtask) => subtask?.done).length;
      const nextSubtask = subtasks.find((subtask) => subtask && !subtask.done) || null;
      const isCurrent = !todo.done && openTodo && openTodo.id === todo.id;
      const node = {
        id: `todo:${todo.id}`,
        kind: "todo",
        name: todo.name || "Untitled todo",
        kicker: todo.done ? "TODO · DONE" : isCurrent ? "TODO · CURRENT" : "TODO · OPEN",
        meta: subtasks.length
          ? `${doneSubs} / ${subtasks.length} 子任务${todo.done ? " · 已完成" : ""}`
          : todo.done ? "已完成" : "还没有子任务",
        categoryId: String(category.id || ""),
        todoId: String(todo.id || ""),
        subtaskId: "",
        color: category.color || "#4e7ad2",
        done: Boolean(todo.done),
        current: Boolean(isCurrent),
        children: [],
        height: 0,
        x: 0,
        y: 0,
        subtreeHeight: 0,
        visibleChildren: [],
      };
      counts.todos += 1;
      node.children = subtasks
        .map((subtask) => subtaskNode(subtask, category, todo, nextSubtask))
        .filter(Boolean);
      return node;
    }

    function subtaskNode(subtask, category, todo, nextSubtask) {
      if (!subtask) return null;
      const forks = forksBySubtask.get(String(subtask.id)) || [];
      const isNext = !subtask.done && nextSubtask && nextSubtask.id === subtask.id;
      const bits = [];
      if (subtask.note) bits.push("有笔记");
      if (forks.length) bits.push(`fork × ${forks.length}`);
      if (subtask.done) bits.push("已完成");
      const node = {
        id: `sub:${subtask.id}`,
        kind: "subtask",
        name: subtask.name || "Untitled subtask",
        kicker: subtask.done ? "SUBTASK · DONE" : isNext ? "SUBTASK · NEXT" : "SUBTASK · OPEN",
        meta: bits.join(" · ") || (isNext ? "即将开始" : "待完成"),
        categoryId: String(category.id || ""),
        todoId: String(todo.id || ""),
        subtaskId: String(subtask.id || ""),
        color: category.color || "#4e7ad2",
        done: Boolean(subtask.done),
        current: Boolean(isNext),
        children: [],
        height: 0,
        x: 0,
        y: 0,
        subtreeHeight: 0,
        visibleChildren: [],
      };
      counts.subtasks += 1;
      node.children = forks.map((fork) => forkNode(fork)).filter(Boolean);
      return node;
    }

    function forkNode(category) {
      if (!category || consumed.has(category.id)) return null;
      consumed.add(category.id);
      counts.forks += 1;

      const from = category.forked_from && typeof category.forked_from === "object"
        ? category.forked_from
        : {};
      const extras = (extrasByRoot.get(String(category.id)) || [])
        .filter((extra) => extra && !consumed.has(extra.id));
      const todos = Array.isArray(category.todos) ? category.todos : [];
      const openTodo = todos.find((todo) => todo && !todo.done) || null;
      const node = {
        id: `fork:${category.id}`,
        kind: "fork",
        name: category.name || from.todo_name || "Fork",
        kicker: "FORK · BRANCH",
        meta: from.subtask_name
          ? `从 “${from.subtask_name}” 分出`
          : from.todo_name ? `来自 ${from.todo_name}` : "一个独立分支",
        categoryId: String(category.id || ""),
        todoId: "",
        subtaskId: "",
        color: "#de6a34",
        done: false,
        current: false,
        children: [],
        height: 0,
        x: 0,
        y: 0,
        subtreeHeight: 0,
        visibleChildren: [],
      };
      node.children = [
        ...todos.map((todo) => todoNode(todo, category, openTodo)).filter(Boolean),
        ...extras.map((extra) => categoryNode(extra, "branch")).filter(Boolean),
      ];
      return node;
    }

    for (const category of categories) {
      if (!category || category.forked_from || category.fork_root) continue;
      const node = categoryNode(category, "category");
      if (node) root.children.push(node);
    }

    // A fork whose source subtask was deleted still deserves a place on the
    // map, so orphaned branches hang from the root instead of disappearing.
    for (const category of categories) {
      if (!category || consumed.has(category.id) || !category.forked_from) continue;
      const node = forkNode(category);
      if (node) root.children.push(node);
    }

    // Anything left over (for example a category whose fork root is gone) is
    // still drawn, so the map never hides user data.
    for (const category of categories) {
      if (!category || consumed.has(category.id)) continue;
      const node = categoryNode(category, category.fork_root ? "branch" : "category");
      if (node) root.children.push(node);
    }

    root.meta = `${counts.categories} 分类 · ${counts.forks} 条分支`;
    return root;
  }

  // ------------------------------------------------------------------------
  // Node cards
  // ------------------------------------------------------------------------
  function markHtml(node) {
    if (node.kind === "root") {
      return '<span class="ft-mark"><img src="forktree.svg" alt=""></span>';
    }
    if (node.kind === "fork") {
      return '<span class="ft-mark"><img src="/fork-flame.svg" alt=""></span>';
    }
    if (node.kind === "todo" || node.kind === "subtask") {
      return '<span class="ft-status" aria-hidden="true"></span>';
    }
    return `<span class="ft-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M4 6.6h5.2l1.6 2H20v9.2H4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M4 9.4h16" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".55"/>
      </svg>
    </span>`;
  }

  function createNodeElement(node) {
    const el = document.createElement("div");
    el.className = `ft-node ft-node-${node.kind}`;
    el.dataset.nodeId = node.id;
    el.style.setProperty("--cat-color", node.color);
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    if (node.done) el.classList.add("is-done");
    if (node.current) el.classList.add("is-current");
    if (collapsed.has(node.id)) el.classList.add("is-collapsed");

    const title = node.kind === "root"
      ? "回到全图"
      : `${node.name} · 点击打开`;
    el.setAttribute("aria-label", title);
    el.title = title;

    const hasChildren = node.children.length > 0;
    el.innerHTML = `${markHtml(node)}
      <span class="ft-node-main">
        <span class="ft-kicker">${escapeHtml(node.kicker)}</span>
        <span class="ft-name">${escapeHtml(node.name)}</span>
        ${node.meta ? `<span class="ft-meta">${escapeHtml(node.meta)}</span>` : ""}
      </span>
      ${hasChildren ? `<button class="ft-toggle" type="button" aria-expanded="${!collapsed.has(node.id)}" aria-label="${collapsed.has(node.id) ? "展开分支" : "收起分支"}">${node.children.length}</button>` : ""}`;
    return el;
  }

  function walkAll(node, visit) {
    if (!node) return;
    visit(node);
    for (const child of node.children || []) walkAll(child, visit);
  }

  function walkVisible(node, visit) {
    if (!node) return;
    visit(node);
    for (const child of node.visibleChildren || []) walkVisible(child, visit);
  }

  function renderTree() {
    els.nodes.innerHTML = "";
    nodeById = new Map();
    allNodes = [];

    const fragment = document.createDocumentFragment();
    walkAll(rootNode, (node) => {
      const el = createNodeElement(node);
      node.el = el;
      nodeById.set(node.id, node);
      allNodes.push(node);
      fragment.appendChild(el);
    });
    els.nodes.appendChild(fragment);

    // Heights are measured once while every card is visible. The layout then
    // uses these cached heights even for branches that are folded away.
    for (const node of allNodes) node.height = node.el.offsetHeight || 58;

    layoutTree();
    drawLines();
    updateStats();
    paintSearch();
  }

  // ------------------------------------------------------------------------
  // Layout: a tidy left-to-right tree. Every subtree owns a vertical span, so
  // sibling branches can never overlap, and parents sit centred on their span.
  // ------------------------------------------------------------------------
  function measureSpan(node) {
    const folded = collapsed.has(node.id);
    node.visibleChildren = folded ? [] : node.children;
    node.el.style.display = "";
    node.el.classList.toggle("is-collapsed", folded);

    if (!node.visibleChildren.length) {
      node.subtreeHeight = node.height;
      return node.subtreeHeight;
    }

    let childrenSpan = 0;
    for (const child of node.visibleChildren) {
      childrenSpan += measureSpan(child);
    }
    childrenSpan += ROW_GAP * (node.visibleChildren.length - 1);
    node.subtreeHeight = Math.max(node.height, childrenSpan);
    return node.subtreeHeight;
  }

  function assignPosition(node, top, depth) {
    node.x = PAD_X + depth * (NODE_WIDTH + COLUMN_GAP);
    const children = node.visibleChildren;
    let childrenSpan = 0;
    if (children.length) {
      childrenSpan = children.reduce((sum, child) => sum + child.subtreeHeight, 0);
      childrenSpan += ROW_GAP * (children.length - 1);
    }
    node.y = top + Math.max(0, (node.subtreeHeight - node.height) / 2);

    if (children.length) {
      let childTop = top + (node.subtreeHeight - childrenSpan) / 2;
      for (const child of children) {
        assignPosition(child, childTop, depth + 1);
        childTop += child.subtreeHeight + ROW_GAP;
      }
    }

    node.el.style.left = `${node.x}px`;
    node.el.style.top = `${node.y}px`;
  }

  function layoutTree() {
    if (!rootNode) return;

    for (const node of allNodes) node.el.style.display = "none";

    measureSpan(rootNode);
    assignPosition(rootNode, PAD_Y, 0);

    let right = 0;
    let bottom = 0;
    walkVisible(rootNode, (node) => {
      right = Math.max(right, node.x + NODE_WIDTH);
      bottom = Math.max(bottom, node.y + node.height);
    });
    bounds = {
      width: Math.max(1, right + PAD_X),
      height: Math.max(1, bottom + PAD_Y),
    };
    els.canvas.style.width = `${bounds.width}px`;
    els.canvas.style.height = `${bounds.height}px`;

    // Hidden cards are display:none, so re-show every visible card once.
    walkVisible(rootNode, (node) => { node.el.style.display = ""; });
  }

  function lineClass(parent, child) {
    const classes = ["link"];
    if (parent.kind === "root") classes.push("link-root");
    if (child.kind === "fork") classes.push("link-fork");
    if (child.done) classes.push("link-done");
    return classes.join(" ");
  }

  function drawLines() {
    const paths = [];
    walkVisible(rootNode, (parent) => {
      for (const child of parent.visibleChildren) {
        const x1 = parent.x + NODE_WIDTH;
        const y1 = parent.y + parent.height / 2;
        const x2 = child.x;
        const y2 = child.y + child.height / 2;
        const curve = Math.max(26, (x2 - x1) * 0.48);
        const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${(x1 + curve).toFixed(1)} ${y1.toFixed(1)}, ${(x2 - curve).toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
        paths.push(`<path class="${lineClass(parent, child)}" data-parent="${escapeHtml(parent.id)}" data-child="${escapeHtml(child.id)}" d="${d}"/>`);
      }
    });
    els.lines.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
    els.lines.setAttribute("width", String(bounds.width));
    els.lines.setAttribute("height", String(bounds.height));
    els.lines.innerHTML = paths.join("");
  }

  function updateStats() {
    els.statCategories.textContent = String(counts.categories);
    els.statTodos.textContent = String(counts.todos);
    els.statSubtasks.textContent = String(counts.subtasks);
    els.statForks.textContent = String(counts.forks);
  }

  // ------------------------------------------------------------------------
  // Search: matching cards glow, the rest of the map fades back. All branches
  // open while a query is active so nothing can hide behind a folded card.
  // ------------------------------------------------------------------------
  function paintSearch() {
    matches = [];
    const terms = searchQuery
      ? searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
      : [];

    const visit = (node) => {
      const haystack = `${node.name} ${node.kicker} ${node.meta}`.toLowerCase();
      const match = terms.length > 0 && terms.every((term) => haystack.includes(term));
      let childMatch = false;
      for (const child of node.children) {
        if (visit(child)) childMatch = true;
      }
      node.match = Boolean(match);
      node.path = !match && childMatch;
      if (node.el) {
        node.el.classList.toggle("is-match", Boolean(match));
        node.el.classList.toggle("is-path", Boolean(node.path));
        node.el.classList.toggle("is-dim", terms.length > 0 && !match && !childMatch);
      }
      if (match) matches.push(node);
      return Boolean(match) || childMatch;
    };

    if (rootNode) visit(rootNode);

    // If the first hit is outside the viewport, bring it into view instead of
    // leaving the user searching a map that looks empty.
    if (terms.length && matches.length) {
      const width = els.viewport.clientWidth || 1;
      const height = els.viewport.clientHeight || 1;
      const visible = matches.some((node) => {
        const left = panX + node.x * zoom;
        const top = panY + node.y * zoom;
        return left + NODE_WIDTH * zoom > 24
          && left < width - 24
          && top + node.height * zoom > 24
          && top < height - 24;
      });
      if (!visible) centerOnNode(matches[0]);
    }

    $$("[data-child]", els.lines).forEach((path) => {
      const child = nodeById.get(path.dataset.child);
      path.classList.toggle("link-match", Boolean(terms.length && child?.match));
      path.classList.toggle("link-path", Boolean(terms.length && child?.path));
      path.classList.toggle("link-dim", Boolean(terms.length && !child?.match && !child?.path));
    });

    els.searchCount.textContent = searchQuery
      ? String(matches.length)
      : "";
  }

  function applySearch(raw) {
    const next = String(raw || "").trim();
    const wasSearching = searching;
    searchQuery = next;

    if (searchQuery && !searching) {
      searching = true;
      savedCollapsed = new Set(collapsed);
      collapsed.clear();
      layoutTree();
      drawLines();
    } else if (!searchQuery && searching) {
      searching = false;
      collapsed = savedCollapsed || new Set();
      savedCollapsed = null;
      layoutTree();
      drawLines();
    } else if (searchQuery && wasSearching) {
      // Query changed while all branches are already open; nothing to relayout.
    }

    paintSearch();
  }

  // ------------------------------------------------------------------------
  // Pan + zoom
  // ------------------------------------------------------------------------
  function applyTransform() {
    els.canvas.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`;
    els.zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  }

  function setZoomAt(nextZoom, clientX, clientY) {
    const rect = els.viewport.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    const worldX = (localX - panX) / zoom;
    const worldY = (localY - panY) / zoom;
    zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
    panX = localX - worldX * zoom;
    panY = localY - worldY * zoom;
    viewTouched = true;
    applyTransform();
  }

  function zoomFromCenter(factor) {
    const rect = els.viewport.getBoundingClientRect();
    setZoomAt(zoom * factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  function fitView() {
    const width = els.viewport.clientWidth || 1;
    const height = els.viewport.clientHeight || 1;
    const scale = Math.min(
      (width - 72) / Math.max(1, bounds.width),
      (height - 72) / Math.max(1, bounds.height),
      1.15
    );
    zoom = clamp(scale, MIN_ZOOM, MAX_ZOOM);
    panX = (width - bounds.width * zoom) / 2;
    panY = (height - bounds.height * zoom) / 2;
    viewTouched = true;
    applyTransform();
  }

  function initialView() {
    if (!rootNode) return;
    const width = els.viewport.clientWidth || 1;
    const height = els.viewport.clientHeight || 1;
    const fitScale = Math.min(
      (width - 96) / Math.max(1, bounds.width),
      (height - 96) / Math.max(1, bounds.height)
    );
    if (fitScale >= 0.52) {
      fitView();
      // The first automatic fit should follow future window resizes until the
      // user pans or zooms by hand.
      viewTouched = false;
      return;
    }
    // A very large tree opens on its root and the first ring of branches.
    zoom = 0.92;
    panX = 34 - rootNode.x * zoom;
    panY = height * 0.46 - (rootNode.y + rootNode.height / 2) * zoom;
    viewTouched = false;
    applyTransform();
  }

  function centerOnNode(node) {
    if (!node) return;
    const width = els.viewport.clientWidth || 1;
    const height = els.viewport.clientHeight || 1;
    zoom = Math.max(zoom, 0.82);
    panX = width / 2 - (node.x + NODE_WIDTH / 2) * zoom;
    panY = height / 2 - (node.y + node.height / 2) * zoom;
    viewTouched = true;
    applyTransform();
  }

  // ------------------------------------------------------------------------
  // Pointer gestures
  // ------------------------------------------------------------------------
  const activePointers = new Map();
  let panGesture = null;
  let pinchGesture = null;

  function localPoint(clientX, clientY) {
    const rect = els.viewport.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function startPinch() {
    const points = [...activePointers.values()];
    if (points.length < 2) return;
    const [a, b] = points;
    const mid = localPoint((a.x + b.x) / 2, (a.y + b.y) / 2);
    pinchGesture = {
      distance: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)),
      mid,
      zoom,
      panX,
      panY,
    };
    panGesture = null;
  }

  els.viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    // Toolbar controls keep their native tap behaviour.
    if (event.target.closest("button, input, .ft-zoom, .ft-legend")) return;

    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (activePointers.size === 1) {
      const onCard = Boolean(event.target.closest(".ft-node"));
      panGesture = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        panX,
        panY,
        moved: false,
        // A card press is first a tap. Capture starts only after the pointer
        // really moves, so a plain click still reaches the card.
        onCard,
      };
      viewTouched = true;
      if (!onCard) {
        try { els.viewport.setPointerCapture(event.pointerId); } catch (error) {}
      }
    } else if (activePointers.size === 2) {
      startPinch();
    }
  });

  els.viewport.addEventListener("pointermove", (event) => {
    if (!activePointers.has(event.pointerId)) return;
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pinchGesture && activePointers.size >= 2) {
      const points = [...activePointers.values()];
      const [a, b] = points;
      const mid = localPoint((a.x + b.x) / 2, (a.y + b.y) / 2);
      const distance = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
      const nextZoom = clamp(
        pinchGesture.zoom * (distance / pinchGesture.distance),
        MIN_ZOOM,
        MAX_ZOOM
      );
      const worldX = (pinchGesture.mid.x - pinchGesture.panX) / pinchGesture.zoom;
      const worldY = (pinchGesture.mid.y - pinchGesture.panY) / pinchGesture.zoom;
      zoom = nextZoom;
      panX = mid.x - worldX * zoom;
      panY = mid.y - worldY * zoom;
      viewTouched = true;
      applyTransform();
      suppressClickUntil = performance.now() + 160;
      return;
    }

    if (!panGesture || event.pointerId !== panGesture.id) return;
    const dx = event.clientX - panGesture.startX;
    const dy = event.clientY - panGesture.startY;
    if (!panGesture.moved && Math.hypot(dx, dy) > 6) {
      panGesture.moved = true;
      els.viewport.classList.add("is-dragging");
      if (panGesture.onCard) {
        try { els.viewport.setPointerCapture(event.pointerId); } catch (error) {}
      }
    }
    if (!panGesture.moved) return;
    panX = panGesture.panX + dx;
    panY = panGesture.panY + dy;
    applyTransform();
  });

  function endPointer(event) {
    activePointers.delete(event.pointerId);
    if (panGesture && event.pointerId === panGesture.id) {
      if (panGesture.moved) suppressClickUntil = performance.now() + 160;
      panGesture = null;
    }
    if (pinchGesture && activePointers.size < 2) {
      pinchGesture = null;
      const remaining = [...activePointers.entries()][0];
      if (remaining) {
        panGesture = {
          id: remaining[0],
          startX: remaining[1].x,
          startY: remaining[1].y,
          panX,
          panY,
          moved: true,
        };
      }
    }
    if (activePointers.size === 0) els.viewport.classList.remove("is-dragging");
  }

  els.viewport.addEventListener("pointerup", endPointer);
  els.viewport.addEventListener("pointercancel", endPointer);
  // Card taps are not pointer-captured, so finish them even if the finger
  // lifts outside the map.
  window.addEventListener("pointerup", endPointer);
  window.addEventListener("pointercancel", endPointer);

  els.viewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    if (event.ctrlKey || event.metaKey) {
      const factor = Math.exp(-event.deltaY * 0.0016);
      setZoomAt(zoom * factor, event.clientX, event.clientY);
      return;
    }
    if (event.shiftKey) {
      panX -= (event.deltaX || event.deltaY) * 0.9;
    } else {
      panX -= event.deltaX;
      panY -= event.deltaY;
    }
    viewTouched = true;
    applyTransform();
  }, { passive: false });

  // ------------------------------------------------------------------------
  // Node interaction
  // ------------------------------------------------------------------------
  els.nodes.addEventListener("click", (event) => {
    if (performance.now() < suppressClickUntil) return;
    const toggle = event.target.closest(".ft-toggle");
    if (toggle) {
      event.preventDefault();
      event.stopPropagation();
      const card = toggle.closest(".ft-node");
      const node = card ? nodeById.get(card.dataset.nodeId) : null;
      if (!node) return;
      if (collapsed.has(node.id)) collapsed.delete(node.id);
      else collapsed.add(node.id);
      toggle.setAttribute("aria-expanded", String(!collapsed.has(node.id)));
      toggle.setAttribute("aria-label", collapsed.has(node.id) ? "展开分支" : "收起分支");
      layoutTree();
      drawLines();
      paintSearch();
      return;
    }
    const card = event.target.closest(".ft-node");
    if (!card) return;
    const node = nodeById.get(card.dataset.nodeId);
    if (node) navigate(node);
  });

  els.nodes.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest(".ft-toggle")) return;
    const card = event.target.closest(".ft-node");
    if (!card) return;
    event.preventDefault();
    const node = nodeById.get(card.dataset.nodeId);
    if (node) navigate(node);
  });

  function navigate(node) {
    if (!node) return;
    if (node.kind === "root") {
      fitView();
      return;
    }
    const target = {
      categoryId: node.categoryId || "",
      todoId: node.todoId || "",
      subtaskId: node.subtaskId || "",
    };
    if (!target.categoryId) return;
    if (window.parent === window) {
      window.location.href = `/?category=${encodeURIComponent(target.categoryId)}`;
      return;
    }
    window.parent.postMessage(
      { type: "neotodo-forktree-open", target },
      window.location.origin
    );
  }

  // ------------------------------------------------------------------------
  // Header + toolbar actions
  // ------------------------------------------------------------------------
  function closeSelf() {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "neotodo-plugin-close" }, window.location.origin);
      return;
    }
    window.close();
  }

  function spinRefresh() {
    if (!els.refresh) return;
    els.refresh.classList.remove("is-spinning");
    void els.refresh.offsetWidth;
    els.refresh.classList.add("is-spinning");
    window.setTimeout(() => els.refresh.classList.remove("is-spinning"), 760);
  }

  async function refresh(manual = false) {
    if (loading) return;
    loading = true;
    if (manual) spinRefresh();
    if (!rootNode) {
      els.loading.hidden = false;
    }
    els.error.hidden = true;

    try {
      const response = await fetch("/api/state", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const hadTree = Boolean(rootNode);
      const keepZoom = zoom;
      const keepPanX = panX;
      const keepPanY = panY;

      rootNode = buildTree(data);
      renderTree();
      hasLoaded = true;

      if (!hadTree) {
        requestAnimationFrame(() => initialView());
        // Desktop shells can finish sizing the iframe a frame or two after
        // the first paint. Refit once while the user has not touched the map.
        window.setTimeout(() => {
          if (!viewTouched) initialView();
        }, 520);
      } else {
        zoom = keepZoom;
        panX = keepPanX;
        panY = keepPanY;
        applyTransform();
      }

      const isEmpty = !rootNode.children.length;
      els.empty.hidden = !isEmpty;
      document.documentElement.classList.remove("ft-booting");
    } catch (error) {
      hasLoaded = true;
      els.error.hidden = false;
      els.errorText.textContent = `无法读取 /api/state：${error.message || "未知错误"}`;
      els.loading.hidden = true;
      document.documentElement.classList.remove("ft-booting");
    } finally {
      loading = false;
      els.loading.hidden = true;
      document.documentElement.classList.remove("ft-booting");
    }
  }

  document.addEventListener("click", (event) => {
    const actionNode = event.target.closest("[data-ft-action]");
    if (!actionNode) return;
    const action = actionNode.dataset.ftAction;
    if (!action) return;
    event.preventDefault();

    if (action === "close") { closeSelf(); return; }
    if (action === "refresh") { refresh(true); return; }
    if (action === "zoom-in") { zoomFromCenter(1.17); return; }
    if (action === "zoom-out") { zoomFromCenter(1 / 1.17); return; }
    if (action === "fit") { fitView(); return; }
    if (action === "expand") {
      if (searchQuery) {
        els.search.value = "";
        applySearch("");
      }
      collapsed.clear();
      layoutTree();
      drawLines();
      paintSearch();
      return;
    }
    if (action === "collapse") {
      if (searchQuery) {
        els.search.value = "";
        applySearch("");
      }
      collapsed.clear();
      for (const node of allNodes) {
        if (node !== rootNode && node.children.length) collapsed.add(node.id);
      }
      layoutTree();
      drawLines();
      paintSearch();
    }
  });

  els.search.addEventListener("input", () => {
    applySearch(els.search.value);
  });

  els.search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (matches.length) centerOnNode(matches[0]);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      if (els.search.value) {
        els.search.value = "";
        applySearch("");
      } else {
        els.search.blur();
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    const typing = event.target instanceof HTMLInputElement;
    if (event.key === "/" && !typing) {
      event.preventDefault();
      els.search.focus();
      els.search.select();
      return;
    }
    if (event.key === "Escape") {
      if (typing) return;
      if (searchQuery) {
        els.search.value = "";
        applySearch("");
      } else {
        closeSelf();
      }
      return;
    }
    if (typing) return;
    if (event.key === "0") { event.preventDefault(); fitView(); return; }
    if (event.key === "+" || event.key === "=") { event.preventDefault(); zoomFromCenter(1.17); return; }
    if (event.key === "-") { event.preventDefault(); zoomFromCenter(1 / 1.17); }
  });

  function scheduleRerender() {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      if (!rootNode) return;
      if (!viewTouched) {
        initialView();
      } else {
        applyTransform();
      }
    });
  }

  window.addEventListener("resize", scheduleRerender);
  window.addEventListener("orientationchange", scheduleRerender);

  if (window.ResizeObserver) {
    new ResizeObserver(scheduleRerender).observe(els.viewport);
  }

  // ------------------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------------------
  syncTheme();
  refresh();

  // A tiny failsafe: if anything above throws before the first paint, the
  // page should still become visible instead of staying at opacity 0.
  window.setTimeout(() => {
    document.documentElement.classList.remove("ft-booting");
    if (!hasLoaded && els.loading) els.loading.hidden = false;
  }, 1800);
})();
