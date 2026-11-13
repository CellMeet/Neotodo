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

- **Captain · Architect** is the todo-level planning agent.
- **Crew · Executor** is opened by selecting a subtask. It runs the local `opencode` CLI with `--auto`, so it can edit the project and run commands to complete that subtask.
- Each todo and subtask keeps its own thread in `agents.json` next to `NeoTodo.json`; subtask executors also keep their own OpenCode session.
- Executions are queued: if another crew agent is working, a new request waits and starts automatically when the current one finishes. The backend holds an atomic lock, so two agents never edit the project simultaneously.
- The terminal follows the selected todo/subtask; drag its top border to resize it. The model/provider label sits next to the current task name.
- Chat agents need `DEEPSEEK_API_KEY` (or `OPENAI_API_KEY`). Execution needs `opencode` on `PATH`; `NEOTODO_AGENT_CWD` can point at the project root (defaults to the app source directory).
- Optional knobs: `NEOTODO_AGENT_MODEL`, `NEOTODO_AGENT_BASE_URL`.

The console renders Markdown, so plans, code snippets, and checklists stay readable. Selecting another subtask switches the lower terminal to that crew member's own thread.

## Keyboard

- `Tab` — toggle the category spine
- `j` / `k` — scroll tasks
- `q` — close the current panel
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
