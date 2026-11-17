/* ==========================================================================
   NeoTodo download site
   --------------------------------------------------------------------------
   Reads two plain JSON files next to this page:
     downloads.json         software versions, files and checksums
     plugins/catalog.json   the same catalog the app fetches for its Community
                            shelf, so the website and the notebook never drift

   No framework, no CDN, no analytics: the page is a shelf of files.
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var $$ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };

  var state = {
    downloads: null,
    recommended: "",
    query: "",
    category: "all",
    plugins: [],
  };

  var CATEGORY_LABELS = {
    interface: "界面",
    play: "游戏",
    productivity: "效率",
    utility: "工具",
    ai: "AI",
    other: "其他",
  };

  var STATUS_LABELS = {
    available: "可下载",
    build: "需构建",
    planned: "制作中",
  };

  var SOURCE_LABELS = {
    github: "GitHub",
    server: "本站直连",
    docs: "文档",
  };

  var PLATFORM_GLYPHS = {
    windows:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.6 11 4.5v7H3.5zM12.4 4.3 20.5 3v8.5h-8.1zM3.5 12.8H11v7L3.5 18.6zM12.4 12.8h8.1V21l-8.1-1.2z" fill="currentColor"/></svg>',
    linux:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.6" y="4.2" width="18.8" height="15.6" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m6.4 9.2 2.6 2.4-2.6 2.4M11.4 14.4h5.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    macos:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="4.6" width="17.6" height="11.4" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2 18.4h20M9.4 18.4l-.6 1.8h6.4l-.6-1.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 8.2c.7-.9 2-.8 2.5-.2.5-.6 1.8-.7 2.5.2.9 1.1.4 3.5-1.2 4.9-.7.6-1.1.3-1.3.3s-.6.3-1.3-.3c-1.6-1.4-2.1-3.8-1.2-4.9Z" fill="currentColor" opacity=".55"/></svg>',
    android:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 10.6a5.8 5.8 0 0 1 11.6 0v6.1a1.4 1.4 0 0 1-1.4 1.4H7.6a1.4 1.4 0 0 1-1.4-1.4z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.4 7.4 7 4.9M15.6 7.4 17 4.9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="9.4" cy="11.2" r=".9" fill="currentColor"/><circle cx="14.6" cy="11.2" r=".9" fill="currentColor"/><path d="M4.2 11.4v5.1M19.8 11.4v5.1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    ios:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.4" y="2.6" width="11.2" height="18.8" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10.4 5.2h3.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="12" cy="18.4" r=".9" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  };

  var FALLBACK_GLYPH =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v5a3 3 0 0 0 3 3h3v6h-5a3 3 0 0 0-3 3v1H7v-4a3 3 0 0 0-3-3H3V9h5a3 3 0 0 0 3-3V3Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function isHttpUrl(value) {
    return /^https?:\/\//i.test(String(value || ""));
  }

  function formatSize(bytes) {
    if (typeof bytes !== "number" || !isFinite(bytes) || bytes <= 0) return "";
    var units = ["B", "KB", "MB", "GB"];
    var size = bytes;
    var index = 0;
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index += 1;
    }
    return (index === 0 ? Math.round(size) : size.toFixed(1)) + " " + units[index];
  }

  function formatDate(value) {
    var text = String(value || "").trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text.replace(/-/g, ".") : text || "—";
  }

  function resolveUrl(path) {
    var raw = String(path || "");
    if (!raw) return "";
    if (isHttpUrl(raw)) return raw;
    try {
      return new URL(raw, window.location.href).href;
    } catch (error) {
      return raw;
    }
  }

  function catalogUrl() {
    if (window.location.protocol === "file:") {
      return "https://你的域名/plugins/catalog.json";
    }
    return resolveUrl("plugins/catalog.json");
  }

  function toast(message) {
    var node = $("[data-toast]");
    if (!node) return;
    node.textContent = message;
    node.classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(function () {
      node.classList.remove("show");
    }, 2400);
  }

  function copyText(text, done) {
    var value = String(text || "");
    var finish = function () { toast(done || "已复制"); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(finish, function () { legacyCopy(value, finish); });
      return;
    }
    legacyCopy(value, finish);
  }

  function legacyCopy(value, done) {
    var area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); } catch (error) {}
    document.body.removeChild(area);
    done();
  }

  function fetchJSON(path) {
    return fetch(path, { cache: "no-store", credentials: "same-origin" }).then(function (response) {
      if (!response.ok) throw new Error(response.status + " " + response.statusText);
      return response.json();
    });
  }

  /* ------------------------------------------------------------------ theme */

  function syncThemeButton() {
    var dark = document.documentElement.dataset.theme === "dark";
    var button = $("[data-theme-toggle]");
    if (!button) return;
    button.setAttribute("aria-pressed", dark ? "true" : "false");
    button.setAttribute("aria-label", dark ? "切换到浅色纸张" : "切换到深色纸张");
  }

  function wireTheme() {
    syncThemeButton();
    var button = $("[data-theme-toggle]");
    if (!button) return;
    button.addEventListener("click", function () {
      var dark = document.documentElement.dataset.theme !== "dark";
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      try { localStorage.setItem("neotodo.site.theme", dark ? "dark" : "light"); } catch (error) {}
      syncThemeButton();
    });
  }

  /* -------------------------------------------------------------- downloads */

  function detectPlatform() {
    var userAgent = navigator.userAgent || "";
    var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    if (/iPhone|iPad|iPod/i.test(userAgent) || /iPad|iPhone|iPod/i.test(platform)) return "ios";
    if (/Android/i.test(userAgent)) return "android";
    if (/Mac/i.test(platform) || /Mac OS X|Macintosh/i.test(userAgent)) return "macos";
    if (/Win/i.test(platform) || /Windows/i.test(userAgent)) return "windows";
    if (/Linux|X11/i.test(platform) || /Linux|X11/i.test(userAgent)) return "linux";
    return "";
  }

  function artifactFor(platform) {
    var artifacts = Array.isArray(platform.artifacts) ? platform.artifacts : [];
    var downloads = artifacts.filter(function (item) { return item && item.kind !== "link" && item.url; });
    return downloads[0] || artifacts[0] || null;
  }

  function artifactMarkup(artifact) {
    if (!artifact) {
      return '<div class="artifact"><button class="btn small" type="button" disabled>尚未发布</button></div>';
    }
    if (artifact.kind === "link") {
      return (
        '<div class="artifact">' +
          '<a class="btn small ghost" href="' + esc(artifact.url || "#") + '" target="_blank" rel="noreferrer noopener">' +
            esc(artifact.name || "查看说明") +
          "</a>" +
          '<span class="artifact-file">' + esc(artifact.file || "") + "</span>" +
        "</div>"
      );
    }
    var size = formatSize(artifact.size);
    var sha = String(artifact.sha256 || "").trim();
    var meta = [];
    if (size) meta.push("<span>" + esc(size) + "</span>");
    if (sha) {
      meta.push(
        '<span>sha256 ' + esc(sha.slice(0, 12)) + "… " +
          '<button class="copy-chip" type="button" data-copy="' + esc(sha) + '" data-copied="校验值已复制">复制</button>' +
        "</span>"
      );
    }
    var source = SOURCE_LABELS[artifact.source] || "";
    return (
      '<div class="artifact">' +
        '<div class="artifact-row">' +
          '<a class="btn small primary" href="' + esc(artifact.url || "#") + '" download rel="noreferrer">' +
            "下载 · " + esc(artifact.kind || "文件") +
          "</a>" +
          (source ? '<span class="source-tag">' + esc(source) + "</span>" : "") +
        "</div>" +
        '<span class="artifact-file">' + esc(artifact.file || "") + "</span>" +
        (meta.length ? '<div class="artifact-meta">' + meta.join("") + "</div>" : "") +
      "</div>"
    );
  }

  function platformCard(platform, index) {
    var recommended = platform.id === state.recommended;
    var status = STATUS_LABELS[platform.status] || platform.status || "";
    var requirements = Array.isArray(platform.requirements) ? platform.requirements : [];
    return (
      '<article class="platform-card' + (recommended ? " recommended" : "") + '" style="--i:' + Math.min(index, 8) + '">' +
        '<div class="platform-top">' +
          '<span class="platform-glyph">' + (PLATFORM_GLYPHS[platform.id] || FALLBACK_GLYPH) + "</span>" +
          '<div class="platform-title">' +
            "<h3>" + esc(platform.name || platform.id) + "</h3>" +
            "<small>" + esc(platform.englishName || "") + "</small>" +
          "</div>" +
          (recommended ? '<span class="badge recommend">推荐</span>' : "") +
          '<span class="badge ' + esc(platform.status || "") + '">' + esc(status) + "</span>" +
        "</div>" +
        (requirements.length
          ? '<ul class="requirements">' + requirements.slice(0, 4).map(function (item) {
              return "<li>" + esc(item) + "</li>";
            }).join("") + "</ul>"
          : "") +
        '<p class="platform-note">' + esc(platform.note || "") + "</p>" +
        artifactMarkup(artifactFor(platform)) +
      "</article>"
    );
  }

  function renderDownloads() {
    var grid = $("[data-download-grid]");
    var data = state.downloads;
    if (!grid) return;
    var app = (data && data.app) || {};
    var platforms = (data && Array.isArray(data.platforms)) ? data.platforms : [];
    state.recommended = detectPlatform();
    grid.innerHTML = platforms.map(platformCard).join("");

    var version = app.version || "";
    if (version) {
      $$("[data-version]").forEach(function (node) { node.textContent = version; });
      document.title = "下载 NeoTodo " + version;
    }
    $$("[data-released]").forEach(function (node) { node.textContent = formatDate(app.released); });

    var link = $("[data-primary-download]");
    var recommendedPlatform = platforms.filter(function (item) { return item.id === state.recommended; })[0];
    var artifact = recommendedPlatform ? artifactFor(recommendedPlatform) : null;
    if (link && artifact && artifact.url && artifact.kind !== "link") {
      link.href = artifact.url;
      link.textContent = "下载 · " + (recommendedPlatform.name || "NeoTodo");
      link.setAttribute("download", "");
    } else if (link && version) {
      link.href = "#download";
      link.textContent = "下载 NeoTodo " + version;
    }
  }

  function renderDownloadError(error) {
    var node = $("[data-download-error]");
    var grid = $("[data-download-grid]");
    if (grid) grid.innerHTML = "";
    if (!node) return;
    node.hidden = false;
    node.innerHTML =
      "无法读取 <code>downloads.json</code>（" + esc(error && error.message ? error.message : "未知错误") + "）。" +
      "如果你是在本地直接双击打开页面，请改用 <code>python3 -m http.server -d site 8080</code> 预览。";
  }

  /* ---------------------------------------------------------------- plugins */

  function categoryLabel(value) {
    var key = String(value || "").trim().toLowerCase();
    return CATEGORY_LABELS[key] || (value ? String(value) : "其他");
  }

  function pluginIcon(entry) {
    var icon = String(entry.icon || "");
    var extension = (icon.split("?")[0].match(/\.(svg|png|jpe?g|webp|gif)$/i) || [])[1] || "svg";
    var local = resolveUrl("plugins/icons/" + encodeURIComponent(entry.id) + "." + extension.toLowerCase());
    var source = "";
    if (isHttpUrl(icon)) {
      source = icon;
    } else if (icon) {
      source = local;
    }
    if (!source) return '<span class="plugin-icon">' + FALLBACK_GLYPH + "</span>";
    var fallback = source === local ? "" :
      ' onerror="if(this.dataset.fallback){this.remove()}else{this.dataset.fallback=1;this.src=\'' + esc(local) + '\'}"';
    return (
      '<span class="plugin-icon">' + FALLBACK_GLYPH +
        '<img src="' + esc(source) + '" alt="" loading="lazy"' + fallback + ">" +
      "</span>"
    );
  }

  function pluginMatches(entry) {
    if (state.category !== "all" && String(entry.category || "").trim().toLowerCase() !== state.category) return false;
    var query = state.query.trim().toLowerCase();
    if (!query) return true;
    var haystack = [
      entry.id,
      entry.name,
      entry.englishName,
      entry.author,
      entry.description,
      entry.category,
      (entry.tags || []).join(" "),
    ].join(" ").toLowerCase();
    return query.split(/\s+/).every(function (word) { return haystack.indexOf(word) !== -1; });
  }

  function pluginCard(entry, index) {
    var download = isHttpUrl(entry.download);
    var bundled = Boolean(entry.bundled);
    var action;
    if (download) {
      action = '<a class="btn small" href="' + esc(entry.download) + '" download rel="noreferrer">下载 .zip</a>';
    } else if (bundled) {
      action = '<span class="badge soft">随软件内置</span>';
    } else {
      action = '<span class="badge soft">即将上架</span>';
    }
    var origin = entry.official
      ? '<span class="badge official">官方</span>'
      : '<span class="badge soft">社区</span>';
    var tags = (Array.isArray(entry.tags) ? entry.tags : []).slice(0, 4).map(function (tag) {
      return '<span class="tag">' + esc(tag) + "</span>";
    }).join("");
    return (
      '<article class="plugin-card" style="--i:' + Math.min(index, 12) + '" data-plugin-id="' + esc(entry.id) + '">' +
        '<div class="plugin-top">' +
          pluginIcon(entry) +
          '<div class="plugin-title">' +
            "<h3>" + esc(entry.name || entry.id) + "</h3>" +
            "<small>" + esc(entry.englishName || entry.id) + "</small>" +
          "</div>" +
          '<span class="version-pill">v' + esc(entry.version || "1.0.0") + "</span>" +
        "</div>" +
        '<p class="plugin-desc">' + esc(entry.description || "这个插件还没有写介绍。") + "</p>" +
        (tags ? '<div class="plugin-tags">' + tags + "</div>" : "") +
        '<div class="plugin-foot">' +
          '<span class="plugin-author">' + origin + " <strong>" + esc(entry.author || "Community") + "</strong></span>" +
          (bundled ? '<span class="badge soft">内置</span>' : "") +
          action +
        "</div>" +
      "</article>"
    );
  }

  function renderChips() {
    var row = $("[data-plugin-chips]");
    if (!row) return;
    var counts = {};
    state.plugins.forEach(function (entry) {
      var key = String(entry.category || "").trim().toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    var order = Object.keys(CATEGORY_LABELS).filter(function (key) { return counts[key]; });
    Object.keys(counts).forEach(function (key) {
      if (order.indexOf(key) === -1) order.push(key);
    });
    var chips = [{ key: "all", label: "全部", count: state.plugins.length }].concat(order.map(function (key) {
      return { key: key, label: categoryLabel(key), count: counts[key] };
    }));
    row.innerHTML = chips.map(function (chip) {
      return (
        '<button class="chip" type="button" data-category="' + esc(chip.key) + '" aria-pressed="' +
          (state.category === chip.key ? "true" : "false") + '">' +
          esc(chip.label) + "<small>" + chip.count + "</small>" +
        "</button>"
      );
    }).join("");
  }

  function renderPlugins() {
    var grid = $("[data-plugin-grid]");
    var empty = $("[data-plugin-empty]");
    if (!grid) return;
    var matches = state.plugins.filter(pluginMatches);
    grid.innerHTML = matches.map(pluginCard).join("");
    if (empty) empty.hidden = matches.length > 0;
    var count = $("[data-plugin-count]");
    if (count) count.textContent = String(state.plugins.length);
    var catalogCount = $("[data-catalog-count]");
    if (catalogCount) {
      var downloadable = state.plugins.filter(function (entry) { return isHttpUrl(entry.download); }).length;
      catalogCount.textContent = state.plugins.length + " 枚 · " + downloadable + " 枚可直接下载";
    }
  }

  function setCategory(key) {
    state.category = key;
    $$("[data-plugin-chips] .chip").forEach(function (chip) {
      chip.setAttribute("aria-pressed", chip.dataset.category === key ? "true" : "false");
    });
    renderPlugins();
  }

  function wirePluginControls() {
    var search = $("[data-plugin-search]");
    if (search) {
      var frame = 0;
      search.addEventListener("input", function () {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(function () {
          state.query = search.value;
          renderPlugins();
        });
      });
      document.addEventListener("keydown", function (event) {
        var target = event.target;
        var typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
        if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          search.focus();
        }
        if (event.key === "Escape" && document.activeElement === search && search.value) {
          search.value = "";
          state.query = "";
          renderPlugins();
        }
      });
    }
    var chips = $("[data-plugin-chips]");
    if (chips) {
      chips.addEventListener("click", function (event) {
        var chip = event.target.closest("[data-category]");
        if (chip) setCategory(chip.dataset.category);
      });
    }
    var grid = $("[data-plugin-grid]");
    if (grid) {
      grid.addEventListener("click", function (event) {
        var link = event.target.closest("a[download]");
        if (link) toast("下载完成后，在应用里打开 设置 → 社区 → 从 .zip 安装");
      });
    }
  }

  function renderCatalogMeta() {
    var url = catalogUrl();
    var env = $("[data-catalog-env]");
    if (env) env.textContent = "NEOTODO_PLUGIN_CATALOG=" + url;
    var link = $("[data-catalog-link]");
    if (link && window.location.protocol !== "file:") link.href = url;
  }

  function renderPluginError(error) {
    var node = $("[data-plugin-error]");
    var grid = $("[data-plugin-grid]");
    if (grid) grid.innerHTML = "";
    if (!node) return;
    node.hidden = false;
    node.innerHTML =
      "无法读取 <code>plugins/catalog.json</code>（" + esc(error && error.message ? error.message : "未知错误") + "）。" +
      "请确认服务器上的 <code>/plugins/catalog.json</code> 可以访问；本地预览请用 " +
      "<code>python3 -m http.server -d site 8080</code>。";
  }

  /* ------------------------------------------------------------------ setup */

  function wireCopyButtons() {
    document.addEventListener("click", function (event) {
      var button = event.target.closest("[data-copy]");
      if (button) {
        copyText(button.dataset.copy, button.dataset.copied || "已复制");
        return;
      }
      if (event.target.closest("[data-copy-catalog]")) {
        copyText(catalogUrl(), "插件目录地址已复制");
        return;
      }
      if (event.target.closest("[data-copy-env]")) {
        var env = $("[data-catalog-env]");
        copyText(env ? env.textContent : "", "环境变量已复制");
      }
    });
  }

  function wireHeadShadow() {
    var head = $("[data-head]");
    if (!head) return;
    var update = function () {
      head.classList.toggle("scrolled", window.scrollY > 8);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ------------------------------------------------------------------- boot */

  function boot() {
    wireTheme();
    wireCopyButtons();
    wireHeadShadow();
    renderCatalogMeta();
    wirePluginControls();

    var downloadsPromise = fetchJSON("downloads.json").then(function (data) {
      state.downloads = data;
      renderDownloads();
    }).catch(function (error) {
      renderDownloadError(error);
    });

    var catalogPromise = fetchJSON("plugins/catalog.json").then(function (catalog) {
      state.plugins = Array.isArray(catalog.plugins) ? catalog.plugins : [];
      var featured = state.plugins.filter(function (entry) { return entry.featured; });
      var rest = state.plugins.filter(function (entry) { return !entry.featured; });
      state.plugins = featured.concat(rest);
      renderChips();
      renderPlugins();
    }).catch(function (error) {
      renderPluginError(error);
    });

    return Promise.all([downloadsPromise, catalogPromise]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
