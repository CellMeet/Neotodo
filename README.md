# NeoTodo

A quiet Linux desktop home for weekly focus and postcard memories.

NeoTodo pairs a single active todo with a paper-like workspace, weekly postcard archives, a floating Doing card, notes, and a small set of theme-aware tools. It is built with Python, GTK4, and WebKitGTK, and the interface is hand-written HTML, CSS, and JavaScript.

## Features

- One active todo at a time, with subtasks, completion trophies, and a weekly archive.
- Twelve postcard themes split into Light and Dark modes, each with its own palette and artwork.
- A floating **Doing** card that uses the current postcard's artwork as its background.
- Notes with Paper and Glass materials, adjustable blur, and a custom note background.
- Weekly archive postcards with per-theme colour accents and readable dark-mode text.
- Typewriter-style interaction sounds for creating, completing, and browsing tasks.
- This week's archive card is created automatically when a week ends.
- Settings for fonts, note material, clock, time cost, and title sizing.

## Download

| Platform | Package |
| --- | --- |
| **Windows x64** | [NeoTodo-0.0.1-Windows-x64-setup.exe](https://github.com/CellMeet/Neotodo/releases/latest/download/NeoTodo-0.0.1-Windows-x64-setup.exe) |
| **Linux x86_64** | [NeoTodo-0.0.1-Linux-x86_64.tar.gz](https://github.com/CellMeet/Neotodo/releases/latest/download/NeoTodo-0.0.1-Linux-x86_64.tar.gz) |
| **macOS** | Planned |
| **Android** | Planned |
| **iOS** | Planned |

The Windows build uses Python + Qt WebEngine and ships with the same HTML/CSS/JS interface as the Linux GTK4 build. The Linux package is a source package; it needs GTK4, PyGObject, and WebKitGTK installed.

## Preview

The app runs as a borderless maximised desktop window. The interface adapts to the selected postcard theme, including light and dark palettes.

## Requirements

### Linux

- Linux with a GTK4 desktop session
- Python 3
- PyGObject (`python-gobject`)
- WebKitGTK 6 (`webkit2gtk-4.1` / `webkitgtk-6.0`, depending on distribution)
- `xdg-open` for opening project and email links

### Windows

- Windows 10/11 x64
- The installer includes the Python runtime and Qt WebEngine.

## Run

### Linux

```sh
./run.sh
```

Or preview only the web layer in a browser:

```sh
python3 app.py --serve
```

### Windows (development)

```powershell
python -m pip install PySide6
python windows_app.py
```

### Data

- Linux: `~/.local/share/neotodo/NeoTodo.json`
- Windows: `%APPDATA%\NeoTodo\NeoTodo.json`
- macOS (planned): `~/Library/Application Support/NeoTodo/NeoTodo.json`

## Build releases

The GitHub Actions workflow `.github/workflows/release.yml` builds:

- `NeoTodo-0.0.1-Windows-x64-setup.exe` with PyInstaller + Inno Setup
- `NeoTodo-0.0.1-Linux-x86_64.tar.gz` as the Linux source package

Push a version tag to publish a release:

```sh
git tag v0.0.1
git push origin v0.0.1
```

## AI terminal

Click the terminal icon in the lower-left tool rail to turn the note half into a Captain & Crew console.

- **Captain · Architect** is the todo-level planning agent. It runs through OpenCode's read-only `plan` agent.
- **Crew · Executor** is opened by selecting a subtask. It runs the local `opencode` CLI with `--auto`, so it can edit the project and run commands to complete that subtask.
- Each todo and subtask keeps its own thread in `agents.json` next to `NeoTodo.json`; every agent also keeps its own OpenCode session.
- Executions are queued: if another crew agent is working, a new request waits and starts automatically when the current one finishes. The backend holds an atomic lock, so two agents never edit the project simultaneously.
- The terminal follows the selected todo/subtask; drag its top border to resize it. The header shows the provider in dark type and the task title in a softer gray.
- Press `Ctrl+P` or use the model picker under the input to switch between the models reported by `opencode models`. The choice is remembered per todo/subtask.
- The mode picker beside the model opens a small menu with **Chat** (OpenCode's read-only plan agent) and **Build** (the `--auto` agent that can edit the project). The choice is remembered per todo/subtask.
- The `+` button attaches up to five files (10 MB each). Attachments are handed to OpenCode with `--file` for that turn, so the agent can read them.
- Swipe left from the right edge of the AI pane to slide out the floating **files card**. It lists every file added to the thread. Drag a cached file row, or drag files from the desktop, onto the input to attach them.
- The footer always shows session tokens with context usage and cost, for example `176.0K (17%) · $10.74`. Tool calls appear as a compact process log above each answer.
- The OpenCode terminal uses its own neutral light/dark palette rather than the postcard theme, with a purple session bar and the Copilot-style input row.
- Opening the AI terminal closes the note card. The note card can be reopened while chatting: it becomes a 50/50 split pane beside the AI console. Drag the divider to change the widths. Long-press the AI or note header, then drop it on the left or right half to swap the split sides.
- The Doing card only reacts near the lower half of the current-task area, so it no longer pops up from casual pointer movement near the top.

The console renders Markdown, so plans, code snippets, and checklists stay readable. Selecting another subtask switches the lower terminal to that crew member's own thread.

## Keyboard

- `Tab` — toggle the category spine
- `j` / `k` — scroll tasks
- `q` — close the current panel
- `Ctrl+P` — cycle the AI terminal model
- `Enter` / `Shift+Enter` — send / newline in the AI terminal
- `Enter` — confirm a new todo after the confirmation dialog

## Roadmap

- [x] Windows x64
- [x] Linux
- [ ] macOS
- [ ] Android
- [ ] iOS

## Project

https://github.com/CellMeet/Neotodo

## Version

0.0.1

## ☕ Buy me a coffee

If NeoTodo helps you, you can support its development with a small donation. Thank you.

<img src="web/donate-alipay-qr.png" width="180" alt="Alipay donation QR">

## Thanks

Thanks for using NeoTodo.
