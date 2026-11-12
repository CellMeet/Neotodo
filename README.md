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

## Preview

The app runs as a borderless maximised desktop window. The interface adapts to the selected postcard theme, including light and dark palettes.

## Requirements

- Linux with a GTK4 desktop session
- Python 3
- PyGObject (`python-gobject`)
- WebKitGTK 6 (`webkit2gtk-4.1` / `webkitgtk-6.0`, depending on distribution)
- `xdg-open` for opening project and email links

## Run

```sh
./run.sh
```

Or preview only the web layer in a browser:

```sh
python3 app.py --serve
```

The app stores its data in `~/.local/share/neotodo/NeoTodo.json`.

## Keyboard

- `Tab` — toggle the category spine
- `j` / `k` — scroll tasks
- `q` — close the current panel
- `Enter` — confirm a new todo after the confirmation dialog

## Project

https://github.com/CellMeet/Neotodo

## Version

0.0.1

## Buy me a coffee

If NeoTodo helps you, you can support its development with a small donation. Thank you.

![Alipay donation QR](web/donate-alipay.png)

## Thanks

Thanks for using NeoTodo.
