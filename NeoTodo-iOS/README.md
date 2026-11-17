# NeoTodo — iOS

The iPhone and iPad build of NeoTodo: a native **Swift + WKWebView** shell around
the same Python backend and `web/` workspace the Linux build uses. Nothing in
the notebook is reimplemented — categories, todos, subtasks, notes, themes,
plugins, sounds and the archive are the Linux-first sources, snapshotted here.

> **Snapshot, not a second trunk.** This folder is a one-time iOS build.
> Future work lands at the repo root and is copied here only when another iOS
> pass is requested. See [Keeping it current](#keeping-it-current).

## What is here

| File | What it is |
| --- | --- |
| `app/` | Snapshot of the Python backend (`app.py`, `startup.py`, `web/`) plus `ios_server.py`, the iOS entry point |
| `NeoTodo/PythonRuntime.m` | Starts the embedded CPython interpreter and hands the GIL to the backend threads |
| `NeoTodo/WorkspaceViewController.swift` | `WKWebView`, the JS bridge, long-press menus, JS dialogs and the photo/file pickers |
| `NeoTodo/DetachedSheetController.swift` | A detached note/AI panel presented as an iOS sheet |
| `NeoTodo/Bridge.swift` | The injected touch-shell bridge, the page configuration and the long-press script |
| `NeoTodo/LoadingView.swift` | The paper-coloured startup screen |
| `NeoTodo/AppDelegate.swift` | Window, audio session, launch |
| `NeoTodo/Resources/` | `Info.plist`, `PrivacyInfo.xcprivacy`, app icon and launch colour |
| `project.yml` | XcodeGen project spec (targets, settings, the Python build phase) |
| `Scripts/fetch-python.sh` | Downloads `Python.xcframework` (CPython for iOS + stdlib) |
| `Scripts/generate-project.sh` | Generates `NeoTodo.xcodeproj` from `project.yml` |
| `Scripts/build.sh` | `xcodebuild` Debug build for a simulator or device |
| `Scripts/archive.sh` | Release archive + App Store `.ipa` export |
| `sync-sources.sh` | Refreshes `app.py`, `startup.py` and `web/` from the repo root |
| `store/` | App Store listing, privacy policy and the publish checklist |

Snapshot source: repo commit `2e47f6a` (2026-11-17) for `app.py`, `startup.py`
and `web/`. Data lives in
`Library/Application Support/.local/share/neotodo/NeoTodo.json` inside the app
container (`HOME` points there, so the shared backend keeps its Linux path).

## Requirements

- A Mac with **Xcode 15 or newer** (full Xcode, not just Command Line Tools)
- **XcodeGen**: `brew install xcodegen`
- Optionally an Apple Developer Program membership (US$99/year) for a device,
  TestFlight and the App Store — a free Apple ID works on the simulator

You cannot build this folder on Linux: iOS apps need Xcode and the iOS SDK.

## Build and run

```sh
cd NeoTodo-iOS

./Scripts/fetch-python.sh          # ~40 MB, once per machine
./Scripts/generate-project.sh      # writes NeoTodo.xcodeproj
open NeoTodo.xcodeproj             # pick your team, pick a simulator, Run

# or from the terminal:
./Scripts/build.sh
DEST="platform=iOS,name=My iPhone" ./Scripts/build.sh
```

`fetch-python.sh` accepts a Python minor version (`./Scripts/fetch-python.sh
3.14`) and downloads the matching [BeeWare
python-apple-support](https://github.com/beeware/python-apple-support) build.
Set `FORCE=1` to replace an existing copy.

The first run creates the data folder, starts the backend on
`127.0.0.1:47321` (an ephemeral port if that one is taken) and loads the
workspace from it.

## How it fits together

```text
NeoTodo.app/
  NeoTodo                 Swift + Objective-C shell, embeds Python.framework
  app/                    app.py, startup.py, web/, ios_server.py  (folder copy)
  python/                 CPython stdlib + lib-dynload, installed by the build phase
  Frameworks/Python.framework
```

1. `AppDelegate` shows a paper loading screen and calls `NeoTodoStartPython()`
   on the main thread.
2. `PythonRuntime.m` sets `PYTHONHOME`, `PYTHONPATH` and `HOME`, configures
   `PyConfig` (UTF-8, no bytecode, system logger) and starts CPython.
3. It imports `ios_server`, registers `native_open_url`, and calls `start()`,
   which builds `app.Store` and `app.start_server` — the same HTTP API the
   desktop shells use.
4. The interpreter's GIL is released, so the server thread keeps running while
   UIKit owns the main thread.
5. `WorkspaceViewController` loads `http://127.0.0.1:<port>/` in a `WKWebView`.
   The page reports its first painted frame (`app-painted` → bridge `ready`) and
   the loading screen fades out.

## iOS adaptations

- **The touch bridge.** `web/app.js` already branches on `window.NeoTodoAndroid`
  for touch devices: edge rails instead of hover, `open`/`home` for detached
  panels, `ready` for the reveal. The iOS shell injects the same object as
  `window.NeoTodoIOS` **and** `window.NeoTodoAndroid`, so the shared page needs
  no platform fork.
- **Right-click = long press.** A held finger (no movement) dispatches the same
  `contextmenu` event the desktop receives, so the app's own card, subtask and
  fan menus work. Drag gestures cancel the press.
- **Detached note/AI panels** open as a native page sheet; the page's grabber
  (`home`) or a swipe down closes it.
- **Pictures and files.** A tap on a file input opens the system photo picker
  for images/videos and the Files picker for everything else, so wallpapers,
  note images and plugin audio still work.
- **External links** open in Safari; the workspace never navigates away.
- **Sounds** play with the ring/silent switch off the table (`.playback` audio
  session, mixed with other audio), matching the desktop keys and completion
  sounds.
- **Full screen.** The status bar is hidden and the layout uses the standard
  safe-area insets; all orientations except upside-down are supported on
  iPhone, all four on iPad.
- **JS dialogs** from plugin frames appear as native alerts.

### What does not exist on iOS

- **Folder actions** (`open project folder`, `open sounds folder`, …) answer
  with a short message: iOS has no desktop file manager. Data folders are still
  created inside the app container.
- **The AI terminal** drives the local `opencode` CLI. iOS cannot run a
  user-installed CLI, so the AI panel reports the failure instead of working.
  The rest of the workspace does not depend on it.
- **Fork windows** (`/api/fork-app`) need a second process; forking a subtask
  into a new category still works, opening it as a separate window does not.
- **The "quit" action** is a no-op — iOS owns the app lifecycle.

## Publish on the App Store

The full checklist — bundle id, certificates, App Store Connect record,
screenshots, privacy label, export compliance and review notes — lives in
[`store/app-store-publish.md`](store/app-store-publish.md) (Chinese, step by
step). Short version:

```sh
TEAM_ID=ABCDE12345 ./Scripts/archive.sh     # -> build/export/NeoTodo.ipa
```

then upload with **Transporter** (or `xcrun altool --upload-app`), answer the
App Store Connect questions, and submit for review.

Two things App Review will ask about, and the answers:

| Question | Answer |
| --- | --- |
| Why does the app open a local HTTP server? | The interface is served to the app's own `WKWebView` from `127.0.0.1`; no traffic leaves the device. `NSAllowsLocalNetworking` is the only ATS exception. |
| Why is a Python interpreter inside the app? | It runs the bundled, signed backend. No executable code is downloaded or installed at runtime. Community themes and plugins are data/JS interpreted by WebKit, never native code. |

## File map

```text
NeoTodo-iOS/
├── app/                          Python backend snapshot + ios_server.py
├── NeoTodo/
│   ├── AppDelegate.swift
│   ├── Bridge.swift
│   ├── DetachedSheetController.swift
│   ├── LoadingView.swift
│   ├── WorkspaceViewController.swift
│   ├── PythonRuntime.h/.m
│   ├── NeoTodo-Bridging-Header.h
│   └── Resources/                Info.plist, privacy manifest, assets
├── Scripts/
│   ├── fetch-python.sh
│   ├── generate-project.sh
│   ├── build.sh
│   └── archive.sh
├── store/                        App Store paperwork
├── sync-sources.sh
└── project.yml
```

## Keeping it current

`app.py`, `startup.py` and `web/` are snapshots of the Linux-first tree at the
repo root. Never edit them here and at the root at the same time — land changes
at the root, then refresh this folder:

```sh
cd NeoTodo-iOS
./sync-sources.sh              # current working tree
./sync-sources.sh 1a3faf0      # a committed revision / tag
./Scripts/build.sh             # rebuild
```

`app/ios_server.py` is iOS-only and is not overwritten by the sync.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Python.xcframework is missing` at build time | `./Scripts/fetch-python.sh` |
| `xcodegen: command not found` | `brew install xcodegen` |
| "The Python runtime is missing from the app bundle" | The **Process Python libraries** build phase did not run. Check Build Phases, then clean the build folder (⇧⌘K) |
| Blank page after the loading screen | Check the Xcode console for `[NeoTodo]` lines; confirm the backend port. The loading screen keeps the reason when startup fails |
| Signing error for `Python.framework` | Signing & Capabilities → set your team for the app target; the framework is signed with the same identity by the build phase |
| Long press does not open a menu | Hold still for ~0.5 s; moving the finger is read as a drag |
| Keyboard covers the note field | Tap the field again after the keyboard settles; WKWebView scrolls the caret into view |
| Wallpaper picker shows Files, not Photos | The wallpaper flow uses the photo picker only for `accept="image/*"` inputs; pick the image through Photos there |
