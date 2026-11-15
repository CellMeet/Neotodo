/* ==========================================================================
   HEAD BAR PLUGIN PAGE — tiny control surface.
   Talks to the NeoTodo plugin host when it runs in the plugin iframe, and
   falls back to the saved settings when opened as a normal page.
   ========================================================================== */

(() => {
  "use strict";

  const PLUGIN_ID = "head-bar";
  const power = document.getElementById("hb-power");
  const title = document.getElementById("hb-power-title");
  const detail = document.getElementById("hb-power-detail");

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
      // Keep the device copy newer than the last backend write; otherwise the
      // next launch would pick the older backend settings by timestamp.
      saved.saved_at = Date.now();
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

  function readLocalStyle() {
    try {
      const saved = JSON.parse(localStorage.getItem("neotodo.settings") || "{}");
      const value = saved?.plugins?.[PLUGIN_ID]?.settings?.bottle;
      return value === "pink" ? "pink" : "blue";
    } catch (error) {
      return "blue";
    }
  }

  function writeLocalStyle(value) {
    try {
      const saved = JSON.parse(localStorage.getItem("neotodo.settings") || "{}");
      if (!saved.plugins || typeof saved.plugins !== "object") saved.plugins = {};
      const record = saved.plugins[PLUGIN_ID] && typeof saved.plugins[PLUGIN_ID] === "object"
        ? saved.plugins[PLUGIN_ID]
        : {};
      record.installed = record.installed !== false;
      if (!record.settings || typeof record.settings !== "object") record.settings = {};
      record.settings.bottle = value === "pink" ? "pink" : "blue";
      saved.plugins[PLUGIN_ID] = record;
      saved.saved_at = Date.now();
      localStorage.setItem("neotodo.settings", JSON.stringify(saved));
    } catch (error) {}
  }

  function currentStyle() {
    if (inHost) {
      try {
        const value = window.parent.pluginState?.(PLUGIN_ID)?.settings?.bottle;
        if (value === "blue" || value === "pink") return value;
      } catch (error) {}
    }
    return readLocalStyle();
  }

  function applyStyle(value) {
    const style = value === "pink" ? "pink" : "blue";
    document.documentElement.dataset.hbStyle = style;
    document.querySelectorAll("[data-hb-style]").forEach((button) => {
      const selected = button.dataset.hbStyle === style;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function setStyle(value) {
    const style = value === "pink" ? "pink" : "blue";
    if (inHost) {
      try {
        if (typeof window.parent.setPluginChoice === "function") {
          window.parent.setPluginChoice(PLUGIN_ID, "bottle", style);
        }
      } catch (error) {}
    } else {
      writeLocalStyle(style);
    }
    applyStyle(style);
  }

  function render() {
    const on = enabled();
    power.setAttribute("aria-pressed", String(on));
    power.classList.toggle("hb-off", !on);
    title.textContent = on ? "Head Bar is on" : "Head Bar is off";
    detail.textContent = on
      ? "悬停时间数字即可唤出灵动岛。"
      : "功能已关闭。重新打开即可再次使用。";
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

  document.querySelectorAll("[data-hb-style]").forEach((button) => {
    button.addEventListener("click", () => setStyle(button.dataset.hbStyle));
  });

  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", closePage);
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type !== "neotodo-plugin-settings" || event.data.plugin !== PLUGIN_ID) return;
    const bottle = event.data.settings?.bottle;
    if (bottle === "blue" || bottle === "pink") applyStyle(bottle);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePage();
  });

  // The host can flush its saved state a beat after a toggle; keep the page in
  // sync when it re-renders or another surface changes the switch.
  window.addEventListener("focus", () => {
    render();
    applyStyle(currentStyle());
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      render();
      applyStyle(currentStyle());
    }
  });

  render();
  applyStyle(currentStyle());
  requestAnimationFrame(() => document.documentElement.classList.remove("hb-booting"));
})();
