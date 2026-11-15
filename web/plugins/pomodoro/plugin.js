/* ==========================================================================
   番茄钟 / POMODORO — plugin control page.
   Talks to the NeoTodo plugin host when it runs in the plugin iframe, and
   falls back to the saved settings when opened as a normal page.
   ========================================================================== */

(() => {
  "use strict";

  const PLUGIN_ID = "pomodoro";
  const power = document.getElementById("pd-power");
  const title = document.getElementById("pd-power-title");
  const detail = document.getElementById("pd-power-detail");
  const start = document.getElementById("pd-start");

  const inHost = (() => {
    try {
      return window.parent !== window
        && typeof window.parent.pluginEnabled === "function"
        && typeof window.parent.setPluginEnabled === "function";
    } catch (error) {
      return false;
    }
  })();

  // The plugin is opt-in, so a missing record means "off", not "on".
  function readLocalEnabled() {
    try {
      const saved = JSON.parse(localStorage.getItem("neotodo.settings") || "{}");
      return saved?.plugins?.[PLUGIN_ID]?.enabled === true;
    } catch (error) {
      return false;
    }
  }

  function writeLocalEnabled(value) {
    try {
      const saved = JSON.parse(localStorage.getItem("neotodo.settings") || "{}");
      if (!saved.plugins || typeof saved.plugins !== "object") saved.plugins = {};
      const record = saved.plugins[PLUGIN_ID] && typeof saved.plugins[PLUGIN_ID] === "object"
        ? saved.plugins[PLUGIN_ID]
        : {};
      record.installed = true;
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
    power.classList.toggle("pd-off", !on);
    title.textContent = on ? "Pomodoro is on" : "Pomodoro is off";
    detail.textContent = on
      ? "右上角的耳机旁边有番茄计数器，完成一次专注就加一。"
      : "打开后，番茄计数器会出现在右上角，耳机会向左让位。";
    start.disabled = !on;
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

  start?.addEventListener("click", () => {
    if (!enabled()) return;
    if (window.parent !== window) {
      window.parent.postMessage({ type: "neotodo-pomodoro-start" }, window.location.origin);
      return;
    }
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
  requestAnimationFrame(() => document.documentElement.classList.remove("pd-booting"));
})();
