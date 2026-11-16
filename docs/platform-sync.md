# Platform sync log

Linux is the source of truth. Windows and Android were updated together in a
single platform-sync step; Android still follows that step below.

## Windows: synced once

`windows_app.py` was brought up to date with the Linux backend on 2026-11-16.
This was a one-off catch-up: later Linux work is **not** synced to Windows
unless the user asks for another Windows pass.

The shell now covers the parts of the Linux app the page depends on:

- The `neotodo.local` bridge, answered on the next event-loop turn like
  `GLib.idle_add`: `new-window` opens another main window, `open` pops the
  note/AI sheet (including the drag-follow move), `home` docks a detached panel
  back into the main window, and `window/move` + `window/resize` drive the
  native drag and the top-edge resize of a detached sheet.
- The native folder and wallpaper pickers (`FOLDER_PICK_CALLBACK`,
  `FILE_PICK_CALLBACK`) are marshalled onto the Qt GUI thread, so the backend's
  `choose_project_folder` and `choose_wallpaper_file` actions work instead of
  falling back or failing.
- The `app-painted` reveal gate: the main window stays transparent until the
  page reports its finished first frame, with a 5 s fallback (4 s for a popped
  out sheet).
- Quitting stops forks and the agent store and shuts the HTTP server down;
  closing the notebook window closes the detached sheets.
- `window.open()` still creates real popup windows through the Qt shell, and
  popups answer the same bridge.
- Autoplay is allowed (Chromium flag + `PlaybackRequiresUserGesture=false`), the
  context menu stays with the page, and the taskbar identity is set.

No Windows items are pending.

## Pending Android sync

Add Linux-first changes that still need an Android pass here.

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
- Postcard plugin: `web/plugins/postcard/`, its `PLUGIN_REGISTRY` entry,
  `window.NeoTodoPostcards` host bridge and the `open-postcard` action in
  `web/app.js`, the rail button in `web/index.html`, the shared `intheme` tag
  handling in `openPluginPanel`, and the top-right button that changed from the
  archive picture to `/robot-agent.svg` + `open-ai-settings`.

## How to sync Android

1. `./android/sync-sources.sh`
2. Build and smoke-test the APK.
3. Clear the pending entries above.
