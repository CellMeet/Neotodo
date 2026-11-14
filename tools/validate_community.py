#!/usr/bin/env python3
"""Validate the community catalog and bundled plugin manifests.

Run this locally before opening a pull request, or let the Plugin Community
GitHub Action run it for you:

    python3 tools/validate_community.py
"""
from __future__ import annotations

import json
import hashlib
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,63}$")
SHA_RE = re.compile(r"^[0-9a-f]{64}$")
CATALOG_PATHS = [ROOT / "community" / "catalog.json", ROOT / "web" / "plugins" / "community-catalog.json"]

errors: list[str] = []
warnings: list[str] = []


def error(message: str) -> None:
    errors.append(message)


def warning(message: str) -> None:
    warnings.append(message)


def http_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in ("https", "http") and bool(parsed.netloc)


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        error(f"{path.relative_to(ROOT)}: {exc}")
        return None


def validate_manifest(path: Path) -> dict | None:
    manifest = load_json(path)
    if not isinstance(manifest, dict):
        error(f"{path.relative_to(ROOT)}: manifest must be an object")
        return None
    folder = path.parent
    plugin_id = str(manifest.get("id") or "")
    if not ID_RE.fullmatch(plugin_id):
        error(f"{path.relative_to(ROOT)}: invalid id {plugin_id!r}")
    entry = str(manifest.get("entry") or "").replace("\\", "/").lstrip("/")
    if not entry or ".." in Path(entry).parts or Path(entry).suffix.lower() not in (".html", ".htm"):
        error(f"{path.relative_to(ROOT)}: entry must be a relative .html file")
    elif not (folder / entry).is_file():
        error(f"{path.relative_to(ROOT)}: entry file is missing: {entry}")
    icon = str(manifest.get("icon") or "").replace("\\", "/").lstrip("/")
    if icon and (".." in Path(icon).parts or not (folder / icon).is_file()):
        error(f"{path.relative_to(ROOT)}: icon file is missing: {icon}")
    for key in ("name", "version"):
        if not str(manifest.get(key) or "").strip():
            error(f"{path.relative_to(ROOT)}: missing {key}")
    return manifest


def validate_catalog(path: Path) -> dict | None:
    catalog = load_json(path)
    if not isinstance(catalog, dict):
        error(f"{path.relative_to(ROOT)}: catalog must be an object")
        return None
    plugins = catalog.get("plugins")
    if not isinstance(plugins, list):
        error(f"{path.relative_to(ROOT)}: plugins must be a list")
        return catalog
    seen: set[str] = set()
    for index, item in enumerate(plugins):
        label = f"{path.relative_to(ROOT)} plugins[{index}]"
        if not isinstance(item, dict):
            error(f"{label}: entry must be an object")
            continue
        plugin_id = str(item.get("id") or "")
        if not ID_RE.fullmatch(plugin_id):
            error(f"{label}: invalid id {plugin_id!r}")
            continue
        if plugin_id in seen:
            error(f"{label}: duplicate id {plugin_id}")
        seen.add(plugin_id)
        for key in ("name", "version", "description", "author", "category"):
            if not str(item.get(key) or "").strip():
                warning(f"{label}: {key} is empty")
        download = str(item.get("download") or "")
        bundled = bool(item.get("bundled"))
        if bundled:
            manifest = ROOT / "web" / "plugins" / plugin_id / "manifest.json"
            if not manifest.is_file():
                error(f"{label}: bundled entry has no web/plugins/{plugin_id}/manifest.json")
        elif not download:
            error(f"{label}: a community entry needs a download URL")
        elif not http_url(download):
            error(f"{label}: download must start with https://")
        sha = str(item.get("sha256") or "").lower()
        if sha and not SHA_RE.fullmatch(sha):
            error(f"{label}: sha256 must be 64 lowercase hex characters")
        if sha and download.startswith("https://raw.githubusercontent.com/CellMeet/Neotodo/"):
            for branch in ("main/", "master/"):
                prefix = f"https://raw.githubusercontent.com/CellMeet/Neotodo/{branch}"
                if not download.startswith(prefix):
                    continue
                local = ROOT / download[len(prefix):]
                if not local.is_file():
                    error(f"{label}: local archive is missing: {local.relative_to(ROOT)}")
                else:
                    actual = hashlib.sha256(local.read_bytes()).hexdigest()
                    if actual != sha:
                        error(f"{label}: sha256 does not match {local.relative_to(ROOT)}")
                break
        for key in ("homepage", "repository"):
            value = str(item.get(key) or "")
            if value and not http_url(value):
                error(f"{label}: {key} must be an http(s) URL")
    return catalog


def main() -> int:
    manifests: dict[str, dict] = {}
    for path in sorted((ROOT / "web" / "plugins").glob("*/manifest.json")):
        manifest = validate_manifest(path)
        if manifest is not None:
            manifests[str(manifest.get("id"))] = manifest
    for path in sorted((ROOT / "community" / "plugins").glob("*/manifest.json")):
        manifest = validate_manifest(path)
        if manifest is not None:
            manifests[str(manifest.get("id"))] = manifest

    catalogs = []
    for path in CATALOG_PATHS:
        if not path.is_file():
            error(f"{path.relative_to(ROOT)}: missing catalog")
            continue
        catalogs.append((path, validate_catalog(path)))

    for plugin_id, manifest in manifests.items():
        if not any(
            isinstance(catalog, dict)
            and any(isinstance(item, dict) and item.get("id") == plugin_id for item in catalog.get("plugins", []))
            for _, catalog in catalogs
        ):
            warning(f"plugin '{plugin_id}' is not listed in the community catalog")

    if len(catalogs) == 2:
        first_ids = {item.get("id") for item in catalogs[0][1].get("plugins", []) if isinstance(item, dict)}
        second_ids = {item.get("id") for item in catalogs[1][1].get("plugins", []) if isinstance(item, dict)}
        if first_ids != second_ids:
            error(
                "community/catalog.json and web/plugins/community-catalog.json must list the same ids "
                f"(diff: {sorted(first_ids ^ second_ids)})"
            )

    for message in warnings:
        print(f"warning: {message}")
    for message in errors:
        print(f"error: {message}", file=sys.stderr)
    if errors:
        print(f"\n{len(errors)} error(s)", file=sys.stderr)
        return 1
    print(f"OK · {len(manifests)} plugin manifest(s), {len(catalogs)} catalog(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
