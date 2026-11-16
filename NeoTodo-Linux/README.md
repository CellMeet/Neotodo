# NeoTodo — Linux

The Linux version of NeoTodo: a GTK4 / WebKitGTK shell (`app.py`) around the
shared HTML/CSS/JS interface in `web/`, with the local Python backend and store
serving it over `127.0.0.1`.

This folder is the saved Linux build. The project now develops **Linux only**;
Windows, macOS, iOS and Android live in their own folders and are brought up to
date together in a separate pass when that is asked for.

## Run

System packages (Arch):

```sh
sudo pacman -S python-gobject gtk4 webkitgtk-6.0
```

Then:

```sh
./run.sh                 # start the app
./run.sh --new-window    # open another window
```

`run.sh` runs `app.py` from this folder with the system `python3`.

## Contents

| File | What it is |
| --- | --- |
| `app.py` | Backend, HTTP server, store and the GTK4/WebKitGTK window (`run_gtk()`) |
| `startup.py` | Startup helpers shared with the other platforms |
| `web/` | The whole interface: HTML, CSS, JS, fonts, sounds, themes, plugins |
| `run.sh` | Desktop launcher (Linux only) |
| `io.github.neotodo.desktop` | Desktop entry pointing at this folder |
| `icon*.svg/png` | App icons |
| `sync-sources.sh` | Refreshes `app.py`, `startup.py` and `web/` from the repo root |

## Keeping it current

`app.py`, `startup.py` and `web/` are snapshots of the Linux-first tree at the
repo root. Never edit them here and at the root at the same time — land changes
at the root, then refresh this folder:

```sh
cd NeoTodo-Linux
./sync-sources.sh            # current working tree
./sync-sources.sh <commit>   # a committed revision
```
