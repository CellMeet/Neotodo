/* ==========================================================================
   PINDou · 拼豆工坊
   A self-contained perler-bead studio. It can run inside the NeoTodo plugin
   host iframe or as a normal page, and stores its work in localStorage.
   ========================================================================== */

(() => {
  "use strict";

  const SIZE = 20;
  const SAVE_KEY = "neotodo.pindou.v1";
  const MAX_HISTORY = 90;

  const PALETTE = [
    { id: "pink", name: "樱花粉", hex: "#ff9ec4" },
    { id: "blush", name: "蜜桃粉", hex: "#ffc2d9" },
    { id: "rose", name: "玫瑰粉", hex: "#ef6d9d" },
    { id: "berry", name: "莓果红", hex: "#c94f7c" },
    { id: "coral", name: "珊瑚红", hex: "#ef5350" },
    { id: "orange", name: "蜜橘橙", hex: "#ff9d4d" },
    { id: "yellow", name: "奶油黄", hex: "#ffd45e" },
    { id: "mint", name: "薄荷绿", hex: "#71d6b3" },
    { id: "green", name: "青草绿", hex: "#7bc96f" },
    { id: "forest", name: "森林绿", hex: "#3f9e63" },
    { id: "teal", name: "湖水蓝", hex: "#4fc3d9" },
    { id: "sky", name: "天空蓝", hex: "#7fc8f0" },
    { id: "blue", name: "钴蓝", hex: "#5aa9e6" },
    { id: "violet", name: "葡萄紫", hex: "#a07be0" },
    { id: "purple", name: "紫罗兰", hex: "#7a4fc0" },
    { id: "brown", name: "可可棕", hex: "#a9744f" },
    { id: "cream", name: "奶油米", hex: "#f0d9b5" },
    { id: "white", name: "云朵白", hex: "#fbf7ee" },
    { id: "ink", name: "墨黑", hex: "#3b3330" },
    { id: "gray", name: "雾灰", hex: "#9b9b9b" }
  ];

  function mixHex(hex, target, ratio) {
    const parse = (value) => {
      const text = String(value || "").replace("#", "");
      const full = text.length === 3 ? text.split("").map((part) => part + part).join("") : text;
      const number = Number.parseInt(full, 16);
      if (!Number.isFinite(number)) return { r: 0, g: 0, b: 0 };
      return { r: (number >> 16) & 255, g: (number >> 8) & 255, b: number & 255 };
    };
    const from = parse(hex);
    const to = parse(target);
    const channel = (a, b) => Math.round(a + (b - a) * ratio).toString(16).padStart(2, "0");
    return `#${channel(from.r, to.r)}${channel(from.g, to.g)}${channel(from.b, to.b)}`;
  }

  const COLORS = {};
  for (const color of PALETTE) {
    COLORS[color.id] = {
      ...color,
      light: mixHex(color.hex, "#ffffff", 0.40),
      dark: mixHex(color.hex, "#2b1620", 0.28)
    };
  }

  const TEMPLATE_DEFS = [
    {
      id: "flower",
      name: "小花",
      note: "一朵粉色的五瓣花",
      legend: { p: "pink", y: "yellow" },
      rows: [
        "................",
        "......ppp.......",
        ".....ppppp......",
        ".....ppppp......",
        "..pp.ppppp.pp...",
        ".ppppppppppppp..",
        "pppppp.p.pppppp.",
        "ppppppyyypppppp.",
        ".pppp.yyy.pppp..",
        "..ppp.yyy.ppp...",
        "...pppp.pppp....",
        "..ppppp.ppppp...",
        "..ppppppppppp...",
        "..ppppp.ppppp...",
        "...ppp...ppp....",
        "................"
      ]
    },
    {
      id: "heart",
      name: "爱心",
      note: "一颗暖暖的粉色爱心",
      legend: { r: "rose", h: "blush" },
      rows: [
        "................",
        "...hhh....rrr...",
        "..hhhhh..rrrrr..",
        ".hhhrrrrrrrrrrr.",
        ".hrrrrrrrrrrrrr.",
        ".rrrrrrrrrrrrrr.",
        "..rrrrrrrrrrrr..",
        "...rrrrrrrrrr...",
        "....rrrrrrrr....",
        ".....rrrrrr.....",
        "......rrrr......",
        ".......rr.......",
        "................",
        "................",
        "................",
        "................"
      ]
    },
    {
      id: "star",
      name: "星星",
      note: "一颗亮晶晶的小星星",
      legend: { y: "yellow", o: "orange" },
      rows: [
        ".......yy.......",
        ".......yy.......",
        "......yyyy......",
        "......yyyy......",
        ".....yyyyyy.....",
        "yyyyyyyyyyyyyyyy",
        ".yyyyyyyyyyyyyy.",
        "..yyyyyyyyyyyy..",
        "...yyyyyyyyyy...",
        "....yyyyyyyy....",
        "...yyyyyyyyyy...",
        "...yyyy..yyyy...",
        "..yyyy....yyyy..",
        "..yyy......yyy..",
        "................",
        "................"
      ]
    },
    {
      id: "mushroom",
      name: "蘑菇",
      note: "森林里的小蘑菇",
      legend: { r: "coral", w: "cream", b: "brown" },
      rows: [
        ".....rrrrrr.....",
        "...rrrrrrrrrr...",
        "..rrrwwrrwwrrr..",
        ".rrrwwwwwwwwrrr.",
        ".rrwwwwwwwwwwrr.",
        ".rrrwwrrrrwwrrr.",
        "..rrrrrrrrrrrr..",
        "....wwwwwwww....",
        "....wwwwwwww....",
        "....wwwwwwww....",
        "....wwwwwwww....",
        ".....wwwwww.....",
        "................",
        "................",
        "................",
        "................"
      ]
    },
    {
      id: "cat",
      name: "小猫",
      note: "一只粉粉的豆豆小猫",
      legend: { p: "pink", w: "white", n: "ink" },
      rows: [
        "..pp........pp..",
        ".pppp......pppp.",
        ".ppppp....ppppp.",
        ".pppppppppppppp.",
        ".pppppppppppppp.",
        ".pppppppppppppp.",
        ".ppwwppppppwwpp.",
        ".ppwwppppppwwpp.",
        ".pppppppppppppp.",
        ".ppppp.nn.ppppp.",
        ".ppppp.nn.ppppp.",
        "..pppppppppppp..",
        "...pppppppppp...",
        "....pppppppp....",
        "................",
        "................"
      ]
    },
    {
      id: "free",
      name: "自由",
      note: "空白拼板，想拼什么都可以",
      legend: {},
      rows: null
    }
  ];

  function compileTemplate(def) {
    const cells = new Array(SIZE * SIZE).fill(null);
    if (Array.isArray(def.rows) && def.rows.length) {
      const offsetX = Math.floor((SIZE - def.rows[0].length) / 2);
      const offsetY = Math.floor((SIZE - def.rows.length) / 2);
      def.rows.forEach((row, y) => {
        for (let x = 0; x < row.length; x += 1) {
          const id = def.legend[row[x]];
          if (!id || !COLORS[id]) continue;
          const index = (y + offsetY) * SIZE + (x + offsetX);
          if (index >= 0 && index < cells.length) cells[index] = id;
        }
      });
    }
    return {
      ...def,
      cells,
      count: cells.reduce((total, value) => total + (value ? 1 : 0), 0)
    };
  }

  const TEMPLATES = TEMPLATE_DEFS.map(compileTemplate);
  const TEMPLATE_BY_ID = Object.fromEntries(TEMPLATES.map((template) => [template.id, template]));
  const DEFAULT_TEMPLATE = "flower";

  function createDefaultState() {
    return {
      beads: new Array(SIZE * SIZE).fill(null),
      color: "pink",
      tool: "brush",
      template: DEFAULT_TEMPLATE,
      guide: true,
      sound: true
    };
  }

  function loadSavedState() {
    const fallback = createDefaultState();
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return fallback;
      const data = JSON.parse(raw);
      if (!data || typeof data !== "object") return fallback;
      const beads = Array.isArray(data.beads) && data.beads.length === SIZE * SIZE
        ? data.beads.map((value) => (value && COLORS[value] ? value : null))
        : fallback.beads;
      return {
        beads,
        color: COLORS[data.color] ? data.color : fallback.color,
        tool: ["brush", "eraser", "picker"].includes(data.tool) ? data.tool : fallback.tool,
        template: TEMPLATE_BY_ID[data.template] ? data.template : fallback.template,
        guide: typeof data.guide === "boolean" ? data.guide : true,
        sound: typeof data.sound === "boolean" ? data.sound : true
      };
    } catch (error) {
      return fallback;
    }
  }

  const state = loadSavedState();

  let currentTemplate = TEMPLATE_BY_ID[state.template] || TEMPLATE_BY_ID[DEFAULT_TEMPLATE];
  let cells = [];
  let history = [];
  let future = [];
  let painting = false;
  let lastPaintedIndex = -1;
  let strokeBefore = null;
  let strokeChanged = false;
  let hoverCell = null;
  let allowCelebrate = false;
  let celebrated = false;
  let toastTimer = 0;
  let saveTimer = 0;
  let fitFrame = 0;
  let audioContext = null;
  let lastPopAt = 0;

  let board = null;
  let palette = null;
  let templates = null;
  let tools = null;
  let progressWrap = null;
  let progressText = null;
  let progressFill = null;
  let currentDot = null;
  let currentName = null;
  let guideToggle = null;
  let stageHint = null;
  let toastNode = null;
  let winNode = null;
  let winText = null;
  let confettiNode = null;
  let undoButton = null;
  let redoButton = null;
  let soundButton = null;

  const $ = (selector) => document.querySelector(selector);

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function snapshot() {
    return { beads: state.beads.slice(), template: state.template };
  }

  function sameBeads(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function commitSnapshot(before) {
    if (!before) return false;
    if (before.template === state.template && sameBeads(before.beads, state.beads)) return false;
    history.push(before);
    if (history.length > MAX_HISTORY) history.shift();
    future = [];
    updateHistoryButtons();
    return true;
  }

  function applySnapshot(saved) {
    if (!saved) return;
    state.beads = saved.beads.slice();
    if (TEMPLATE_BY_ID[saved.template]) {
      state.template = saved.template;
      currentTemplate = TEMPLATE_BY_ID[saved.template];
      updateTemplateChips();
    }
    allowCelebrate = false;
    celebrated = false;
    renderAllCells();
    updateProgress();
    scheduleSave();
    updateHistoryButtons();
  }

  function updateHistoryButtons() {
    if (undoButton) undoButton.disabled = history.length === 0;
    if (redoButton) redoButton.disabled = future.length === 0;
  }

  function updateTemplateChips() {
    templates?.querySelectorAll("[data-template]").forEach((chip) => {
      const active = chip.dataset.template === state.template;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function templateThumb(template) {
    if (!template.rows) return '<span class="pd-thumb-free" aria-hidden="true">✦</span>';
    const startX = Math.floor((SIZE - template.rows[0].length) / 2);
    const startY = Math.floor((SIZE - template.rows.length) / 2);
    const mini = [];
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        const index = (startY + y * 2) * SIZE + (startX + x * 2);
        const id = template.cells[index];
        if (id) {
          mini.push(`<i class="on" style="--c:${COLORS[id].hex}"></i>`);
        } else {
          mini.push("<i></i>");
        }
      }
    }
    return `<span class="pd-thumb" aria-hidden="true">${mini.join("")}</span>`;
  }

  function buildTemplates() {
    if (!templates) return;
    templates.innerHTML = TEMPLATES.map((template) => `
      <button class="pd-chip ${template.id === state.template ? "is-active" : ""}" type="button"
        role="tab" data-template="${template.id}" aria-selected="${template.id === state.template ? "true" : "false"}"
        title="${escapeHtml(template.note)}">
        ${templateThumb(template)}
        <span>${escapeHtml(template.name)}</span>
      </button>`).join("");
  }

  function buildPalette() {
    if (!palette) return;
    palette.innerHTML = PALETTE.map((color) => {
      const tone = COLORS[color.id];
      return `<button class="pd-swatch ${color.id === state.color ? "is-active" : ""}" type="button"
        role="option" data-color="${color.id}" aria-selected="${color.id === state.color ? "true" : "false"}"
        aria-label="${escapeHtml(color.name)}" title="${escapeHtml(color.name)}"
        style="--c:${tone.hex};--c-light:${tone.light};--c-dark:${tone.dark}"></button>`;
    }).join("");
  }

  function buildBoard() {
    if (!board) return;
    const fragment = document.createDocumentFragment();
    cells = [];
    for (let index = 0; index < SIZE * SIZE; index += 1) {
      const cell = document.createElement("div");
      cell.className = "pd-cell";
      cell.dataset.index = String(index);
      cell.setAttribute("role", "gridcell");
      cell.innerHTML = '<span class="pd-peg"></span><span class="pd-guide"></span><span class="pd-ghost"></span><span class="pd-bead"></span>';
      fragment.appendChild(cell);
      cells.push(cell);
    }
    board.innerHTML = "";
    board.appendChild(fragment);
  }

  function updateCell(index, pop = false) {
    const cell = cells[index];
    if (!cell) return;
    const colorId = state.beads[index];
    const tone = colorId ? COLORS[colorId] : null;
    cell.classList.toggle("is-filled", Boolean(tone));
    if (tone) {
      cell.style.setProperty("--bead", tone.hex);
      cell.style.setProperty("--bead-light", tone.light);
      cell.style.setProperty("--bead-dark", tone.dark);
    }
    const guideId = currentTemplate.cells[index];
    cell.classList.toggle("has-guide", Boolean(guideId));
    cell.classList.toggle("is-wrong", Boolean(tone && guideId && colorId !== guideId));
    if (guideId && COLORS[guideId]) {
      cell.style.setProperty("--guide", COLORS[guideId].hex);
    } else {
      cell.style.removeProperty("--guide");
    }
    if (pop) {
      cell.classList.remove("pop");
      void cell.offsetWidth;
      cell.classList.add("pop");
    }
  }

  function renderAllCells() {
    cells.forEach((cell, index) => updateCell(index, false));
    clearHover();
  }

  function updateCurrentColor() {
    const tone = COLORS[state.color] || COLORS.pink;
    if (currentDot) {
      currentDot.style.setProperty("--dot", tone.hex);
      currentDot.style.setProperty("--dot-light", tone.light);
      currentDot.style.setProperty("--dot-dark", tone.dark);
    }
    if (currentName) currentName.textContent = tone.name;
    if (board) {
      board.style.setProperty("--ghost", tone.hex);
      board.style.setProperty("--ghost-light", tone.light);
      board.style.setProperty("--ghost-dark", tone.dark);
    }
    palette?.querySelectorAll("[data-color]").forEach((swatch) => {
      const active = swatch.dataset.color === state.color;
      swatch.classList.toggle("is-active", active);
      swatch.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function updateToolButtons() {
    tools?.querySelectorAll("[data-tool]").forEach((button) => {
      const active = button.dataset.tool === state.tool;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (board) board.dataset.tool = state.tool;
    if (stageHint) {
      stageHint.textContent = state.tool === "brush"
        ? "按住拖动，连续放豆"
        : state.tool === "eraser"
          ? "按住拖动，擦掉豆豆"
          : "点一颗豆豆，把颜色吸过来";
    }
  }

  function updateSoundButton() {
    if (!soundButton) return;
    soundButton.dataset.sound = state.sound ? "on" : "off";
    soundButton.setAttribute("aria-pressed", state.sound ? "true" : "false");
    soundButton.setAttribute("aria-label", state.sound ? "关闭声音" : "打开声音");
    soundButton.title = state.sound ? "声音：开" : "声音：关";
  }

  function notifyParentSettings() {
    if (!window.parent || window.parent === window) return;
    try {
      window.parent.postMessage({
        type: "neotodo-plugin-settings-changed",
        plugin: "pindou",
        settings: { sound: state.sound }
      }, "*");
    } catch (error) {}
  }

  function isTemplateComplete() {
    if (!currentTemplate.count) return false;
    for (let i = 0; i < state.beads.length; i += 1) {
      const targetId = currentTemplate.cells[i];
      if (targetId && state.beads[i] !== targetId) return false;
    }
    return true;
  }

  function updateProgress() {
    if (!progressText || !progressFill || !progressWrap) return;
    if (!currentTemplate.count) {
      const placed = state.beads.reduce((total, value) => total + (value ? 1 : 0), 0);
      progressText.textContent = placed ? `已放 ${placed} 颗` : "自由创作";
      progressFill.style.width = "0%";
      progressWrap.classList.add("is-free");
      progressWrap.classList.remove("is-done");
      return;
    }
    let good = 0;
    for (let i = 0; i < state.beads.length; i += 1) {
      const targetId = currentTemplate.cells[i];
      if (targetId && state.beads[i] === targetId) good += 1;
    }
    const done = good === currentTemplate.count;
    const percent = Math.round((good / currentTemplate.count) * 100);
    progressWrap.classList.remove("is-free");
    progressWrap.classList.toggle("is-done", done);
    progressText.textContent = done ? "完成啦 ✓" : `${good} / ${currentTemplate.count}`;
    progressFill.style.width = `${percent}%`;
    if (!done) {
      celebrated = false;
    } else if (allowCelebrate && !celebrated) {
      celebrate();
    }
  }

  function toast(message) {
    if (!toastNode) return;
    toastNode.textContent = message;
    toastNode.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastNode.classList.remove("show"), 2000);
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify({
          beads: state.beads,
          color: state.color,
          tool: state.tool,
          template: state.template,
          guide: state.guide,
          sound: state.sound
        }));
      } catch (error) {}
    }, 120);
  }

  function ensureAudio() {
    if (!state.sound) return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioContext) {
      try { audioContext = new Ctx(); } catch (error) { return null; }
    }
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  }

  function playTone(frequency, duration, type = "triangle", volume = 0.10, delay = 0) {
    const context = ensureAudio();
    if (!context) return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(60, frequency * 0.72), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  function playPop(index, colorId) {
    if (!state.sound) return;
    const now = performance.now();
    if (now - lastPopAt < 26) return;
    lastPopAt = now;
    const colorIndex = Math.max(0, PALETTE.findIndex((color) => color.id === colorId));
    const row = Math.floor(index / SIZE);
    const base = 330 + colorIndex * 9 + (row % 5) * 7;
    playTone(base, 0.10, "triangle", 0.075);
  }

  function playPick() {
    playTone(780, 0.07, "sine", 0.07);
    playTone(1040, 0.09, "sine", 0.045, 0.04);
  }

  function playUndo() {
    playTone(240, 0.10, "sine", 0.055);
  }

  function playChime() {
    if (!state.sound) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((note, index) => {
      playTone(note, 0.42, "sine", 0.075, index * 0.11);
    });
  }

  function celebrate() {
    celebrated = true;
    if (winText) {
      winText.textContent = `你拼好了「${currentTemplate.name}」，每一颗豆豆都放对了。`;
    }
    if (winNode) winNode.hidden = false;
    burstConfetti();
    playChime();
  }

  function burstConfetti() {
    if (!confettiNode) return;
    const colors = PALETTE.map((color) => color.hex);
    const pieces = [];
    for (let i = 0; i < 38; i += 1) {
      const x = 4 + Math.random() * 92;
      const dx = (Math.random() - 0.5) * 120;
      const duration = 1.15 + Math.random() * 0.9;
      const delay = Math.random() * 0.28;
      const rotation = 160 + Math.random() * 420;
      const color = colors[i % colors.length];
      pieces.push(`<i style="--x:${x.toFixed(1)}%;--dx:${dx.toFixed(1)}px;--dur:${duration.toFixed(2)}s;--delay:${delay.toFixed(2)}s;--rot:${rotation.toFixed(0)}deg;--c:${color}"></i>`);
    }
    confettiNode.innerHTML = pieces.join("");
    setTimeout(() => { if (confettiNode) confettiNode.innerHTML = ""; }, 2500);
  }

  function closeWin() {
    if (winNode) winNode.hidden = true;
  }

  function setColor(id) {
    if (!COLORS[id]) return;
    state.color = id;
    updateCurrentColor();
    scheduleSave();
  }

  function setTool(tool) {
    if (!["brush", "eraser", "picker"].includes(tool)) return;
    state.tool = tool;
    updateToolButtons();
    scheduleSave();
  }

  function chooseTemplate(id) {
    const next = TEMPLATE_BY_ID[id];
    if (!next || id === state.template) return;
    const before = snapshot();
    history.push(before);
    if (history.length > MAX_HISTORY) history.shift();
    future = [];
    state.template = id;
    currentTemplate = next;
    state.beads = new Array(SIZE * SIZE).fill(null);
    allowCelebrate = false;
    celebrated = false;
    updateTemplateChips();
    renderAllCells();
    updateProgress();
    updateHistoryButtons();
    scheduleSave();
    closeWin();
    toast(before.beads.some(Boolean)
      ? `换成「${next.name}」啦，刚才的作品可以撤销找回`
      : `开始拼「${next.name}」`);
    playPick();
  }

  function clearBoard() {
    if (!state.beads.some(Boolean)) {
      toast("拼板已经是空的了");
      return;
    }
    const before = snapshot();
    state.beads = new Array(SIZE * SIZE).fill(null);
    celebrated = false;
    commitSnapshot(before);
    renderAllCells();
    updateProgress();
    scheduleSave();
    closeWin();
    toast("清空啦，Ctrl+Z 可以找回");
    playUndo();
  }

  function undo() {
    if (!history.length) return;
    future.push(snapshot());
    applySnapshot(history.pop());
    playUndo();
  }

  function redo() {
    if (!future.length) return;
    history.push(snapshot());
    if (history.length > MAX_HISTORY) history.shift();
    applySnapshot(future.pop());
    playTone(420, 0.08, "sine", 0.055);
  }

  function finishStroke() {
    if (!painting) return;
    painting = false;
    if (strokeBefore && strokeChanged) {
      commitSnapshot(strokeBefore);
      scheduleSave();
    }
    strokeBefore = null;
    strokeChanged = false;
    lastPaintedIndex = -1;
  }

  function cellAtPoint(event) {
    const node = document.elementFromPoint(event.clientX, event.clientY);
    return node?.closest?.(".pd-cell") || null;
  }

  function applyAt(index) {
    const number = Number(index);
    if (!Number.isInteger(number) || number < 0 || number >= SIZE * SIZE) return;
    if (number === lastPaintedIndex) return;
    lastPaintedIndex = number;

    if (state.tool === "picker") {
      const id = state.beads[number];
      if (id && COLORS[id]) {
        setColor(id);
        setTool("brush");
        playPick();
        toast(`吸到了「${COLORS[id].name}」`);
      } else {
        toast("这里是空的，放一颗豆豆再吸色吧");
      }
      return;
    }

    const next = state.tool === "eraser" ? null : state.color;
    if (state.beads[number] === next) return;

    allowCelebrate = true;
    state.beads[number] = next;
    strokeChanged = true;
    updateCell(number, Boolean(next));
    updateProgress();
    scheduleSave();
    if (next) playPop(number, next);
    else playTone(190, 0.06, "sine", 0.045);
  }

  function clearHover() {
    if (hoverCell) {
      hoverCell.classList.remove("is-hover");
      hoverCell = null;
    }
  }

  function updateHover(cell) {
    if (hoverCell === cell) return;
    clearHover();
    if (!cell) return;
    const index = Number(cell.dataset.index);
    if (state.tool !== "brush") return;
    if (state.beads[index]) return;
    hoverCell = cell;
    cell.classList.add("is-hover");
  }

  function handlePointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const cell = cellAtPoint(event);
    if (!cell) return;
    event.preventDefault();
    ensureAudio();
    avoidNativeSelection();
    if (state.tool !== "picker") {
      painting = true;
      strokeBefore = snapshot();
      strokeChanged = false;
    } else {
      painting = false;
      strokeBefore = null;
      strokeChanged = false;
    }
    lastPaintedIndex = -1;
    try { board.setPointerCapture(event.pointerId); } catch (error) {}
    applyAt(cell.dataset.index);
    if (event.pointerType !== "mouse") clearHover();
  }

  function handlePointerMove(event) {
    if (painting) {
      event.preventDefault();
      const cell = cellAtPoint(event);
      if (cell) applyAt(cell.dataset.index);
      return;
    }
    if (event.pointerType === "mouse") updateHover(cellAtPoint(event));
  }

  function handlePointerEnd() {
    finishStroke();
  }

  function avoidNativeSelection() {
    try { window.getSelection()?.removeAllRanges(); } catch (error) {}
  }

  function fitBoard() {
    if (fitFrame) return;
    fitFrame = requestAnimationFrame(() => {
      fitFrame = 0;
      if (!board) return;
      const wrap = board.closest(".pd-board-wrap");
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const available = Math.min(rect.width, rect.height);
      const size = Math.max(96, Math.min(720, Math.floor(available - 26)));
      board.style.width = `${size}px`;
      board.style.height = `${size}px`;
    });
  }

  function roundRect(context, x, y, width, height, radius) {
    if (typeof context.roundRect === "function") {
      context.beginPath();
      context.roundRect(x, y, width, height, radius);
      return;
    }
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function exportImage() {
    if (!state.beads.some(Boolean)) {
      toast("先放几颗豆豆再保存吧");
      return;
    }
    const dark = document.documentElement.dataset.pdDark === "true";
    const cell = 28;
    const padding = 34;
    const boardSize = SIZE * cell;
    const width = boardSize + padding * 2;
    const height = width + 18;
    const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext("2d");
    if (!context) {
      toast("这张图片暂时保存不了");
      return;
    }
    context.scale(scale, scale);

    context.fillStyle = dark ? "#1b1419" : "#f7efe3";
    context.fillRect(0, 0, width, height);

    const boardX = padding - 12;
    const boardY = padding - 12;
    const boardW = boardSize + 24;
    const boardH = boardSize + 24;
    context.save();
    context.shadowColor = dark ? "rgba(0,0,0,.5)" : "rgba(73,45,22,.24)";
    context.shadowBlur = 18;
    context.shadowOffsetY = 8;
    context.fillStyle = dark ? "#33242d" : "#f0dfc7";
    roundRect(context, boardX, boardY, boardW, boardH, 20);
    context.fill();
    context.restore();

    context.strokeStyle = dark ? "rgba(255,220,235,.18)" : "rgba(115,80,45,.22)";
    context.lineWidth = 1.4;
    roundRect(context, boardX, boardY, boardW, boardH, 20);
    context.stroke();

    for (let index = 0; index < state.beads.length; index += 1) {
      const colorId = state.beads[index];
      if (!colorId) continue;
      const tone = COLORS[colorId];
      if (!tone) continue;
      const x = index % SIZE;
      const y = Math.floor(index / SIZE);
      const cx = padding + x * cell + cell / 2;
      const cy = padding + y * cell + cell / 2;
      const radius = cell * 0.42;

      context.save();
      context.shadowColor = "rgba(42,20,10,.24)";
      context.shadowBlur = 2.4;
      context.shadowOffsetY = 1.4;
      const gradient = context.createRadialGradient(
        cx - radius * 0.30, cy - radius * 0.32, radius * 0.05,
        cx, cy, radius
      );
      gradient.addColorStop(0, tone.light);
      gradient.addColorStop(0.56, tone.hex);
      gradient.addColorStop(1, tone.dark);
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.fill();
      context.restore();

      context.strokeStyle = dark ? "rgba(0,0,0,.24)" : "rgba(80,42,24,.20)";
      context.lineWidth = 1;
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.stroke();

      context.fillStyle = "rgba(255,255,255,.54)";
      context.beginPath();
      context.arc(cx - radius * 0.27, cy - radius * 0.29, radius * 0.29, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = dark ? "#241a20" : "#e6cfb1";
      context.strokeStyle = dark ? "rgba(255,220,235,.14)" : "rgba(80,42,24,.20)";
      context.lineWidth = 0.9;
      context.beginPath();
      context.arc(cx, cy, radius * 0.36, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    }

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = dark ? "rgba(246,232,238,.60)" : "rgba(90,60,38,.60)";
    context.font = '11px "Noto Sans", "Adwaita Sans", sans-serif';
    context.fillText("NeoTodo · 拼豆工坊", width / 2, height - 12);

    const finish = (blob) => {
      if (!blob) {
        toast("这张图片暂时保存不了");
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pindou-${state.template}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2200);
      toast("图片保存好啦");
    };

    if (typeof canvas.toBlob === "function") {
      canvas.toBlob(finish, "image/png");
    } else {
      try {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `pindou-${state.template}-${Date.now()}.png`;
        link.click();
        toast("图片保存好啦");
      } catch (error) {
        toast("这张图片暂时保存不了");
      }
    }
  }

  function closePlugin() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "neotodo-plugin-close", plugin: "pindou" }, "*");
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  }

  function applyTheme(dark) {
    document.documentElement.dataset.pdDark = dark ? "true" : "false";
  }

  function readParentTheme() {
    try {
      if (window.parent && window.parent !== window) {
        applyTheme(window.parent.document.documentElement.dataset.postcardDark === "true");
      }
    } catch (error) {}
  }

  function bindEvents() {
    document.querySelector("[data-close]")?.addEventListener("click", closePlugin);

    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        if (action === "undo") undo();
        else if (action === "redo") redo();
        else if (action === "sound") {
          state.sound = !state.sound;
          updateSoundButton();
          scheduleSave();
          notifyParentSettings();
          if (state.sound) {
            ensureAudio();
            playPick();
            toast("声音打开啦");
          } else {
            toast("声音关掉了");
          }
        } else if (action === "export") {
          exportImage();
        } else if (action === "clear") {
          clearBoard();
        }
      });
    });

    palette?.addEventListener("click", (event) => {
      const swatch = event.target.closest("[data-color]");
      if (!swatch) return;
      setColor(swatch.dataset.color);
      playPick();
    });

    templates?.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-template]");
      if (!chip) return;
      chooseTemplate(chip.dataset.template);
    });

    tools?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-tool]");
      if (!button) return;
      setTool(button.dataset.tool);
      playTone(520, 0.06, "sine", 0.045);
    });

    guideToggle?.addEventListener("change", () => {
      state.guide = guideToggle.checked;
      document.documentElement.dataset.guide = state.guide ? "true" : "false";
      scheduleSave();
      toast(state.guide ? "参考线打开了" : "参考线收起来了");
    });

    board?.addEventListener("pointerdown", handlePointerDown);
    board?.addEventListener("pointermove", handlePointerMove);
    board?.addEventListener("pointerup", handlePointerEnd);
    board?.addEventListener("pointercancel", handlePointerEnd);
    board?.addEventListener("pointerleave", () => {
      if (!painting) clearHover();
    });
    board?.addEventListener("contextmenu", (event) => event.preventDefault());

    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);
    window.addEventListener("blur", finishStroke);
    window.addEventListener("resize", fitBoard);
    window.addEventListener("orientationchange", () => setTimeout(fitBoard, 120));

    document.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (event.key === "Escape") {
        event.preventDefault();
        if (winNode && !winNode.hidden) {
          closeWin();
          return;
        }
        closePlugin();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && key === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && key === "y") {
        event.preventDefault();
        redo();
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (key === "b") setTool("brush");
      else if (key === "e") setTool("eraser");
      else if (key === "i") setTool("picker");
    });

    document.querySelectorAll("[data-win]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.win === "new") {
          closeWin();
          clearBoard();
        } else {
          closeWin();
        }
      });
    });

    winNode?.addEventListener("pointerdown", (event) => {
      if (event.target === winNode) closeWin();
    });

    window.addEventListener("message", (event) => {
      if (event.origin && event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data) return;
      if (data.type === "neotodo-theme") {
        applyTheme(Boolean(data.dark));
        return;
      }
      if (data.type === "neotodo-plugin-settings" && data.settings) {
        if (typeof data.settings.sound === "boolean" && data.settings.sound !== state.sound) {
          state.sound = data.settings.sound;
          updateSoundButton();
          scheduleSave();
        }
      }
    });

    if ("ResizeObserver" in window) {
      const wrap = board?.closest(".pd-board-wrap");
      if (wrap) new ResizeObserver(() => fitBoard()).observe(wrap);
    }
  }

  function init() {
    board = $("#board");
    palette = $("#palette");
    templates = $("#templates");
    tools = $("#tools");
    progressWrap = $("#progress-wrap");
    progressText = $("#progress-text");
    progressFill = $("#progress-fill");
    currentDot = $("#current-dot");
    currentName = $("#current-name");
    guideToggle = $("#guide-toggle");
    stageHint = $("#stage-hint");
    toastNode = $("#toast");
    winNode = $("#win");
    winText = $("#win-text");
    confettiNode = $("#confetti");
    undoButton = document.querySelector('[data-action="undo"]');
    redoButton = document.querySelector('[data-action="redo"]');
    soundButton = document.querySelector('[data-action="sound"]');

    if (guideToggle) guideToggle.checked = state.guide;
    document.documentElement.dataset.guide = state.guide ? "true" : "false";
    updateSoundButton();
    updateToolButtons();

    buildTemplates();
    buildPalette();
    buildBoard();
    updateCurrentColor();
    setTool(state.tool);
    renderAllCells();
    celebrated = isTemplateComplete();
    allowCelebrate = false;
    updateProgress();
    updateHistoryButtons();
    bindEvents();
    readParentTheme();

    requestAnimationFrame(() => {
      fitBoard();
      document.documentElement.classList.remove("pd-booting");
      setTimeout(fitBoard, 80);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
