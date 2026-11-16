/* ==========================================================================
   FORKTREE · fork store
   --------------------------------------------------------------------------
   A fork is not a NeoTodo category. It is a small app of its own that lives
   inside the Forktree plugin: one subtask promoted to the main task, with its
   own checklist, note and completion state.

   The store is client-side so the plugin owns its data completely:

     neotodo.forktree.store.v1
       { version: 1, branches: [ branch, … ] }

   A branch keeps a link back to the NeoTodo it came from:

     source.categoryId / categoryName
     source.todoId     / todoName      <- the NeoTodo todo (grouping key)
     source.subtaskId  / subtaskName   <- the subtask that was promoted

   Forks of forks are the same record with `fromBranchId` pointing at the fork
   app they branched out of. `source.todoId` always stays the original NeoTodo
   todo, so every fork of the same todo is grouped together no matter how deep
   the tree goes.
   ========================================================================== */

(() => {
  "use strict";

  const KEY = "neotodo.forktree.store.v1";
  // Legacy category ids that have already been imported. They survive the
  // deletion of the branch, so an old fork board can never be imported twice.
  const LEGACY_KEY = "neotodo.forktree.legacy.v1";
  const VERSION = 1;
  const MAX_NOTE = 40000;

  const listeners = new Set();
  let cache = null;

  const text = (value, limit = 400) => String(value ?? "").trim().slice(0, limit);

  function legacyTombstones() {
    try {
      const raw = JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
      return new Set(Array.isArray(raw) ? raw.map(String) : []);
    } catch (error) {
      return new Set();
    }
  }

  function rememberLegacy(ids) {
    const next = legacyTombstones();
    let changed = false;
    for (const id of ids || []) {
      const key = String(id || "");
      if (!key || next.has(key)) continue;
      next.add(key);
      changed = true;
    }
    if (!changed) return;
    try {
      localStorage.setItem(LEGACY_KEY, JSON.stringify([...next].slice(-1000)));
    } catch (error) {}
  }

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function normalizeSubtask(raw) {
    if (!raw || typeof raw !== "object") return null;
    const name = text(raw.name, 400);
    if (!name) return null;
    return {
      id: text(raw.id, 80) || uid("fs"),
      name,
      done: raw.done === true,
      createdAt: typeof raw.createdAt === "string" ? raw.createdAt : nowISO(),
      completedAt: raw.done === true && typeof raw.completedAt === "string" ? raw.completedAt : null,
    };
  }

  function normalizeBranch(raw) {
    if (!raw || typeof raw !== "object") return null;
    const name = text(raw.name, 400);
    const source = raw.source && typeof raw.source === "object" ? raw.source : {};
    const todoId = text(source.todoId, 80);
    if (!name || !todoId) return null;
    const subtasks = Array.isArray(raw.subtasks)
      ? raw.subtasks.map(normalizeSubtask).filter(Boolean)
      : [];
    return {
      id: text(raw.id, 80) || uid("fk"),
      name,
      note: typeof raw.note === "string" ? raw.note.slice(0, MAX_NOTE) : "",
      done: raw.done === true,
      createdAt: typeof raw.createdAt === "string" ? raw.createdAt : nowISO(),
      updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : nowISO(),
      completedAt: raw.done === true && typeof raw.completedAt === "string" ? raw.completedAt : null,
      fromBranchId: text(raw.fromBranchId, 80) || null,
      fromBranchName: text(raw.fromBranchName, 400) || null,
      // A port fork points at its own NeoTodo instance. The map opens this URL
      // in a real window instead of the in-panel workspace.
      url: text(raw.url, 2000),
      port: Number(raw.port) > 0 ? Math.floor(Number(raw.port)) : 0,
      forkId: text(raw.forkId, 80),
      forkTodoId: text(raw.forkTodoId, 80),
      // A fork imported from the first Forktree build keeps the id of the
      // NeoTodo category it used to be, so the notebook can hide that old
      // category without ever importing it twice.
      legacyCategoryId: text(raw.legacyCategoryId, 80) || null,
      source: {
        categoryId: text(source.categoryId, 80),
        categoryName: text(source.categoryName, 400),
        todoId,
        todoName: text(source.todoName, 400),
        subtaskId: text(source.subtaskId, 80),
        subtaskName: text(source.subtaskName, 400) || name,
        depth: Number.isFinite(Number(source.depth)) ? Math.max(1, Number(source.depth)) : 1,
      },
      subtasks,
    };
  }

  function readStorage() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { version: VERSION, branches: [] };
      const parsed = JSON.parse(raw);
      const branches = Array.isArray(parsed?.branches)
        ? parsed.branches.map(normalizeBranch).filter(Boolean)
        : [];
      return { version: VERSION, branches };
    } catch (error) {
      return { version: VERSION, branches: [] };
    }
  }

  function store() {
    if (!cache) cache = readStorage();
    return cache;
  }

  function emit() {
    for (const listener of [...listeners]) {
      try { listener(); } catch (error) {}
    }
    try {
      window.dispatchEvent(new CustomEvent("neotodo-fork-change"));
    } catch (error) {}
  }

  function persist(next) {
    cache = { version: VERSION, branches: next };
    try {
      localStorage.setItem(KEY, JSON.stringify(cache));
    } catch (error) {}
    emit();
  }

  function branches() {
    return store().branches;
  }

  function get(id) {
    const key = String(id || "");
    if (!key) return null;
    return branches().find((branch) => branch.id === key) || null;
  }

  function commit(branch) {
    if (!branch) return null;
    branch.updatedAt = nowISO();
    const index = branches().findIndex((item) => item.id === branch.id);
    if (index < 0) return null;
    const next = branches().slice();
    next[index] = branch;
    persist(next);
    return branch;
  }

  // Every branch that came out of one NeoTodo todo, oldest first. The flat
  // order is what the 待选区 (staging shelf) shows.
  function todoBranches(todoId) {
    const key = String(todoId || "");
    if (!key) return [];
    return branches()
      .filter((branch) => branch.source.todoId === key)
      .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  }

  function roots(todoId) {
    const all = todoBranches(todoId);
    const ids = new Set(all.map((branch) => branch.id));
    return all.filter((branch) => !branch.fromBranchId || !ids.has(branch.fromBranchId));
  }

  function childrenOf(branchId) {
    const key = String(branchId || "");
    if (!key) return [];
    return branches().filter((branch) => branch.fromBranchId === key);
  }

  // the todo → … → this fork chain, used for breadcrumbs in the sub-app
  function chain(branch) {
    const out = [];
    let cursor = branch;
    const seen = new Set();
    while (cursor && !seen.has(cursor.id)) {
      seen.add(cursor.id);
      out.unshift(cursor);
      cursor = cursor.fromBranchId ? get(cursor.fromBranchId) : null;
    }
    return out;
  }

  function progress(branch) {
    const subtasks = branch?.subtasks || [];
    const done = subtasks.filter((item) => item.done).length;
    return {
      done,
      total: subtasks.length,
      pct: subtasks.length ? Math.round((done / subtasks.length) * 100) : 0,
    };
  }

  function create(input = {}) {
    const name = text(input.name, 400);
    if (!name) return null;
    const parent = input.fromBranchId ? get(input.fromBranchId) : null;
    const source = input.source && typeof input.source === "object" ? input.source : {};
    const baseTodoId = text(source.todoId, 80) || parent?.source.todoId || "";
    if (!baseTodoId) return null;
    const at = nowISO();
    const branch = normalizeBranch({
      id: uid("fk"),
      name,
      note: String(input.note ?? "").slice(0, MAX_NOTE),
      done: false,
      createdAt: at,
      updatedAt: at,
      fromBranchId: parent?.id || null,
      fromBranchName: parent?.name || null,
      url: text(input.url, 2000),
      port: Number(input.port) > 0 ? Math.floor(Number(input.port)) : 0,
      forkId: text(input.forkId, 80),
      forkTodoId: text(input.forkTodoId, 80),
      source: {
        categoryId: text(source.categoryId, 80) || parent?.source.categoryId || "",
        categoryName: text(source.categoryName, 400) || parent?.source.categoryName || "",
        todoId: baseTodoId,
        todoName: text(source.todoName, 400) || parent?.source.todoName || "",
        subtaskId: text(source.subtaskId, 80),
        subtaskName: text(source.subtaskName, 400) || name,
        depth: parent ? (parent.source.depth || 1) + 1 : (Number(source.depth) || 1),
      },
      subtasks: [],
    });
    if (!branch) return null;
    persist([...branches(), branch]);
    return branch;
  }

  // The first Forktree build created a NeoTodo category for every fork. Move
  // those boards into the plugin store once, so forks stop posing as duplicate
  // NeoTodos. The old category id stays on the branch; the notebook hides the
  // matching row instead of deleting any user data.
  function importLegacy(categories) {
    if (!Array.isArray(categories) || !categories.length) return 0;
    const before = branches().length;
    const existing = new Set([
      ...branches()
        .map((branch) => branch.legacyCategoryId)
        .filter(Boolean)
        .map(String),
      ...legacyTombstones(),
    ]);
    const next = branches().slice();
    const imported = [];

    for (const category of categories) {
      if (!category || typeof category !== "object") continue;
      const from = category.forked_from;
      if (!from || typeof from !== "object" || !from.todo_id) continue;
      // A fork app's own category also carries forked_from metadata. It is the
      // main board of that window, never an old category to migrate away.
      const currentTodos = Array.isArray(category.todos) ? category.todos : [];
      if (category.fork_app || currentTodos.some((todo) => todo && todo.fork_app)) continue;
      const legacyId = text(category.id, 80);
      if (!legacyId || existing.has(legacyId)) continue;

      const todos = currentTodos;
      const todo = todos.find((item) => item && !item.done) || todos.find(Boolean) || null;
      const name = text(todo?.name || from.subtask_name || category.name, 400);
      if (!name) continue;
      const at = [todo?.created_at, from.at, nowISO()]
        .find((value) => typeof value === "string" && value) || nowISO();
      const subtasks = (todo?.subtasks || []).map((subtask) => {
        if (!subtask || typeof subtask !== "object") return null;
        const subName = text(subtask.name, 400);
        if (!subName) return null;
        return {
          id: text(subtask.id, 80) || uid("fs"),
          name: subName,
          done: subtask.done === true,
          createdAt: typeof subtask.created_at === "string" ? subtask.created_at : at,
          completedAt: subtask.done === true
            ? (typeof subtask.completed_at === "string" ? subtask.completed_at : at)
            : null,
        };
      }).filter(Boolean);

      const branch = normalizeBranch({
        id: uid("fk"),
        name,
        note: typeof todo?.note === "string" ? todo.note : "",
        done: todo?.done === true,
        createdAt: at,
        updatedAt: typeof todo?.completed_at === "string" ? todo.completed_at : at,
        completedAt: todo?.done === true
          ? (typeof todo?.completed_at === "string" ? todo.completed_at : at)
          : null,
        fromBranchId: null,
        fromBranchName: null,
        legacyCategoryId: legacyId,
        source: {
          categoryId: text(from.category_id, 80),
          categoryName: text(from.category_name, 400),
          todoId: text(from.todo_id, 80),
          todoName: text(from.todo_name, 400),
          subtaskId: text(from.subtask_id, 80),
          subtaskName: text(from.subtask_name, 400) || name,
          depth: 1,
        },
        subtasks,
      });
      if (!branch) continue;
      next.push(branch);
      existing.add(legacyId);
      imported.push(legacyId);
    }

    if (next.length === before) return 0;
    persist(next);
    rememberLegacy(imported);
    return next.length - before;
  }

  function migratedLegacyIds() {
    const ids = new Set(legacyTombstones());
    for (const branch of branches()) {
      if (branch.legacyCategoryId) ids.add(String(branch.legacyCategoryId));
    }
    return [...ids];
  }

  function isMigratedLegacy(categoryId) {
    const key = String(categoryId || "");
    return Boolean(key) && migratedLegacyIds().includes(key);
  }

  function update(id, patch = {}) {
    const branch = get(id);
    if (!branch) return null;
    if (typeof patch.name === "string" && text(patch.name)) branch.name = text(patch.name, 400);
    if (typeof patch.note === "string") branch.note = patch.note.slice(0, MAX_NOTE);
    if (typeof patch.done === "boolean") {
      branch.done = patch.done;
      branch.completedAt = patch.done ? nowISO() : null;
    }
    if (typeof patch.url === "string") branch.url = text(patch.url, 2000);
    if (Number(patch.port) > 0) branch.port = Math.floor(Number(patch.port));
    if (typeof patch.forkId === "string") branch.forkId = text(patch.forkId, 80);
    if (typeof patch.forkTodoId === "string") branch.forkTodoId = text(patch.forkTodoId, 80);
    return commit(branch);
  }

  // Removing a fork app removes everything it branched out of it too, so the
  // staging shelf can never keep an orphan.
  function remove(id) {
    const key = String(id || "");
    const target = get(key);
    if (!target) return 0;
    const doomed = new Set([key]);
    let grew = true;
    while (grew) {
      grew = false;
      for (const branch of branches()) {
        if (doomed.has(branch.id)) continue;
        if (branch.fromBranchId && doomed.has(branch.fromBranchId)) {
          doomed.add(branch.id);
          grew = true;
        }
      }
    }
    const legacyIds = branches()
      .filter((branch) => doomed.has(branch.id) && branch.legacyCategoryId)
      .map((branch) => branch.legacyCategoryId);
    persist(branches().filter((branch) => !doomed.has(branch.id)));
    rememberLegacy(legacyIds);
    return doomed.size;
  }

  function addSubtask(id, name) {
    const branch = get(id);
    const value = text(name, 400);
    if (!branch || !value) return null;
    const subtask = {
      id: uid("fs"),
      name: value,
      done: false,
      createdAt: nowISO(),
      completedAt: null,
    };
    branch.subtasks.unshift(subtask);
    commit(branch);
    return subtask;
  }

  function updateSubtask(id, subtaskId, patch = {}) {
    const branch = get(id);
    const subtask = branch?.subtasks.find((item) => item.id === String(subtaskId || ""));
    if (!branch || !subtask) return null;
    if (typeof patch.name === "string" && text(patch.name)) subtask.name = text(patch.name, 400);
    if (typeof patch.done === "boolean") {
      subtask.done = patch.done;
      subtask.completedAt = patch.done ? nowISO() : null;
    }
    commit(branch);
    return subtask;
  }

  function removeSubtask(id, subtaskId) {
    const branch = get(id);
    if (!branch) return false;
    const key = String(subtaskId || "");
    const next = branch.subtasks.filter((item) => item.id !== key);
    if (next.length === branch.subtasks.length) return false;
    branch.subtasks = next;
    commit(branch);
    return true;
  }

  function subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== KEY) return;
    cache = null;
    store();
    emit();
  });

  window.NeoTodoFork = {
    KEY,
    list: branches,
    get,
    create,
    update,
    remove,
    addSubtask,
    updateSubtask,
    removeSubtask,
    progress,
    todoBranches,
    roots,
    childrenOf,
    chain,
    importLegacy,
    migratedLegacyIds,
    isMigratedLegacy,
    subscribe,
  };
})();
