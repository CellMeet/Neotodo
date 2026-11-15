# Platform sync log

Linux is the source of truth. Windows and Android are updated together later.

## Pending sync

Add Linux-first changes that still need a Windows/Android pass here.

- New-window support: `web/app.js` right-click on the wordmark, `neotodo.local/new-window`
  bridge and `--new-window` in `app.py`.
- AI attachment pasting: `add_paths` API, amber file chips, `agent-file-pin` symbol.
- AI async chat queue (12 parallel), draft persistence, copy-on-select,
  interrupt handling and the scroll cache.
- Storage box plugin: `web/plugins/storage-box/`, its `PLUGIN_REGISTRY` entry and
  `visibleCategories()` hook in `web/app.js`, and the rail button in
  `web/index.html`.
- Palette plugin: `web/plugins/palette/`, its `PLUGIN_REGISTRY` entry,
  `window.NeoTodoPalette` host bridge and the `open-palette` action in
  `web/app.js`, the rail button in `web/index.html`, and the page controls that
  moved out of Settings → Theme (selection highlight, page line, layout,
  finished rows). The note surface stays under Settings → Theme → Note theme.

## How to sync

1. `./android/sync-sources.sh`
2. Check `windows_app.py` against new `/api/*` and `neotodo.local/*` behaviour.
3. Build both targets and smoke-test.
4. Clear the pending entries above.
