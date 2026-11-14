/* ==========================================================================
   NEON TERMINAL plugin control page
   Talks to the NeoTodo plugin host when it runs in the plugin iframe, and
   falls back to the saved settings when opened as a normal page.
   ========================================================================== */

(() => {
  "use strict";

  const PLUGIN_ID = "music-player";
  const power = document.getElementById("mp-power");
  const powerTitle = document.getElementById("mp-power-title");
  const powerDetail = document.getElementById("mp-power-detail");
  const openPlayer = document.getElementById("mp-open-player");
  const count = document.querySelector("[data-count]");
  const folderState = document.querySelector("[data-folder-state]");
  const sourceState = document.querySelector("[data-source-state]");
  const folderPath = document.querySelector("[data-folder-path]");

  const inHost = (() => {
    try {
      return window.parent !== window
        && typeof window.parent.pluginEnabled === "function"
        && typeof window.parent.setPluginEnabled === "function";
    } catch (error) {
      return false;
    }
  })();

  function readLocalEnabled() {
    try {
      const saved = JSON.parse(localStorage.getItem("neotodo.settings") || "{}");
      return saved?.plugins?.[PLUGIN_ID]?.enabled !== false;
    } catch (error) {
      return true;
    }
  }

  function writeLocalEnabled(value) {
    try {
      const saved = JSON.parse(localStorage.getItem("neotodo.settings") || "{}");
      if (!saved.plugins || typeof saved.plugins !== "object") saved.plugins = {};
      const record = saved.plugins[PLUGIN_ID] && typeof saved.plugins[PLUGIN_ID] === "object"
        ? saved.plugins[PLUGIN_ID]
        : {};
      record.installed = record.installed !== false;
      record.enabled = Boolean(value);
      saved.plugins[PLUGIN_ID] = record;
      localStorage.setItem("neotodo.settings", JSON.stringify(saved));
    } catch (error) {}
  }

  function enabled() {
    if (inHost) {
      try { return Boolean(window.parent.pluginEnabled(PLUGIN_ID)); } catch (error) {}
    }
    return readLocalEnabled();
  }

  function setEnabled(value) {
    if (inHost) {
      try {
        window.parent.setPluginEnabled(PLUGIN_ID, value);
        return;
      } catch (error) {}
    }
    writeLocalEnabled(value);
  }

  function render() {
    const on = enabled();
    power.setAttribute("aria-pressed", String(on));
    power.classList.toggle("mp-off", !on);
    powerTitle.textContent = on ? "Music player is on" : "Music player is off";
    powerDetail.textContent = on
      ? "播放器图标会留在左侧工具栏。"
      : "功能已关闭。重新打开即可再次使用。";
    if (openPlayer) openPlayer.disabled = !on;
  }

  async function loadStats() {
    try {
      const response = await fetch("/api/music", { cache: "no-store" });
      if (!response.ok) throw new Error("not found");
      const data = await response.json();
      const tracks = Array.isArray(data.tracks) ? data.tracks : [];
      count.textContent = String(tracks.length);
      folderState.textContent = data.library || "MUSIC";
      sourceState.textContent = tracks.some((track) => track.local) ? "LOCAL" : "FOLDER";
      if (data.folder) {
        folderPath.textContent = data.folder;
        folderPath.title = `点击复制：${data.folder}`;
        folderPath.dataset.path = data.folder;
      } else {
        folderPath.textContent = "内置曲库（music 文件夹）";
        folderPath.title = "内置曲库";
        folderPath.dataset.path = "";
      }
    } catch (error) {
      count.textContent = "—";
      folderState.textContent = "MUSIC";
      sourceState.textContent = "FOLDER";
    }
  }

  function closePage() {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "neotodo-plugin-close" }, window.location.origin);
      return;
    }
    window.close();
  }

  function openThePlayer() {
    if (!enabled()) {
      render();
      power?.focus();
      return;
    }
    if (window.parent !== window) {
      window.parent.postMessage({ type: "neotodo-music-player-open" }, window.location.origin);
      return;
    }
    window.location.href = "/#music-player";
  }

  power?.addEventListener("click", () => {
    setEnabled(!enabled());
    render();
  });

  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", closePage);
  });

  openPlayer?.addEventListener("click", openThePlayer);

  folderPath?.addEventListener("click", () => {
    const path = folderPath.dataset.path || "";
    if (!path) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(path).then(() => {
        folderPath.textContent = "曲库路径已复制";
        setTimeout(loadStats, 1200);
      }).catch(() => {});
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePage();
  });

  window.addEventListener("focus", render);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      render();
      loadStats();
    }
  });

  render();
  loadStats();
  requestAnimationFrame(() => document.documentElement.classList.remove("mp-booting"));
})();
