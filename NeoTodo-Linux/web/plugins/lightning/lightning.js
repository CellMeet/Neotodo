/* ==========================================================================
   LIGHTNING PLUGIN — a breathing knot of white lightning.
   --------------------------------------------------------------------------
   The plugin owns the whole effect:
     - it registers itself with the plugin host, so Settings → Plugins can
       install, switch and remove it without touching the notebook;
     - it builds a small mass behind every unseen Doing icon: three layers of
       white filaments (core tangles, long body leaders and a dissolving
       fringe), each breathing at its own pace;
     - it toggles html.lightning-on, which lightning.css is scoped to.

   The mass is pure SVG. Nothing is drawn as a sphere, rim or shell: the only
   light is a blurred copy of the filaments, so the white tangle has a fuzzy,
   uneven edge and looks alive. This file only builds the mass and keeps it in
   sync with the card. Fireflies and Firelight are separate plugins and may
   stay on at the same time.
   ========================================================================== */

(() => {
  "use strict";

  const PLUGIN_ID = "lightning";
  const body = document.body;
  const root = document.documentElement;
  if (!body || !root) return;

  const PLUGIN_DEFINITION = {
    id: PLUGIN_ID,
    title: "白色闪电",
    englishTitle: "White Lightning",
    version: "1.4.0",
    author: "NeoTodo",
    category: "Interface",
    description: "完成任务的代理会让 Doing 图标被一团白色闪电包住：三层互相缠绕的白色电弧像活物一样一呼一吸地涨大、缩回，边缘的电丝不断闪烁又化开。不是球，也没有硬边。",
    icon: "/plugins/lightning/lightning.svg",
    entry: "/plugins/lightning/index.html",
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
  let probe = document.querySelector("[data-lightning-probe]");
  if (!probe) {
    probe = document.createElement("span");
    probe.className = "lightning-probe";
    probe.dataset.plugin = PLUGIN_ID;
    probe.dataset.lightningProbe = "";
    probe.setAttribute("aria-hidden", "true");
    body.appendChild(probe);
    if (typeof applyPluginState === "function") applyPluginState();
  }

  // ------------------------------------------------------------------------
  // Seeded storm: the same icon always gets the same strike phase, so the
  // flashes do not re-roll every time the Doing panel is rebuilt.
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

  // A breathing knot of white lightning. Every unseen icon gets three layers
  // of filaments instead of a few tidy radial bolts:
  //   - core: short tangles just outside the icon;
  //   - body: long, crooked leaders that give the mass its outline;
  //   - fringe: thin hairs that dissolve into the paper.
  // Each layer breathes (scales and turns a little) at its own pace, and
  // individual filaments flicker, so the clump looks alive instead of looping
  // one fixed animation. The geometry is seeded per todo.
  const CENTER = 50;
  const TAU = Math.PI * 2;

  const LAYERS = [
    { className: "mass-core", count: 5, inner: 6, outer: 24, breath: 2.6, tangle: 1 },
    { className: "mass-body", count: 9, inner: 12, outer: 38, breath: 3.6, tangle: 2 },
    { className: "mass-fringe", count: 9, inner: 20, outer: 48, breath: 4.6, tangle: 2 },
  ];

  function dot(angle, radius) {
    return [CENTER + Math.cos(angle) * radius, CENTER + Math.sin(angle) * radius];
  }

  function num(value) {
    return String(Math.round(value * 10) / 10);
  }

  function polyline(points) {
    return `M${points.map(([x, y]) => `${num(x)} ${num(y)}`).join(" ")}`;
  }

  // A leader: a crooked run that drifts sideways as it moves outward.
  function arcPoints(angle, inner, outer, random) {
    const steps = 4 + Math.floor(random() * 3);
    const points = [];
    let drift = 0;
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      if (i > 0) drift += (random() - 0.5) * 0.3;
      drift = Math.max(-0.6, Math.min(0.6, drift));
      const bend = angle + drift * (0.25 + t * 0.75);
      const radius = inner + (outer - inner) * t;
      const [x, y] = dot(bend, radius);
      points.push([
        x + (i > 0 && i < steps ? (random() - 0.5) * 2.6 : 0),
        y + (i > 0 && i < steps ? (random() - 0.5) * 2.6 : 0),
      ]);
    }
    return points;
  }

  // A tangle: a filament that curls sideways through one layer, filling the
  // mass so it reads as a clump rather than a set of spokes.
  function tanglePoints(radius, random) {
    const start = random() * TAU;
    const span = (0.7 + random() * 1.2) * (random() < 0.5 ? -1 : 1);
    const steps = 4 + Math.floor(random() * 4);
    const points = [];
    let current = radius;
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      current = Math.max(8, Math.min(47, current + (random() - 0.5) * 4.5));
      const [x, y] = dot(start + span * t, current);
      points.push([
        x + (i > 0 && i < steps ? (random() - 0.5) * 2 : 0),
        y + (i > 0 && i < steps ? (random() - 0.5) * 2 : 0),
      ]);
    }
    return points;
  }

  // A fork leaves a vertex of the leader and drifts to one side, getting
  // thinner and dimmer on the way out.
  function branchPoints(points, random) {
    const index = 1 + Math.floor(random() * Math.max(1, points.length - 2));
    const [x, y] = points[Math.min(index, points.length - 2)];
    const base = Math.atan2(y - CENTER, x - CENTER);
    const side = random() < 0.5 ? -1 : 1;
    const bend = base + side * (0.18 + random() * 0.24);
    const length = 5 + random() * 8;
    const [mx, my] = [
      x + Math.cos(bend) * length * 0.6,
      y + Math.sin(bend) * length * 0.6,
    ];
    const [ex, ey] = [
      x + Math.cos(bend + side * 0.2) * length,
      y + Math.sin(bend + side * 0.2) * length,
    ];
    return [[x, y], [mx, my], [ex, ey]];
  }

  function buildFilament(points, random) {
    const forks = [];
    const hairs = [];
    const tips = [];
    const forkCount = random() < 0.6 ? 2 : 1;
    for (let i = 0; i < forkCount; i += 1) {
      const branch = branchPoints(points, random);
      forks.push(polyline(branch));
      if (random() < 0.5) {
        const [ex, ey] = branch[branch.length - 1];
        tips.push([ex, ey, 0.6 + random() * 0.4]);
      }
    }
    if (random() < 0.75) hairs.push(polyline(branchPoints(points, random)));
    if (random() < 0.55) {
      const [ex, ey] = points[points.length - 1];
      tips.push([ex, ey, 0.9 + random() * 0.6]);
    }
    return { d: polyline(points), forks, hairs, tips };
  }

  function buildLayer(layer, random) {
    const filaments = [];
    for (let i = 0; i < layer.count; i += 1) {
      // Random angles leave gaps and clumps, so the mass never becomes a ring.
      const angle = random() * TAU;
      const inner = layer.inner + random() * 6;
      // Vary the reach of each leader a lot: some hug the icon, some whip far
      // out. A narrow band of equal lengths would read as a ring.
      const reach = 0.36 + random() * 0.88;
      const outer = Math.min(50, layer.inner + (layer.outer - layer.inner) * reach);
      filaments.push(buildFilament(arcPoints(angle, inner, outer, random), random));
    }
    for (let i = 0; i < layer.tangle; i += 1) {
      const radius = layer.inner + (layer.outer - layer.inner) * (0.3 + random() * 0.6);
      filaments.push(buildFilament(tanglePoints(radius, random), random));
    }
    return { ...layer, filaments };
  }

  function filamentMarkup(filament, random) {
    const pulse = random() < 0.72;
    const vars = pulse
      ? `--flicker-dur:${(0.7 + random() * 1.3).toFixed(2)}s;--flicker-delay:-${(random() * 2).toFixed(2)}s`
      : "";
    const paths = [
      `<path class="storm-glow" d="${filament.d}"></path>`,
      `<path class="storm-bolt" d="${filament.d}"></path>`,
      `<path class="storm-core" d="${filament.d}"></path>`,
      ...filament.forks.map((d) => `<path class="storm-bolt storm-fork" d="${d}"></path>`),
      ...filament.hairs.map((d) => `<path class="storm-bolt storm-hair" d="${d}"></path>`),
    ].join("");
    const tips = filament.tips
      .map(([cx, cy, r]) => `<circle class="storm-tip" cx="${num(cx)}" cy="${num(cy)}" r="${num(r)}"></circle>`)
      .join("");
    return `<g class="storm-filament${pulse ? " storm-pulse" : ""}" style="${vars}">${paths}${tips}</g>`;
  }

  function stormMarkup(seed) {
    const random = seededDots(String(seed));
    const layers = LAYERS.map((layer) => buildLayer(layer, random));
    const markup = layers
      .map((layer) => {
        const delay = (random() * layer.breath).toFixed(2);
        const style = `--breathe-dur:${layer.breath}s;--breathe-delay:-${delay}s`;
        return `<g class="storm-mass ${layer.className}" style="${style}">${layer.filaments
          .map((filament) => filamentMarkup(filament, random))
          .join("")}</g>`;
      })
      .join("");
    return `<svg class="storm-bolts" viewBox="0 0 100 100" aria-hidden="true">${markup}</svg>`;
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
  // DOM: wrap unseen icons, and unwrap them as soon as they settle.
  // ------------------------------------------------------------------------
  let scheduled = 0;
  let watchedPanel = null;
  let panelObserver = null;

  function decorate() {
    if (probe.classList.contains("plugin-hidden")) return;

    document.querySelectorAll(".doing-storm[data-lightning]").forEach((node) => {
      if (!node.parentElement?.matches(".doing-mark.has-unseen, .doing-fan.has-unseen")) node.remove();
    });

    document.querySelectorAll(".doing-mark.has-unseen, .doing-fan.has-unseen").forEach((icon) => {
      if (icon.querySelector(":scope > .doing-storm[data-lightning]")) return;
      const storm = document.createElement("span");
      storm.className = "doing-storm";
      storm.dataset.lightning = "1";
      storm.setAttribute("aria-hidden", "true");
      storm.innerHTML = stormMarkup(seedFor(icon));
      icon.appendChild(storm);
    });
  }

  function cleanup() {
    document.querySelectorAll(".doing-storm[data-lightning]").forEach((node) => node.remove());
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
    root.classList.toggle("lightning-on", enabled);
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
  root.classList.toggle("lightning-on", on());
  if (on()) {
    watchPanel();
    decorate();
  } else {
    bodyObserver.disconnect();
  }
})();
