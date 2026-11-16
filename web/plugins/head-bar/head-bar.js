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

  // Detached AI / note windows share index.html, but they are not the parent
  // notebook. Only the main NeoTodo window gets a Head Bar.
  const query = new URLSearchParams(window.location.search);
  const detachedParam = query.get("detached");
  const isDetachedWindow = detachedParam === "note"
    || (detachedParam === "ai" && Boolean(query.get("agent_id")));
  if (isDetachedWindow) return;

  const PLUGIN_DEFINITION = {
    id: PLUGIN_ID,
    title: "Head Bar",
    englishTitle: "Dynamic Island",
    version: "2.3.2",
    author: "NeoTodo",
    category: "Interface",
    description: "悬停时间数字时，一条海盐瓶水晶质感的灵动岛从上边框滑出。点击后工作区可选择推拉收起，或像纸张燃烧一样变黑、卷起、冒烟，最后露出壁纸；恢复时动画倒放，像时间倒流。",
    icon: "/plugins/head-bar/head-bar.svg",
    entry: "/plugins/head-bar/index.html",
    kind: "chrome",
    settings: [
      {
        id: "bottle",
        type: "choice",
        label: "Bottle style",
        detail: "海之盐蓝瓶 / 粉瓶",
        default: "blue",
        options: [
          { value: "blue", label: "海之盐 · 蓝", detail: "Maldives blue bottle" },
          { value: "pink", label: "海之盐 · 粉", detail: "Peach pink bottle" },
        ],
      },
      {
        id: "effect",
        type: "choice",
        label: "Collapse effect",
        detail: "工作区收起 / 复原的方式",
        default: "slide",
        options: [
          { value: "slide", label: "推拉", detail: "Push and pull" },
          { value: "burn", label: "火光烧尽", detail: "Char, curl and smoke like burning paper, then reveal the wallpaper" },
        ],
      },
    ],
  };

  function bottleStyle() {
    try {
      if (typeof pluginState === "function") {
        const value = pluginState(PLUGIN_ID)?.settings?.bottle;
        if (value === "pink" || value === "blue") return value;
      }
    } catch (error) {}
    return "blue";
  }

  function applyBottleStyle(value) {
    body.dataset.headBarStyle = value === "pink" ? "pink" : "blue";
  }

  function effectStyle() {
    try {
      if (typeof pluginState === "function") {
        const value = pluginState(PLUGIN_ID)?.settings?.effect;
        if (value === "burn" || value === "slide") return value;
      }
    } catch (error) {}
    return "slide";
  }

  function applyEffect(value) {
    body.dataset.headBarEffect = value === "burn" ? "burn" : "slide";
  }

  // ------------------------------------------------------------------------
  // Plugin registration: show up in Settings → Plugins with an on/off switch.
  // ------------------------------------------------------------------------
  function registerPlugin() {
    try {
      if (typeof PLUGIN_REGISTRY === "undefined" || !PLUGIN_REGISTRY) return;
      const registered = PLUGIN_REGISTRY[PLUGIN_ID];
      if (!registered) {
        PLUGIN_REGISTRY[PLUGIN_ID] = { ...PLUGIN_DEFINITION };
      } else {
        // The backend manifest can land before this script and register a
        // record without its choice rows (older backends only forwarded
        // toggles). Merge the bottle definition back in so Settings can keep
        // saving the reader's colour instead of silently ignoring the click.
        const rows = Array.isArray(registered.settings) ? [...registered.settings] : [];
        const known = new Set(rows.map((row) => row?.id).filter(Boolean));
        for (const row of PLUGIN_DEFINITION.settings) {
          if (!known.has(row.id)) rows.push(row);
        }
        registered.settings = rows;
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

  const island = document.createElement("span");
  island.className = "head-bar-island";
  island.setAttribute("aria-hidden", "true");

  const line = document.createElement("span");
  line.className = "head-bar-line";
  line.setAttribute("aria-hidden", "true");
  island.appendChild(line);
  bar.appendChild(island);
  body.appendChild(bar);

  // Full-viewport layers used only by the burn effect: a firelight wash,
  // blackened paper patches, and a handful of drifting smoke puffs.
  const burnChar = document.createElement("div");
  burnChar.className = "head-bar-burn-char";
  burnChar.setAttribute("aria-hidden", "true");
  body.appendChild(burnChar);

  const burnGlow = document.createElement("div");
  burnGlow.className = "head-bar-burn-glow";
  burnGlow.setAttribute("aria-hidden", "true");
  body.appendChild(burnGlow);

  const burnSmoke = document.createElement("div");
  burnSmoke.className = "head-bar-burn-smoke";
  burnSmoke.setAttribute("aria-hidden", "true");
  for (let index = 0; index < 7; index += 1) {
    burnSmoke.appendChild(document.createElement("i"));
  }
  body.appendChild(burnSmoke);

  let measureFrame = 0;
  let collapsed = false;
  let restoreTimer = 0;
  let revealTimer = 0;

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
    const wasCollapsed = collapsed;
    collapsed = Boolean(next);
    body.classList.toggle("head-bar-collapsed", collapsed);

    if (collapsed) {
      window.clearTimeout(restoreTimer);
      restoreTimer = 0;
      window.clearTimeout(revealTimer);
      revealTimer = 0;
      body.classList.remove("head-bar-restoring", "head-bar-reveal");
      body.classList.remove("head-bar-hover");
      // The click leaves the pointer on the trigger strip. Hide the island
      // until the pointer leaves the strip and comes back to the top.
      bar.classList.add("head-bar-suppress-hover");
      requestAnimationFrame(() => {
        if (!bar.matches(":hover")) bar.classList.remove("head-bar-suppress-hover");
      });
    } else {
      bar.classList.remove("head-bar-suppress-hover");
      // The door lines are viewport-fixed. Keep them hidden until the
      // workspace has finished sliding home, otherwise they pop out first.
      if (wasCollapsed) {
        body.classList.add("head-bar-restoring");
        window.clearTimeout(restoreTimer);
        window.clearTimeout(revealTimer);
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const burnEffect = body.dataset.headBarEffect === "burn";
        const restoreDelay = reduced ? 0 : (burnEffect ? 1350 : 560);
        restoreTimer = window.setTimeout(() => {
          restoreTimer = 0;
          body.classList.remove("head-bar-restoring");
          if (reduced) return;
          // The workspace has landed. The Doing card now wipes in from its
          // top edge instead of popping in ahead of the page.
          body.classList.add("head-bar-reveal");
          revealTimer = window.setTimeout(() => {
            revealTimer = 0;
            body.classList.remove("head-bar-reveal");
          }, 420);
        }, restoreDelay);
      }
    }

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
    // Leaving the top strip re-arms the hover trigger for the collapsed state.
    bar.classList.remove("head-bar-suppress-hover");
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
  window.addEventListener("neotodo-plugin-setting-change", (event) => {
    if (event.detail?.plugin !== PLUGIN_ID) return;
    if (event.detail?.key === "bottle") applyBottleStyle(event.detail.value);
    if (event.detail?.key === "effect") applyEffect(event.detail.value);
  });
  // The Notebook loads saved settings after this script boots, so the first
  // paint is always the default. Repaint as soon as the real record lands,
  // which is what keeps the chosen bottle/effect after a restart.
  window.addEventListener("neotodo-plugin-settings-sync", () => {
    applyBottleStyle(bottleStyle());
    applyEffect(effectStyle());
  });

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
  applyBottleStyle(bottleStyle());
  applyEffect(effectStyle());
  scheduleMeasure();
  requestAnimationFrame(() => {
    body.classList.add("head-bar-ready");
    measure();
  });
})();
