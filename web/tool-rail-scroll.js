/* ==========================================================================
   LEFT TOOL SHELF: TYPEWRITER DRUM
   --------------------------------------------------------------------------
   The rail is a five-row window (tool-rail-scroll.css). This file turns that
   window into the platen of a typewriter: the row under the middle of the
   glass faces the user and is the largest, the rows above and below are
   progressively smaller, and their spacing squeezes together toward the ends
   exactly like a drum seen from the front.

   The drum is drawn with transforms only, from the row's real layout centre:

       offset  = rowCentre - (scrollTop + windowHeight / 2)
       u       = offset / (windowHeight / 2)          -1 .. 1 across the glass

       projected = CURVE * A * sin(u * TURN) + (1 - CURVE) * u * half
       scale     = MIN + (MAX - MIN) * cos-focus      tiny at the ends

   `sin` is flatter near its ends, so neighbouring rows sit closer together at
   the top and bottom. CURVE keeps only a hint of that bulge: the ends stay
   tucked in, while the middle does not open a wide, loose gap around the row
   facing the user. Because everything is a transform, the 43px layout slots
   never move, so the scroll height cannot jitter while the spring settles.

   Motion is a spring, not a constant-speed lerp: every wheel notch gives the
   drum a target, and the spring pulls the rows toward it with a real
   acceleration and a soft deceleration (slightly under critical, so it lands
   without wobbling). Fast flicks keep their momentum, and a new notch while
   it is still moving adds to the same spring.

   The last row the user stopped on is remembered in localStorage and restored
   on the next launch, so opening the rail shows the same part of the drum.

   The stored state is the row itself (its plugin/action key), not only a pixel
   offset: bundled and community plugins mount asynchronously and a disabled
   plugin can disappear between launches, so raw pixels would point at a
   different icon. Restoring by row keeps the plugin the reader left in the
   middle of the glass in the middle, and only a real move by the reader
   overwrites the stored row. A short-lived non-scrollable shelf during boot
   can never reset the saved position anymore.
   ========================================================================== */

