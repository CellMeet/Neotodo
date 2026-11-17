# Plugins

Each folder here is a self-contained NeoTodo mini-app. The left tool rail opens
it in an isolated iframe, so a plugin can be installed or removed without
editing the main notebook code.

```
plugins/
  plugin-host.css      shared host frame + rail icon styles
  plugin-theme.css     shared theme mapping for every control page
  plugin-theme.js      copies the notebook's live theme before first paint
  pindou/
    manifest.json      plugin metadata (id, name, version, icon, entry)
    index.html         plugin UI
    pindou.css         plugin styles
    pindou.js          plugin logic
    pindou.svg         pink perler-bead flower rail icon
  palette/
    manifest.json      plugin metadata (interface / chrome, intheme)
    index.html         Settings-style page sheet (line, highlight, rows)
    plugin.css         page-only rail mark and nav foot
    plugin.js          talks to window.NeoTodoPalette in the host notebook
    palette.svg        paint-palette rail icon (user-provided)
  postcard/
    manifest.json      plugin metadata (interface / chrome, intheme)
    index.html         Settings-style weekly postcard archive
    plugin.css         page-only rail mark, year jumps and preview spacing
    plugin.js          talks to window.NeoTodoPostcards in the host notebook
    postcard.svg       picture/postcard rail icon (user-provided)
  community/
    manifest.json      opt-in community shop metadata (interface / chrome, intheme)
    index.html         Settings-style shop sheet: plugins, games, themes
    community.css      transparent iframe, shop cards and theme swatches
    community.js       catalogs + window.NeoTodoCommunity install/apply bridge
    community.svg      hammer rail icon (user-provided)
  subtask-search/
    manifest.json      plugin metadata (interface / chrome)
    index.html         plugin control page
    plugin.css         control page styles
    plugin.js          control page on/off switch
    subtask-search.css slide-out search drawer, own glass mask + result rows
    subtask-search.js  rail toggle, activity-sorted results, relative time, jump + select
    subtask-search.svg rail magnifier icon (painted deep black in CSS)
  completed-drawer/
    manifest.json      plugin metadata (interface / chrome)
    index.html         control page with a live drawer preview
    plugin.css         control page styles
    plugin.js          control page on/off switch
    completed-drawer.svg purple card rail icon
  storage-box/
    manifest.json      plugin metadata (interface / chrome)
    index.html         control page with a category/box preview
    plugin.css         control page styles
    plugin.js          control page on/off switch + open box button
    storage-box.css    box strip in the Categories spine + rail glyph
    storage-box.js     collect/restore logic, stored ids in localStorage
    storage-box.svg    amber storage box (user-provided)
  pomodoro/
    manifest.json      achievement-tagged pomodoro metadata (interface / chrome)
    index.html         control page with the top-right achievement preview
    plugin.css         control page styles
    plugin.js          control page on/off switch + start-timer message
    pomodoro.svg       tomato rail + achievement icon
  firelight/
    manifest.json      plugin metadata (effects / chrome)
    index.html         control page with a live Doing-card preview
    plugin.css         control page styles
    plugin.js          control page on/off switch
    firelight.css      the Doing icon glow (scoped to html.firelight-on)
    firelight.js       registers the plugin, mirrors the switch onto <html>
    firelight.svg      warm flame plugin icon
  fireflies/
    manifest.json      plugin metadata (effects / chrome)
    index.html         control page with a live Doing-card preview
    plugin.css         control page styles
    plugin.js          control page on/off switch
    fireflies.css      drifting specks (scoped to html.fireflies-on)
    fireflies.js       registers the plugin, seeds specks, syncs the switch
    fireflies.svg      little glowing specks plugin icon
  lightning/
    manifest.json      plugin metadata (effects / chrome)
    index.html         control page with a live Doing-card preview
    plugin.css         control page styles
    plugin.js          control page on/off switch
    lightning.css      the breathing white tangle (scoped to html.lightning-on)
    lightning.js       registers the plugin, builds the mass, syncs the switch
    lightning.svg      white lightning-bolt plugin icon
  music-player/
    manifest.json      plugin metadata (play / chrome)
    index.html         plugin control page
    plugin.css         control page styles
    plugin.js          control page power switch + open-player message
    music-player.css   rail button, bottom player bar, lyrics stage, library
    music-player.js    host-level player, IndexedDB imports, LRC sync
    play.svg           pink record rail icon (user-provided)
```

`web/music/` is the bundled electronic-music library. On first launch it is
copied to the user's data directory (`neotodo/music/`), where tracks and
sidecar `.lrc` lyrics can be added without rebuilding the app.

Chrome plugins load their effect CSS/JS from `index.html` and register
themselves in `PLUGIN_REGISTRY`; effect CSS should be scoped to a class that
the plugin toggles so the switch can remove it cleanly. A manifest tagged
`"achievement"` (or `"成就"`) claims a slot in the top-right header: the
headphone is the built-in default, and each new tagged plugin slides it left.
A manifest tagged `"intheme"` (or `"in-theme"`) says its page is not a mini-app
but the notebook's own Settings sheet: the host keeps the live wallpaper behind
its transparent stage and folds Settings / Community away when it opens. The
Palette, Postcards and Community pages are the bundled examples.

## Add a plugin

### Bundled plugins

1. Create `plugins/<id>/` with an entry HTML file and a `manifest.json`.
2. Add the id/entry to `PLUGIN_REGISTRY` in `web/app.js`.
3. Add a `.tool-button` with a `data-action` that calls
   `openPluginPanel("<id>")`.

