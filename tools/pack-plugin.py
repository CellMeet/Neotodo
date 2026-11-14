#!/usr/bin/env python3
"""Package one NeoTodo plugin folder as a community-ready .zip.

Usage:
    python3 tools/pack-plugin.py web/plugins/pindou
    python3 tools/pack-plugin.py community/template --out dist/plugins

The archive keeps manifest.json at its root, which is what
POST /api/plugins/install expects. The command prints a catalog entry with the
sha256 checksum so it can be pasted into community/catalog.json.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,63}$")
SKIP_NAMES = {".DS_Store", "Thumbs.db"}
SKIP_SUFFIXES = {".zip", ".pyc"}


def fail(message: str) -> None:
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(1)


def validate_plugin(folder: Path) -> dict:
    manifest_path = folder / "manifest.json"
    if not manifest_path.is_file():
        fail(f"{folder} has no manifest.json")
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except Exception as error:
        fail(f"manifest.json is not valid JSON: {error}")
    if not isinstance(manifest, dict):
        fail("manifest.json must contain an object")

    plugin_id = str(manifest.get("id") or "").strip()
    if not ID_RE.fullmatch(plugin_id):
        fail("id must be lowercase letters, numbers and hyphens (2-64 chars)")
    for key in ("name", "version", "entry"):
        if not str(manifest.get(key) or "").strip():
            fail(f"manifest is missing '{key}'")
    entry = str(manifest.get("entry") or "").replace("\\", "/").lstrip("/")
    if ".." in Path(entry).parts or Path(entry).suffix.lower() not in (".html", ".htm"):
        fail("entry must be a relative .html file")
    if not (folder / entry).is_file():
        fail(f"entry file not found: {entry}")

    icon = str(manifest.get("icon") or "").replace("\\", "/").lstrip("/")
    if icon:
        if ".." in Path(icon).parts or not (folder / icon).is_file():
            fail(f"icon file not found: {icon}")
    else:
        print("warning: no icon declared; the community card will use a placeholder", file=sys.stderr)

    if not str(manifest.get("description") or "").strip():
        print("warning: add a description so people know what the plugin does", file=sys.stderr)
    if not str(manifest.get("author") or "").strip():
        print("warning: add an author name", file=sys.stderr)
    return manifest


def archive_files(folder: Path):
    for path in sorted(folder.rglob("*")):
        if not path.is_file():
            continue
        relative = path.relative_to(folder)
        if any(part.startswith(".") for part in relative.parts):
            continue
        if path.name in SKIP_NAMES or path.suffix.lower() in SKIP_SUFFIXES:
            continue
        yield path, relative


def build_archive(folder: Path, output: Path, manifest: dict, force: bool) -> Path:
    plugin_id = manifest["id"]
    version = str(manifest.get("version") or "1.0.0")
    safe_version = re.sub(r"[^0-9A-Za-z._-]+", "-", version).strip("-") or "1.0.0"
    output.mkdir(parents=True, exist_ok=True)
    archive_path = output / f"{plugin_id}-{safe_version}.zip"
    if archive_path.exists() and not force:
        fail(f"{archive_path} already exists; pass --force to overwrite")
    with zipfile.ZipFile(archive_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path, relative in archive_files(folder):
            archive.write(path, relative.as_posix())
    return archive_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Package a NeoTodo plugin for the community catalog.")
    parser.add_argument("folder", nargs="?", default=".", help="plugin folder containing manifest.json")
    parser.add_argument("--out", default="dist/plugins", help="output folder (default: dist/plugins)")
    parser.add_argument("--force", action="store_true", help="overwrite an existing archive")
    parser.add_argument("--no-entry", action="store_true", help="print the archive path only")
    args = parser.parse_args()

    folder = Path(args.folder).expanduser().resolve()
    if not folder.is_dir():
        fail(f"not a folder: {folder}")
    manifest = validate_plugin(folder)
    archive_path = build_archive(folder, Path(args.out).expanduser().resolve(), manifest, args.force)
    digest = hashlib.sha256(archive_path.read_bytes()).hexdigest()

    print(f"archive: {archive_path}")
    print(f"sha256:  {digest}")
    if not args.no_entry:
        entry = {
            "id": manifest["id"],
            "name": manifest.get("name", manifest["id"]),
            "englishName": manifest.get("englishName", ""),
            "version": manifest.get("version", "1.0.0"),
            "description": manifest.get("description", ""),
            "author": manifest.get("author", ""),
            "category": manifest.get("category", "Interface"),
            "icon": manifest.get("icon", ""),
            "download": "https://github.com/OWNER/REPO/releases/download/TAG/FILENAME.zip",
            "sha256": digest,
            "homepage": "",
            "repository": "",
            "license": manifest.get("license", ""),
            "tags": manifest.get("tags", []),
            "featured": False,
            "bundled": False,
            "official": False,
        }
        print("\nPaste this entry into community/catalog.json and replace the download URL:")
        print(json.dumps(entry, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
