/* ==========================================================================
   COMMUNITY PLUGIN PAGE
   --------------------------------------------------------------------------
   This is the shop that used to live behind Settings → Community. It reads the
   plugin and theme catalogs from the same backend endpoints, renders them with
   the notebook's own Community CSS, and asks window.NeoTodoCommunity in the
   host to install, enable, uninstall or open things. The page is tagged
   "intheme", so its sheet inherits the current app theme.
   ========================================================================== */

(() => {
  "use strict";

  const API_PLUGIN = "/api/plugins/community";
  const API_THEME = "/api/themes/community";
  const PLUGIN_ID = "community";
  const SECTIONS = ["plugins", "games", "themes"];
  const GAME_IDS = new Set(["pindou", "tetris", "piano"]);
  const GAME_TAGS = new Set(["game", "games", "play", "arcade", "puzzle"]);
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  let pluginCatalog = null;
  let themeCatalog = null;
  let catalogBusy = false;
  let pluginCatalogError = "";
  let themeCatalogError = "";
  let host = null;
  let hostState = emptyHostState();
  let activeTab = initialTab();
  let queries = { plugins: "", games: "", themes: "" };
  let filters = { plugins: "all", games: "all", themes: "all" };
  let busy = new Set();
  let toastTimer = 0;

  function emptyHostState() {
    return { plugins: {}, themes: [], themeId: "", themeBusy: "", installing: [] };
  }

  function initialTab() {
    const section = new URLSearchParams(location.search).get("section") || "";
    return SECTIONS.includes(section) ? section : "plugins";
  }

  function hostApi() {
    try {
      if (window.parent === window) return null;
      return window.parent.NeoTodoCommunity || null;
    } catch (error) {
      return null;
    }
  }

  function normalizeHostState(raw) {
    if (!raw || typeof raw !== "object") return hostState;
    return {
      plugins: raw.plugins && typeof raw.plugins === "object" ? raw.plugins : {},
      themes: Array.isArray(raw.themes) ? raw.themes : [],
      themeId: String(raw.theme?.id || raw.themeId || ""),
      themeBusy: String(raw.themeBusy || ""),
      installing: Array.isArray(raw.installing) ? raw.installing : []
    };
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function safeColor(value, fallback) {
    const raw = String(value || "").trim();
    return /^#[0-9a-f]{3,8}$/i.test(raw) || /^rgba?\(/i.test(raw) ? raw : fallback;
  }

  function categoryLabel(value) {
    const raw = String(value || "Interface").trim();
    if (!raw) return "Interface";
    const lower = raw.toLowerCase();
    if (lower === "ai") return "AI";
    if (lower === "ui") return "UI";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  function versionNewer(candidate, current) {
    const parse = (value) => String(value || "0").split(/[._-]/).map((part) => parseInt(part, 10) || 0);
    const left = parse(candidate);
    const right = parse(current);
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      const a = left[index] || 0;
      const b = right[index] || 0;
      if (a !== b) return a > b;
    }
    return false;
  }

  function isGame(entry) {
    const id = String(entry?.id || "").toLowerCase();
    const category = categoryLabel(entry?.category).toLowerCase();
    if (category === "game" || category === "games") return true;
    if (GAME_IDS.has(id)) return true;
    const tags = (Array.isArray(entry?.tags) ? entry.tags : []).map((tag) => String(tag).toLowerCase());
    return tags.some((tag) => GAME_TAGS.has(tag));
  }

  function hostMissing() {
    return !host || typeof host.read !== "function";
  }

  function canMutate() {
    return Boolean(host);
  }

  function toast(message) {
    const node = $("[data-toast]");
    if (!node) return;
    node.textContent = message;
    node.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.classList.remove("show"), 2600);
  }

  async function fetchJson(url, force = false) {
    const response = await fetch(`${url}${force ? "?refresh=1" : ""}`, { cache: "no-store" });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.ok) throw new Error(data?.error || "无法读取社区目录");
    return data;
  }

  async function loadCatalogs(force = false) {
    if (catalogBusy) return;
    catalogBusy = true;
    pluginCatalogError = "";
    themeCatalogError = "";
    renderServer();
    const [plugins, themes] = await Promise.allSettled([
      fetchJson(API_PLUGIN, force),
      fetchJson(API_THEME, force)
    ]);
    if (plugins.status === "fulfilled") pluginCatalog = plugins.value;
    else pluginCatalogError = plugins.reason?.message || "插件目录读取失败";
    if (themes.status === "fulfilled") themeCatalog = themes.value;
    else themeCatalogError = themes.reason?.message || "主题目录读取失败";
    catalogBusy = false;
    render();
  }

  async function loadStandaloneState() {
    try {
      const response = await fetch("/api/plugins", { cache: "no-store" });
      const data = await response.json();
      if (data?.ok && Array.isArray(data.plugins)) {
        const plugins = {};
        for (const plugin of data.plugins) {
          const icon = String(plugin.icon || "");
          plugins[plugin.id] = {
            id: plugin.id,
            title: plugin.name || plugin.id,
            version: plugin.version || "1.0.0",
            icon: icon ? `/plugins/${encodeURIComponent(plugin.id)}/${icon}` : "",
            source: plugin.source || "bundled",
            installed: true,
            enabled: true
          };
        }
        hostState.plugins = plugins;
      }
    } catch (error) {}
    try {
      const response = await fetch("/api/themes", { cache: "no-store" });
      const data = await response.json();
      if (data?.ok && Array.isArray(data.packs)) {
        hostState.themes = data.packs.map((pack) => ({
          id: pack.id,
          name: pack.name || pack.id,
          englishName: pack.englishName || "",
          version: pack.version || "1.0.0",
          description: pack.description || "",
          author: pack.author || "NeoTodo",
          palette: pack.palette || {},
          source: pack.source || "user",
          bundled: pack.source === "bundled",
          applied: false
        }));
      }
    } catch (error) {}
    render();
  }

  async function refreshHost() {
    if (!host) return;
    if (typeof host.load === "function") {
      try {
        hostState = normalizeHostState(await host.load(false));
      } catch (error) {}
    } else if (typeof host.read === "function") {
      try {
        hostState = normalizeHostState(host.read());
      } catch (error) {}
    }
  }

  function pluginEntries() {
    return (Array.isArray(pluginCatalog?.plugins) ? pluginCatalog.plugins : [])
      .filter((entry) => entry && entry.id !== PLUGIN_ID);
  }

  function pluginsFor(scope) {
    const wantGames = scope === "games";
    return pluginEntries().filter((entry) => isGame(entry) === wantGames);
  }

  function pluginState(id) {
    return hostState.plugins?.[id] || null;
  }

  function installedCount(entries) {
    return entries.filter((entry) => pluginState(entry.id)?.installed).length;
  }

  function filteredEntries(scope) {
    const query = queries[scope].trim().toLowerCase();
    const filter = filters[scope];
    return pluginsFor(scope)
      .filter((entry) => {
        if (filter === "all") return true;
        if (filter === "featured") return Boolean(entry.featured);
        return categoryLabel(entry.category).toLowerCase() === filter;
      })
      .filter((entry) => {
        if (!query) return true;
        return [
          entry.name,
          entry.englishName,
          entry.author,
          entry.description,
          ...(Array.isArray(entry.tags) ? entry.tags : [])
        ].join(" ").toLowerCase().includes(query);
      })
      .sort((left, right) => Number(Boolean(right.featured)) - Number(Boolean(left.featured))
        || String(left.name || left.id).localeCompare(String(right.name || right.id)));
  }

  function pluginIconPath(entry) {
    const state = pluginState(entry.id);
    let source = String(state?.icon || "").trim();
    const icon = String(entry.icon || "").trim();
    if (!source) {
      if (/^https?:\/\//i.test(icon)) source = icon;
      else if (entry.bundled && icon) {
        source = `/plugins/${encodeURIComponent(entry.id)}/${icon.split("/").map(encodeURIComponent).join("/")}`;
      }
    }
    if (source && !/^https?:\/\//i.test(source) && !source.startsWith("/")) source = `/${source}`;
    return source && (/^https?:\/\//i.test(source) || source.startsWith("/")) ? source : "";
  }

  const puzzleGlyph = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v5a3 3 0 0 0 3 3h3v6h-5a3 3 0 0 0-3 3v1H7v-4a3 3 0 0 0-3-3H3V9h5a3 3 0 0 0 3-3V3Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

  function pluginIconMarkup(entry) {
    const source = pluginIconPath(entry);
    if (!source) return `<span class="shop-plugin-icon">${puzzleGlyph}</span>`;
    return `<span class="shop-plugin-icon"><img src="${escapeHtml(source)}" alt="" loading="lazy"></span>`;
  }

  function actionDisabled() {
    return canMutate() ? "" : " disabled title=\"请从 NeoTodo 内打开社区插件\"";
  }

  function pluginCardMarkup(entry) {
    const state = pluginState(entry.id);
    const installed = Boolean(state?.installed);
    const enabled = Boolean(state?.enabled);
    const working = busy.has(entry.id) || hostState.installing.includes(entry.id);
    const update = installed && entry.version && versionNewer(entry.version, state?.version);
    const official = entry.official || entry.author === "NeoTodo";
    const tags = (Array.isArray(entry.tags) ? entry.tags : []).slice(0, 4);
    let actions = "";
    if (working) {
      actions = `<span class="shop-busy">处理中…</span>`;
    } else if (installed) {
      actions = `<span class="community-installed-badge">${enabled ? "已安装" : "已关闭"}</span>`;
      if (enabled) {
        actions += `<button class="btn small" type="button" data-action="open-plugin" data-id="${escapeHtml(entry.id)}"${actionDisabled()}>打开</button>`;
      }
      actions += `<button class="btn small" type="button" data-action="toggle-plugin" data-id="${escapeHtml(entry.id)}"${actionDisabled()}>${enabled ? "关闭" : "开启"}</button>`;
      if (update) {
        actions += `<button class="btn small" type="button" data-action="install-plugin" data-id="${escapeHtml(entry.id)}"${actionDisabled()}>更新</button>`;
      }
      actions += `<button class="btn small" type="button" data-action="manage-plugin" data-id="${escapeHtml(entry.id)}"${actionDisabled()}>管理</button>`;
      if (entry.id !== PLUGIN_ID) {
        actions += `<button class="btn small danger" type="button" data-action="remove-plugin" data-id="${escapeHtml(entry.id)}"${actionDisabled()}>卸载</button>`;
      }
    } else if (entry.bundled || entry.download || state) {
      actions = `<button class="btn small primary" type="button" data-action="install-plugin" data-id="${escapeHtml(entry.id)}"${actionDisabled()}>安装</button>`;
    } else {
      actions = `<span class="community-installed-badge built-in">即将上架</span>`;
    }
    return `<article class="community-plugin-card" data-plugin-card="${escapeHtml(entry.id)}">
      <div class="community-card-top">
        ${pluginIconMarkup(entry)}
        <div class="community-card-title">
          <strong>${escapeHtml(entry.name || entry.id)}</strong>
          <small>${escapeHtml(entry.englishName || entry.id)} · v${escapeHtml(entry.version || "1.0.0")}</small>
        </div>
        <span class="community-origin ${official ? "official" : ""}">${official ? "Official" : "Community"}</span>
      </div>
      <p class="community-card-description">${escapeHtml(entry.description || "")}</p>
      <div class="community-card-meta">
        <span>by ${escapeHtml(entry.author || "Community")}</span>
        <span>${escapeHtml(categoryLabel(entry.category))}</span>
        ${entry.bundled ? "<span>内置</span>" : ""}
      </div>
      ${tags.length ? `<div class="community-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      <div class="shop-actions">${actions}</div>
    </article>`;
  }

  function pluginFilterChips(scope, entries) {
    const categories = [];
    const seen = new Set();
    for (const entry of entries) {
      const label = categoryLabel(entry.category);
      const value = label.toLowerCase();
      if (seen.has(value)) continue;
      seen.add(value);
      categories.push({ value, label });
    }
    categories.sort((left, right) => left.label.localeCompare(right.label));
    const chips = [
      { value: "all", label: "全部" },
      { value: "featured", label: "精选" },
      ...categories
    ];
    return chips.map((chip) => `<button class="community-filter ${filters[scope] === chip.value ? "active" : ""}" type="button" data-plugin-filter="${escapeHtml(chip.value)}">${escapeHtml(chip.label)}</button>`).join("");
  }

  function pluginShelfMarkup(scope) {
    const games = scope === "games";
    const entries = pluginsFor(scope);
    const rows = filteredEntries(scope);
    const scopeLabel = games ? "游戏" : "插件";
    const scopeEnglish = games ? "GAMES" : "PLUGINS";
    const query = queries[scope];
    const status = serverInfo();
    const catalogReady = Boolean(pluginCatalog);
    const error = pluginCatalogError || pluginCatalog?.catalog_error || "";
    let body = "";
    if (catalogBusy && !catalogReady) {
      body = `<div class="shop-empty"><strong>正在连接社区服务器…</strong><span>内置目录会在连接失败时继续可用。</span></div>`;
    } else if (!catalogReady && error) {
      body = `<div class="shop-empty"><strong>暂时读不到 ${scopeLabel}目录</strong><span>${escapeHtml(error)}</span><button class="btn small" type="button" data-action="refresh-catalog">重新连接</button></div>`;
    } else if (!rows.length) {
      body = `<div class="shop-empty"><strong>没有匹配的 ${scopeLabel}</strong><span>换一个关键词或筛选条件试试。</span></div>`;
    } else {
      body = `<div class="community-plugin-grid">${rows.map(pluginCardMarkup).join("")}</div>`;
    }
    const callout = games ? "" : `<div class="shop-callout">
      <div>
        <strong>Build the next small thing</strong>
        <p>每个插件都是一只带 manifest 和 HTML 的文件夹。打包成 .zip 后可以装进 NeoTodo，也可以提交到社区目录。</p>
      </div>
      <div class="shop-callout-actions">
        <button class="btn small" type="button" data-action="install-plugin-archive"${actionDisabled()}>安装 .zip</button>
        <button class="btn small" type="button" data-action="open-plugins-folder"${actionDisabled()}>打开插件文件夹</button>
      </div>
    </div>`;
    return `<div class="shop-shelf">
      <div class="shop-shelf-head">
        <div><strong>${scopeLabel}商店</strong><small>${scopeEnglish} · ${escapeHtml(status.label)}</small></div>
        <span class="shop-status"><b>${rows.length}</b> 个${scopeLabel} · <b>${installedCount(entries)}</b> 个已安装</span>
      </div>
      <p class="community-shelf-copy">${games ? "小游戏也住在插件目录里；安装后会在左栏多一个入口。" : "浏览社区里的插件，安装后留在本机。已安装的插件可以在这里直接打开。"}</p>
      ${hostMissing() ? `<div class="shop-warning">当前页面只能浏览。请从 NeoTodo 应用内打开社区插件，才能安装、启停或卸载。</div>` : ""}
      ${error ? `<div class="shop-warning">${escapeHtml(error)}</div>` : ""}
      <div class="shop-toolbar">
        <label class="community-search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
          <input type="search" data-search value="${escapeHtml(query)}" placeholder="搜索${scopeLabel}、作者、标签…" autocomplete="off">
        </label>
        <button class="btn small community-refresh" type="button" data-action="refresh-catalog">${catalogBusy ? "刷新中…" : "刷新"}</button>
      </div>
      <div class="community-filters">${pluginFilterChips(scope, entries)}</div>
      ${body}
      ${callout}
    </div>`;
  }

  function themePalette(entry) {
    const palette = entry?.palette && typeof entry.palette === "object" ? entry.palette : {};
    return {
      paper: safeColor(palette.paper, "#f7efe3"),
      paper2: safeColor(palette.paper2, safeColor(palette.paper, "#ece2d5")),
      ink: safeColor(palette.ink, "#2d2924"),
      accent: safeColor(palette.accent, "#b06a3f")
    };
  }

  function themePreviewMarkup(entry) {
    const palette = themePalette(entry);
    const preview = String(entry?.preview || "").trim();
    if (/^https?:\/\//i.test(preview)) {
      return `<span class="theme-pack-preview"><img src="${escapeHtml(preview)}" alt="" loading="lazy"></span>`;
    }
    return `<span class="theme-pack-preview"><span class="shop-theme-swatch" style="background:linear-gradient(135deg, ${escapeHtml(palette.paper)}, ${escapeHtml(palette.paper2)});color:${escapeHtml(palette.ink)}"><b style="border-color:${escapeHtml(palette.accent)}">Aa</b><i style="background:${escapeHtml(palette.accent)}"></i></span></span>`;
  }

  function themeBadges(entry) {
    const badges = [];
    if (entry.palette) badges.push("Palette");
    if (entry.chrome) badges.push("Chrome");
    if (entry.note) badges.push("Note");
    if (entry.ai) badges.push("AI");
    if (!badges.length) badges.push("Theme");
    return badges.map((badge) => `<span class="theme-pack-badge">${badge}</span>`).join("");
  }

  function themePackMarkup(entry, options = {}) {
    const installed = Boolean(options.installed);
    const applied = Boolean(options.applied);
    const working = busy.has(entry.id) || hostState.themeBusy === entry.id;
    const source = entry.bundled ? "内置" : entry.official ? "官方" : entry.source === "user" ? "已安装" : "社区";
    let actions = "";
    if (working) {
      actions = `<span class="shop-busy">处理中…</span>`;
    } else if (installed) {
      actions = `<button class="btn small ${applied ? "" : "primary"}" type="button" data-action="apply-theme" data-id="${escapeHtml(entry.id)}"${applied || actionDisabled() ? " disabled" : ""}>${applied ? "使用中" : "应用"}</button>
        <button class="btn small danger" type="button" data-action="remove-theme" data-id="${escapeHtml(entry.id)}"${actionDisabled()}>移除</button>`;
    } else {
      actions = `<button class="btn small primary" type="button" data-action="install-theme" data-id="${escapeHtml(entry.id)}"${actionDisabled()}>安装</button>`;
    }
    return `<article class="theme-pack-card ${applied ? "theme-pack-active" : ""}" data-theme-card="${escapeHtml(entry.id)}">
      ${themePreviewMarkup(entry)}
      <div class="theme-pack-body">
        <div class="theme-pack-head">
          <strong>${escapeHtml(entry.name || entry.id)}</strong>
          <small>${escapeHtml(entry.englishName || entry.id)} · v${escapeHtml(entry.version || "1.0.0")}</small>
        </div>
        <div class="theme-pack-meta">${escapeHtml(entry.author || "NeoTodo")} · ${source}</div>
        ${entry.description ? `<p>${escapeHtml(entry.description)}</p>` : ""}
        <div class="theme-pack-badges">${themeBadges(entry)}</div>
        <div class="theme-pack-actions">${actions}</div>
      </div>
    </article>`;
  }

  function themeShelfMarkup() {
    const installed = Array.isArray(hostState.themes) ? hostState.themes : [];
    const installedIds = new Set(installed.map((entry) => entry.id));
    const query = queries.themes.trim().toLowerCase();
    const matches = (entry) => !query || [entry.name, entry.englishName, entry.author, entry.description]
      .join(" ").toLowerCase().includes(query);
    const catalogRows = (Array.isArray(themeCatalog?.themes) ? themeCatalog.themes : [])
      .filter((entry) => !installedIds.has(entry.id))
      .filter(matches);
    const installedRows = installed.filter(matches);
    const status = serverInfo();
    const error = themeCatalogError || themeCatalog?.catalog_error || "";
    const installedSection = installedRows.length
      ? `<div class="theme-pack-grid">${installedRows.map((entry) => themePackMarkup(entry, {
        installed: true,
        applied: Boolean(entry.applied) || hostState.themeId === entry.id
      })).join("")}</div>`
      : `<div class="shop-empty"><strong>还没有安装主题</strong><span>从下面的社区目录挑一只，或者继续使用当前主题。</span></div>`;
    let catalogSection = "";
    if (catalogBusy && !themeCatalog) {
      catalogSection = `<div class="shop-empty"><strong>正在读取主题目录…</strong></div>`;
    } else if (!catalogRows.length) {
      catalogSection = `<div class="theme-community-empty"><strong>${themeCatalog ? "目录里的主题都装好了" : "目录还没有加载"}</strong><span>${themeCatalog ? "新主题会在刷新目录后出现。" : "内置目录会在连接失败时继续可用。"}</span></div>`;
    } else {
      catalogSection = `<div class="theme-pack-grid">${catalogRows.map((entry) => themePackMarkup(entry)).join("")}</div>`;
    }
    return `<div class="shop-shelf">
      <div class="shop-shelf-head">
        <div><strong>主题商店</strong><small>THEMES · ${escapeHtml(status.label)}</small></div>
        <span class="shop-status"><b>${installedRows.length + catalogRows.length}</b> 个主题 · <b>${installed.length}</b> 个已安装</span>
      </div>
      <p class="community-shelf-copy">主题包会带来纸色、壁纸、音效和图标。应用一只主题时，社区页也会立刻换成同样的颜色。</p>
      ${hostMissing() ? `<div class="shop-warning">当前页面只能浏览。请从 NeoTodo 应用内打开社区插件，才能安装或应用主题。</div>` : ""}
      ${error ? `<div class="shop-warning">${escapeHtml(error)}</div>` : ""}
      <div class="shop-toolbar">
        <label class="community-search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
          <input type="search" data-search value="${escapeHtml(queries.themes)}" placeholder="搜索主题、作者、标签…" autocomplete="off">
        </label>
        <button class="btn small community-refresh" type="button" data-action="refresh-catalog">${catalogBusy ? "刷新中…" : "刷新"}</button>
      </div>
      <div class="shop-theme-section">
        <div class="shop-theme-section-label">已安装 <b>${installed.length}</b></div>
        ${installedSection}
      </div>
      <div class="shop-theme-section">
        <div class="shop-theme-section-label">社区目录 <b>${catalogRows.length}</b></div>
        ${catalogSection}
      </div>
      <div class="shop-callout">
        <div>
          <strong>想微调当前主题？</strong>
          <p>纸色、页面横线和笔记 / AI 主题仍然在 Settings 的 Appearance 里。社区只负责装新的主题包。</p>
        </div>
        <div class="shop-callout-actions">
          <button class="btn small" type="button" data-action="open-theme-settings"${actionDisabled()}>打开主题设置</button>
        </div>
      </div>
    </div>`;
  }

  function serverInfo() {
    if (catalogBusy) return { state: "loading", label: "正在连接…" };
    const catalog = activeTab === "themes" ? themeCatalog : pluginCatalog;
    const catalogError = activeTab === "themes" ? themeCatalogError : pluginCatalogError;
    const error = catalog?.catalog_error || (!catalog && catalogError);
    if (error) return { state: "offline", label: "离线目录" };
    const source = catalog?.catalog_source || "";
    if (source === "remote") return { state: "live", label: "社区服务器" };
    if (source === "cache") return { state: "cache", label: "缓存副本" };
    return { state: "local", label: "内置目录" };
  }

  function renderServer() {
    const info = serverInfo();
    const node = $("[data-server]");
    if (node) node.className = `community-server ${info.state}`;
    const label = $("[data-server-label]");
    if (label) label.textContent = info.label;
  }

  function renderTabs() {
    $$("[data-tab]").forEach((button) => {
      const active = button.dataset.tab === activeTab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    const entries = pluginEntries();
    const games = entries.filter((entry) => isGame(entry)).length;
    const plugins = entries.length - games;
    const installedThemes = Array.isArray(hostState.themes) ? hostState.themes.length : 0;
    const catalogThemes = Array.isArray(themeCatalog?.themes) ? themeCatalog.themes.length : 0;
    const countPlugins = $("[data-count-plugins]");
    const countGames = $("[data-count-games]");
    const countThemes = $("[data-count-themes]");
    if (countPlugins) countPlugins.textContent = String(plugins);
    if (countGames) countGames.textContent = String(games);
    if (countThemes) countThemes.textContent = String(Math.max(installedThemes, catalogThemes));
  }

  function renderView(preserveSearch = false) {
    const search = document.activeElement?.matches?.("[data-search]") ? document.activeElement : null;
    const caret = search?.selectionStart ?? null;
    const view = $("[data-view]");
    if (!view) return;
    view.innerHTML = activeTab === "themes" ? themeShelfMarkup() : pluginShelfMarkup(activeTab);
    if (preserveSearch && search) {
      const next = $("[data-search]");
      if (next) {
        next.focus();
        const position = caret === null ? next.value.length : Math.min(caret, next.value.length);
        next.setSelectionRange(position, position);
      }
    }
  }

  function render() {
    renderTabs();
    renderServer();
    renderView();
  }

  async function refreshAll() {
    await loadCatalogs(true);
    await refreshHost();
    render();
    toast("社区目录已刷新");
  }

  function entryById(id) {
    return pluginCatalog?.plugins?.find((entry) => entry.id === id)
      || themeCatalog?.themes?.find((entry) => entry.id === id)
      || hostState.themes.find((entry) => entry.id === id)
      || null;
  }

  async function runTask(id, task, successMessage) {
    if (!canMutate()) {
      toast("请从 NeoTodo 内打开社区插件");
      return;
    }
    const key = String(id || "__task__");
    busy.add(key);
    renderView();
    try {
      const next = await task();
      hostState = normalizeHostState(next);
      if (successMessage) toast(successMessage);
    } catch (error) {
      toast(error?.message || "操作失败");
    } finally {
      busy.delete(key);
      render();
    }
  }

  async function installPlugin(id) {
    const entry = entryById(id);
    await runTask(id, () => host.installPlugin(entry), `${entry?.name || id} 已安装`);
  }

  async function removePlugin(id) {
    const entry = entryById(id);
    const ok = window.confirm(`卸载「${entry?.name || id}」？\n\n会从这台电脑移除插件文件；你的任务和笔记不受影响。`);
    if (!ok) return;
    await runTask(id, () => host.removePlugin(id), `${entry?.name || id} 已卸载`);
  }

  async function togglePlugin(id) {
    const state = pluginState(id);
    if (!state) return;
    const next = !state.enabled;
    await runTask(id, () => host.setPluginEnabled(id, next), `${entryById(id)?.name || id} ${next ? "已开启" : "已关闭"}`);
  }

  async function openPlugin(id) {
    if (!canMutate()) {
      toast("请从 NeoTodo 内打开社区插件");
      return;
    }
    const opened = host.openPlugin(id);
    if (!opened) toast(`${entryById(id)?.name || id} 当前是关闭状态`);
  }

  function managePlugin(id) {
    if (!canMutate()) return;
    host.managePlugin(id);
  }

  function managePlugins() {
    if (!canMutate()) return;
    host.managePlugins();
  }

  function openThemeSettings() {
    if (!canMutate()) return;
    host.openThemeSettings();
  }

  async function installTheme(id) {
    const entry = entryById(id);
    if (!entry) return;
    await runTask(id, () => host.installTheme(entry), `${entry.name || id} 已安装`);
  }

  async function removeTheme(id) {
    const entry = entryById(id);
    const ok = window.confirm(`移除主题「${entry?.name || id}」？\n\n当前主题会回到默认主题；任务和笔记不受影响。`);
    if (!ok) return;
    await runTask(id, () => host.removeTheme(id), `${entry?.name || id} 已移除`);
  }

  async function applyTheme(id) {
    const entry = entryById(id);
    await runTask(id, () => host.applyTheme(id), `${entry?.name || id} 已应用`);
  }

  function choosePluginArchive() {
    if (!canMutate()) {
      toast("请从 NeoTodo 内打开社区插件");
      return;
    }
    $("[data-plugin-archive]")?.click();
  }

  async function installPluginArchive(file) {
    if (!file || !canMutate()) return;
    if (file.size > 24_000_000) {
      toast("插件包不能超过 24 MB");
      return;
    }
    const key = "__archive__";
    busy.add(key);
    renderView();
    try {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
        reader.onerror = () => reject(new Error("无法读取这个文件"));
        reader.readAsDataURL(file);
      });
      const next = await host.installPluginArchive(data, file.name);
      hostState = normalizeHostState(next);
      toast(`${file.name} 安装完成`);
    } catch (error) {
      toast(error?.message || "插件安装失败");
    } finally {
      busy.delete(key);
      render();
    }
  }

  function closePage() {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "neotodo-plugin-close" }, window.location.origin);
      return;
    }
    window.close();
  }

  document.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (tab) {
      activeTab = tab.dataset.tab;
      filters[activeTab] = filters[activeTab] || "all";
      render();
      return;
    }

    const filterChip = event.target.closest("[data-plugin-filter]");
    if (filterChip) {
      filters[activeTab] = filterChip.dataset.pluginFilter || "all";
      renderView();
      return;
    }

    const actionNode = event.target.closest("[data-action]");
    if (actionNode) {
      const action = actionNode.dataset.action;
      const id = actionNode.dataset.id || "";
      if (action === "refresh-catalog") { refreshAll(); return; }
      if (action === "manage-plugins") { managePlugins(); return; }
      if (action === "manage-plugin") { managePlugin(id); return; }
      if (action === "open-theme-settings") { openThemeSettings(); return; }
      if (action === "open-plugins-folder") { host?.openPluginsFolder?.(); return; }
      if (action === "install-plugin-archive") { choosePluginArchive(); return; }
      if (action === "install-plugin") { installPlugin(id); return; }
      if (action === "remove-plugin") { removePlugin(id); return; }
      if (action === "toggle-plugin") { togglePlugin(id); return; }
      if (action === "open-plugin") { openPlugin(id); return; }
      if (action === "install-theme") { installTheme(id); return; }
      if (action === "remove-theme") { removeTheme(id); return; }
      if (action === "apply-theme") { applyTheme(id); return; }
      return;
    }

    if (event.target.closest("[data-close]") || event.target.matches?.(".community-stage")) closePage();
  });

  document.addEventListener("input", (event) => {
    if (!event.target.matches("[data-search]")) return;
    queries[activeTab] = event.target.value || "";
    renderView(true);
  });

  document.addEventListener("change", (event) => {
    if (!event.target.matches("[data-plugin-archive]")) return;
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) installPluginArchive(file);
  });

  // Plugin icons are transparent SVGs, so the fallback must replace the image
  // instead of sitting behind it (otherwise the puzzle shows through).
  document.addEventListener("error", (event) => {
    const image = event.target;
    if (!image?.matches?.(".shop-plugin-icon img")) return;
    const holder = image.closest(".shop-plugin-icon");
    if (holder) holder.innerHTML = puzzleGlyph;
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePage();
  });

  async function init() {
    host = hostApi();
    if (host) {
      try {
        hostState = normalizeHostState(host.read());
      } catch (error) {}
    }
    render();
    loadCatalogs(false);
    if (host) {
      refreshHost().then(render).catch(() => {});
    } else {
      loadStandaloneState();
    }
  }

  init();
})();
