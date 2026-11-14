# Plugins

Each folder here is a self-contained NeoTodo mini-app. The left tool rail opens
it in an isolated iframe, so a plugin can be installed or removed without
editing the main notebook code.

```
plugins/
  plugin-host.css      shared host frame + rail icon styles
  pindou/
    manifest.json      plugin metadata (id, name, version, icon, entry)
    index.html         plugin UI
    pindou.css         plugin styles
    pindou.js          plugin logic
    pindou.svg         pink perler-bead flower rail icon
  subtask-search/
    manifest.json      plugin metadata (interface / chrome)
    index.html         plugin control page
    plugin.css         control page styles
    plugin.js          control page on/off switch
    subtask-search.css slide-out search drawer + result rows
    subtask-search.js  rail toggle, drawer motion, result jump
    subtask-search.svg orange magnifier rail icon
  firelight/
    manifest.json      plugin metadata (effects / chrome)
    index.html         control page with a live Doing-card preview
    plugin.css         control page styles
    plugin.js          control page on/off switch
    firelight.css      the Doing icon glow (scoped to html.firelight-on)
    firelight.js       registers the plugin, seeds specks, syncs the switch
    firelight.svg      warm flame plugin icon
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
the plugin toggles so the switch can remove it cleanly.

## Add a plugin

### Bundled plugins

1. Create `plugins/<id>/` with an entry HTML file and a `manifest.json`.
2. Add the id/entry to `PLUGIN_REGISTRY` in `web/app.js`.
3. Add a `.tool-button` with a `data-action` that calls
   `openPluginPanel("<id>")`.

The host sends `{ type: "neotodo-theme", dark }` messages to the iframe and
listens for `{ type: "neotodo-plugin-close" }` so a plugin can close itself.

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
- `subtask-search` — 子任务搜索 / Subtask Search
- `forktree` — 分支地图 / Forktree. Clicking a card posts
  `{ type: "neotodo-forktree-open", target }`; the host closes the plugin and
  opens that category / todo / subtask.
- `firelight` — 火光特效 / Firelight. Tints unseen Doing icons: fireflies and
  paper lanterns on dark paper, a silhouette-hugging ember glow plus rising
  sparks on light paper. No burst or particle shell.
- `music-player` — 白噪音播放器 / Neon Terminal. A host-level electronic
  music player: rail record icon (user's `play.svg`), bottom bar, synced LRC
  stage, left/right switching, clickable library, folder-based tracks plus
  IndexedDB imports. Audio keeps playing while the notebook is used.
