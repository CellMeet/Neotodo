# NeoTodo platform edit rules

## Default work mode: Linux only

Unless the user explicitly asks for a Windows/Android change, modify **Linux
and the shared Linux-first sources only**.

Do **not** edit these during Linux work:

- `windows_app.py`
- `installer.iss`
- `.github/workflows/release.yml`
- `NeoTodo-Android/**` (Gradle project, Java/WebView shell, vendored
  `app/src/main/python`)
- `NeoTodo-Android.apk`

They are synced together in a separate platform-sync step. The Android project
used to live in `android/`; it now lives in `NeoTodo-Android/` and is a one-off
snapshot, not a second trunk.

## Source ownership

| Area | Platform | Rule |
| --- | --- | --- |
| `app.py` outside `run_gtk()` | Shared backend | Linux-first; Windows and Android consume it |
| `app.py` → `run_gtk()` | Linux only | GTK4 / WebKitGTK shell — do not port by hand |
| `startup.py` | Shared backend | Linux-first |
| `web/**` | Shared UI | Linux-first; copied to Android by `NeoTodo-Android/sync-sources.sh` |
| `run.sh`, `io.github.neotodo.desktop` | Linux only | Edit freely |
| `windows_app.py`, `installer.iss` | Windows only | Do not touch during Linux work |
| `NeoTodo-Android/**` | Android only | Do not touch during Linux work |
| `NeoTodo-MacOS/**`, `NeoTodo-iOS/**` | macOS / iOS only | Do not touch during Linux work |

## Code markers

Use these markers when a block is platform-specific:

```python
# [linux]  Linux-only block (GTK/WebKitGTK, desktop entry, native folder picker)
# [shared] Used by every platform (HTTP API, store, web UI)
# [win]    Windows-only, lives in windows_app.py / installer.iss
# [android] Android-only, lives under NeoTodo-Android/
```

`app.py` and `web/` may contain `[shared]` and `[linux]` blocks. Prefer adding
platform branches behind `sys.platform` instead of copying whole files.

## When the user asks to sync a platform

1. Android: `cd NeoTodo-Android && ./sync-sources.sh` so `app.py`, `startup.py`
   and `web/` are copied into `app/src/main/python/` (they are tracked there).
   macOS: `NeoTodo-MacOS/sync-sources.sh`.
2. Review `windows_app.py` / the platform shell for bridge or API changes
   introduced on Linux.
3. Rebuild:
   - Linux: `./run.sh`
   - Android: `NeoTodo-Android/build.sh` (debug) or `build-release.sh` (store AAB)
   - macOS: `NeoTodo-MacOS/build.sh`
   - Windows: see `.github/workflows/release.yml` / `installer.iss`
4. Update `docs/platform-sync.md` and clear the pending list there.

## Never start the Android emulator during Linux work

Do not run `NeoTodo-Android/run-emulator.sh`, `emulator`, `adb` device commands, or Gradle
Android builds while working on Linux. They are only for an explicit Android
test/sync request. This applies to crew agents too; their prompt includes the
same rule.
