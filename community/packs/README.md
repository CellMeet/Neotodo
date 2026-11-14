# Theme pack uploads

Drop community theme zips here as `<id>.zip`, then add an entry to
`../themes.json`:

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "version": "1.0.0",
  "author": "Your name",
  "download": "https://raw.githubusercontent.com/CellMeet/Neotodo/main/community/packs/my-theme.zip",
  "preview": "https://raw.githubusercontent.com/CellMeet/Neotodo/main/community/packs/my-theme-preview.svg",
  "tags": ["light", "calm"]
}
```

The zip must contain `theme.json` at its root (or in a single top-level
folder). Keep it under 24 MB. See [`docs/theme-community.md`](../../docs/theme-community.md)
for the full format.
