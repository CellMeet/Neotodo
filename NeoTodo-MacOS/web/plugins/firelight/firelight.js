/* ==========================================================================
   FIRELIGHT PLUGIN — the Doing card's warm icon glow.
   --------------------------------------------------------------------------
   The plugin owns the glow:
     - it registers itself with the plugin host, so Settings → Plugins can
       install, switch and remove it without touching the notebook;
     - it toggles html.firelight-on, which firelight.css is scoped to.

   The drifting fireflies and lanterns are the separate Fireflies plugin, and
   the blue electric ball is the separate Lightning plugin. This file only
   mirrors the switch onto <html>; the light itself is pure CSS.
   ========================================================================== */

(() => {
  "use strict";

  const PLUGIN_ID = "firelight";
  const body = document.body;
  const root = document.documentElement;
  if (!body || !root) return;

  const PLUGIN_DEFINITION = {
    id: PLUGIN_ID,
    title: "火光特效",
    englishTitle: "Firelight",
    version: "1.1.0",
    author: "NeoTodo",
    category: "Interface",
    description: "完成任务的代理会让 Doing 图标亮起来：暗色主题是一盏暖色的灯和柔和光晕，亮色主题是贴着图标轮廓的暖色火光。萤火虫是独立插件，也能和白色闪电同时开启。",
    icon: "/plugins/firelight/firelight.svg",
    entry: "/plugins/firelight/index.html",
    kind: "chrome",
  };

  // ------------------------------------------------------------------------
  // Plugin registration: show up in Settings → Plugins with an on/off switch.
  // ------------------------------------------------------------------------
  function registerPlugin() {
    try {
      if (typeof PLUGIN_REGISTRY === "undefined" || !PLUGIN_REGISTRY) return;
      if (!PLUGIN_REGISTRY[PLUGIN_ID]) {
        PLUGIN_REGISTRY[PLUGIN_ID] = { ...PLUGIN_DEFINITION };
      }
      if (typeof applyPluginState === "function") applyPluginState();
    } catch (error) {}
  }

  registerPlugin();

  // A zero-sized probe carries data-plugin so the existing host switch can
  // toggle .plugin-hidden on it; this file watches that class and mirrors the
  // state onto <html>. Turning the plugin off therefore needs no host patch.
  let probe = document.querySelector("[data-firelight-probe]");
  if (!probe) {
    probe = document.createElement("span");
    probe.className = "firelight-probe";
    probe.dataset.plugin = PLUGIN_ID;
    probe.dataset.firelightProbe = "";
    probe.setAttribute("aria-hidden", "true");
    body.appendChild(probe);
    if (typeof applyPluginState === "function") applyPluginState();
  }

  function on() {
    return !probe.classList.contains("plugin-hidden");
  }

  function syncEnabled() {
    root.classList.toggle("firelight-on", on());
  }

  new MutationObserver(syncEnabled).observe(probe, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // Reflect the switch that the host already rendered.
  root.classList.toggle("firelight-on", on());
})();