(function () {
  "use strict";

  const RAIL_SELECTOR = "#tool-rail";
  const STORAGE_KEY = "neotodo:toolRailScroll";
  const WHEEL_LINE_PX = 18;    // Firefox reports wheel deltas in lines
  const SAVE_MS = 220;         // quiet time before the position is stored

  // ------------------------------------------------------------------ drum ---
  // How far the outermost row would turn around the platen, the size it gets
  // there, and the size of the row facing the user.
  const TURN = 1.25;           // radians at the window edge
  // How much of the platen bulge the positions keep. The size curve below is
  // unchanged; 1 is the full drum, 0 lays the rows at their plain layout
  // rhythm. 0.55 keeps a hint of curvature without the loose middle gaps.
  const CURVE = 0.55;
  const MIN_SCALE = 0.85;      // top / bottom rows
  const MAX_SCALE = 1.16;      // middle row
  // Only the row facing the user stays big: the two rows beside it fall away
  // faster than a plain cosine, so they read as the normal 43px circle instead
  // of a second and fourth "large" row. Tuned so the five rows land on
  // 0.85 / 1.00 / 1.16 / 1.00 / 0.85.
  const FOCUS_CURVE = 2.3;
  const REACH_MIN = 0.35;      // guards for a one- or two-row shelf
  const REACH_MAX = 0.96;

  // ---------------------------------------------------------------- spring ---
  // A notch used to move the drum about two rows and then take its time
  // settling. The rail now travels further per notch and the spring is stiffer,
  // so the same flick reaches the wanted icon instead of crawling to it.
  const WHEEL_SPEED = 1.6;     // multiplier on every wheel delta
  const STIFFNESS = 200;       // pull toward the wheel target
  const DAMPING = 26;          // just under critical: quick, no wobble
  const REST_DISTANCE = 0.4;   // px
  const REST_SPEED = 8;        // px per second
  const MAX_STEP = 0.008;      // seconds per integration substep

  const rail = document.querySelector(RAIL_SELECTOR);
  if (!rail) return;

  const reducedMotion = () =>
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const drum = { half: 0, reach: 0.83, rowHeight: 43, items: [] };
  let hoverNode = null;

  let savedScroll = readRemembered();
  let target = 0;       // where the wheel wants the drum to stop
  let position = 0;     // fractional scroll position while the spring runs
  let velocity = 0;     // px per second
  let frame = 0;
  let animating = false;
  let lastFrame = 0;
  let saveTimer = 0;
  let userMoved = false;

  // ------------------------------------------------------------- storage ---

  /**
   * The stored shape is `{ top, row }`. `row` is the stable key of the icon
   * that was facing the reader; `top` is its pixel fallback. Builds before
   * this one stored the bare offset, so a plain number is still understood.
   */
  function readRemembered() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return { top: 0, row: "" };
      // Legacy value: "216".
      if (/^\s*-?\d+(\.\d+)?\s*$/.test(raw)) {
        return { top: Math.max(0, Number(raw) || 0), row: "" };
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return { top: 0, row: "" };
      return {
        top: Math.max(0, Number(parsed.top) || 0),
        row: typeof parsed.row === "string" ? parsed.row : "",
      };
    } catch (error) {
      return { top: 0, row: "" };
    }
  }

  function writeRemembered(record) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        top: Math.round(record.top),
        row: record.row || "",
        at: Date.now(),
      }));
    } catch (error) {
      // Private windows and older shells can refuse storage; scrolling still works.
    }
  }

  function scheduleSave() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveNow, SAVE_MS);
  }

  function saveNow() {
    window.clearTimeout(saveTimer);
    saveTimer = 0;
    // Restoring the remembered row also sets scrollTop, and a shelf that
    // momentarily cannot scroll (plugins still mounting, or a very short
    // list) reports 0. Neither is a position the reader picked, so only a
    // real move may replace the stored row.
    if (!userMoved) return;
    if (maxScroll() <= 0) return;
    savedScroll = {
      top: clamp(rail.scrollTop, 0, maxScroll()),
      row: centredRowKey(),
    };
    writeRemembered(savedScroll);
  }

  function maxScroll() {
    return Math.max(0, rail.scrollHeight - rail.clientHeight);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  // ------------------------------------------------------------- row key ---

  /** A stable name for a row that survives re-renders and plugin changes. */
  function rowKey(node) {
    if (!node) return "";
    const plugin = node.dataset ? node.dataset.plugin : "";
    if (plugin) return `plugin:${plugin}`;
    const action = node.dataset ? node.dataset.action : "";
    if (action) return `action:${action}`;
    return `label:${node.getAttribute("aria-label") || ""}`;
  }

  /** The row facing the middle of the glass for a given scroll offset. */
  function nearestRowKey(top) {
    const centre = top + drum.half;
    let best = "";
    let bestDistance = Infinity;
    for (let i = 0; i < drum.items.length; i += 1) {
      const item = drum.items[i];
      const distance = Math.abs(item.center - centre);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = rowKey(item.node);
      }
    }
    return best;
  }

  /** The row facing the middle of the glass, i.e. the reader's current spot. */
  function centredRowKey() {
    return nearestRowKey(rail.scrollTop);
  }

  // ---------------------------------------------------------------- drum ---

  /** Put the whole shelf back in place: one transform per visible row. */
  function paint() {
    const items = drum.items;
    const half = drum.half;
    if (!items.length || half <= 0) return;

    const top = animating ? position : rail.scrollTop;
    const centre = top + half;
    const reach = drum.reach;
    const edge = half - drum.rowHeight / 2;   // distance to the outermost row
    const sineReach = Math.sin(reach * TURN);
    const amplitude = sineReach > 0.001 ? edge / sineReach : edge;
    const cosReach = Math.cos(reach * TURN);
    const denominator = 1 - cosReach;
    // Past the outermost row the shelf keeps moving outward at the same
    // speed, so rows just outside the glass never fold back inside it.
    const slope = CURVE * amplitude * TURN * cosReach + (1 - CURVE) * half;

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const offset = item.center - centre;
      const u = offset / half;
      const away = Math.abs(u);
      const sign = u < 0 ? -1 : 1;
      // A blend of the drum's sine curve and the plain row rhythm: the ends
      // stay pulled in, but the middle no longer opens a wide gap around the
      // row facing the user.
      const projected = away <= reach
        ? CURVE * amplitude * Math.sin(away * TURN) + (1 - CURVE) * away * half
        : edge + (away - reach) * slope;
      const shift = sign * projected - offset;

      const focusA = Math.min(away, reach);
      const focus = denominator > 0.0001
        ? (Math.cos(focusA * TURN) - cosReach) / denominator
        : 1;
      // The curve is shaped so the middle row keeps its full size while the
      // rows next to it drop to roughly the plain circle size.
      const falloff = Math.pow(clamp(focus, 0, 1), FOCUS_CURVE);
      const size = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * falloff;

      // The old shelf nudged the hovered row two pixels to the right; the drum
      // owns the transform now, so it carries that nudge itself.
      const nudge = item.node === hoverNode ? 2 : 0;
      item.node.style.transform =
        `translate3d(${nudge}px, ${shift.toFixed(2)}px, 0) scale(${size.toFixed(3)})`;
    }
  }

  /** Measure rows, window height and the drum's reach; then draw it. */
  function measure() {
    const max = maxScroll();
    const scrollable = max > 1;
    // Always write the flag so the first paint can never keep a stale value.
    rail.dataset.railScroll = scrollable ? "true" : "false";

    drum.half = rail.clientHeight / 2;

    const items = [];
    let rowHeight = 0;
    const nodes = rail.querySelectorAll(".tool-button");
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const height = node.offsetHeight;      // 0 while a plugin is switched off
      if (!height) continue;
      items.push({ node, center: node.offsetTop + height / 2 });
      rowHeight = height;
    }
    drum.items = items;
    if (rowHeight) drum.rowHeight = rowHeight;
    drum.reach = clamp(
      drum.half > 0 ? 1 - (drum.rowHeight / 2) / drum.half : 0.83,
      REACH_MIN,
      REACH_MAX
    );

    if (!scrollable) {
      position = 0;
      target = 0;
      velocity = 0;
      animating = false;
      if (rail.scrollTop !== 0) rail.scrollTop = 0;
    } else {
      if (animating) {
        position = clamp(position, 0, max);
        target = clamp(target, 0, max);
      } else {
        position = clamp(rail.scrollTop, 0, max);
        target = position;
        velocity = 0;
      }
      if (!userMoved) applyRemembered(max);
    }

    paint();
    return max;
  }

  /** Put the shelf back on the row it was left on, clamped to real content. */
  function applyRemembered(max = maxScroll()) {
    if (max <= 0) return;
    // Prefer the remembered row: plugin lists gain or lose rows between
    // launches, and the pixel offset that fitted last time may now point at a
    // neighbour. When the offset still lands on the same row, keep its exact
    // sub-row position; otherwise re-centre the row. A row that has gone away
    // falls back to the stored offset.
    let top = clamp(savedScroll.top, 0, max);
    if (savedScroll.row && nearestRowKey(top) !== savedScroll.row) {
      for (let i = 0; i < drum.items.length; i += 1) {
        const item = drum.items[i];
        if (rowKey(item.node) === savedScroll.row) {
          top = clamp(item.center - drum.half, 0, max);
          break;
        }
      }
    }
    position = top;
    target = top;
    velocity = 0;
    rail.scrollTop = top;
    paint();
  }

  // -------------------------------------------------------------- scrolling ---

  function wheelDelta(event) {
    let delta = event.deltaY;
    if (!delta) return 0;
    if (event.deltaMode === 1) delta *= WHEEL_LINE_PX;
    else if (event.deltaMode === 2) delta *= Math.max(1, rail.clientHeight) * 0.9;
    delta *= WHEEL_SPEED;
    // A mouse notch is a big number; keep it from launching the drum past
    // several rows so the curvature can still be read while it travels.
    return clamp(delta, -rail.clientHeight * 1.5, rail.clientHeight * 1.5);
  }

  function startAnimation() {
    if (animating) return;
    animating = true;
    // Start the clock at the wheel event, not at the first frame: the first
    // step then gets a full 16ms of travel instead of a 1ms sliver.
    lastFrame = typeof window.performance?.now === "function"
      ? window.performance.now()
      : 0;
    frame = window.requestAnimationFrame(tick);
  }

  /** Advance the spring by `dt` seconds, sub-stepped so a slow frame cannot
      explode the integration (stiff springs hate big steps). */
  function advance(dt) {
    const max = maxScroll();
    target = clamp(target, 0, max);

    let remaining = dt;
    while (remaining > 0) {
      const step = Math.min(MAX_STEP, remaining);
      remaining -= step;
      const pull = -STIFFNESS * (position - target);
      const drag = -DAMPING * velocity;
      velocity += (pull + drag) * step;
      position += velocity * step;
    }

    // Hitting an end stops the drum instead of letting the spring press
    // against it and bounce back.
    if (position < 0) {
      position = 0;
      velocity = 0;
    } else if (position > max) {
      position = max;
      velocity = 0;
    }
  }

  function tick(now) {
    const previous = lastFrame || now;
    const dt = clamp((now - previous) / 1000, 0.001, 0.032);
    lastFrame = now;

    advance(dt);
    rail.scrollTop = position;
    paint();

    if (
      Math.abs(target - position) < REST_DISTANCE &&
      Math.abs(velocity) < REST_SPEED
    ) {
      position = target;
      velocity = 0;
      rail.scrollTop = position;
      paint();
      animating = false;
      frame = 0;
      scheduleSave();
      return;
    }

    frame = window.requestAnimationFrame(tick);
  }

  rail.addEventListener("wheel", (event) => {
    // Ctrl+wheel is page zoom, not scrolling; leave it to the shell.
    if (event.ctrlKey) return;
    const max = maxScroll();
    if (max <= 0) return;
    const delta = wheelDelta(event);
    if (!delta) return;
    event.preventDefault();
    userMoved = true;

    if (!animating) {
      // A native touch scroll may have moved the rail under our target.
      position = clamp(rail.scrollTop, 0, max);
      target = position;
      velocity = 0;
    }
    target = clamp(target + delta, 0, max);

    if (reducedMotion()) {
      position = target;
      velocity = 0;
      rail.scrollTop = position;
      paint();
      scheduleSave();
      return;
    }
    startAnimation();
  }, { passive: false });

  // Native touch scrolling (and a keyboard-focused row) move the rail without
  // passing through the wheel handler; follow along and remember the result.
  // A programmatic restore also fires `scroll`, so nothing is written until
  // the reader has actually moved the shelf. When the shelf cannot scroll at
  // all its scrollTop is a forced 0, which is not a row the reader picked, so
  // it must not replace the stored one.
  rail.addEventListener("scroll", () => {
    if (!animating) {
      position = rail.scrollTop;
      target = position;
      paint();
    }
    if (userMoved && maxScroll() > 0) scheduleSave();
  }, { passive: true });

  // Once the reader has touched the shelf, a late layout pass must not yank
  // the rows back to the remembered position.
  const markMoved = () => { userMoved = true; };
  rail.addEventListener("pointerdown", markMoved, { passive: true });
  rail.addEventListener("touchstart", markMoved, { passive: true });
  // Keyboard scrolling is a real move too (a focused row responds to arrows,
  // PageUp/PageDown and Home/End without ever passing through pointerdown).
  rail.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
      markMoved();
    }
  });

  // The drum's transform includes the old two-pixel hover nudge.
  const setHover = (node) => {
    if (node === hoverNode) return;
    hoverNode = node;
    paint();
  };
  rail.addEventListener("pointerover", (event) => {
    const target = event.target;
    const node = target && target.closest ? target.closest(".tool-button") : null;
    setHover(node && rail.contains(node) ? node : null);
  }, { passive: true });
  rail.addEventListener("pointerleave", () => setHover(null), { passive: true });

  window.addEventListener("pagehide", saveNow);
  window.addEventListener("beforeunload", saveNow);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveNow();
  });

  // ---------------------------------------------------------------- layout ---

  let measureFrame = 0;
  function scheduleMeasure() {
    if (measureFrame) return;
    measureFrame = window.requestAnimationFrame(() => {
      measureFrame = 0;
      measure();
    });
  }

  measure();

  // Plugin buttons arrive after the first paint (bundled plugins mount
  // themselves, community plugins come back from /api/plugins). Re-measure so
  // the drum, the fade and the remembered row follow the real rows.
  // `style` is deliberately not observed: paint() writes each row's transform,
  // and listening to that would make the observer chase its own tail.
  if (window.MutationObserver) {
    new MutationObserver(scheduleMeasure).observe(rail, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "hidden"],
    });
    // The whole rail is hidden while the head bar is collapsed; when it comes
    // back its height is real again.
    new MutationObserver(scheduleMeasure).observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  window.addEventListener("resize", scheduleMeasure);
  window.addEventListener("load", scheduleMeasure);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleMeasure).catch(() => {});
  }

  // Images inside the buttons are fixed-size glyphs, but a slow icon must not
  // leave the first measure stale.
  rail.addEventListener("load", scheduleMeasure, true);
})();
