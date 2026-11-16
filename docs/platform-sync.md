# Platform sync log

Linux is the source of truth. Windows, macOS and Android were each brought up to
date in their own **one-off** pass; later Linux work is not synced to them
unless the user asks for another platform pass.

Each platform folder is a snapshot, not a second trunk:

| Folder | Shell | Vendored from Linux |
| --- | --- | --- |
| `windows_app.py` | Qt WebEngine | imports the root `app.py` directly |
| `NeoTodo-MacOS/` | PyObjC + WKWebView | `sync-sources.sh` copies `app.py`, `startup.py`, `web/` |
| `NeoTodo-Android/` | Java + WebView + Chaquopy | `sync-sources.sh` copies `app.py`, `startup.py`, `web/` |

## One folder per platform

Each platform keeps its own folder, and **only Linux is developed now**:

| Folder | Platform |
| --- | --- |
| repo root (`app.py`, `web/`, `run.sh`) | Shared Linux-first sources — the tree that is edited |
| `NeoTodo-Linux/` | Saved Linux build (snapshot of the root sources) |
| `NeoTodo-MacOS/` | macOS build |
| `NeoTodo-iOS/` | iOS build |
| `android/`, `NeoTodo-Android.apk` | Android build |
| `windows_app.py`, `installer.iss` | Windows build |

Linux work lands at the repo root; `NeoTodo-Linux/` is refreshed from it with
`NeoTodo-Linux/sync-sources.sh`. The other platforms are **not** synced as part
of Linux work — they are updated together only when the user asks for a
platform-sync pass.

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

## macOS: built once

`NeoTodo-MacOS/` holds the saved macOS build: a native PyObjC + WKWebView shell
(`macos_shell.py`) around a snapshot of the same `app.py`, `startup.py` and
`web/` tree. It is not rebuilt as part of Linux work; refresh it with
`NeoTodo-MacOS/sync-sources.sh <commit>` only when a macOS pass is requested.

The shell covers the parts of the page the GTK shell owns:

- The `neotodo.local` bridge: `new-window`, `open` (a real detached note/AI
  window), `home` (dock it back) and `window/move` (native drag; `resize` is a
  no-op because the native window has live edges).
- Native folder and wallpaper pickers (`FOLDER_PICK_CALLBACK`,
  `FILE_PICK_CALLBACK`) opened on the AppKit main thread.
- The `app-painted` reveal gate with a 6 s fallback, so the window never flashes
  WebKit's white background.
- Native `alert` / `confirm` / `prompt` for plugin iframes, external links sent
  to the default browser, renderer-crash reload, and Cmd+Q cleanup of forks and
  the agent store.
- `build.sh` builds a py2app `.app`, signs with hardened runtime, and can
  notarize for Developer ID distribution or package a sandboxed `.pkg` for the
  Mac App Store. The App Store blockers (agent CLI, community installs,
  security-scoped bookmarks) are listed in `NeoTodo-MacOS/README.md`.

No macOS items are pending.

## Android: synced once (2026-11-16)

The Gradle project moved from `android/` to **`NeoTodo-Android/`** and was brought
up to date with the Linux tree in a single pass. The folder now vendors
`app.py`, `startup.py` and `web/` under `app/src/main/python/` (tracked, so the
folder builds on its own) and carries the store kit:

- `build-release.sh` + `keystore.properties.example` for a signed `.aab` /
  release `.apk`; `app/build.gradle` reads the upload key and only falls back to
  the debug key when `keystore.properties` is missing.
- `store/` with the 512x512 icon, the 1024x500 feature graphic, the Chinese
  listing copy and the bilingual privacy policy.
- `docs/android-store-publish.md` — keystore, Google Play, the Chinese stores,
  the APP filing, target API 36 / 16 KB page size and the review pitfalls.

The Linux-first features that were pending here are inside the snapshot:
new-window support and the `neotodo.local` bridge, AI attachment pasting and the
async chat queue, the storage box, palette and postcard plugins, plus the
head-bar, wallpaper and note-material changes made this week.

## Pending Android sync

Add Linux-first changes that still need an Android pass here.

- Nothing pending as of 2026-11-16. The next Android pass is a separate request;
  Linux remains the tree that is edited.

## How to sync Android

1. `cd NeoTodo-Android && ./sync-sources.sh` (or `./sync-sources.sh v0.0.2` to
   take a tag instead of the working tree).
2. `./build.sh` and smoke-test the APK on a device or emulator.
3. Bump `versionCode` / `versionName` in `app/build.gradle`, run
   `./build-release.sh --apk`, upload to the stores.
4. Clear the pending entries above and update the date of this pass.