The host sends `{ type: "neotodo-theme", dark, vars }` messages to the iframe
and listens for `{ type: "neotodo-plugin-close" }` so a plugin can close itself.
`vars` carries the live postcard palette, page_line paint and weight, the shared
ink-green card outline / corner / lift, and the reader's font stacks; the host
repeats it whenever the theme, wallpaper or page line changes.

Every non-`intheme` control page loads the shared theme bridge:

```html
<script src="../plugin-theme.js"></script>   <!-- in <head>, before the plugin CSS -->
<link rel="stylesheet" href="../plugin-theme.css"> <!-- after the plugin CSS -->
```

`plugin-theme.js` reads the parent palette before the first paint, sets
`data-nt-theme` on the page and mirrors the light/dark switch onto the plugin's
own `data-*-dark` flag. `plugin-theme.css` maps `--nt-*` onto the plugin's
private `--xx-paper` / `--xx-ink` / `--xx-line` variables, so the page wears the
current theme while its identity colour (a tomato, a flame, a bead board) stays
its own. Pages tagged `"intheme"` load `/style.css` and copy `vars` themselves
instead; they must not load the bridge, because their stage is transparent.

### Community plugins

Downloaded plugins do not need a registry entry. The backend scans
`<data>/plugins/<id>/manifest.json`, the host merges the manifest at startup,
and a downloaded plugin automatically gets a tool-rail button. See
[`community/README.md`](../../community/README.md) in the repository root for
the manifest contract, `tools/pack-plugin.py`, and the catalog submission flow.

The community catalog is `plugins/community-catalog.json` here. It is the
offline copy of `community/catalog.json` in the repository root; both must list
the same plugin ids. `python3 tools/validate_community.py` checks them.

## Installed plugins

- `pindou` — 拼豆工坊 / Perler Bead Studio
- `palette` — 调色板 / Palette. The paint-palette rail icon opens the same
  Settings sheet inside the plugin iframe and owns the page controls that used
  to sit in Settings → Theme: selection highlight, page line colour / weight,
  page line opacity / row pitch and finished rows. The note surface stays in
  Settings → Theme → Note theme. It writes through `window.NeoTodoPalette`, so
  page-line.json and baseline-rule.json remain the only sources the page paints
  from. The sheet loads `style.css`, `page-line.css` and `baseline-rules.css`
  and copies the postcard variables, so it wears the current theme instead of a
  private palette. It is tagged `intheme`.
- `postcard` — 明信片 / Postcards. The picture rail icon opens the weekly
  archive as the same Settings-style sheet. The iframe only lists years,
  months and weeks; `window.NeoTodoPostcards` supplies the week rows, the
  existing postcard article and the large viewer, so the notebook keeps a
  single archive and app startup never loads a second copy of the themes.
  Tagged `intheme`.
- `community` — 社区 / Community. The hammer rail icon opens the shop formerly
  hidden behind Settings → Community. It browses plugins, games and themes,
  installs / enables / removes plugins and applies themes through
  `window.NeoTodoCommunity`, so the notebook keeps ownership of plugin files,
  saved switches and theme packs. The page loads `style.css` and is tagged
  `intheme`, so it wears the current theme. Settings no longer carries a
  Community item; bundled plugins are added from Settings → Plugins →
  Available.
- `subtask-search` — 子任务搜索 / Subtask Search
- `forktree` — 分支地图 / Forktree. Opened from Settings → Plugins (no rail
  icon). Clicking a card posts `{ type: "neotodo-forktree-open", target }`; the
  host closes the plugin and opens that category / todo / subtask.
- `completed-drawer` — 完成抽屉 / Completed Drawer
- `storage-box` — 收纳箱 / Storage Box. The bottom-left rail box opens a strip
  under the Categories rule. Click a category to store it, click the strip to
  see what is inside, and click a stored board to return it to the end of the
  list. Turning the plugin off empties the box and restores every category.
- `pomodoro` — 番茄钟 / Pomodoro. Opt-in from Community: NeoTodo starts with
  only the headphone achievement visible. Its manifest tags it `achievement`,
  so turning it on reveals the tomato counter in the top-right header and the
  headphone achievement slides left to make room. Finishing a 25-minute focus
  adds one to the counter; clicking it opens the focus log.
- `firelight` — 火光特效 / Firelight. Tints unseen Doing icons: a warm lantern
  core and halo on dark paper, a silhouette-hugging ember glow on light paper.
  No burst or particle shell.
- `fireflies` — 萤火虫特效 / Fireflies. Drifts seeded fireflies and paper
  lanterns around unseen Doing icons on dark paper, and rising embers on light
  paper. Kept separate from Firelight so either half can be switched alone.
- `lightning` — 白色闪电 / White Lightning. Wraps unseen Doing icons in a breathing
  knot of white lightning: three layers of tangled filaments (short core
  tangles, long body leaders, a dissolving fringe), each swelling and tilting
  at its own pace while individual strands flicker. The strokes are white with
  a faint cool aura; the radial mask keeps the edge fuzzy and uneven instead of
  drawing a ball or a rim. Runs alongside Firelight and Fireflies.
- `music-player` — 白噪音播放器 / Neon Terminal. A host-level electronic
  music player: rail record icon (user's `play.svg`), bottom bar, synced LRC
  stage, left/right switching, clickable library, folder-based tracks plus
  IndexedDB imports. Audio keeps playing while the notebook is used.
