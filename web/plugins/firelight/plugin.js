/* ==========================================================================
   FIRELIGHT PLUGIN PAGE — tiny control surface.
   Talks to the NeoTodo plugin host when it runs in the plugin iframe, and
   falls back to the saved settings when opened as a normal page.
   ========================================================================== */

(() => {
  "use strict";

  const PLUGIN_ID = "firelight";
  const power = document.getElementById("fl-power");
  const title = document.getElementById("fl-power-title");
  const detail = document.getElementById("fl-power-detail");

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
    power.classList.toggle("fl-off", !on);
    title.textContent = on ? "Firelight is on" : "Firelight is off";
    detail.textContent = on
      ? "代理留下未读结果时，图标会亮起。"
      : "Doing 图标保持安静，所有亮光都会熄灭。";
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
  requestAnimationFrame(() => document.documentElement.classList.remove("fl-booting"));
})();
