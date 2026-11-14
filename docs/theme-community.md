# NeoTodo Theme Community

NeoTodo's theme community is **file-first**. A theme is a small zip containing a
palette plus optional wallpaper, foley sounds and achievement stickers. There is
no account, database or upload server in the core app: people install a zip,
export their own look, and share the file (or open a pull request against the
community catalog).

That keeps the notebook local-first and makes the community useful offline. The
app already reads the same catalog format from `web/theme-packs/community-catalog.json`
when GitHub cannot be reached.

## What a pack can change

| Part | File | Notes |
| --- | --- | --- |
| Palette | `theme.json` → `theme` | Paper, paper2, ink, muted, accent, accent2, border, stamp, glow, motif, quote. |
| Wallpaper | `theme.json` → `wallpaper` | Optional image inside the pack (`jpg`, `png`, `webp`, `gif`, `avif`, `svg`). |
| Foley | `theme.json` → `sounds` | Optional per-cue audio files (`wav`, `mp3`, `ogg`, `flac`, `m4a`). |
| Icons | `theme.json` → `icons` | Optional `completed` / `focus` achievement pictures. |
| Card art | `preview.svg` / any image | Shown in the community shelf. |
| Cover icon | `icon.svg` / any image | Optional square mark for future shelves and listings. |

## Pack layout

```
my-theme/
  theme.json
  preview.svg
  wallpaper.jpg        optional
  sounds/
    type.wav           optional
    enter.wav
  icons/
    completed.jpg      optional
    focus.jpg
```

`theme.json`:

```json
{
  "id": "ember-terminal",
  "name": "余烬终端",
  "englishName": "Ember Terminal",
  "version": "1.0.0",
  "description": "A short line for the community card.",
  "author": "Your name",
  "license": "CC BY 4.0",
  "tags": ["dark", "terminal", "sound"],
  "theme": {
    "paper": "#0f1418",
    "paper2": "#171f24",
    "ink": "#d9f2e8",
    "muted": "#87a89b",
    "accent": "#4ee0a8",
    "accent2": "#ffb454",
    "border": "#294238",
    "stamp": "#4ee0a8",
    "glow": "rgba(78,224,168,.2)",
    "motif": "▮",
    "quote": "Small commits. Clean exit."
  },
  "preview": "preview.svg",
  "icon": "icon.svg",
  "wallpaper": "wallpaper.svg",
  "sounds": {
    "type": "sounds/type.wav",
    "enter": "sounds/enter.wav",
    "paperTear": "sounds/paper-tear.wav"
  },
  "icons": {
    "completed": "icons/completed.jpg",
    "focus": "icons/focus.jpg"
  }
}
```

Only `paper` and `ink` are strictly required. The app derives missing colours
from those so a tiny palette-only pack still works. All asset paths are relative
to the pack folder; absolute paths and `..` are rejected.

Supported sound keys: `type`, `enter`, `drawerOpen`, `drawerClose`,
`waterFlow`, `trickle`, `windScroll`, `train`, `paperTear`, `steamHiss`.

Supported icon keys: `completed`, `focus`.

## Install and apply

1. **Settings → 主题社区 → Import .zip** installs the pack into:
   - Linux: `~/.local/share/neotodo/theme-packs/<id>/`
   - Windows: `%APPDATA%\NeoTodo\theme-packs\<id>\`
   - macOS: `~/Library/Application Support/NeoTodo/theme-packs/<id>/`
2. The shelf lists installed packs. **Apply** switches the postcard palette,
   uses the pack wallpaper when present, swaps its foley samples and loads its
   achievement stickers.
3. **Remove** deletes only the pack folder. Tasks, notes and other artwork stay.

The catalog install button has two paths:

- `bundled: true` copies a pack from `web/theme-packs/<id>/` (works offline).
- otherwise it downloads `download` after validating the optional `sha256`.

The remote catalog URL defaults to:

```
https://raw.githubusercontent.com/CellMeet/Neotodo/main/community/themes.json
```

Set `NEOTODO_THEME_CATALOG` to a local JSON file (or `off`) while developing.

## Export and upload

**Settings → 主题社区 → Export .zip** writes a pack to `theme-exports/` with:

- the current palette,
- the current static wallpaper if it is your own picture,
- the active theme-pack foley overrides,
- the current Completed / Pomodoro sticker images,
- a generated `preview.svg` and `README.txt`.

To publish:

1. Zip the pack folder (or use the exported zip).
2. Open a pull request that adds the zip to `community/packs/<id>.zip`.
3. Add an entry to `community/themes.json`:

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "version": "1.0.0",
  "author": "Your name",
  "download": "https://raw.githubusercontent.com/CellMeet/Neotodo/main/community/packs/my-theme.zip",
  "sha256": "optional-but-recommended",
  "preview": "https://raw.githubusercontent.com/CellMeet/Neotodo/main/community/packs/my-theme-preview.svg",
  "tags": ["dark", "calm"]
}
```

4. Keep the zip under 24 MB. The app caps archives at 24 MB, 400 files and
   64 MB unpacked.

## Security and moderation

The local app already enforces:

- catalog URLs must be `http(s)` and bounded to 1.5 MB,
- theme ids match `^[a-z0-9][a-z0-9-]{1,63}$`,
- zip entries cannot be absolute paths, parent paths or symlinks,
- archive size, file count and unpacked size are capped,
- only known sound/icon keys and real files inside the pack are accepted.

A future hosted community should add:

- a signed manifest (publisher key or GitHub Actions checksum),
- server-side malware scanning for uploaded archives,
- moderation and report flows,
- screenshots, changelogs and version pinning,
- an optional CDN for wallpapers so packs stay small.

The current pull-request flow is deliberate: the repository is the moderation
queue, and every change is reviewable in git.
