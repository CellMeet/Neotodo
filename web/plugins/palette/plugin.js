/* ==========================================================================
   PALETTE PLUGIN PAGE
   --------------------------------------------------------------------------
   The page controls the notebook used to keep in Settings → Theme now live
   here. The iframe never edits a copy: every slider and picker calls
   `window.parent.NeoTodoPalette`, so page-line.json and baseline-rule.json stay
   the single source the page paints from. The note surface stays in
   Settings → Theme → Note theme.

   The page itself loads style.css, page-line.css and baseline-rules.css, so it
   is the same Settings sheet with the same theme colours — no private palette.
   ========================================================================== */

(() => {
  "use strict";

  const root = document.documentElement;
  const THEME_VARS = [
    "--pc-paper", "--pc-paper2", "--pc-ink", "--pc-muted",
    "--pc-accent", "--pc-accent-2", "--pc-accent2",
    "--pc-accent-rgb", "--pc-accent2-rgb", "--pc-border",
    "--pc-line", "--pc-rule", "--pc-paper-rgb", "--pc-paper2-rgb",
    "--pc-glow", "--pc-stamp", "--pc-paper-soft",
    "--pc-mask-soft", "--pc-mask-mid", "--pc-mask-strong",
    "--display", "--mono", "--script", "--note-font", "--overlay-top",
  ];

  const FALLBACK = {
    highlight: "",
    highlightFallback: "#1e1f23",
    pageLine: { color: "#333333", opacity: 1, row: 40, thickness: 1 },
    baselineRule: { mode: "solid", color: "#333333", color2: "#a8691f", angle: 0 },
    theme: { id: "light", name: "Light", dark: false, vars: {} },
  };

  let state = FALLBACK;

  const q = (selector) => document.querySelector(selector);
  const qa = (selector) => Array.from(document.querySelectorAll(selector));

  function normalizeHex(raw) {
    const value = String(raw || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
    if (/^[0-9a-f]{6}$/i.test(value)) return `#${value.toLowerCase()}`;
    if (/^#[0-9a-f]{3}$/i.test(value)) {
      return `#${value.slice(1).split("").map((char) => char + char).join("").toLowerCase()}`;
    }
    return "";
  }

  function hexToRgb(hex) {
    const value = normalizeHex(hex).replace("#", "");
    if (value.length !== 6) return "51, 51, 51";
    return `${parseInt(value.slice(0, 2), 16)}, ${parseInt(value.slice(2, 4), 16)}, ${parseInt(value.slice(4, 6), 16)}`;
  }

  function pageLinePaint(line) {
    return `rgba(${hexToRgb(line.color)}, ${line.opacity})`;
  }

  function hostBridge() {
    try {
      if (window.parent === window) return null;
      return window.parent.NeoTodoPalette || null;
    } catch (error) {
      return null;
    }
  }

  function applyThemeVars(vars) {
    if (!vars || typeof vars !== "object") return;
    for (const name of THEME_VARS) {
      const value = String(vars[name] || "").trim();
      if (value) root.style.setProperty(name, value);
    }
  }

  function adopt(next) {
    if (!next || typeof next !== "object") return;
    state = next;
    if (next.theme && typeof next.theme.dark === "boolean") {
      root.dataset.postcardDark = next.theme.dark ? "true" : "false";
    }
    applyThemeVars(next.theme?.vars);
    render();
  }

  function readFromHost() {
    const api = hostBridge();
    if (!api || typeof api.read !== "function") return;
    try {
      adopt(api.read());
    } catch (error) {}
  }

  function run(method, ...args) {
    const api = hostBridge();
    if (!api || typeof api[method] !== "function") return null;
    try {
      const result = api[method](...args);
      if (result && typeof result.then === "function") {
        result.then(adopt).catch(() => {});
        return result;
      }
      adopt(result);
      return result;
    } catch (error) {
      return null;
    }
  }

  function setField(node, value) {
    if (!node) return;
    if (document.activeElement !== node) node.value = String(value);
  }

  function render() {
    const line = { ...FALLBACK.pageLine, ...(state.pageLine || {}) };
    const rule = { ...FALLBACK.baselineRule, ...(state.baselineRule || {}) };
    const highlight = state.highlight || "";
    const highlightValue = highlight || state.highlightFallback || FALLBACK.highlightFallback;

    setField(q("[data-pl-highlight-color]"), highlightValue);
    setField(q("[data-pl-highlight-hex]"), highlightValue);
    const auto = q("[data-pl-highlight-auto]");
    if (auto) {
      const active = !highlight;
      auto.classList.toggle("active", active);
      auto.disabled = active;
      auto.setAttribute("aria-pressed", active ? "true" : "false");
    }

    setField(q("[data-pl-line-color]"), line.color);
    setField(q("[data-pl-line-hex]"), line.color);
    setField(q("[data-pl-line-thickness]"), line.thickness);
    const thicknessValue = q("#page-line-thickness-value");
    if (thicknessValue) thicknessValue.textContent = `${line.thickness} px`;

    setField(q("[data-pl-line-opacity]"), line.opacity);
    const opacityValue = q("#page-line-opacity-value");
    if (opacityValue) opacityValue.textContent = `${Math.round(line.opacity * 100)}%`;
    setField(q("[data-pl-line-row]"), line.row);
    const rowValue = q("#page-line-row-value");
    if (rowValue) rowValue.textContent = `${line.row} px`;

    const swatch = q("#pl-line-swatch");
    if (swatch) {
      swatch.style.setProperty("--preview-color", pageLinePaint(line));
      swatch.style.setProperty("--preview-row", "6px");
      swatch.style.setProperty("--preview-weight", `${Math.min(3, line.thickness)}px`);
    }

    qa("[data-pl-baseline-mode]").forEach((button) => {
      const active = button.dataset.plBaselineMode === rule.mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    setField(q("[data-pl-baseline-color]"), rule.color);
    setField(q("[data-pl-baseline-color-hex]"), rule.color);
    setField(q("[data-pl-baseline-color2]"), rule.color2);
    setField(q("[data-pl-baseline-color2-hex]"), rule.color2);
    setField(q("[data-pl-baseline-angle]"), rule.angle);
    const angleValue = q("#baseline-row-angle-value");
    if (angleValue) angleValue.textContent = `${rule.angle}°`;
    const secondControls = qa("[data-pl-baseline-color2], [data-pl-baseline-color2-hex]");
    secondControls.forEach((node) => node.classList.toggle("is-hidden", rule.mode === "solid"));
    const angleControl = q("[data-pl-baseline-angle]");
    if (angleControl) angleControl.classList.toggle("is-hidden", rule.mode !== "gradient");
    if (angleValue) angleValue.classList.toggle("is-hidden", rule.mode !== "gradient");

    const themeName = q("#pl-theme-name");
    if (themeName) themeName.textContent = state.theme?.name || "Theme";
  }

  function jumpTo(id) {
    const section = document.getElementById(id);
    if (!section) return;
    const scroller = q(".settings-scroll");
    if (scroller) {
      const top = section.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 12;
      scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
    qa("[data-pl-jump]").forEach((button) => {
      button.classList.toggle("active", button.dataset.plJump === id);
    });
  }

  function closePage() {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "neotodo-plugin-close" }, window.location.origin);
      return;
    }
    window.close();
  }

  // Settings closes when the desk outside the sheet is pressed; keep the same
  // gesture here so the palette never feels like a separate mini-app.
  q(".settings-stage")?.addEventListener("mousedown", (event) => {
    if (event.target === event.currentTarget) closePage();
  });

  let scrollFrame = 0;
  function trackSection() {
    scrollFrame = 0;
    const scroller = q(".settings-scroll");
    if (!scroller) return;
    const top = scroller.getBoundingClientRect().top + 72;
    let current = "";
    for (const button of qa("[data-pl-jump]")) {
      const section = document.getElementById(button.dataset.plJump);
      if (section && section.getBoundingClientRect().top <= top) current = button.dataset.plJump;
    }
    if (!current) current = "pl-highlight";
    qa("[data-pl-jump]").forEach((button) => {
      button.classList.toggle("active", button.dataset.plJump === current);
    });
  }

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.matches("[data-pl-highlight-color]")) {
      run("setHighlight", target.value);
      return;
    }
    if (target.matches("[data-pl-highlight-hex]")) {
      const color = normalizeHex(target.value);
      if (color) run("setHighlight", color);
      return;
    }
    if (target.matches("[data-pl-line-color]")) {
      run("setPageLine", { color: target.value });
      return;
    }
    if (target.matches("[data-pl-line-hex]")) {
      const color = normalizeHex(target.value);
      if (color) run("setPageLine", { color });
      return;
    }
    if (target.matches("[data-pl-line-thickness]")) {
      run("setPageLine", { thickness: Math.round(Number(target.value) || 1) });
      return;
    }
    if (target.matches("[data-pl-line-opacity]")) {
      run("setPageLine", { opacity: Math.max(0, Math.min(1, Number(target.value) || 0)) });
      return;
    }
    if (target.matches("[data-pl-line-row]")) {
      run("setPageLine", { row: Math.round(Number(target.value) || 40) });
      return;
    }
    if (target.matches("[data-pl-baseline-color]")) {
      run("setBaselineRule", { color: target.value });
      return;
    }
    if (target.matches("[data-pl-baseline-color2]")) {
      run("setBaselineRule", { color2: target.value });
      return;
    }
    if (target.matches("[data-pl-baseline-color-hex]")) {
      const color = normalizeHex(target.value);
      if (color) run("setBaselineRule", { color });
      return;
    }
    if (target.matches("[data-pl-baseline-color2-hex]")) {
      const color = normalizeHex(target.value);
      if (color) run("setBaselineRule", { color2: color });
      return;
    }
    if (target.matches("[data-pl-baseline-angle]")) {
      run("setBaselineRule", { angle: Math.max(0, Math.min(180, Number(target.value) || 0)) });
      return;
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const line = { ...FALLBACK.pageLine, ...(state.pageLine || {}) };
    const rule = { ...FALLBACK.baselineRule, ...(state.baselineRule || {}) };
    if (target.matches("[data-pl-highlight-hex]") && !normalizeHex(target.value)) {
      target.value = state.highlight || state.highlightFallback || FALLBACK.highlightFallback;
      return;
    }
    if (target.matches("[data-pl-line-hex]") && !normalizeHex(target.value)) {
      target.value = line.color;
      return;
    }
    if (target.matches("[data-pl-baseline-color-hex]") && !normalizeHex(target.value)) {
      target.value = rule.color;
      return;
    }
    if (target.matches("[data-pl-baseline-color2-hex]") && !normalizeHex(target.value)) {
      target.value = rule.color2;
      return;
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element
      ? event.target.closest("[data-close], [data-pl-jump], [data-pl-highlight-auto], [data-pl-baseline-mode]")
      : null;
    if (!target) return;
    if (target.matches("[data-close]")) {
      closePage();
      return;
    }
    if (target.matches("[data-pl-jump]")) {
      jumpTo(target.dataset.plJump);
      return;
    }
    if (target.matches("[data-pl-highlight-auto]")) {
      run("resetHighlight");
      return;
    }
    if (target.matches("[data-pl-baseline-mode]")) {
      run("setBaselineRule", { mode: target.dataset.plBaselineMode });
      return;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePage();
  });

  window.addEventListener("message", (event) => {
    if (event.data?.type !== "neotodo-theme") return;
    if (typeof event.data.dark === "boolean") {
      root.dataset.postcardDark = event.data.dark ? "true" : "false";
    }
    applyThemeVars(event.data.vars);
  });

  window.addEventListener("focus", readFromHost);
  window.addEventListener("resize", readFromHost, { passive: true });

  const scroller = q(".settings-scroll");
  scroller?.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(trackSection);
  }, { passive: true });

  render();
  readFromHost();
})();
