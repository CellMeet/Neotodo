/* ==========================================================================
   收纳箱 / STORAGE BOX — host chrome
   --------------------------------------------------------------------------
   A quiet box under the Categories rule:

     · the box on the bottom-left tool rail is the on/off switch: it slides
       the strip in under "Categories" and pushes the category list down;
       clicking the rail icon again closes the box, but keeps what is inside;
     · click the box icon on the strip -> the stored categories unfold;
       click the icon again to fold them away;
     · click a category while the box is open -> it moves into the box;
     · click a stored category -> it returns to the bottom of the list.

   Stored ids live in localStorage (`neotodo.storage-box`) so a restart keeps
   the same box contents. Turning the plugin off empties the box and brings
   every category back.
   ========================================================================== */

(() => {
  "use strict";

  const PLUGIN_ID = "storage-box";
  const STORAGE_KEY = "neotodo.storage-box";
  const index = document.querySelector(".index");
  const categoryList = document.getElementById("category-list");
  const railButton = document.querySelector('[data-plugin="storage-box"]');
  if (!index || !categoryList || !railButton) return;

  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  // ------------------------------------------------------------------------
  // DOM
  // ------------------------------------------------------------------------
  const box = document.createElement("div");
  box.className = "storage-box";
  box.id = "storage-box";
  box.dataset.storageBox = "1";
  box.setAttribute("aria-hidden", "true");
  box.innerHTML = `
    <button class="storage-box-head" type="button" data-storage-box-toggle aria-expanded="false" aria-label="展开箱内分类">
      <span class="storage-box-icon">
        <img class="storage-box-glyph" src="/plugins/storage-box/storage-box.svg" alt="">
        <span class="storage-box-count" data-storage-box-count hidden>0</span>
      </span>
    </button>
    <div class="storage-box-tray">
      <div class="storage-box-list" data-storage-box-list role="list"></div>
      <button class="storage-box-exit" type="button" data-storage-box-exit hidden>全部分类放回列表</button>
    </div>`;

  const head = index.querySelector(".index-head");
  if (head) head.insertAdjacentElement("afterend", box);
  else index.prepend(box);

  const countNode = box.querySelector("[data-storage-box-count]");
  const listNode = box.querySelector("[data-storage-box-list]");
  const toggleNode = box.querySelector("[data-storage-box-toggle]");
  const exitNode = box.querySelector("[data-storage-box-exit]");

  let active = false;
  let expanded = false;
  let orderChain = Promise.resolve();
  let renderFrame = 0;
  let knockTimer = 0;

  // ------------------------------------------------------------------------
  // Plugin record helpers
  // ------------------------------------------------------------------------
  function appData() {
    try { return typeof state !== "undefined" ? state : null; } catch (error) { return null; }
  }

  function pluginOn() {
    try {
      if (typeof pluginEnabled === "function") return Boolean(pluginEnabled(PLUGIN_ID));
    } catch (error) {}
    return !railButton.classList.contains("plugin-hidden");
  }

  // The box is device-local on purpose: the notebook backend keeps a curated
  // settings schema, so this small list lives in localStorage and survives a
  // restart even if other plugin switches are reset by a settings merge.
  function rawStoredIds() {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch (error) { raw = null; }
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.ids) ? raw.ids : [];
    const seen = new Set();
    const ids = [];
    for (const item of list) {
      const id = String(item || "");
      if (!id || seen.has(id)) continue;
      seen.add(id);
      ids.push(id);
    }
    return ids;
  }

  function persistStoredIds(ids) {
    const list = Array.from(new Set((Array.isArray(ids) ? ids : []).map(String).filter(Boolean)));
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (error) {}
  }

  function categories() {
    const data = appData()?.data;
    return Array.isArray(data?.categories) ? data.categories : [];
  }

  /** Stored categories that still exist, in the order they were put in. */
  function storedCategories() {
    const byId = new Map(categories().map((category) => [String(category.id), category]));
    return rawStoredIds().map((id) => byId.get(id)).filter(Boolean);
  }

  /**
   * Host contract: renderCategories()/visibleCategories() call this to keep
   * stored boards out of the index. A null result means "nothing hidden".
   */
  window.storageBoxedIds = function storageBoxedIds() {
    if (!pluginOn()) return null;
    const ids = storedCategories().map((category) => String(category.id));
    return ids.length ? new Set(ids) : null;
  };

  // ------------------------------------------------------------------------
  // Box rendering
  // ------------------------------------------------------------------------
  function renderBox() {
    const stored = storedCategories();
    const open = Boolean(active && pluginOn());
    // An empty box has nothing to unfold, so keep the strip compact.
    if (!stored.length) expanded = false;
    const unfolded = open && expanded && stored.length > 0;
    box.classList.toggle("is-active", open);
    box.classList.toggle("is-expanded", unfolded);
    box.setAttribute("aria-hidden", String(!open));
    if (toggleNode) {
      toggleNode.setAttribute("aria-expanded", String(unfolded));
      toggleNode.setAttribute("aria-label", unfolded ? "收起箱内分类" : "展开箱内分类");
    }

    if (countNode) {
      countNode.textContent = String(stored.length);
      countNode.hidden = !stored.length;
    }
    if (exitNode) exitNode.hidden = !stored.length;

    if (listNode) {
      listNode.innerHTML = stored.map((category) => {
        const id = escapeHtml(category.id);
        const color = escapeHtml(category.color || "#a8781f");
        return `<button class="storage-box-item" type="button" role="listitem" data-storage-restore="${id}" style="--c:${color}" aria-label="把 ${escapeHtml(category.name)} 放回列表">
          <span class="storage-box-item-dot" aria-hidden="true"></span>
          <span class="storage-box-item-name">${escapeHtml(category.name)}</span>
          <span class="storage-box-return" aria-hidden="true">放回 ↩</span>
        </button>`;
      }).join("");
    }
  }

  function scheduleRenderBox() {
    if (renderFrame) return;
    renderFrame = requestAnimationFrame(() => {
      renderFrame = 0;
      renderBox();
    });
  }

  function refreshStage() {
    try { if (typeof window.render === "function") window.render(); } catch (error) {}
  }

  function vibrate() {
    try { AudioFX.categoryTap(); } catch (error) {}
  }

  function setCollecting(value) {
    active = Boolean(value);
    if (!active) expanded = false;
    document.body.classList.toggle("storage-box-collecting", active && pluginOn());
    renderBox();
  }

  /** A small knock when the box is empty, so the icon still answers a click. */
  function knockBox() {
    box.classList.remove("is-knock");
    // Restart the animation even when two clicks arrive in the same frame.
    void box.offsetWidth;
    box.classList.add("is-knock");
    clearTimeout(knockTimer);
    knockTimer = setTimeout(() => box.classList.remove("is-knock"), 460);
  }

  // ------------------------------------------------------------------------
  // Category order: restoring always lands at the end of the full list.
  // ------------------------------------------------------------------------
  function applyOrder(order) {
    const data = appData()?.data;
    if (!data || !Array.isArray(data.categories)) return;
    const byId = new Map(data.categories.map((category) => [String(category.id), category]));
    const next = order.map((id) => byId.get(String(id))).filter(Boolean);
    if (next.length === data.categories.length) data.categories = next;
  }

  function persistOrder(order) {
    const ids = order.map(String);
    const send = () => (typeof silentAction === "function"
      ? silentAction("reorder_categories", { ids })
      : Promise.resolve(null));
    // Serialise the calls so two quick restores cannot overwrite each other.
    orderChain = orderChain.then(send, send).catch(() => {});
  }

  function storedOrderWithAtEnd(restoredId) {
    const all = categories().map((category) => String(category.id));
    const body = all.filter((id) => id !== restoredId);
    if (all.includes(restoredId)) body.push(restoredId);
    return body;
  }

  // ------------------------------------------------------------------------
  // Boxing / restoring
  // ------------------------------------------------------------------------
  function boxCategory(categoryId) {
    const id = String(categoryId || "");
    if (!id || !pluginOn()) return;
    const stored = rawStoredIds();
    if (stored.includes(id)) return;

    persistStoredIds(stored.concat(id));

    const data = appData();
    if (data && String(data.selectedCategoryId) === id) {
      const boxed = new Set(rawStoredIds());
      const next = categories().find((category) => (
        !boxed.has(String(category.id))
        && !(typeof isLegacyForkCategory === "function" && isLegacyForkCategory(category))
      ));
      data.selectedCategoryId = next ? String(next.id) : null;
      try { if (typeof saveViewState === "function") saveViewState(); } catch (error) {}
    }

    renderBox();
    refreshStage();
    vibrate();
  }

  function restoreCategory(categoryId) {
    const id = String(categoryId || "");
    if (!id) return;
    const stored = rawStoredIds();
    if (!stored.includes(id)) return;

    persistStoredIds(stored.filter((item) => item !== id));
    applyOrder(storedOrderWithAtEnd(id));
    persistOrder(storedOrderWithAtEnd(id));

    const data = appData();
    if (data) data.selectedCategoryId = id;

    renderBox();
    refreshStage();
    vibrate();
    try { if (typeof saveViewState === "function") saveViewState(); } catch (error) {}
  }

  function restoreAll(ids) {
    const all = categories().map((category) => String(category.id));
    const wanted = new Set(ids);
    const order = all.filter((id) => !wanted.has(id));
    for (const id of all) if (wanted.has(id)) order.push(id);
    persistStoredIds([]);
    applyOrder(order);
    persistOrder(order);
  }

  function exitCollecting({ restore = true } = {}) {
    const stored = rawStoredIds();
    setCollecting(false);
    if (restore && stored.length) {
      restoreAll(stored);
      refreshStage();
    }
    vibrate();
  }

  // ------------------------------------------------------------------------
  // Events
  // ------------------------------------------------------------------------
  // The rail icon is the storage box's on/off switch. Closing it keeps the
  // stored categories inside; it only hides the strip from the index.
  railButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!pluginOn()) return;
    setCollecting(!active);
    vibrate();
  });

  box.addEventListener("click", (event) => {
    const toggle = event.target.closest?.("[data-storage-box-toggle]");
    if (toggle) {
      if (!pluginOn()) return;
      if (!active) setCollecting(true);
      // The grey box icon on the strip only unfolds what is already inside.
      if (!storedCategories().length) {
        knockBox();
        return;
      }
      expanded = !expanded;
      renderBox();
      vibrate();
      return;
    }
    const exit = event.target.closest?.("[data-storage-box-exit]");
    if (exit) {
      exitCollecting();
      return;
    }
    const item = event.target.closest?.("[data-storage-restore]");
    if (item) {
      restoreCategory(item.dataset.storageRestore);
    }
  });

  // While the box is open a category click means "put this away", not "open it".
  categoryList.addEventListener("click", (event) => {
    if (!active || !pluginOn()) return;
    const row = event.target.closest?.(".category-item[data-category-id]");
    if (!row) return;
    event.preventDefault();
    event.stopPropagation();
    boxCategory(row.dataset.categoryId);
  });

  // Keep the box list/count in sync when the index is re-rendered elsewhere.
  new MutationObserver(scheduleRenderBox).observe(categoryList, { childList: true });

  // The plugin switch toggles .plugin-hidden on the rail button. Watch it so
  // turning the plugin off empties the box and brings every category back.
  new MutationObserver(() => {
    if (!pluginOn()) {
      const stored = rawStoredIds();
      if (stored.length) restoreAll(stored);
      active = false;
      expanded = false;
      document.body.classList.remove("storage-box-collecting");
      renderBox();
      refreshStage();
      return;
    }
    renderBox();
  }).observe(railButton, { attributes: true, attributeFilter: ["class"] });

  // ------------------------------------------------------------------------
  // Boot: wait for the notebook state, prune ids whose category was removed,
  // and reopen the strip when the box still holds something.
  // ------------------------------------------------------------------------
  let bootTries = 0;
  function boot() {
    if (!appData()?.data) {
      if (bootTries++ < 160) setTimeout(boot, 60);
      return;
    }
    // A plugin that was switched off while this window was closed must not
    // surprise the index by re-hiding boards when it is switched on again.
    if (!pluginOn()) {
      persistStoredIds([]);
      renderBox();
      return;
    }
    const known = new Set(categories().map((category) => String(category.id)));
    const stored = rawStoredIds();
    const valid = stored.filter((id) => known.has(id));
    if (valid.length !== stored.length) persistStoredIds(valid);
    if (valid.length) {
      active = true;
      document.body.classList.toggle("storage-box-collecting", true);
    }
    renderBox();
  }

  // The plugin control page runs in an iframe and can call this directly.
  window.NeoTodoStorageBox = {
    activate() {
      if (!pluginOn()) return false;
      setCollecting(true);
      expanded = true;
      renderBox();
      return true;
    },
    exit() {
      exitCollecting();
    },
    active() {
      return Boolean(active && pluginOn());
    },
    stored() {
      return storedCategories().map((category) => category.name);
    },
  };

  renderBox();
  boot();
})();
