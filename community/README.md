# NeoTodo Plugin Community

NeoTodo is built from small pieces. The community catalog is how those pieces
travel between people: one person builds a mini-app, packages it as a `.zip`,
and everyone else can install it from **Settings → Community** without waiting
for a new NeoTodo release.

This folder is the public index and the contribution guide. The app ships a
copy of `catalog.json` for offline use and refreshes from the repository copy
when it can. The first downloadable example is
[`Hello Paper`](template/), a tiny counter you can install and then copy as
your own starter.

## For people using NeoTodo

1. Open **Settings → Community**.
2. Search by name, author or tag, then press **Install**.
3. The plugin downloads into your NeoTodo data folder and gets a small button
   in the left tool rail.
4. Turn it off, change its settings, or remove it from **Settings → Plugins**.
5. No account is needed. The notebook itself never uploads your tasks or notes.

You can also install a plugin you received as a file with **Install from .zip**
in the Community tab.

The downloaded files live here:

| Platform | Folder |
| --- | --- |
| Linux | `~/.local/share/neotodo/plugins/<plugin-id>/` |
| Windows | `%APPDATA%\NeoTodo\plugins\<plugin-id>\` |
| Android | app-private `files/.local/share/neotodo/plugins/<plugin-id>/` |

## For plugin authors

A plugin is an ordinary folder. Copy [`template/`](template/) to start, or make
your own:

```
my-plugin/
  manifest.json      required metadata
  index.html         required entry page
  plugin.css         your styles
  plugin.js          your logic
  icon.svg           rail icon (recommended)
```

### manifest.json

```json
{
  "id": "my-plugin",
  "name": "我的插件",
  "englishName": "My Plugin",
  "version": "1.0.0",
  "description": "One calm sentence about what it does.",
  "icon": "icon.svg",
  "entry": "index.html",
  "author": "Your Name",
  "category": "interface",
  "homepage": "https://github.com/you/my-plugin",
  "repository": "https://github.com/you/my-plugin",
  "license": "MIT",
  "tags": ["search", "paper"],
  "settings": [
    {
      "id": "sparkle",
      "label": "Sparkle",
      "detail": "Show a small star when something happens.",
      "type": "toggle",
      "default": true
    }
  ]
}
```

| Field | Notes |
| --- | --- |
| `id` | Lowercase letters, numbers and hyphens, 2–64 characters. Must be unique and must not match a built-in id. |
| `name` | Shown on the card and in Settings. |
| `englishName` | Optional secondary label. |
| `version` | Plain numbers such as `1.0.0`; used to offer updates. |
| `description` | Keep it short and concrete. |
| `icon` | Relative path. A square SVG works best; PNG/JPG are accepted. |
| `entry` | Relative `.html` file. |
| `author` | Your name or team. |
| `category` | `interface`, `play`, `productivity`, `utility`, `ai`… |
| `license` | Optional, but strongly recommended. |
| `tags` | Up to 6 short words for search. |
| `settings` | Only `toggle` settings are rendered by the host today. |

### The host contract

The plugin runs inside an iframe. It receives:

```js
window.addEventListener("message", (event) => {
  if (event.data?.type === "neotodo-theme") {
    document.documentElement.dataset.dark = String(event.data.dark);
  }
  if (event.data?.type === "neotodo-plugin-settings") {
    // event.data.settings mirrors the toggles saved in Settings
  }
});
```

It may close itself with:

```js
window.parent.postMessage({ type: "neotodo-plugin-close" }, window.location.origin);
```

Keep the interface responsive, respect light/dark themes, and never touch files
you did not create. Plugins currently run with the same origin as NeoTodo, so
only install plugins you trust and keep your source public when possible.

### Package it

```sh
python3 tools/pack-plugin.py path/to/my-plugin
```

The tool validates the manifest, writes `dist/plugins/my-plugin-1.0.0.zip`
with `manifest.json` at the archive root, and prints:

- the archive path
- its `sha256`
- a ready-to-paste catalog entry

### Publish the archive

Host the `.zip` somewhere stable and public. The simplest option is a GitHub
release on your plugin repository:

```
https://github.com/you/my-plugin/releases/download/v1.0.0/my-plugin-1.0.0.zip
```

### Add it to the catalog

Open a pull request that appends one object to the `plugins` array in
[`catalog.json`](catalog.json). The same object goes into
`web/plugins/community-catalog.json` so the offline copy stays complete.

```json
{
  "id": "my-plugin",
  "name": "我的插件",
  "englishName": "My Plugin",
  "version": "1.0.0",
  "description": "One calm sentence about what it does.",
  "author": "Your Name",
  "category": "Interface",
  "icon": "https://raw.githubusercontent.com/you/my-plugin/main/icon.svg",
  "download": "https://github.com/you/my-plugin/releases/download/v1.0.0/my-plugin-1.0.0.zip",
  "sha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  "homepage": "https://github.com/you/my-plugin",
  "repository": "https://github.com/you/my-plugin",
  "license": "MIT",
  "tags": ["paper", "search"],
  "featured": false,
  "bundled": false,
  "official": false
}
```

For catalog entries, `icon` should be an absolute `https://` URL unless the
plugin is `"bundled": true`. `download` and `sha256` are required for community
entries; the checksum is verified before the archive is unpacked.

Not comfortable with JSON? Open a
[plugin submission issue](https://github.com/CellMeet/Neotodo/issues/new?template=plugin-submission.yml)
and a maintainer will prepare the catalog entry.

## Review and security

Every catalog pull request is reviewed before it reaches users. The review
checks:

- the manifest and archive layout
- no network calls that collect personal data
- no destructive filesystem access
- a readable source repository and a license
- the checksum, version and changelog

Plugins are still code. They run in an iframe but currently share NeoTodo's
origin, so the catalog is curated rather than a free-for-all. If you find a
problem, email **cellmeet@163.com** or open a private security advisory.

## Maintenance

Run the validator before changing the catalog or any bundled manifest:

```sh
python3 tools/validate_community.py
```

It checks manifest fields, archive references, download URLs, checksums,
duplicate ids and that both catalog copies list the same plugins.
