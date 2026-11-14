/* ==========================================================================
   FIRELIGHT PLUGIN — the Doing card's icon glow.
   --------------------------------------------------------------------------
   The plugin owns the whole effect:
     - it registers itself with the plugin host, so Settings → Plugins can
       install, switch and remove it without touching the notebook;
     - it decorates unseen Doing icons with seeded specks;
     - it toggles html.firelight-on, which firelight.css is scoped to.

   The icon glow itself is pure CSS. This file only keeps the DOM in sync.
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
    version: "1.0.0",
    author: "NeoTodo",
    category: "Interface",
    description: "完成任务的代理会让 Doing 图标亮起来：暗色主题是萤火虫和小灯笼，亮色主题是贴在图标上的暖色火光与缓缓升起的余烬。",
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

  // ------------------------------------------------------------------------
  // Seeded specks, identical in spirit to the notebook's original fireflies:
  // the same icon always gets the same arrangement.
  // ------------------------------------------------------------------------
  function seededDots(seed) {
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i += 1) hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619);
    return () => {
      hash += 0x6d2b79f5;
      let value = hash;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function specksMarkup(seed) {
    const random = seededDots(String(seed));
    return Array.from({ length: 10 }, (_, index) => {
      const lantern = index % 3 === 1;
      const rose = lantern && random() > 0.62;
      const angle = random() * Math.PI * 2;
      const radius = lantern ? 5 + random() * 6 : 7 + random() * 10;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.55 + (lantern ? 3 : 0);
      const sway = (2.5 + random() * 5) * (random() > 0.5 ? 1 : -1);
      const x2 = x + (random() - 0.5) * (lantern ? 12 : 18);
      const y2 = y - (lantern ? 26 + random() * 18 : 12 + random() * 16);
      const size = lantern ? 5.4 + random() * 2.8 : 2.4 + random() * 2.1;
      const duration = lantern ? 4.4 + random() * 2.4 : 2.8 + random() * 2.2;
      const delay = index * 0.34 + random() * 0.8;
      const cls = `${lantern ? "lantern" : "firefly"}${rose ? " rose" : ""}`;
      return `<i class="${cls}" style="--fx:${x.toFixed(1)}px;--fy:${y.toFixed(1)}px;--fx2:${x2.toFixed(1)}px;--fy2:${y2.toFixed(1)}px;--fsway:${sway.toFixed(1)}px;--fs:${size.toFixed(1)}px;--fdur:${duration.toFixed(2)}s;--fdelay:${delay.toFixed(2)}s"></i>`;
    }).join("");
  }

  const fallbackSeeds = new WeakMap();
  let fallbackSeq = 0;

  function seedFor(icon) {
    const sub = icon.closest(".doing-sub");
    if (sub?.dataset.doingSubtask) return `sub:${sub.dataset.doingSubtask}`;
    const item = icon.closest(".doing-item");
    if (item?.dataset.doingItem) return `todo:${item.dataset.doingItem}`;
    if (!fallbackSeeds.has(icon)) {
      fallbackSeq += 1;
      fallbackSeeds.set(icon, `icon:${fallbackSeq}`);
    }
    return fallbackSeeds.get(icon);
  }

  // ------------------------------------------------------------------------
  // DOM: decorate unseen icons, and clean up as soon as one settles.
  // ------------------------------------------------------------------------
  let scheduled = 0;
  let watchedPanel = null;
  let panelObserver = null;

  function decorate() {
    if (probe.classList.contains("plugin-hidden")) return;

    document.querySelectorAll(".doing-fireflies[data-firelight]").forEach((node) => {
      if (!node.parentElement?.matches(".doing-mark.has-unseen, .doing-fan.has-unseen")) node.remove();
    });

    document.querySelectorAll(".doing-mark.has-unseen, .doing-fan.has-unseen").forEach((icon) => {
      if (icon.querySelector(":scope > .doing-fireflies[data-firelight]")) return;
      const specks = document.createElement("span");
      specks.className = "doing-fireflies";
      specks.dataset.firelight = "1";
      specks.setAttribute("aria-hidden", "true");
      specks.innerHTML = specksMarkup(seedFor(icon));
      icon.appendChild(specks);
    });
  }

  function cleanup() {
    document.querySelectorAll(".doing-fireflies[data-firelight]").forEach((node) => node.remove());
  }

  function scheduleDecorate() {
    if (scheduled) return;
    scheduled = requestAnimationFrame(() => {
      scheduled = 0;
      decorate();
    });
  }

  function watchPanel() {
    const panel = document.getElementById("doing-peek");
    if (panel === watchedPanel) return;
    watchedPanel = panel;
    panelObserver?.disconnect();
    panelObserver = null;
    if (!panel) return;
    panelObserver = new MutationObserver(scheduleDecorate);
    panelObserver.observe(panel, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    scheduleDecorate();
  }

  // Watch only the body's direct children: the Doing panel is added and
  // removed there, while the rest of the notebook stays unobserved.
  const bodyObserver = new MutationObserver(watchPanel);
  bodyObserver.observe(body, { childList: true });

  watchPanel();

  // ------------------------------------------------------------------------
  // Plugin switch: mirror the probe's state onto <html>.
  // ------------------------------------------------------------------------
  function on() {
    return !probe.classList.contains("plugin-hidden");
  }

  function syncEnabled() {
    const enabled = on();
    root.classList.toggle("firelight-on", enabled);
    if (enabled) {
      bodyObserver.observe(body, { childList: true });
      watchPanel();
      decorate();
      return;
    }
    bodyObserver.disconnect();
    panelObserver?.disconnect();
    panelObserver = null;
    watchedPanel = null;
    cleanup();
  }

  new MutationObserver(syncEnabled).observe(probe, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // Reflect the switch that the host already rendered.
  root.classList.toggle("firelight-on", on());
  if (on()) {
    watchPanel();
    decorate();
  } else {
    bodyObserver.disconnect();
  }
})();
