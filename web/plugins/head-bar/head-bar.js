/* ==========================================================================
   HEAD BAR PLUGIN — the Dynamic Island workspace switch.
   --------------------------------------------------------------------------
   This plugin owns:
     - its own capsule button appended to <body>;
     - its position, measured from the live header clock;
     - the body.head-bar-* state classes that roll the workspace away.

   It registers itself with the NeoTodo plugin host so Settings → Plugins can
   turn it on or off like any other plugin. No source file outside this folder
   needs to know what it does.
   ========================================================================== */

(() => {
  "use strict";

  const PLUGIN_ID = "head-bar";
  const body = document.body;
  if (!body || body.querySelector(".head-bar")) return;

  const PLUGIN_DEFINITION = {
    id: PLUGIN_ID,
    title: "Head Bar",
    englishTitle: "Dynamic Island",
    version: "2.0.0",
    author: "NeoTodo",
    category: "Interface",
    description: "悬停时间数字时，一条短短的、蓝白剔透的水晶宝石灵动岛从上边框滑出。点击后整个工作区向上收起，只留下原始壁纸；再次点击恢复。",
    icon: "/plugins/head-bar/head-bar.svg",
    entry: "/plugins/head-bar/index.html",
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

  // ------------------------------------------------------------------------
  // DOM: a transparent hit band with the island hanging from its top edge.
  // ------------------------------------------------------------------------
  const bar = document.createElement("button");
  bar.type = "button";
  bar.className = "head-bar";
  bar.dataset.plugin = PLUGIN_ID;
  bar.setAttribute("aria-pressed", "false");
  bar.setAttribute("aria-label", "Head Bar: hide the workspace and show the wallpaper");
  bar.title = "Head Bar";

  const island = document.createElement("span");
  island.className = "head-bar-island";
  island.setAttribute("aria-hidden", "true");

  const line = document.createElement("span");
  line.className = "head-bar-line";
  line.setAttribute("aria-hidden", "true");
  island.appendChild(line);
  bar.appendChild(island);
  body.appendChild(bar);

  let measureFrame = 0;
  let collapsed = false;

  const header = () => document.querySelector(".notebook-head");
  const clock = () => document.querySelector("#header-clock");

  function measure() {
    const headNode = header();
    const clockNode = clock();
    const viewportWidth = Math.max(1, window.innerWidth);

    // The hit band starts at the very top so it also covers the old hidden
    // top-edge strip, and ends at the header's lower border.
    let height = 56;
    let center = viewportWidth / 2;
    let islandWidth = 128;

    if (headNode) {
      const headRect = headNode.getBoundingClientRect();
      height = Math.max(56, Math.round(headRect.bottom || headRect.height || 56));
    }

    if (clockNode) {
      const clockStyle = window.getComputedStyle(clockNode);
      const clockRect = clockNode.getBoundingClientRect();
      if (clockStyle.display !== "none" && clockRect.width > 0) {
        center = clockRect.left + clockRect.width / 2;
        // A short cabochon: only a little wider than the time digits.
        islandWidth = Math.max(82, Math.round(clockRect.width + 18));
      }
    }

    const hitWidth = Math.min(
      Math.max(120, viewportWidth - 24),
      Math.max(184, islandWidth + 84)
    );

    bar.style.setProperty("--head-bar-left", `${Math.round(center)}px`);
    bar.style.setProperty("--head-bar-height", `${Math.round(height)}px`);
    bar.style.setProperty("--head-bar-island-width", `${islandWidth}px`);
    bar.style.setProperty("--head-bar-hit-width", `${Math.round(hitWidth)}px`);
  }

  function scheduleMeasure() {
    if (measureFrame) return;
    measureFrame = requestAnimationFrame(() => {
      measureFrame = 0;
      measure();
    });
  }

  function setCollapsed(next) {
    collapsed = Boolean(next);
    body.classList.toggle("head-bar-collapsed", collapsed);
    if (collapsed) body.classList.remove("head-bar-hover");

    bar.setAttribute("aria-pressed", String(collapsed));
    bar.setAttribute(
      "aria-label",
      collapsed
        ? "Head Bar: restore the workspace"
        : "Head Bar: hide the workspace and show the wallpaper"
    );

    if (!collapsed) {
      scheduleMeasure();
      // The header is still sliding home at this point; measure once more when
      // it lands so the island is sitting under the restored clock again.
      window.setTimeout(scheduleMeasure, 560);
    }
  }

  bar.addEventListener("pointerenter", () => {
    if (!collapsed && !bar.classList.contains("plugin-hidden")) {
      body.classList.add("head-bar-hover");
    }
  });
  bar.addEventListener("pointerleave", () => {
    body.classList.remove("head-bar-hover");
  });
  bar.addEventListener("focus", () => {
    if (!collapsed && !bar.classList.contains("plugin-hidden")) {
      body.classList.add("head-bar-hover");
    }
  });
  bar.addEventListener("blur", () => {
    body.classList.remove("head-bar-hover");
  });
  bar.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
  });
  bar.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setCollapsed(!collapsed);
  });

  // Keep the island glued to the clock through theme changes, window resizes
  // and the minute-by-minute text updates.
  window.addEventListener("resize", scheduleMeasure);
  window.addEventListener("orientationchange", scheduleMeasure);
  document.addEventListener("visibilitychange", scheduleMeasure);

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(scheduleMeasure);
    const headNode = header();
    const clockNode = clock();
    if (headNode) observer.observe(headNode);
    if (clockNode) observer.observe(clockNode);
  }

  if (window.MutationObserver) {
    const clockNode = clock();
    if (clockNode) {
      new MutationObserver(scheduleMeasure).observe(clockNode, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }

    // Turning the plugin off must also undo a collapsed workspace.
    new MutationObserver(() => {
      if (!bar.classList.contains("plugin-hidden")) {
        scheduleMeasure();
        return;
      }
      body.classList.remove("head-bar-hover");
      if (collapsed) setCollapsed(false);
    }).observe(bar, { attributes: true, attributeFilter: ["class"] });
  }

  header()?.addEventListener("transitionend", scheduleMeasure);

  registerPlugin();
  scheduleMeasure();
  requestAnimationFrame(() => {
    body.classList.add("head-bar-ready");
    measure();
  });
})();
