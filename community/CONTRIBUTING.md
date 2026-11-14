# Contributing a plugin

Thank you for making NeoTodo a little more useful. This checklist keeps the
community shelf calm and predictable.

## Before you open a pull request

- [ ] `python3 tools/validate_community.py` passes.
- [ ] `python3 tools/pack-plugin.py path/to/plugin --force` builds a `.zip` with
      `manifest.json` at the root.
- [ ] The plugin has its own `id`, a version, a description, an author and a
      license.
- [ ] It looks right in both light and dark postcards.
- [ ] It works at small widths (the tool panel is often narrow).
- [ ] It does not read, upload or delete anything outside its own folder.
- [ ] Remote assets are served over `https://`.
- [ ] The download URL is stable and public.
- [ ] `sha256` matches the archive.
- [ ] The same catalog object is added to both:
      - `community/catalog.json`
      - `web/plugins/community-catalog.json`

## What to send

1. A link to the source repository.
2. A link to the release archive.
3. A short changelog for the first version.
4. The catalog object printed by `tools/pack-plugin.py`.

If you prefer not to edit JSON, open the **Plugin submission** issue template.
A maintainer will turn it into a catalog entry.

## Versioning

Use `MAJOR.MINOR.PATCH`:

- **PATCH** — a fix that does not change the interface.
- **MINOR** — a new setting, screen or small feature.
- **MAJOR** — a change that breaks saved plugin data or the host contract.

Bump `version` in `manifest.json` and the catalog entry together. The app shows
an **Update** button when the catalog version is newer than the installed one.

## Review outcomes

A maintainer may ask for changes, or may decline a plugin that:

- duplicates a built-in feature without adding something new
- hides what it does, obfuscates its source, or includes tracking
- ships large binaries with no clear purpose
- breaks the light/dark theme or the iframe layout
- uses an id that belongs to another plugin

Be kind. Small, quiet tools are the point.
