/* ==========================================================================
   POSTCARD PLUGIN PAGE
   --------------------------------------------------------------------------
   The archive lives in the notebook, not in this iframe. The host bridge
   `window.NeoTodoPostcards` hands over the week list and the postcard markup
   the notebook already prints, so this page never keeps a second copy of the
   archive and never delays the app's own startup.
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

  const q = (selector) => document.querySelector(selector);
  const qa = (selector) => Array.from(document.querySelectorAll(selector));
  const archive = q("#pc-archive");
  const navYears = q("#pc-nav-years");
  const summary = q("#pc-summary");
  const scroller = q("#pc-scroll");
  let expandedId = null;
  let scrollFrame = 0;

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));

  function hostBridge() {
    try {
      if (window.parent === window) return null;
      return window.parent.NeoTodoPostcards || null;
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

  function closePage() {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "neotodo-plugin-close" }, window.location.origin);
      return;
    }
    window.close();
  }

  function emptyMarkup() {
    return `<div class="pc-empty"><strong>The box is empty.</strong>Finish a week, and it will arrive here as a postcard.</div>`;
  }

  function weekMarkup(card) {
    return `<button class="week-line" type="button" data-pc-card="${esc(card.id)}" style="--sw-a:${esc(card.accent)};--row-accent-rgb:${esc(card.accentRgb)}">
      <span class="week-swatch"></span>
      <span class="week-w">${esc(card.weekLabel)}</span>
      <span class="week-dates">${esc(card.dates)}</span>
      <span class="week-theme">${esc(card.themeName)}${card.sample ? '<span class="sample-word">sample</span>' : ""}</span>
      <span class="week-count">${esc(card.count)} ✓</span>
      <span class="week-arrow">›</span>
      <span class="week-art" aria-hidden="true">${card.art || ""}</span>
    </button>
    <div class="archive-postcard" data-pc-expand="${esc(card.id)}" hidden></div>`;
  }

  function render() {
    const api = hostBridge();
    if (!api || typeof api.list !== "function") {
      archive.innerHTML = emptyMarkup();
      summary.textContent = "—";
      return;
    }
    let data = null;
    try {
      data = api.list();
    } catch (error) {
      data = null;
    }
    const cards = Array.isArray(data?.cards) ? data.cards : [];
    if (data?.themeName) {
      const themeName = q("#pc-theme-name");
      if (themeName) themeName.textContent = data.themeName;
    }
    summary.textContent = `${cards.length} postcard${cards.length === 1 ? "" : "s"} · ${data?.entries || 0} entries`;
    if (!cards.length) {
      archive.innerHTML = emptyMarkup();
      navYears.innerHTML = "";
      return;
    }

    const years = new Map();
    for (const card of cards) {
      const year = Number(card.year) || 0;
      if (!years.has(year)) years.set(year, new Map());
      const months = years.get(year);
      const month = Number(card.month) || 0;
      if (!months.has(month)) months.set(month, []);
      months.get(month).push(card);
    }
    const sortedYears = [...years.keys()].sort((a, b) => b - a);
    archive.innerHTML = sortedYears.map((year) => {
      const months = years.get(year);
      const monthKeys = [...months.keys()].sort((a, b) => b - a);
      const count = [...months.values()].reduce((sum, list) => sum + list.length, 0);
      return `<details class="year-group" open data-pc-year-group="${year}">
        <summary><span class="chev">▸</span><span>${year}</span><span class="count">${count}</span></summary>
        <div class="months">
          ${monthKeys.map((month) => `<details class="month-group" open>
            <summary><span class="chev">▸</span><span>${esc(months.get(month)[0]?.monthLabel || `${month}月`)}</span><span class="count">${months.get(month).length}</span></summary>
            <div class="week-list">${months.get(month).map(weekMarkup).join("")}</div>
          </details>`).join("")}
        </div>
      </details>`;
    }).join("");

    navYears.innerHTML = sortedYears.map((year) => {
      const count = [...years.get(year).values()].reduce((sum, list) => sum + list.length, 0);
      return `<button class="settings-nav-item" type="button" data-pc-nav="${year}">${year}<span class="pc-nav-count">${count}</span></button>`;
    }).join("");
  }

  function expandedHolder(id) {
    return qa("[data-pc-expand]").find((node) => node.dataset.pcExpand === id) || null;
  }

  function collapseExpanded() {
    if (!expandedId) return;
    const holder = expandedHolder(expandedId);
    if (holder) {
      holder.hidden = true;
      holder.innerHTML = "";
    }
    expandedId = null;
  }

  function toggleCard(id) {
    if (!id) return;
    if (expandedId === id) {
      collapseExpanded();
      renderArrows();
      return;
    }
    collapseExpanded();
    const api = hostBridge();
    let article = "";
    try {
      article = api && typeof api.article === "function" ? api.article(id) : "";
    } catch (error) {
      article = "";
    }
    const holder = expandedHolder(id);
    if (!holder || !article) return;
    holder.innerHTML = article;
    holder.hidden = false;
    expandedId = id;
    renderArrows();
    try { api.markSeen?.(id); } catch (error) {}
  }

  function renderArrows() {
    qa("[data-pc-card]").forEach((node) => {
      const arrow = node.querySelector(".week-arrow");
      if (arrow) arrow.textContent = node.dataset.pcCard === expandedId ? "⌄" : "›";
    });
  }

  function setActiveNav(value) {
    qa("[data-pc-nav]").forEach((node) => {
      node.classList.toggle("active", node.dataset.pcNav === value);
    });
  }

  function jumpTo(target) {
    const value = String(target || "all");
    setActiveNav(value);
    if (!scroller) return;
    if (value === "all") {
      scroller.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const group = qa("[data-pc-year-group]").find((node) => node.dataset.pcYearGroup === value);
    if (!group) return;
    const top = group.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 12;
    scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function trackSection() {
    scrollFrame = 0;
    if (!scroller) return;
    const top = scroller.getBoundingClientRect().top + 80;
    let current = "all";
    for (const group of qa("[data-pc-year-group]")) {
      if (group.getBoundingClientRect().top <= top) current = group.dataset.pcYearGroup;
    }
    setActiveNav(current);
  }

  archive.addEventListener("click", (event) => {
    const preview = event.target.closest(".archive-postcard");
    if (preview && !preview.hidden) {
      const api = hostBridge();
      try { api?.open?.(preview.dataset.pcExpand); } catch (error) {}
      return;
    }
    const row = event.target.closest("[data-pc-card]");
    if (row) toggleCard(row.dataset.pcCard);
  });

  navYears.addEventListener("click", (event) => {
    const node = event.target.closest("[data-pc-nav]");
    if (node) jumpTo(node.dataset.pcNav);
  });

  q('[data-pc-nav="all"]')?.addEventListener("click", () => jumpTo("all"));
  q("[data-close]")?.addEventListener("click", closePage);
  q(".settings-stage")?.addEventListener("mousedown", (event) => {
    if (event.target === event.currentTarget) closePage();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePage();
  });

  scroller?.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(trackSection);
  }, { passive: true });

  window.addEventListener("message", (event) => {
    if (event.data?.type !== "neotodo-theme") return;
    if (typeof event.data.dark === "boolean") {
      root.dataset.postcardDark = event.data.dark ? "true" : "false";
    }
    applyThemeVars(event.data.vars);
  });

  render();
})();
