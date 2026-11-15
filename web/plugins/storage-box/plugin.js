/* ==========================================================================
   收纳箱 / STORAGE BOX — plugin control page.
   Talks to the NeoTodo plugin host when it runs in the plugin iframe, and
   falls back to the saved settings when opened as a normal page.
   ========================================================================== */

(() => {
  "use strict";

  const PLUGIN_ID = "storage-box";
  const power = document.getElementById("sb-power");
  const title = document.getElementById("sb-power-title");
  const detail = document.getElementById("sb-power-detail");
  const openButton = document.getElementById("sb-open");

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

  function parentBox() {
    try {
      if (window.parent !== window && window.parent.NeoTodoStorageBox) {
        return window.parent.NeoTodoStorageBox;
      }
    } catch (error) {}
    return null;
  }

  function render() {
    const on = enabled();
    power.setAttribute("aria-pressed", String(on));
    power.classList.toggle("sb-off", !on);
    title.textContent = on ? "Storage Box is on" : "Storage Box is off";
    detail.textContent = on
      ? "点击左下角的箱子，把不用的分类收起来。"
      : "收纳箱按钮和箱子都会隐藏，所有分类回到列表里。";

    let stored = 0;
    try { stored = parentBox()?.stored?.().length || 0; } catch (error) { stored = 0; }
    if (on && stored) detail.textContent = `箱子里目前有 ${stored} 个分类。`;

    if (openButton) {
      openButton.hidden = !inHost;
      openButton.disabled = !on;
    }
  }

  function closePage() {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "neotodo-plugin-close" }, window.location.origin);
      return;
    }
    window.close();
  }

  power?.addEventListener("click", () => {
    setEnabled(!enabled());
    render();
  });

  openButton?.addEventListener("click", () => {
    if (!enabled()) return;
    try { parentBox()?.activate?.(); } catch (error) {}
    closePage();
  });

  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", closePage);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePage();
  });

  // The host can flush its saved state a beat after a toggle; keep the page in
  // sync when it re-renders or another surface changes the switch.
  window.addEventListener("focus", render);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) render();
  });

  render();
  requestAnimationFrame(() => document.documentElement.classList.remove("sb-booting"));
})();
