/* ==========================================================================
   SUBTASK SEARCH PLUGIN PAGE — tiny control surface.
   Talks to the NeoTodo plugin host when it runs in the plugin iframe, and
   falls back to the saved settings when opened as a normal page.
   ========================================================================== */

(() => {
  "use strict";

  const PLUGIN_ID = "subtask-search";
  const power = document.getElementById("ss-power");
  const title = document.getElementById("ss-power-title");
  const detail = document.getElementById("ss-power-detail");
  const blurInput = document.getElementById("ss-blur");
  const blurValue = document.getElementById("ss-blur-value");

  // The search pane's blur radius. The host page reads the same localStorage
  // key and repaints --ss-search-blur, so the drawer and this preview move
  // together while the slider is dragged.
  const BLUR_KEY = "neotodo.subtask-search.blur";
  const BLUR_DEFAULT = 26;
  const BLUR_MAX = 80;

  function normalizeBlur(value) {
    const px = Math.round(Number(value));
    if (!Number.isFinite(px)) return BLUR_DEFAULT;
    return Math.max(0, Math.min(BLUR_MAX, px));
  }

  function readLocalBlur() {
    try {
      const raw = localStorage.getItem(BLUR_KEY);
      if (raw === null || raw === "") return BLUR_DEFAULT;
      return normalizeBlur(raw);
    } catch (error) {
      return BLUR_DEFAULT;
    }
  }

  function paintBlur(value) {
    const px = normalizeBlur(value);
    if (blurInput) blurInput.value = String(px);
    if (blurValue) blurValue.textContent = `${px} px`;
    try {
      document.documentElement.style.setProperty("--ss-search-blur", `${px}px`);
    } catch (error) {}
  }

  function setBlur(value) {
    const px = normalizeBlur(value);
    try { localStorage.setItem(BLUR_KEY, String(px)); } catch (error) {}
    paintBlur(px);
    if (window.parent !== window) {
      try {
        if (typeof window.parent.setSubtaskSearchBlur === "function") {
          window.parent.setSubtaskSearchBlur(px);
        }
        window.parent.postMessage(
          { type: "neotodo-subtask-search-blur", value: px },
          window.location.origin
        );
      } catch (error) {}
    }
  }

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
    power.classList.toggle("ss-off", !on);
    title.textContent = on ? "Subtask Search is on" : "Subtask Search is off";
    detail.textContent = on
      ? "点击左栏放大镜，搜索栏会从子任务上边框滑出。"
      : "搜索栏已收起，重新打开即可使用。";
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

  blurInput?.addEventListener("input", () => {
    setBlur(blurInput.value);
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

  paintBlur(readLocalBlur());
  render();
  requestAnimationFrame(() => document.documentElement.classList.remove("ss-booting"));
})();
