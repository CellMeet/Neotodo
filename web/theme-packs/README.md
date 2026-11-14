# Bundled theme packs

These folders are the offline storefront for **Settings → 主题社区**.

- Each folder is a complete theme pack (`theme.json` + optional assets).
- `community-catalog.json` is the offline fallback for the remote catalog at
  `community/themes.json`.
- Installing a bundled pack copies its folder into the user's data directory
  (`neotodo/theme-packs/<id>/`), so it can be updated or removed without touching
  the app bundle.

Included packs:

| Pack | What it shows |
| --- | --- |
| `paper-moon` | A light palette with a paper-and-moon card. |
| `ember-terminal` | A dark terminal palette with foley overrides and two achievement stickers. |
| `linen-garden` | A light garden palette plus a pack wallpaper. |

See [`docs/theme-community.md`](../../docs/theme-community.md) for the full
`theme.json` format and publishing flow.
