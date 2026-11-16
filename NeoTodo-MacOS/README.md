# NeoTodo — macOS

The macOS build of NeoTodo: a native **PyObjC + WKWebView** shell around the
same Python backend and `web/` workspace used by the Linux build. Nothing in
the notebook is reimplemented — the store, HTTP API, notes, AI console, themes,
plugins and sounds are the Linux-first sources, snapshotted here.

> **Linux stays the source of truth.** This folder is a one-time macOS build.
> Later work lands at the repo root and is copied here only when another macOS
> pass is requested. See [Keeping it current](#keeping-it-current).

## What is here

| File | What it is |
| --- | --- |
| `main.py` | Entry point: starts the backend and hands it to the macOS shell |
| `macos_shell.py` | `NSWindow` + `WKWebView`, the `neotodo.local` bridge, native pickers, menus, quit cleanup |
| `app.py`, `startup.py`, `web/` | Snapshot of the Linux-first sources (`sync-sources.sh`) |
| `run-macos.sh` | Run from source on this Mac |
| `sync-sources.sh` | Refresh the snapshot from the repo root or a git ref |
| `setup.py` | py2app configuration |
| `build.sh` | Build, copy resources, generate the icon, sign, notarize or package for the App Store |
| `entitlements.plist` | Hardened-runtime entitlements (direct download) |
| `entitlements-appstore.plist` | App Sandbox entitlements (Mac App Store variant) |
| `requirements.txt` | PyObjC + py2app |
| `icon-master.png` | 1024 px master used to generate `NeoTodo.icns` |

Snapshot source: repo commit `1a3faf0` (2026-11-16). Data lives in
`~/Library/Application Support/NeoTodo/` (`NeoTodo.json`, `agents.json`,
`pictures/`, `music/`, `sounds/`, `plugins/`).

## Requirements

- macOS 11 Big Sur or newer (Apple silicon or Intel)
- Python 3.10+ with `pip`. The python.org **universal2** installer or a
  Homebrew `python@3.12` both work; the python.org build is the easiest to sign.
- Xcode Command Line Tools (`xcode-select --install`) for `codesign`, `sips`,
  `iconutil` and `notarytool`

Use a virtual environment so the shell and py2app share one interpreter:

```sh
python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install -r requirements.txt
```

## Run from source

```sh
./run-macos.sh              # native window
./run-macos.sh --serve      # headless, open the printed 127.0.0.1 URL in a browser
```

The first launch creates `~/Library/Application Support/NeoTodo/`. The window
stays transparent until the page reports `app-painted`, so no white WebKit
flash is shown. Logs go to stderr; a bundled app writes
`~/Library/Logs/NeoTodo.log`.

### What the native shell covers

- **One `NSWindow` per notebook.** The window is resizable, minimizable,
  zoomable, full-screen capable, and remembers its frame.
- **The `neotodo.local` bridge.** `/open` creates a real detached note/AI
  window, `/home` docks it back, `/new-window` opens another notebook, and
  `/window/move` starts a native window drag on a detached panel.
- **Native pickers.** `choose_project_folder` and `choose_wallpaper_file` open
  `NSOpenPanel` on the main thread and answer the same backend callbacks the
  GTK shell uses.
- **JS dialogs.** Plugin `window.confirm` / `alert` / `prompt` are shown as
  native alerts instead of being silently dropped.
- **External links.** Links in notes and plugin pages open in the default
  browser; the WKWebView never leaves the local workspace.
- **Quit.** Cmd+Q, the app's own quit button, SIGTERM and closing the last
  notebook window all stop forks and the agent store before exit.
- **Renderer crash.** A terminated WebContent process reloads instead of
  leaving a blank window.

### macOS differences from the Linux shell

- The window uses the standard macOS title bar (traffic lights, drag, resize)
  instead of the borderless GTK window. Panels and the sheet remain unchanged.
- A detached panel is moved by its title bar. Its custom grabber still docks
  the panel home; the bridge can only start a drag while the mouse is down.
- The `view/move` long-press is cosmetic on macOS; native dragging is used.

## Build a `.app`

```sh
./build.sh
open dist/NeoTodo.app
```

This produces an **ad-hoc signed** app that runs on this Mac only. To change the
version or bundle id:

```sh
NEOTODO_VERSION=0.0.2 NEOTODO_BUILD=42 \
NEOTODO_BUNDLE_ID=com.example.neotodo ./build.sh
```

`--sync` refreshes `app.py`, `startup.py` and `web/` from the repo root first.

## Distribute outside the App Store (recommended today)

This keeps every feature — the OpenCode agent, arbitrary project folders and
community plugin/theme installs. You need an Apple Developer Program membership
and a **Developer ID Application** certificate in your login keychain.

1. Create a notarization profile once (an app-specific password from
   [appleid.apple.com](https://appleid.apple.com) is required):

   ```sh
   xcrun notarytool store-credentials "neotodo" \
     --apple-id "you@example.com" \
     --team-id "TEAMID" \
     --password "app-specific-password"
   ```

2. Build, sign with the hardened runtime, notarize and staple:

   ```sh
   NEOTODO_SIGN_IDENTITY="Developer ID Application: Your Name (TEAMID)" \
   NEOTODO_NOTARY_PROFILE="neotodo" \
   ./build.sh
   ```

3. Optionally wrap it in a DMG:

   ```sh
   hdiutil create -volname "NeoTodo" -srcfolder dist/NeoTodo.app \
     -ov -format UDZO dist/NeoTodo-0.0.1.dmg
   codesign --force --timestamp --sign "Developer ID Application: Your Name (TEAMID)" \
     dist/NeoTodo-0.0.1.dmg
   xcrun notarytool submit dist/NeoTodo-0.0.1.dmg \
     --keychain-profile "neotodo" --wait
   xcrun stapler staple dist/NeoTodo-0.0.1.dmg
   ```

4. Verify:

   ```sh
   spctl --assess --type execute --verbose=4 dist/NeoTodo.app
   codesign -dv --verbose=4 dist/NeoTodo.app
   ```

The hardened-runtime entitlements in `entitlements.plist` allow the embedded
Python runtime (`allow-jit`, `allow-unsigned-executable-memory`,
`disable-library-validation`) and the loopback HTTP server. Do **not** add
`get-task-allow`; that is for debug builds only.

## Publish on the Mac App Store

This is the full path, plus the parts of NeoTodo that must change first. Read
both halves before paying for anything.

### First: what App Review will object to

| NeoTodo feature | Store problem | Work needed |
| --- | --- | --- |
| **Crew agent** runs the local `opencode` CLI, which edits files and can run commands | Guideline **2.5.2** forbids downloading or executing code that changes app functionality; the sandbox also cannot spawn a user-installed CLI | Remove the agent from the store build, or route it to a **remote** LLM API you control. A separate direct-download build can keep it |
| **Community plugins and themes** install `.zip` files containing JavaScript | 2.5.2 again — downloaded code changes the app | Ship a fixed catalog inside the bundle, or disable installs in the store build |
| **Project folders** are read and written across launches | App Sandbox cannot use an absolute path after relaunch | Store **security-scoped bookmarks** when the folder is picked, resolve them at launch, call `startAccessingSecurityScopedResource()` around reads/writes, and release it |
| **Wallpaper** is read from anywhere on disk | Same sandbox rule | Same bookmark handling; keep the file reference, not a copy, or copy it into the container |
| **Local HTTP server** on `127.0.0.1` | Allowed with `com.apple.security.network.server`, but reviewers ask why | Add review notes; or replace it with a `WKURLSchemeHandler` (no TCP port) |
| **Embedded Python** | Allowed, but every Mach-O must be signed | `build.sh` signs `.so`/`.dylib` first; also sign `Python.framework` and use a universal2 interpreter |
| **AI data leaves the machine** | App Privacy label must match reality | Declare “Data Not Collected” only if the store build has no remote AI; otherwise declare User Content / Usage Data |

The practical route is a **notes-first store build**: notes, tasks, postcards,
themes, wallpaper, sounds and local achievements; no agent CLI and no
third-party plugin/theme installation. Everything else stays in the Developer ID
build.

### Step by step

1. **Join the Apple Developer Program** (US$99/year) and accept the agreements
   in [App Store Connect](https://appstoreconnect.apple.com).

2. **Register the bundle id.** Certificates, Identifiers & Profiles → Identifiers
   → **App IDs** → macOS → explicit id, for example
   `com.cellmeet.neotodo`. Enable **App Sandbox** and **File Access → User
   Selected File → Read/Write** if you use those entitlements.

3. **Create the certificates.** In Xcode → Settings → Accounts → Manage
   Certificates, or in the developer portal:
   - **Apple Distribution** (signs the app)
   - **Mac Installer Distribution** / *3rd Party Mac Developer Installer*
     (signs the `.pkg`)

4. **Create a Mac App Store provisioning profile** for that App ID with the
   distribution certificate, and download it. `build.sh` embeds it when you set
   `NEOTODO_PROVISION_PROFILE=/path/to/profile.provisionprofile`.

5. **Create the app record** in App Store Connect → My Apps → **+** → New App:
   platform **macOS**, the bundle id above, a SKU (any internal string), the
   name **NeoTodo**, primary language and the **Productivity** category. Check
   that the name is still available; App Store names are global.

6. **Build the sandboxed app and installer package** on a Mac with the
   distribution certificates installed:

   ```sh
   NEOTODO_VERSION=0.0.1 NEOTODO_BUILD=1 \
   NEOTODO_APPSTORE_IDENTITY="Apple Distribution: Your Name (TEAMID)" \
   NEOTODO_INSTALLER_IDENTITY="3rd Party Mac Developer Installer: Your Name (TEAMID)" \
   NEOTODO_PROVISION_PROFILE="$HOME/Downloads/NeoTodo_Mac_App_Store.provisionprofile" \
   ./build.sh --appstore
   ```

   This leaves `dist/NeoTodo-0.0.1.pkg` signed with the sandbox entitlements in
   `entitlements-appstore.plist`. Verify before uploading:

   ```sh
   codesign -d --entitlements :- dist/NeoTodo.app
   codesign --verify --deep --strict --verbose=2 dist/NeoTodo.app
   pkgutil --check-signature dist/NeoTodo-0.0.1.pkg
   ```

7. **Upload** with **Transporter** (free Mac App Store app) or the command line.
   Create an App Store Connect API key under Users and Access → Integrations:

   ```sh
   xcrun altool --upload-app -f dist/NeoTodo-0.0.1.pkg -t macos \
     --apiKey "$ASC_KEY_ID" --apiIssuer "$ASC_ISSUER_ID"
   ```

   The build appears under App Store Connect → your app → TestFlight after
   processing (usually 5–30 minutes).

8. **TestFlight** (optional but useful): add yourself as an internal tester,
   install the build on a clean Mac, and check the reveal, pickers, data folder
   and quitting.

9. **Prepare the store page**: screenshots at 1280×800, 1440×900, 2560×1600 and
   2880×1800 (at least one size, all four for the best layout), a 512×512 icon,
   description, keywords, support URL, marketing URL and a **privacy policy
   URL** (required). Answer **App Privacy** honestly and set the age rating.
   For export compliance, the app uses only standard TLS through Python’s
   `ssl` module, so `ITSAppUsesNonExemptEncryption` is already `false` in the
   plist.

10. **Submit for review** with notes such as:

    > NeoTodo is a local-first notebook. It serves its interface from
    > 127.0.0.1 and never contacts a remote server in this build. Tasks, notes
    > and settings are stored only in the app container. No account is needed.

    If the build still contains the agent or community installs, explain them
    precisely and expect a 2.5.2 rejection; the notes-first variant avoids that
    conversation.

11. **Wait for review**, then release manually or automatically. Typical macOS
    review time is 24–72 hours.

12. **After release**, keep the Developer ID build for power users and the Mac
    App Store build for the sandboxed notes experience. Both use the same
    version numbers, but do not share a bundle id — for example
    `com.cellmeet.neotodo` (store) and `com.cellmeet.neotodo.direct` (Developer
    ID).

### Store checklist

- [ ] Developer Program + agreements
- [ ] Bundle id, App ID capabilities and provisioning profile
- [ ] Apple Distribution + Mac Installer Distribution certificates
- [ ] Sandbox + bookmark support in the build
- [ ] Agent CLI and community installs removed from the store build
- [ ] Every embedded Mach-O signed; `codesign --verify` clean
- [ ] `dist/NeoTodo-x.y.z.pkg` uploaded to App Store Connect
- [ ] Screenshots, icon, privacy policy, privacy label, age rating
- [ ] Review notes about localhost and local-only data
- [ ] TestFlight pass on a clean Mac

## Known limitations of this snapshot

- The snapshot does not include later Linux changes; refresh it with
  `./sync-sources.sh <commit>` when a new macOS pass is requested.
- The App Store sandbox/bookmark work described above is **not implemented**.
  The direct-download build is the fully featured macOS build today.
- When no project folder is linked, the crew's fallback working folder is the
  writable notebook data folder (`~/Library/Application Support/NeoTodo`), not
  the read-only app bundle.
- `window/move` for a detached panel depends on a live mouse event; use the
  native title bar or the grabber’s click-to-dock behaviour instead.
- py2app builds are not universal by default; build with a universal2 Python if
  you need both architectures in one bundle (`lipo -info` the interpreter).

## Keeping it current

`app.py`, `startup.py` and `web/` are snapshots of the Linux-first tree at the
repo root. Never edit them here and at the root at the same time — land changes
at the root, then refresh this folder:

```sh
cd NeoTodo-MacOS
./sync-sources.sh              # current working tree
./sync-sources.sh 1a3faf0      # a committed revision / tag
./run-macos.sh                 # smoke test
./build.sh --sync              # rebuild
```

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `ModuleNotFoundError: AppKit` | `python3 -m pip install -r requirements.txt`; make sure the same `python3` runs `main.py` |
| Blank window, no page | Check `~/Library/Logs/NeoTodo.log`; confirm port 47321 is free or that the fallback port was logged |
| App is killed on launch after signing | Re-sign with `--options runtime` and the entitlements; do not add `get-task-allow` |
| `notarytool` says “Invalid” | Inspect with `xcrun notarytool log <submission-id>`; usually an unsigned `.so` or a missing hardened runtime |
| Fonts look wrong | The web fonts are bundled in `web/fonts/`; make sure `web/` was copied into `Contents/Resources/web` |
| Agent buttons do nothing | The mac shell does not bundle `opencode`; install it on `PATH` like on Linux |

## File map

```
NeoTodo-MacOS/
├── main.py
├── macos_shell.py
├── app.py                  # snapshot (root)
├── startup.py              # snapshot (root)
├── web/                    # snapshot (root)
├── run-macos.sh
├── sync-sources.sh
├── setup.py
├── build.sh
├── requirements.txt
├── entitlements.plist
├── entitlements-appstore.plist
├── icon-master.png
├── icon.svg
├── icon.png
└── README.md
```
