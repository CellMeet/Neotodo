/* ==========================================================================
   PLUGIN THEME BRIDGE
   --------------------------------------------------------------------------
   Every plugin page is a small document of its own, but it must wear the
   notebook it was opened from. This script runs in the plugin <head>, before
   the plugin stylesheet, and copies the live theme from the host window:

     - the postcard palette (paper, paper2, ink, muted, line, accent, borders),
     - the page-line paint and weight,
     - the floating-card outline, radius and lift,
     - the reader's display / mono font stacks.

   It also mirrors the light/dark switch onto every `data-*-dark` flag a
   bundled plugin uses, so a light theme can never leave a page on its private
   dark fallback (and the other way round).

   The host repeats the same payload through postMessage whenever the theme,
   the wallpaper or the page line changes, so an open plugin repaints in place.
   plugin-theme.css then maps these values onto each plugin's own variables.
   ========================================================================== */

(() => {
  "use strict";

  const root = document.documentElement;

  // Everything a plugin page may need. The host adds the same list to the
  // neotodo-theme message; unknown or empty values are simply skipped.
  const THEME_VARS = [
    "--pc-paper", "--pc-paper2", "--pc-ink", "--pc-muted",
    "--pc-accent", "--pc-accent-2", "--pc-accent2",
    "--pc-accent-rgb", "--pc-accent2-rgb", "--pc-border",
    "--pc-line", "--pc-rule", "--pc-paper-rgb", "--pc-paper2-rgb",
    "--pc-glow", "--pc-stamp", "--pc-paper-soft",
    "--pc-mask-soft", "--pc-mask-mid", "--pc-mask-strong",
    "--page-line-paint", "--page-line-thickness", "--page-line-row",
    "--page-task-h", "--subcard-outline",
    "--overlay-paper", "--overlay-radius",
    "--card-lift-page", "--card-lift-card",
    "--paper", "--ink", "--muted", "--line",
    "--display", "--mono", "--script", "--note-font",
  ];

  // Bundled plugin pages all publish their dark mode under their own flag.
  // Mirror the notebook's switch onto every one of them so the plugin's own
  // identity colours (a tomato, a flame, a bead board) keep their dark variant
  // while the page paper follows the theme.
  const DARK_FLAGS = [
    "pdDark", "cdDark", "ffDark", "flDark", "lgDark",
    "sbDark", "ssDark", "mpDark", "ftDark", "hbDark",
  ];

  function hostRoot() {
    try {
      return window.parent !== window ? window.parent.document.documentElement : null;
    } catch (error) {
      return null;
    }
  }

  function applyTheme(dark, vars) {
    const isDark = Boolean(dark);
    root.dataset.ntTheme = isDark ? "dark" : "light";
    // The effect previews (firelight / fireflies / lightning) read the same
    // attribute as the notebook page.
    root.dataset.postcardDark = isDark ? "true" : "false";
    for (const flag of DARK_FLAGS) root.dataset[flag] = isDark ? "true" : "false";
    if (!vars || typeof vars !== "object") return;
    for (const [name, value] of Object.entries(vars)) {
      if (!name.startsWith("--") || typeof value !== "string") continue;
      const next = value.trim();
      if (!next) continue;
      root.style.setProperty(name, next);
    }
  }

  function readHostTheme() {
    const host = hostRoot();
    if (!host) return null;
    const styles = window.parent.getComputedStyle(host);
    const vars = {};
    for (const name of THEME_VARS) {
      const value = styles.getPropertyValue(name).trim();
      if (value) vars[name] = value;
    }
    return { dark: host.dataset.postcardDark === "true", vars };
  }

  // First paint: read the host directly, so a dark notebook never flashes a
  // bright plugin card through the iframe.
  const boot = readHostTheme();
  if (boot) applyTheme(boot.dark, boot.vars);

  // The host owns later changes (theme pack, wallpaper, page line, fonts).
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.type !== "neotodo-theme") return;
    applyTheme(Boolean(data.dark), data.vars);
  });
})();
