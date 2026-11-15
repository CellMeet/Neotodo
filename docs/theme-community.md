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
| Palette | `theme.json` → `theme` | Paper, paper2, ink, muted, accent, accent2, border, stamp, optional line/rule, glow, motif, quote. |
| Chrome | `theme.json` → `chrome` | Optional colours for the page dividers (`baseline`), the add / complete accent (`submit`) and the selected-cell wash (`highlight`). The finished-subtasks and Doing card hairlines follow the page line, so `row` / `row2` are still accepted for older packs but no longer paint a private card colour. Applied by writing the normal `page-line.json` / `baseline-rule.json` files and the highlight setting. |
| Note theme | `theme.json` → `note` | Optional notebook palette: `paper`, `ink`, `muted`, `rule`, `accent`, `accent2`, `handle`. Saved by the app as `<data>/note-theme/<id>.json` and listed under **Note** in the **Settings → Theme** menu. |
| AI theme | `theme.json` → `ai` | Optional console palette: `bg`, `ink`, `soft`, `line`, `accent`, `notice`, `handle`. Saved as `<data>/ai-theme/<id>.json` and listed under **AI** in the **Settings → Theme** menu. |
| Wallpaper | `theme.json` → `wallpaper` | Optional image inside the pack (`jpg`, `png`, `webp`, `gif`, `avif`, `svg`). |
| Foley | `theme.json` → `sounds` | Optional per-cue audio files (`wav`, `mp3`, `ogg`, `flac`, `m4a`). |
| Icons | `theme.json` → `icons` | Optional `completed` / `focus` achievement pictures. |
| Card art | `preview.svg` / any image | Shown in the community shelf. |
| Cover icon | `icon.svg` / any image | Optional square mark for future shelves and listings. |

## Three independent theme shelves

NeoTodo stores an app theme, a note theme and an AI theme in three separate
folders. They never read each other's files:

```
<data>/theme-packs/<pack-id>/theme.json   app paper, wallpaper, sounds, icons
<data>/note-theme/<id>.json               notebook palette (paper, ink, rules)
<data>/ai-theme/<id>.json                 AI console palette (bg, ink, lines)
```

- Applying a NeoTodo theme only changes the app paper. It never rewrites
  `settings.note_theme` or `settings.ai_theme`.
- Installing a pack with a `note` / `ai` palette drops a copy of that palette
  into the matching pane folder; removing the pack deletes only those copies.
- You can add your own palette by dropping a JSON file into the folder:
  ```json
  {
    "id": "my-paper",
    "name": "My paper",
    "palette": { "paper": "#fffdf6", "ink": "#2a2620", "rule": "#d9d2c2" }
  }
  ```
  Note palettes need `paper` and `ink`; AI palettes need `bg` and `ink`.
  Files marked `"source": "user"` are never deleted by a pack uninstall.

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
    "line": "#4ee0a8",
    "rule": "#294238",
    "lineAlpha": 0.42,
    "ruleAlpha": 0.28,
    "glow": "rgba(78,224,168,.2)",
    "motif": "▮",
    "quote": "Small commits. Clean exit."
  },
  "chrome": {
    "baseline": "#294238",
    "row": "#294238",
    "submit": "#4ee0a8",
    "highlight": "#4ee0a8"
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
from those so a tiny palette-only pack still works. `line` and `rule` are
optional underline colours; when omitted the app keeps its subtle ink-derived
rules. Optional `lineAlpha` / `ruleAlpha` values (0.03–1) control their
strength. All asset paths are relative to the pack folder; absolute paths and
`..` are rejected.

Supported sound keys: `type`, `enter`, `drawerOpen`, `drawerClose`,
`waterFlow`, `trickle`, `windScroll`, `train`, `paperTear`, `steamHiss`.

Supported icon keys: `completed`, `focus`.

The optional `chrome` block turns a theme into a complete room, not just a
paper colour. `baseline` sets the page dividers, `submit` the colour of the
add / complete actions and `highlight` the wash behind the selected cell. The
finished-subtasks card and the Doing card share that page line, so `row` /
`row2` remain readable for older packs but no longer introduce a second card
colour. Applying the theme writes these into the reader's normal
`page-line.json`, `baseline-rule.json` and highlight setting, so they can
still be adjusted afterwards in **Settings → Theme**.

## Install and apply

1. **Settings → Community → 主题 (Themes) → Import .zip** installs the pack into:
   - Linux: `~/.local/share/neotodo/theme-packs/<id>/`
   - Windows: `%APPDATA%\NeoTodo\theme-packs\<id>\`
   - macOS: `~/Library/Application Support/NeoTodo/theme-packs/<id>/`
2. The shelf lists installed packs. **Apply** switches the postcard palette,
   uses the pack wallpaper when present, applies its chrome colours (underline,
   add accent, selection wash), swaps its foley samples and loads its
   achievement stickers. It leaves the notebook and console themes untouched.
   Inside **Settings → Theme**, the **Theme** row is the selector itself, with
   the current accent dot and a small arrow. Its menu uses the same
   names-and-checkmarks list for every palette; at the top, **Note theme ›** and
   **AI theme ›** rows switch the whole Theme row to that palette (and back to
   **Theme ›**). Choosing a theme applies it and leaves the row in that mode.
   **Manage** (app) and **Folder** (note/AI) sit beside the menu.
3. **Remove** deletes only the pack folder and the pane palettes it contributed.
   Tasks, notes and other artwork stay.

The catalog install button has two paths:

- `bundled: true` copies a pack from `web/theme-packs/<id>/` (works offline).
- otherwise it downloads `download` after validating the optional `sha256`.

The remote catalog URL defaults to:

```
https://raw.githubusercontent.com/CellMeet/Neotodo/main/community/themes.json
```

Set `NEOTODO_THEME_CATALOG` to a local JSON file (or `off`) while developing.

## Export and upload

**Settings → Community → 主题 (Themes) → Export .zip** writes a pack to `theme-exports/` with:

- the current palette,
- the current wallpaper when it comes from a theme pack or the old pictures
  folder (a file picked from elsewhere is only read in place, so it is not
  packed),
- the active theme-pack foley overrides,
- the current Completed trophy / Pomodoro tomato sticker images,
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
