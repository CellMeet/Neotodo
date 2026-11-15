# Bundled theme packs

These folders are the offline storefront for **Settings → Community → 主题**.

- Each folder is a complete theme pack (`theme.json` + optional assets).
- `community-catalog.json` is the offline fallback for the remote catalog at
  `community/themes.json`.
- Installing a bundled pack copies its folder into the user's data directory
  (`neotodo/theme-packs/<id>/`), so it can be updated or removed without touching
  the app bundle.

Included packs:

| Pack | What it shows |
| --- | --- |
| `paper-moon` | A light palette with a paper-and-moon card, plus note and AI themes. |
| `ember-terminal` | A dark terminal palette with foley overrides, two achievement stickers and a dark note/AI theme. |
| `linen-garden` | A light garden palette, a pack wallpaper and matching note/AI themes. |
| `tokyo-night` | Tokyo Night: deep navy paper, neon blue/purple ink and a matched night chrome. |
| `catppuccin-mocha` | Catppuccin Mocha: soft pastel purple and sky blue on a dark base. |
| `nord` | Nord: slate blue paper with frost-blue accents. |
| `gruvbox-dark` | Gruvbox Dark: warm charcoal, mustard yellow and retro green. |
| `solarized-light` | Solarized Light: warm paper, muted teal ink and ocean blue accents. |

Each bundled pack also declares a `chrome` block (`baseline`, `row`, `submit`,
`highlight`). Applying a theme writes those colours into the normal baseline
and highlight files, so one click switches the wallpaper, the underline under
task text, the add / complete accent and the selected-cell wash together.

A pack may also include a `"note"` palette (`paper`, `ink`, `muted`, `rule`,
`accent`, `accent2`, `handle`) and an `"ai"` palette (`bg`, `ink`, `soft`,
`line`, `accent`, `notice`, `handle`). The app copies them into their own
folders at install time:

- `<data>/note-theme/<id>.json` → **Settings → Theme → Note theme**
- `<data>/ai-theme/<id>.json` → **Settings → Theme → AI theme**

The NeoTodo app theme itself lives in `<data>/theme-packs/`. The three shelves
are independent: applying an app theme never changes the note or AI theme.

See [`docs/theme-community.md`](../../docs/theme-community.md) for the full
`theme.json` format and publishing flow.
