/* ==========================================================================
   NEON TERMINAL · programmer electronic music player
   --------------------------------------------------------------------------
   A host-level plugin, not an iframe: the rail icon toggles a bottom player
   bar, the stage above it shows synced LRC lyrics, and the library drawer lists
   tracks from the user's music folder plus files imported into IndexedDB.

   The plugin registers itself in PLUGIN_REGISTRY, so Settings → Plugins can
   turn it on/off and open its small control page. Audio keeps playing while
   the rest of NeoTodo is used.
   ========================================================================== */

(() => {
  "use strict";

  if (window.__neotodoMusicPlayer) return;
  window.__neotodoMusicPlayer = true;

  const PLUGIN_ID = "music-player";
  const STORE_KEY = "neotodo.music.player.v1";
  const DB_NAME = "neotodo-music";
  const DB_STORE = "tracks";
  const ICON = "/plugins/music-player/play.svg";
  const COLORS = ["#ff4d9d", "#41e0d0", "#8f8cff", "#ffb45e", "#7cd4ff", "#b6ff6b"];

  const PLUGIN_DEFINITION = {
    id: PLUGIN_ID,
    title: "白噪音播放器",
    englishTitle: "Neon Terminal",
    version: "1.0.0",
    author: "NeoTodo",
    category: "Play",
    description: "程序员电子乐播放器。点击左侧唱片图标，下方出现播放器横条与同步歌词；支持左右切歌、点击列表选曲，以及自定义曲库文件夹。",
    icon: ICON,
    entry: "/plugins/music-player/index.html",
  };

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char]));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));

  function notify(message, error = false) {
    try {
      if (typeof toast === "function") toast(message, error);
    } catch (error) {}
  }

  function readSaved() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      return raw && typeof raw === "object" ? raw : {};
    } catch (error) {
      return {};
    }
  }

  const saved = readSaved();
  const state = {
    server: [],
    local: [],
    all: [],
    currentIndex: -1,
    currentId: typeof saved.lastTrackId === "string" ? saved.lastTrackId : "",
    loadedId: "",
    lyricsId: "",
    lines: [],
    lineEls: [],
    activeLine: -1,
    visible: false,
    stageOpen: saved.stageOpen !== false,
    libraryOpen: false,
    query: "",
    folder: "",
    libraryName: "",
    volume: saved.volume == null ? 0.72 : clamp(saved.volume, 0, 1),
    lastVolume: 0.72,
    seeking: false,
    importing: false,
    dbWarned: false,
    errorId: "",
  };

  // ------------------------------------------------------------------------
  // Small inline icon set
  // ------------------------------------------------------------------------
  const strokeIcon = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const fillIcon = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" stroke="none">${body}</svg>`;

  const I = {
    prev: fillIcon('<path d="M6 5h2v14H6z"/><path d="M20 5 9 12l11 7V5Z"/>'),
    next: fillIcon('<path d="M16 5h2v14h-2z"/><path d="M4 5l11 7L4 19V5Z"/>'),
    play: fillIcon('<path d="M8 5.2 19.2 12 8 18.8V5.2Z"/>'),
    pause: fillIcon('<path d="M7 5h4v14H7z"/><path d="M13 5h4v14h-4z"/>'),
    list: strokeIcon('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.6" cy="6" r="1.1" fill="currentColor" stroke="none"/><circle cx="4.6" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="4.6" cy="18" r="1.1" fill="currentColor" stroke="none"/>'),
    lyrics: strokeIcon('<path d="M4 6h16M4 11h10M4 16h13M4 21h7"/>'),
    close: strokeIcon('<path d="M6 6l12 12M18 6 6 18"/>'),
    chevron: strokeIcon('<path d="m6 9 6 6 6-6"/>'),
    refresh: strokeIcon('<path d="M20 11a8 8 0 1 0-2.3 6.7"/><path d="M20 5v6h-6"/>'),
    folder: strokeIcon('<path d="M3.5 7.5h6l1.8 2h9.2v8.8a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7V7.5Z"/><path d="M3.5 9.5V6.8A1.3 1.3 0 0 1 4.8 5.5h3.7l1.7 2"/>'),
    plus: strokeIcon('<path d="M12 5v14M5 12h14"/>'),
    volume: strokeIcon('<path d="M4 9.2h3.5L13 5v14l-5.5-4.2H4z"/><path d="M16.2 8.6a5 5 0 0 1 0 6.8"/><path d="M18.8 6a8.6 8.6 0 0 1 0 12"/>'),
    mute: strokeIcon('<path d="M4 9.2h3.5L13 5v14l-5.5-4.2H4z"/><path d="m17 9 4 6M21 9l-4 6"/>'),
  };

  // ------------------------------------------------------------------------
  // Plugin registration + rail button
  // ------------------------------------------------------------------------
  function registerPlugin() {
    try {
      if (typeof PLUGIN_REGISTRY === "undefined" || !PLUGIN_REGISTRY) return;
      if (!PLUGIN_REGISTRY[PLUGIN_ID]) {
        PLUGIN_REGISTRY[PLUGIN_ID] = { ...PLUGIN_DEFINITION };
      }
    } catch (error) {}
  }

  const railButton = document.createElement("button");
  railButton.type = "button";
  railButton.className = "tool-button music-player-button";
  railButton.dataset.plugin = PLUGIN_ID;
  railButton.setAttribute("aria-label", "打开白噪音播放器");
  railButton.setAttribute("aria-expanded", "false");
  railButton.title = "白噪音播放器 · 电子乐";
  railButton.innerHTML = `<img class="music-player-glyph" src="${ICON}" alt="">`;

  function mountRailButton() {
    const rail = document.querySelector(".tool-rail");
    if (!rail || rail.querySelector(".music-player-button")) return;
    const anchor = rail.querySelector(".forktree-button") || rail.querySelector(".pindou-button");
    if (anchor) anchor.after(railButton);
    else rail.appendChild(railButton);
  }

  // ------------------------------------------------------------------------
  // DOM
  // ------------------------------------------------------------------------
  const root = document.createElement("div");
  root.className = "mb-root";
  root.id = "mb-root";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `
    <div class="mb-scrim" data-mb="library-close"></div>
    <div class="mb-shell">
      <section class="mb-stage" aria-label="歌词播放界面">
        <div class="mb-stage-top">
          <div class="mb-brand">
            <span class="mb-brand-mark"><img src="${ICON}" alt=""></span>
            <span>
              <b>NEON TERMINAL</b>
              <small>NEOTODO · MUSIC DAEMON</small>
            </span>
          </div>
          <div class="mb-stage-tools">
            <button class="mb-chip" type="button" data-mb="library">曲库 <b class="mb-count">0</b></button>
            <button class="mb-icon" type="button" data-mb="stage-close" aria-label="收起歌词" title="收起歌词">${I.chevron}</button>
          </div>
        </div>

        <div class="mb-stage-main">
          <div class="mb-visual">
            <div class="mb-cover" data-cover>
              <span class="mb-cover-grid"></span>
              <img class="mb-cover-mark" src="${ICON}" alt="">
              <span class="mb-cover-title" data-cover-title>NO SIGNAL</span>
            </div>
            <div class="mb-tags" data-tags></div>
          </div>

          <div class="mb-lyrics-wrap">
            <div class="mb-now-head">
              <span class="mb-kicker">LYRICS · 歌词</span>
              <span class="mb-lyrics-status" data-lyrics-status>STANDBY</span>
            </div>
            <div class="mb-lyrics" data-lyrics>
              <div class="mb-lyrics-track" data-lyrics-track>
                <p class="mb-lyric is-active">正在载入曲库…</p>
              </div>
            </div>
            <div class="mb-wave" data-wave aria-hidden="true"></div>
          </div>
        </div>
      </section>

      <div class="mb-bar" aria-label="音乐播放器控制条">
        <div class="mb-bar-now">
          <div class="mb-mini-cover"><img src="${ICON}" alt=""></div>
          <div class="mb-bar-meta">
            <b data-bar-title>Neon Terminal</b>
            <small data-bar-artist>NeoTodo Synth Lab</small>
          </div>
        </div>

        <div class="mb-controls">
          <button class="mb-control" type="button" data-mb="prev" aria-label="上一首" title="上一首">${I.prev}</button>
          <button class="mb-play" type="button" data-mb="play" aria-label="播放" title="播放 / 暂停">${I.play}</button>
          <button class="mb-control" type="button" data-mb="next" aria-label="下一首" title="下一首">${I.next}</button>
        </div>

        <div class="mb-timeline">
          <span class="mb-time" data-time-now>0:00</span>
          <input class="mb-seek" data-seek type="range" min="0" max="1000" step="1" value="0" aria-label="播放进度">
          <span class="mb-time" data-time-total>--:--</span>
        </div>

        <div class="mb-bar-tools">
          <button class="mb-icon mb-stage-toggle" type="button" data-mb="stage-toggle" aria-label="显示或收起歌词" title="歌词界面">${I.lyrics}</button>
          <button class="mb-icon mb-library-toggle" type="button" data-mb="library" aria-label="打开曲库" title="曲库列表">${I.list}</button>
          <button class="mb-icon mb-volume-toggle" type="button" data-mb="volume-toggle" aria-label="静音" title="静音">${I.volume}</button>
          <input class="mb-volume" data-volume type="range" min="0" max="1" step="0.01" value="0.72" aria-label="音量">
          <button class="mb-icon mb-close" type="button" data-mb="close" aria-label="关闭播放器" title="关闭播放器">${I.close}</button>
        </div>
      </div>

      <aside class="mb-library" data-library aria-hidden="true" aria-label="曲库">
        <div class="mb-lib-head">
          <div>
            <span class="mb-kicker">LIBRARY · 曲库</span>
            <h3>电子乐收藏</h3>
            <small data-library-name>NEOTODO ORIGINAL</small>
          </div>
          <button class="mb-icon" type="button" data-mb="library-close" aria-label="关闭曲库">${I.close}</button>
        </div>

        <div class="mb-lib-search">
          <input data-search type="search" placeholder="搜索曲名 / 作者 / 标签" autocomplete="off" spellcheck="false">
        </div>

        <div class="mb-lib-actions">
          <button class="primary" type="button" data-mb="add-local">${I.plus} 从本地添加</button>
          <button type="button" data-mb="refresh">${I.refresh} 刷新</button>
          <button type="button" data-mb="folder">${I.folder} 打开文件夹</button>
        </div>

        <div class="mb-lib-folder" data-mb="copy-folder" title="复制曲库路径">
          ${I.folder}<span data-folder>内置曲库</span>
        </div>

        <div class="mb-lib-list" data-lib-list></div>
        <div class="mb-lib-foot">
          把音频放进曲库文件夹，或在 <code>library.json</code> 中补充标题与歌词。同名 <code>.lrc</code> 会自动同步。
        </div>
      </aside>

      <input data-files type="file" accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac,.opus,.lrc" multiple hidden>
      <audio data-audio preload="metadata"></audio>
    </div>
  `;

  document.body.appendChild(root);

  const nodes = {
    audio: root.querySelector("[data-audio]"),
    stage: root.querySelector(".mb-stage"),
    coverTitle: root.querySelector("[data-cover-title]"),
    tags: root.querySelector("[data-tags]"),
    lyrics: root.querySelector("[data-lyrics]"),
    lyricsTrack: root.querySelector("[data-lyrics-track]"),
    lyricsStatus: root.querySelector("[data-lyrics-status]"),
    wave: root.querySelector("[data-wave]"),
    barTitle: root.querySelector("[data-bar-title]"),
    barArtist: root.querySelector("[data-bar-artist]"),
    play: root.querySelector('[data-mb="play"]'),
    seek: root.querySelector("[data-seek]"),
    timeNow: root.querySelector("[data-time-now]"),
    timeTotal: root.querySelector("[data-time-total]"),
    volumeToggle: root.querySelector("[data-mb='volume-toggle']"),
    volume: root.querySelector("[data-volume]"),
    count: root.querySelector(".mb-count"),
    library: root.querySelector("[data-library]"),
    libraryName: root.querySelector("[data-library-name]"),
    list: root.querySelector("[data-lib-list]"),
    search: root.querySelector("[data-search]"),
    folder: root.querySelector("[data-folder]"),
    files: root.querySelector("[data-files]"),
  };

  nodes.audio.volume = state.volume;
  nodes.volume.value = String(state.volume);

  for (let i = 0; i < 34; i += 1) {
    const bar = document.createElement("span");
    bar.style.setProperty("--h", `${7 + Math.round(Math.random() * 21)}px`);
    bar.style.setProperty("--d", `${0.48 + Math.random() * 0.8}s`);
    bar.style.setProperty("--delay", `${-Math.random() * 1.2}s`);
    nodes.wave.appendChild(bar);
  }

  function paintRange(input) {
    if (!input) return;
    const min = Number(input.min) || 0;
    const max = Number(input.max) || 1;
    const value = Number(input.value) || 0;
    const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
    input.style.setProperty("--fill", `${clamp(percent, 0, 100)}%`);
  }

  function accentRgb(hex) {
    const match = /^#?([0-9a-f]{6})$/i.exec(String(hex || ""));
    if (!match) return "255, 77, 157";
    const number = Number.parseInt(match[1], 16);
    return `${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}`;
  }

  // ------------------------------------------------------------------------
  // State persistence
  // ------------------------------------------------------------------------
  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        volume: state.volume,
        stageOpen: state.stageOpen,
        lastTrackId: state.currentId || saved.lastTrackId || "",
      }));
    } catch (error) {}
  }

  // ------------------------------------------------------------------------
  // LRC parsing + lyric rendering
  // ------------------------------------------------------------------------
  function parseLrc(text) {
    const lines = [];
    const stamp = /\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
    String(text || "").split(/\r?\n/).forEach((raw) => {
      const stamps = [...raw.matchAll(stamp)];
      if (!stamps.length) return;
      const content = raw.replace(stamp, "").replace(/\[[a-z]+:[^\]]*\]/gi, "").trim();
      if (!content) return;
      for (const match of stamps) {
        const minutes = Number(match[1]) || 0;
        const seconds = Number(match[2]) || 0;
        const fraction = match[3] || "";
        let millis = Number(fraction) || 0;
        if (fraction.length === 1) millis *= 100;
        else if (fraction.length === 2) millis *= 10;
        lines.push({ time: minutes * 60 + seconds + millis / 1000, text: content });
      }
    });
    return lines.sort((a, b) => a.time - b.time);
  }

  function renderLyrics(track) {
    state.lyricsId = track.id;
    const timed = track.lrc ? parseLrc(track.lrc) : [];
    state.lines = timed.length
      ? timed
      : [
        { time: 0, text: "· 纯音乐 / INSTRUMENTAL ·" },
        { time: 0.01, text: `${track.title} — ${track.artist}` },
      ];
    nodes.lyricsStatus.textContent = timed.length ? "SYNC ON" : "INSTRUMENTAL";
    nodes.lyricsTrack.innerHTML = state.lines
      .map((line, index) => `<p class="mb-lyric" data-line="${index}" data-time="${line.time}">${esc(line.text)}</p>`)
      .join("");
    state.lineEls = [...nodes.lyricsTrack.querySelectorAll(".mb-lyric")];
    state.activeLine = -1;
    nodes.lyrics.scrollTop = 0;
    syncLyrics(0, true);
  }

  function syncLyrics(time, force = false) {
    if (!state.lineEls.length) return;
    let index = -1;
    for (let i = 0; i < state.lines.length; i += 1) {
      if (state.lines[i].time <= time + 0.12) index = i;
      else break;
    }
    if (index === state.activeLine && !force) return;
    state.activeLine = index;
    state.lineEls.forEach((line, i) => {
      line.classList.toggle("is-active", i === index);
      line.classList.toggle("is-past", i < index);
    });
    const line = state.lineEls[index];
    if (!line) return;
    const box = nodes.lyrics;
    if (!box.clientHeight) return;
    const top = line.offsetTop - box.clientHeight / 2 + line.offsetHeight / 2;
    try {
      box.scrollTo({ top: Math.max(0, top), behavior: force ? "auto" : "smooth" });
    } catch (error) {
      box.scrollTop = Math.max(0, top);
    }
  }

  function recenterLyrics() {
    if (!state.visible || !state.stageOpen) return;
    requestAnimationFrame(() => syncLyrics(nodes.audio.currentTime, true));
  }

  // ------------------------------------------------------------------------
  // Track UI
  // ------------------------------------------------------------------------
  function currentTrack() {
    return state.all[state.currentIndex] || null;
  }

  function applyTrackUI(track) {
    if (!track) return;
    state.currentId = track.id;
    const color = track.color || COLORS[0];
    root.style.setProperty("--mb-accent", color);
    root.style.setProperty("--mb-accent-rgb", accentRgb(color));
    nodes.coverTitle.textContent = String(track.title || "UNTITLED").slice(0, 26).toUpperCase();
    nodes.barTitle.textContent = track.title || "Untitled";
    nodes.barArtist.textContent = track.album ? `${track.artist} · ${track.album}` : track.artist || "NeoTodo";
    nodes.libraryName.textContent = (state.libraryName || "NEOTODO ORIGINAL").toUpperCase();

    const tags = [];
    if (track.local) tags.push("LOCAL");
    if (Array.isArray(track.tags)) tags.push(...track.tags);
    if (!tags.length) tags.push("ELECTRONIC");
    if (track.instrumental) tags.push("INSTRUMENTAL");
    nodes.tags.innerHTML = tags.slice(0, 4).map((tag) => `<span>${esc(tag)}</span>`).join("");

    if (state.lyricsId !== track.id) renderLyrics(track);
    updateMediaSession(track);
  }

  function showEmptyLibrary() {
    try { nodes.audio.pause(); } catch (error) {}
    state.loadedId = "";
    state.currentId = "";
    state.currentIndex = -1;
    state.lyricsId = "";
    state.lines = [];
    state.lineEls = [];
    state.activeLine = -1;
    try {
      nodes.audio.removeAttribute("src");
      nodes.audio.load();
    } catch (error) {}
    root.style.setProperty("--mb-accent", COLORS[0]);
    root.style.setProperty("--mb-accent-rgb", accentRgb(COLORS[0]));
    nodes.coverTitle.textContent = "NO SIGNAL";
    nodes.barTitle.textContent = "曲库为空";
    nodes.barArtist.textContent = "把音乐放进 music 文件夹，或从本地添加";
    nodes.tags.innerHTML = "<span>EMPTY LIBRARY</span>";
    nodes.lyricsStatus.textContent = "STANDBY";
    nodes.lyricsTrack.innerHTML = `
      <p class="mb-lyric is-active">曲库还是空的</p>
      <p class="mb-lyric">打开「曲库」面板，把喜欢的电子乐放进来。</p>
      <p class="mb-lyric">也可以直接把音频放进取景框外的 music 文件夹。</p>
    `;
    state.lineEls = [...nodes.lyricsTrack.querySelectorAll(".mb-lyric")];
    updateProgress();
    updatePlayButton();
    renderLibrary();
  }

  function selectTrack(index, { autoplay = false, resetTime = true, silent = false } = {}) {
    if (!state.all.length) {
      showEmptyLibrary();
      return;
    }
    const length = state.all.length;
    const nextIndex = ((Math.trunc(index) % length) + length) % length;
    const track = state.all[nextIndex];
    const changed = state.loadedId !== track.id;
    state.currentIndex = nextIndex;
    state.currentId = track.id;
    saved.lastTrackId = track.id;
    persist();

    if (changed) {
      state.loadedId = track.id;
      state.errorId = "";
      nodes.audio.src = track.src;
      nodes.audio.load();
      if (resetTime) {
        try { nodes.audio.currentTime = 0; } catch (error) {}
      }
    }

    applyTrackUI(track);
    renderLibrary();
    updateProgress();
    if (autoplay) playCurrent();
    else if (!silent) updatePlayButton();
  }

  function switchTrack(delta, autoplay) {
    if (!state.all.length) {
      showPlayer();
      setLibrary(true);
      notify("曲库是空的，先添加音乐", true);
      return;
    }
    if (state.all.length === 1) {
      try { nodes.audio.currentTime = 0; } catch (error) {}
      if (autoplay) playCurrent();
      else updateProgress();
      return;
    }
    selectTrack(state.currentIndex + delta, { autoplay });
  }

  function previousTrack() {
    if (!state.all.length) return;
    if (nodes.audio.currentTime > 4) {
      try { nodes.audio.currentTime = 0; } catch (error) {}
      updateProgress();
      return;
    }
    switchTrack(-1, true);
  }

  function nextTrack() {
    switchTrack(1, true);
  }

  function playCurrent() {
    if (!state.all.length) {
      showPlayer();
      setLibrary(true);
      notify("曲库是空的，先添加音乐", true);
      return;
    }
    if (!state.loadedId) {
      selectTrack(Math.max(0, state.currentIndex), { autoplay: false });
    }
    const pending = nodes.audio.play();
    if (pending && typeof pending.catch === "function") {
      pending.catch((error) => {
        if (error && error.name === "AbortError") return;
        updatePlayButton();
        notify("无法播放这首歌，检查曲库文件是否还在", true);
      });
    }
  }

  function togglePlay() {
    if (nodes.audio.paused) playCurrent();
    else nodes.audio.pause();
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
    const total = Math.floor(seconds);
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  }

  function updateProgress() {
    const duration = Number.isFinite(nodes.audio.duration) ? nodes.audio.duration : 0;
    const current = Number.isFinite(nodes.audio.currentTime) ? nodes.audio.currentTime : 0;
    const ratio = duration ? clamp(current / duration, 0, 1) : 0;
    nodes.timeTotal.textContent = duration ? formatTime(duration) : "--:--";
    if (!state.seeking) {
      nodes.seek.value = String(Math.round(ratio * 1000));
      paintRange(nodes.seek);
      nodes.timeNow.textContent = formatTime(current);
    }
    syncLyrics(current);
  }

  function updatePlayButton() {
    const playing = !nodes.audio.paused && Boolean(nodes.audio.src);
    nodes.play.innerHTML = playing ? I.pause : I.play;
    nodes.play.setAttribute("aria-label", playing ? "暂停" : "播放");
    root.classList.toggle("is-playing", playing);
    railButton.classList.toggle("is-playing", playing);
    updateLibraryPlayingMarker();
    if ("mediaSession" in navigator) {
      try { navigator.mediaSession.playbackState = playing ? "playing" : "paused"; } catch (error) {}
    }
  }

  function updateVolumeUI() {
    const volume = clamp(nodes.audio.muted ? 0 : nodes.audio.volume, 0, 1);
    nodes.volume.value = String(volume);
    paintRange(nodes.volume);
    const muted = volume <= 0.001;
    nodes.volumeToggle.innerHTML = muted ? I.mute : I.volume;
    nodes.volumeToggle.setAttribute("aria-label", muted ? "取消静音" : "静音");
  }

  function setVolume(value) {
    const volume = clamp(value, 0, 1);
    nodes.audio.volume = volume;
    nodes.audio.muted = volume <= 0.001;
    state.volume = volume;
    if (volume > 0.001) state.lastVolume = volume;
    updateVolumeUI();
    persist();
  }

  // ------------------------------------------------------------------------
  // Library (music folder + IndexedDB imports)
  // ------------------------------------------------------------------------
  let dbPromise = null;
  const localUrls = new Map();

  function musicDb() {
    if (!("indexedDB" in window)) return Promise.reject(new Error("IndexedDB unavailable"));
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(DB_STORE)) {
            db.createObjectStore(DB_STORE, { keyPath: "id" });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return dbPromise;
  }

  async function dbGetAll() {
    const db = await musicDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(DB_STORE, "readonly");
      const request = transaction.objectStore(DB_STORE).getAll();
      request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
      request.onerror = () => reject(request.error);
    });
  }

  async function dbPut(record) {
    const db = await musicDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(DB_STORE, "readwrite");
      transaction.objectStore(DB_STORE).put(record);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  async function dbDelete(id) {
    const db = await musicDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(DB_STORE, "readwrite");
      transaction.objectStore(DB_STORE).delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  async function loadLocalTracks() {
    let rows = [];
    try {
      rows = await dbGetAll();
    } catch (error) {
      if (!state.dbWarned) {
        state.dbWarned = true;
        notify("本地曲库存储不可用，仍可使用 music 文件夹", true);
      }
    }
    const nextUrls = new Map();
    const tracks = [];
    rows.forEach((row, index) => {
      if (!row || !row.id) return;
      const blob = row.blob instanceof Blob
        ? row.blob
        : (row.data ? new Blob([row.data], { type: row.mime || "audio/mpeg" }) : null);
      if (!blob) return;
      const existing = localUrls.get(row.id);
      const url = existing ? existing.url : URL.createObjectURL(blob);
      nextUrls.set(row.id, { url });
      tracks.push({
        id: row.id,
        src: url,
        title: row.title || "Untitled",
        artist: row.artist || "本地文件",
        album: row.album || "",
        color: row.color || COLORS[index % COLORS.length],
        tags: ["LOCAL"],
        lrc: row.lrc || "",
        local: true,
        instrumental: !row.lrc,
      });
    });
    for (const [id, entry] of localUrls) {
      if (!nextUrls.has(id) && id !== state.currentId) {
        try { URL.revokeObjectURL(entry.url); } catch (error) {}
      }
    }
    localUrls.clear();
    nextUrls.forEach((value, key) => localUrls.set(key, value));
    state.local = tracks;
    return tracks;
  }

  async function fetchServerTracks() {
    try {
      const response = await fetch("/api/music", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        if (data && data.ok && Array.isArray(data.tracks)) {
          state.folder = typeof data.folder === "string" ? data.folder : "";
          state.libraryName = typeof data.library === "string" ? data.library : "";
          return data.tracks.filter((track) => track && track.src);
        }
      }
    } catch (error) {}
    return fetchStaticTracks();
  }

  async function fetchStaticTracks() {
    try {
      const response = await fetch("/music/library.json", { cache: "no-store" });
      if (!response.ok) return [];
      const manifest = await response.json();
      const rows = Array.isArray(manifest.tracks) ? manifest.tracks : [];
      const tracks = await Promise.all(rows.map(async (row, index) => {
        if (!row || !row.file) return null;
        let lrc = "";
        if (row.lrc) {
          try {
            const lrcResponse = await fetch(`/music/${encodeURIComponent(row.lrc)}`, { cache: "no-store" });
            if (lrcResponse.ok) lrc = await lrcResponse.text();
          } catch (error) {}
        }
        return {
          id: row.file,
          file: row.file,
          src: `/music/${encodeURIComponent(row.file)}`,
          title: row.title || row.file.replace(/\.[^.]+$/, ""),
          artist: row.artist || "Local file",
          album: row.album || "",
          color: row.color || COLORS[index % COLORS.length],
          tags: Array.isArray(row.tags) ? row.tags : [],
          instrumental: Boolean(row.instrumental),
          lrc,
        };
      }));
      state.libraryName = typeof manifest.name === "string" ? manifest.name : "";
      return tracks.filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  function mergeTracks() {
    state.all = [...state.server, ...state.local];
  }

  async function refreshLibrary({ initial = false, announce = false } = {}) {
    const [server, local] = await Promise.all([fetchServerTracks(), loadLocalTracks()]);
    state.server = server;
    state.local = local;
    mergeTracks();
    nodes.count.textContent = String(state.all.length);
    nodes.folder.textContent = state.folder || "内置曲库（music 文件夹）";
    nodes.folder.title = state.folder ? `点击复制曲库路径：${state.folder}` : "内置曲库";
    nodes.libraryName.textContent = (state.libraryName || "NEOTODO ORIGINAL").toUpperCase();

    if (!state.all.length) {
      showEmptyLibrary();
      if (announce) notify("曲库为空，先放进几首歌", true);
      return;
    }

    let index = state.all.findIndex((track) => track.id === (state.currentId || saved.lastTrackId));
    if (index < 0) index = 0;
    const track = state.all[index];
    if (initial || !state.loadedId) {
      selectTrack(index, { autoplay: false, silent: true });
    } else if (track.id !== state.loadedId) {
      selectTrack(index, { autoplay: !nodes.audio.paused, silent: true });
    } else {
      state.currentIndex = index;
      state.currentId = track.id;
      applyTrackUI(track);
      updateProgress();
    }
    renderLibrary();
    if (announce) notify(`曲库已刷新 · ${state.all.length} 首`);
  }

  function filteredTracks() {
    const query = state.query.trim().toLowerCase();
    if (!query) return state.all;
    return state.all.filter((track) => {
      const haystack = [track.title, track.artist, track.album, ...(track.tags || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  function renderLibrary() {
    nodes.count.textContent = String(state.all.length);
    const tracks = filteredTracks();
    if (!state.all.length) {
      nodes.list.innerHTML = `
        <div class="mb-lib-empty">
          曲库还是空的。<br>
          把 MP3 / WAV / OGG 放进 music 文件夹，<br>
          或点上面的「从本地添加」。
        </div>`;
      return;
    }
    if (!tracks.length) {
      nodes.list.innerHTML = '<div class="mb-lib-empty">没有找到匹配的曲目。</div>';
      return;
    }
    nodes.list.innerHTML = tracks.map((track) => {
      const index = state.all.indexOf(track);
      const current = track.id === state.currentId;
      const playing = current && !nodes.audio.paused;
      const tags = (track.tags || []).slice(0, 2).map((tag) => `<span>${esc(tag)}</span>`).join("");
      const bars = playing ? '<span class="mb-playing-bars"><i></i><i></i><i></i></span>' : "";
      return `
        <div class="mb-track-row">
          <button class="mb-track ${current ? "is-current" : ""}" type="button" data-track-index="${index}" aria-label="播放 ${esc(track.title)}">
            <span class="mb-track-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="mb-track-dot" style="--c:${esc(track.color || COLORS[0])}"></span>
            <span class="mb-track-copy">
              <b>${esc(track.title)}</b>
              <small>${esc(track.artist)}${track.album ? ` · ${esc(track.album)}` : ""}${bars}</small>
            </span>
            <span class="mb-track-tags">${tags}</span>
          </button>
          ${track.local ? `<button class="mb-track-remove" type="button" data-remove-local="${esc(track.id)}" aria-label="从本地曲库移除 ${esc(track.title)}" title="从本地曲库移除">×</button>` : ""}
        </div>`;
    }).join("");
  }

  function updateLibraryPlayingMarker() {
    if (!state.libraryOpen) return;
    const playing = !nodes.audio.paused;
    nodes.list.querySelectorAll(".mb-track").forEach((row) => {
      const current = row.classList.contains("is-current");
      const small = row.querySelector(".mb-track-copy small");
      if (!small) return;
      const bars = small.querySelector(".mb-playing-bars");
      if (current && playing && !bars) {
        const marker = document.createElement("span");
        marker.className = "mb-playing-bars";
        marker.innerHTML = "<i></i><i></i><i></i>";
        small.appendChild(marker);
      } else if ((!current || !playing) && bars) {
        bars.remove();
      }
    });
  }

  async function importFiles(fileList) {
    if (state.importing) return;
    const files = [...(fileList || [])];
    if (!files.length) return;
    state.importing = true;
    const lrcFiles = new Map();
    files.forEach((file) => {
      if (/\.lrc$/i.test(file.name)) {
        lrcFiles.set(file.name.replace(/\.lrc$/i, "").toLowerCase(), file);
      }
    });
    const newIds = [];
    let skipped = 0;
    let failed = false;
    try {
      for (const file of files) {
        if (!/\.(mp3|wav|ogg|flac|m4a|aac|opus)$/i.test(file.name)) {
          if (!/\.lrc$/i.test(file.name)) skipped += 1;
          continue;
        }
        const stem = file.name.replace(/\.[^.]+$/, "");
        const lrcFile = lrcFiles.get(stem.toLowerCase());
        let lrc = "";
        if (lrcFile) {
          try { lrc = await lrcFile.text(); } catch (error) {}
        }
        const data = await file.arrayBuffer();
        const id = `local:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 8)}:${stem}`;
        const title = stem.replace(/[_]+/g, " ").replace(/\s+/g, " ").trim() || file.name;
        await dbPut({
          id,
          title,
          artist: "本地文件",
          album: "",
          color: COLORS[(state.local.length + newIds.length) % COLORS.length],
          lrc,
          data,
          mime: file.type || "audio/mpeg",
          fileName: file.name,
          addedAt: Date.now(),
        });
        newIds.push(id);
      }
    } catch (error) {
      failed = true;
      console.error("[music-player] import failed", error);
      notify("保存本地曲目失败，可能是存储空间不足", true);
    } finally {
      state.importing = false;
      nodes.files.value = "";
    }

    if (!newIds.length) {
      if (!failed) notify(skipped ? "没有找到可播放的音频文件" : "没有选择文件", true);
      return;
    }
    await refreshLibrary();
    const first = state.all.findIndex((track) => track.id === newIds[0]);
    if (first >= 0) selectTrack(first, { autoplay: false });
    notify(`已添加 ${newIds.length} 首到本地曲库`);
  }

  async function removeLocalTrack(id) {
    if (!id) return;
    const wasCurrent = state.currentId === id;
    try {
      await dbDelete(id);
    } catch (error) {
      notify("删除失败", true);
      return;
    }
    const entry = localUrls.get(id);
    if (entry) {
      if (wasCurrent) {
        try { nodes.audio.pause(); } catch (error) {}
      }
      try { URL.revokeObjectURL(entry.url); } catch (error) {}
      localUrls.delete(id);
    }
    if (wasCurrent) {
      state.loadedId = "";
      state.currentId = "";
      state.currentIndex = -1;
    }
    await refreshLibrary();
    notify("已从本地曲库移除");
  }

  // ------------------------------------------------------------------------
  // Open / close
  // ------------------------------------------------------------------------
  function showPlayer() {
    try {
      if (typeof pluginEnabled === "function" && !pluginEnabled(PLUGIN_ID)) {
        notify("白噪音播放器已关闭，可在设置 → 插件里打开", true);
        return;
      }
    } catch (error) {}
    state.visible = true;
    root.classList.add("is-open");
    root.classList.toggle("stage-open", state.stageOpen);
    root.setAttribute("aria-hidden", "false");
    railButton.classList.add("is-open");
    railButton.setAttribute("aria-expanded", "true");
    if (!state.all.length) {
      refreshLibrary({ initial: true }).then(() => {
        if (state.all.length) requestAnimationFrame(() => syncLyrics(nodes.audio.currentTime, true));
      });
    } else if (!state.loadedId) {
      selectTrack(Math.max(0, state.currentIndex), { autoplay: false, silent: true });
    }
    recenterLyrics();
    setTimeout(recenterLyrics, 470);
  }

  function hidePlayer({ pause = false } = {}) {
    state.visible = false;
    state.libraryOpen = false;
    root.classList.remove("is-open", "library-open");
    root.setAttribute("aria-hidden", "true");
    railButton.classList.remove("is-open");
    railButton.setAttribute("aria-expanded", "false");
    nodes.library.setAttribute("aria-hidden", "true");
    if (pause) {
      try { nodes.audio.pause(); } catch (error) {}
    }
  }

  function togglePlayer() {
    if (state.visible) hidePlayer({ pause: false });
    else showPlayer();
  }

  function toggleStage(force) {
    state.stageOpen = typeof force === "boolean" ? force : !state.stageOpen;
    root.classList.toggle("stage-open", state.stageOpen && state.visible);
    persist();
    if (state.stageOpen) {
      recenterLyrics();
      setTimeout(recenterLyrics, 470);
    }
  }

  function setLibrary(open) {
    state.libraryOpen = Boolean(open);
    root.classList.toggle("library-open", state.libraryOpen);
    nodes.library.setAttribute("aria-hidden", String(!state.libraryOpen));
    if (state.libraryOpen) renderLibrary();
  }

  // ------------------------------------------------------------------------
  // Media Session
  // ------------------------------------------------------------------------
  function updateMediaSession(track) {
    if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album || "NeoTodo · Neon Terminal",
        artwork: [{ src: ICON, sizes: "1024x1024", type: "image/svg+xml" }],
      });
    } catch (error) {}
  }

  function setupMediaSession() {
    if (!("mediaSession" in navigator)) return;
    const safe = (name, handler) => {
      try { navigator.mediaSession.setActionHandler(name, handler); } catch (error) {}
    };
    safe("play", () => playCurrent());
    safe("pause", () => { try { nodes.audio.pause(); } catch (error) {} });
    safe("previoustrack", () => previousTrack());
    safe("nexttrack", () => nextTrack());
    safe("seekto", (details) => {
      if (Number.isFinite(details?.seekTime)) {
        try { nodes.audio.currentTime = details.seekTime; } catch (error) {}
        updateProgress();
      }
    });
  }

  // ------------------------------------------------------------------------
  // Events
  // ------------------------------------------------------------------------
  function copyFolderPath() {
    if (!state.folder) {
      notify("当前使用内置曲库，路径未提供", true);
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(state.folder)
        .then(() => notify("曲库路径已复制"))
        .catch(() => notify(state.folder));
    } else {
      notify(state.folder);
    }
  }

  async function openFolder() {
    if (typeof action === "function") {
      try {
        const result = await action("open_music_folder");
        if (result?.ok) {
          notify("已打开曲库文件夹");
          return;
        }
      } catch (error) {}
    }
    if (state.folder) {
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(state.folder);
      } catch (error) {}
      notify("无法直接打开文件夹，路径已复制", true);
    } else {
      notify("把音乐放进 music 文件夹即可", true);
    }
  }

  railButton.addEventListener("click", togglePlayer);

  root.addEventListener("click", (event) => {
    const node = event.target.closest("[data-mb]");
    if (!node) return;
    const command = node.dataset.mb;
    if (command === "play") togglePlay();
    else if (command === "prev") previousTrack();
    else if (command === "next") nextTrack();
    else if (command === "stage-toggle") toggleStage();
    else if (command === "stage-close") toggleStage(false);
    else if (command === "library") setLibrary(!state.libraryOpen);
    else if (command === "library-close") setLibrary(false);
    else if (command === "close") hidePlayer({ pause: true });
    else if (command === "refresh") refreshLibrary({ announce: true });
    else if (command === "folder") openFolder();
    else if (command === "copy-folder") copyFolderPath();
    else if (command === "add-local") nodes.files.click();
    else if (command === "volume-toggle") {
      if (nodes.audio.muted || nodes.audio.volume <= 0.001) setVolume(state.lastVolume || 0.72);
      else {
        state.lastVolume = nodes.audio.volume;
        setVolume(0);
      }
    }
  });

  nodes.list.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-remove-local]");
    if (remove) {
      event.preventDefault();
      event.stopPropagation();
      removeLocalTrack(remove.dataset.removeLocal);
      return;
    }
    const row = event.target.closest("[data-track-index]");
    if (!row) return;
    const index = Number(row.dataset.trackIndex);
    if (!Number.isInteger(index)) return;
    selectTrack(index, { autoplay: true });
    if (window.innerWidth < 760) setLibrary(false);
  });

  nodes.files.addEventListener("change", () => importFiles(nodes.files.files));

  nodes.search.addEventListener("input", () => {
    state.query = nodes.search.value;
    renderLibrary();
  });

  nodes.seek.addEventListener("pointerdown", () => { state.seeking = true; });
  nodes.seek.addEventListener("input", () => {
    state.seeking = true;
    paintRange(nodes.seek);
    const duration = nodes.audio.duration;
    if (Number.isFinite(duration)) {
      nodes.timeNow.textContent = formatTime(duration * (Number(nodes.seek.value) / 1000));
    }
  });
  const commitSeek = () => {
    const duration = nodes.audio.duration;
    if (Number.isFinite(duration)) {
      const target = duration * (Number(nodes.seek.value) / 1000);
      try { nodes.audio.currentTime = clamp(target, 0, duration); } catch (error) {}
      syncLyrics(target, true);
    }
    state.seeking = false;
    updateProgress();
  };
  nodes.seek.addEventListener("change", commitSeek);
  nodes.seek.addEventListener("pointerup", commitSeek);
  nodes.seek.addEventListener("pointercancel", () => { state.seeking = false; updateProgress(); });

  nodes.volume.addEventListener("input", () => setVolume(Number(nodes.volume.value)));

  nodes.audio.addEventListener("play", updatePlayButton);
  nodes.audio.addEventListener("pause", updatePlayButton);
  nodes.audio.addEventListener("loadedmetadata", updateProgress);
  nodes.audio.addEventListener("durationchange", updateProgress);
  nodes.audio.addEventListener("timeupdate", updateProgress);
  nodes.audio.addEventListener("ended", () => {
    if (state.all.length > 1) nextTrack();
    else {
      try { nodes.audio.currentTime = 0; } catch (error) {}
      updateProgress();
    }
  });
  nodes.audio.addEventListener("error", () => {
    if (!state.loadedId || state.errorId === state.loadedId) return;
    state.errorId = state.loadedId;
    updatePlayButton();
    notify("音频加载失败，检查曲库文件是否还在", true);
  });

  nodes.lyricsTrack.addEventListener("click", (event) => {
    const line = event.target.closest("[data-time]");
    if (!line) return;
    const time = Number(line.dataset.time);
    if (!Number.isFinite(time)) return;
    try { nodes.audio.currentTime = time; } catch (error) {}
    syncLyrics(time, true);
    if (nodes.audio.paused) playCurrent();
  });

  // Swipe left/right on the stage or bar to change tracks.
  let swipe = null;
  const swipeStart = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target.closest("input, button, a, [data-track-index]")) return;
    swipe = { x: event.clientX, y: event.clientY, id: event.pointerId };
  };
  const swipeEnd = (event) => {
    if (!swipe || event.pointerId !== swipe.id) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) < 54 || Math.abs(dy) > 44) return;
    const keepPlaying = !nodes.audio.paused;
    if (dx < 0) switchTrack(1, keepPlaying);
    else switchTrack(-1, keepPlaying);
  };
  [nodes.stage, root.querySelector(".mb-bar")].forEach((node) => {
    node.addEventListener("pointerdown", swipeStart);
    node.addEventListener("pointerup", swipeEnd);
    node.addEventListener("pointercancel", () => { swipe = null; });
  });

  nodes.stage.addEventListener("transitionend", (event) => {
    if (event.propertyName === "height" && state.stageOpen) recenterLyrics();
  });

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(recenterLyrics, 160);
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (state.libraryOpen) setLibrary(false);
    else if (state.stageOpen) toggleStage(false);
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type !== "neotodo-music-player-open") return;
    try {
      if (typeof closePluginPanel === "function") closePluginPanel();
    } catch (error) {}
    showPlayer();
  });

  if (window.MutationObserver) {
    new MutationObserver(() => {
      if (railButton.classList.contains("plugin-hidden") && state.visible) {
        hidePlayer({ pause: true });
      }
    }).observe(railButton, { attributes: true, attributeFilter: ["class"] });
  }

  // ------------------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------------------
  paintRange(nodes.seek);
  paintRange(nodes.volume);
  root.classList.toggle("stage-open", state.stageOpen);
  updateVolumeUI();
  updatePlayButton();
  setupMediaSession();
  registerPlugin();
  mountRailButton();
  try {
    if (typeof applyPluginState === "function") applyPluginState();
  } catch (error) {}

  refreshLibrary({ initial: true }).catch((error) => {
    console.error("[music-player]", error);
    showEmptyLibrary();
  });
})();
