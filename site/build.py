#!/usr/bin/env python3
"""Build the deployable NeoTodo download + plugin site.

The site is a plain folder of static files. This script does the one job that
cannot be done by hand every release:

  1. reads ``site/downloads.json`` and copies any release files found in
     ``site/releases/`` into ``dist/files/`` with a fresh size + sha256;
  2. packages every bundled plugin from ``web/plugins/`` into a community-ready
     .zip, puts it in ``dist/plugins/files/`` and rewrites the catalog entries
     with the archive URL + checksum;
  3. copies the page, icons and catalogs into ``dist/`` so ``deploy.sh`` can
     rsync one folder to the server.

Usage:
    python3 site/build.py --check
    python3 site/build.py --base-url https://dl.example.com --releases dist
    python3 -m http.server -d site/dist 8080

``--base-url`` is the public address of the server. Without it the build still
works for local preview, but download URLs stay root-relative and the app's
plugin installer (which requires absolute https URLs) will not accept them.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import sys
import zipfile
from datetime import date
from pathlib import Path

SITE = Path(__file__).resolve().parent
ROOT = SITE.parent
WEB = ROOT / "web"
COMMUNITY = ROOT / "community"
DEFAULT_RELEASES = SITE / "releases"
DEFAULT_OUT = SITE / "dist"

STATIC_FILES = ("index.html", "style.css", "site.js")
STATIC_DIRS = ("assets",)
SKIP_NAMES = {".DS_Store", "Thumbs.db"}
SKIP_SUFFIXES = {".zip", ".pyc"}
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,63}$")
SHA_RE = re.compile(r"^[0-9a-f]{64}$")
VERSION_RE = re.compile(r"^[0-9A-Za-z._+-]{1,32}$")
STATUSES = {"available", "build", "planned"}

errors: list[str] = []
warnings: list[str] = []


def error(message: str) -> None:
    errors.append(message)
    print(f"error: {message}", file=sys.stderr)


def warn(message: str) -> None:
    warnings.append(message)
    print(f"warning: {message}", file=sys.stderr)


def fail(message: str) -> None:
    error(message)
    raise SystemExit(1)


def read_json(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 128), b""):
            digest.update(chunk)
    return digest.hexdigest()


def safe_version(value) -> str:
    text = re.sub(r"[^0-9A-Za-z._-]+", "-", str(value or "")).strip("-")
    return text or "1.0.0"


def join_url(base: str, path: str) -> str:
    """Join the public base URL and a path, keeping a usable root-relative URL."""
    path = path.lstrip("/")
    if not base:
        return "/" + path
    return base.rstrip("/") + "/" + path


def archive_files(folder: Path):
    for path in sorted(folder.rglob("*")):
        if not path.is_file():
            continue
        relative = path.relative_to(folder)
        if any(part.startswith(".") for part in relative.parts):
            continue
        if path.name in SKIP_NAMES or path.suffix.lower() in SKIP_SUFFIXES:
            continue
        if "__pycache__" in relative.parts:
            continue
        yield path, relative


def read_manifest(folder: Path) -> dict:
    manifest_path = folder / "manifest.json"
    if not manifest_path.is_file():
        raise ValueError(f"{folder} has no manifest.json")
    manifest = read_json(manifest_path)
    if not isinstance(manifest, dict):
        raise ValueError(f"{folder}/manifest.json must be an object")
    plugin_id = str(manifest.get("id") or "").strip()
    if not ID_RE.fullmatch(plugin_id):
        raise ValueError(f"{folder}: invalid plugin id {plugin_id!r}")
    entry = str(manifest.get("entry") or "").replace("\\", "/").lstrip("/")
    if not entry or not (folder / entry).is_file():
        raise ValueError(f"{folder}: entry file is missing")
    return manifest


def build_plugin_archive(folder: Path, manifest: dict, output: Path) -> Path:
    plugin_id = manifest["id"]
    version = safe_version(manifest.get("version"))
    output.mkdir(parents=True, exist_ok=True)
    archive_path = output / f"{plugin_id}-{version}.zip"
    with zipfile.ZipFile(archive_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path, relative in archive_files(folder):
            archive.write(path, relative.as_posix())
    return archive_path


def check_archive(path: Path, expected_id: str) -> None:
    if path.stat().st_size > 24_000_000:
        raise ValueError(f"{path.name}: larger than the app's 24 MB plugin limit")
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        if "manifest.json" not in names:
            raise ValueError(f"{path.name}: manifest.json must sit at the archive root")
        unpacked = sum(info.file_size for info in archive.infolist())
        if unpacked > 48_000_000:
            raise ValueError(f"{path.name}: unpacks to more than the app's 48 MB limit")
        manifest = json.loads(archive.read("manifest.json").decode("utf-8"))
    if str(manifest.get("id") or "") != expected_id:
        raise ValueError(f"{path.name}: archive id does not match {expected_id}")


def copy_static(out: Path) -> None:
    for name in STATIC_FILES:
        source = SITE / name
        if not source.is_file():
            fail(f"missing site file: {source.relative_to(ROOT)}")
        shutil.copy2(source, out / name)
    for name in STATIC_DIRS:
        source = SITE / name
        if source.is_dir():
            shutil.copytree(source, out / name, dirs_exist_ok=True)
    icons = SITE / "plugins" / "icons"
    if icons.is_dir():
        shutil.copytree(icons, out / "plugins" / "icons", dirs_exist_ok=True)


# ------------------------------------------------------------------ downloads


def release_index(releases: Path) -> dict[str, Path]:
    """Map file name -> path for every file the owner dropped in site/releases."""
    index: dict[str, Path] = {}
    if not releases.is_dir():
        return index
    for path in sorted(releases.rglob("*")):
        if path.is_file() and not path.name.startswith("."):
            index.setdefault(path.name, path)
    return index


def apply_release_files(manifest: dict, releases: Path, out: Path, base_url: str) -> int:
    files = release_index(releases)
    copied = 0
    for platform in manifest.get("platforms") or []:
        for artifact in platform.get("artifacts") or []:
            name = str(artifact.get("file") or "").strip()
            if not name or Path(name).name != name:
                continue
            source = files.get(name)
            if source is None:
                continue
            destination = out / "files" / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)
            artifact["size"] = destination.stat().st_size
            artifact["sha256"] = sha256_file(destination)
            artifact["url"] = join_url(base_url, f"files/{name}")
            artifact["source"] = "server"
            copied += 1
    return copied


# -------------------------------------------------------------------- catalog


def icon_paths(entry: dict, manifest: dict | None, folder: Path | None) -> Path | None:
    """Return the icon file that should be published for this catalog entry."""
    candidates = []
    if manifest:
        candidates.append(str(manifest.get("icon") or ""))
    candidates.append(str(entry.get("icon") or ""))
    for candidate in candidates:
        candidate = candidate.replace("\\", "/")
        if "://" in candidate:
            # Remote icons are not downloaded at build time; a copy in the
            # template folder is published instead when one exists.
            candidate = candidate.rsplit("/", 1)[-1]
        candidate = candidate.lstrip("/")
        if not candidate or ".." in Path(candidate).parts:
            continue
        if folder and (folder / candidate).is_file():
            return folder / candidate
        if (COMMUNITY / "template" / candidate).is_file():
            return COMMUNITY / "template" / candidate
    return None


def build_catalog(base_url: str, out: Path) -> tuple[int, int]:
    source = COMMUNITY / "catalog.json"
    if not source.is_file():
        fail("community/catalog.json is missing")
    catalog = read_json(source)
    plugins = catalog.get("plugins")
    if not isinstance(plugins, list):
        fail("community/catalog.json must contain a plugins list")

    files_out = out / "plugins" / "files"
    icons_out = out / "plugins" / "icons"
    files_out.mkdir(parents=True, exist_ok=True)
    icons_out.mkdir(parents=True, exist_ok=True)

    packaged = 0
    remote = 0
    for entry in plugins:
        plugin_id = str(entry.get("id") or "")
        if not ID_RE.fullmatch(plugin_id):
            error(f"catalog entry has an invalid id: {plugin_id!r}")
            continue

        folder = WEB / "plugins" / plugin_id
        manifest = None
        if folder.is_dir() and (folder / "manifest.json").is_file():
            try:
                manifest = read_manifest(folder)
            except ValueError as problem:
                error(str(problem))
                continue

        archive_local = COMMUNITY / "plugins" / f"{plugin_id}-{safe_version(entry.get('version'))}.zip"
        archive = None
        if manifest is not None:
            try:
                archive = build_plugin_archive(folder, manifest, files_out)
                entry["version"] = str(manifest.get("version") or entry.get("version") or "1.0.0")
                check_archive(archive, plugin_id)
            except Exception as problem:  # noqa: BLE001 - report and keep going
                error(f"{plugin_id}: {problem}")
                archive = None
        elif archive_local.is_file():
            archive = files_out / archive_local.name
            shutil.copy2(archive_local, archive)
            try:
                check_archive(archive, plugin_id)
            except ValueError as problem:
                error(f"{plugin_id}: {problem}")
                archive = None

        if archive is not None:
            digest = sha256_file(archive)
            entry["download"] = join_url(base_url, f"plugins/files/{archive.name}")
            entry["sha256"] = digest
            packaged += 1
        elif entry.get("download"):
            remote += 1

        icon = icon_paths(entry, manifest, folder if manifest else None)
        if icon is not None:
            extension = icon.suffix.lower() or ".svg"
            published = icons_out / f"{plugin_id}{extension}"
            shutil.copy2(icon, published)
            entry["icon"] = join_url(base_url, f"plugins/icons/{published.name}")

    catalog["updated"] = date.today().isoformat()
    if base_url:
        catalog["homepage"] = base_url + "/"
    write_json(out / "plugins" / "catalog.json", catalog)
    return packaged, remote


# --------------------------------------------------------------------- check


def check_manifest(path: Path) -> dict:
    if not path.is_file():
        fail(f"missing {path.relative_to(ROOT)}")
    try:
        manifest = read_json(path)
    except json.JSONDecodeError as problem:
        fail(f"{path.relative_to(ROOT)} is not valid JSON: {problem}")
        return {}
    if manifest.get("schema") != 1:
        error("downloads.json: schema must be 1")
    app = manifest.get("app")
    if not isinstance(app, dict):
        fail("downloads.json: app object is missing")
        return manifest
    version = str(app.get("version") or "")
    if not VERSION_RE.fullmatch(version):
        error(f"downloads.json: app.version {version!r} is not a plain version")
    for key in ("homepage", "releases"):
        if not re.match(r"^https?://", str(app.get(key) or "")):
            error(f"downloads.json: app.{key} must be an absolute URL")

    platforms = manifest.get("platforms")
    if not isinstance(platforms, list) or not platforms:
        fail("downloads.json: platforms must be a non-empty list")
        return manifest
    seen = set()
    for platform in platforms:
        platform_id = str(platform.get("id") or "")
        if not platform_id or platform_id in seen:
            error(f"downloads.json: duplicate or empty platform id {platform_id!r}")
        seen.add(platform_id)
        if not str(platform.get("name") or "").strip():
            error(f"downloads.json: platform {platform_id} has no name")
        if platform.get("status") not in STATUSES:
            error(f"downloads.json: platform {platform_id} has an unknown status")
        for artifact in platform.get("artifacts") or []:
            url = str(artifact.get("url") or "")
            if url and not re.match(r"^https?://", url):
                error(f"downloads.json: {platform_id} artifact URL must be absolute: {url}")
            name = str(artifact.get("file") or "")
            if name and (name in (".", "..") or "/" in name or "\\" in name):
                error(f"downloads.json: {platform_id} artifact file must be a plain file name: {name!r}")
            digest = str(artifact.get("sha256") or "")
            if digest and not SHA_RE.fullmatch(digest):
                error(f"downloads.json: {platform_id} artifact sha256 must be 64 lowercase hex characters")
    return manifest


def check_catalog(path: Path) -> dict:
    if not path.is_file():
        fail(f"missing {path.relative_to(ROOT)}")
    try:
        catalog = read_json(path)
    except json.JSONDecodeError as problem:
        fail(f"{path.relative_to(ROOT)} is not valid JSON: {problem}")
        return {}
    plugins = catalog.get("plugins")
    if not isinstance(plugins, list):
        fail("plugins/catalog.json: plugins must be a list")
        return catalog
    seen = set()
    icons = SITE / "plugins" / "icons"
    for entry in plugins:
        plugin_id = str(entry.get("id") or "")
        if not ID_RE.fullmatch(plugin_id):
            error(f"catalog: invalid plugin id {plugin_id!r}")
            continue
        if plugin_id in seen:
            error(f"catalog: duplicate plugin id {plugin_id}")
        seen.add(plugin_id)
        for key in ("name", "version", "description", "author"):
            if not str(entry.get(key) or "").strip():
                error(f"catalog: {plugin_id} is missing {key}")
        download = str(entry.get("download") or "")
        digest = str(entry.get("sha256") or "").strip().lower()
        if download:
            if not re.match(r"^https?://", download):
                error(f"catalog: {plugin_id} download must be an absolute https URL")
            if not SHA_RE.fullmatch(digest):
                error(f"catalog: {plugin_id} needs a 64-character sha256")
        elif not entry.get("bundled"):
            error(f"catalog: {plugin_id} is not bundled and has no download URL")
        icon = str(entry.get("icon") or "")
        if icon and "://" not in icon:
            extension = Path(icon.split("?")[0]).suffix.lower() or ".svg"
            if not (icons / f"{plugin_id}{extension}").is_file():
                error(f"catalog: missing site/plugins/icons/{plugin_id}{extension}")
    return catalog


def check_site(report: bool = True) -> None:
    for name in STATIC_FILES:
        path = SITE / name
        if not path.is_file() or path.stat().st_size < 500:
            error(f"site/{name} is missing or too small")
    for name in ("assets/icon.svg", "nginx/neotodo-downloads.conf", "deploy.sh"):
        if not (SITE / name).is_file():
            error(f"site/{name} is missing")

    script = (SITE / "site.js").read_text(encoding="utf-8") if (SITE / "site.js").is_file() else ""
    for needle in ("downloads.json", "plugins/catalog.json", "NEOTODO_PLUGIN_CATALOG"):
        if needle not in script:
            error(f"site.js no longer mentions {needle}")

    page = (SITE / "index.html").read_text(encoding="utf-8") if (SITE / "index.html").is_file() else ""
    for needle in ("data-download-grid", "data-plugin-grid", "data-copy-env", "style.css", "site.js"):
        if needle not in page:
            error(f"index.html is missing {needle}")

    nginx = SITE / "nginx" / "neotodo-downloads.conf"
    if nginx.is_file():
        config = nginx.read_text(encoding="utf-8")
        for needle in ("server_name", "gzip on", "/plugins/files/", "Access-Control-Allow-Origin"):
            if needle not in config:
                error(f"nginx config is missing {needle}")

    manifest = check_manifest(SITE / "downloads.json")
    catalog = check_catalog(SITE / "plugins" / "catalog.json")

    source_catalog = COMMUNITY / "catalog.json"
    if source_catalog.is_file():
        try:
            source_ids = {entry.get("id") for entry in read_json(source_catalog).get("plugins") or []}
            site_ids = {entry.get("id") for entry in (catalog.get("plugins") or [])}
            if source_ids != site_ids:
                warn(
                    "site/plugins/catalog.json is out of date with community/catalog.json; "
                    "the deployed build always refreshes it, this copy is only for preview"
                )
        except Exception as problem:  # noqa: BLE001 - a broken source catalog is not this file's job
            warn(f"could not compare community/catalog.json: {problem}")

    if report:
        print(
            "OK · "
            f"{len(manifest.get('platforms') or [])} platform(s), "
            f"{len(catalog.get('plugins') or [])} plugin(s), "
            f"{len(errors)} error(s), {len(warnings)} warning(s)"
        )


# ---------------------------------------------------------------------- build


def build(base_url: str, releases: Path, out: Path, with_plugins: bool) -> None:
    base_url = base_url.strip().rstrip("/")
    if base_url and not re.match(r"^https?://", base_url):
        fail("--base-url must start with http:// or https://")
    if base_url.startswith("http://"):
        warn("use https:// for --base-url: the plugin installer only accepts https downloads")
    if SITE.is_relative_to(out):
        fail("--out must not be site/ or one of its parents: the build clears the output folder first")
    if releases.is_relative_to(out):
        fail("--releases must live outside the output folder")

    check_site(report=False)
    if errors:
        raise SystemExit("Refusing to build while the checks above are failing")

    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    copy_static(out)

    manifest = read_json(SITE / "downloads.json")
    copied = apply_release_files(manifest, releases, out, base_url)
    write_json(out / "downloads.json", manifest)

    packaged = remote = 0
    if with_plugins:
        packaged, remote = build_catalog(base_url, out)
    else:
        shutil.copytree(SITE / "plugins", out / "plugins", dirs_exist_ok=True)

    if errors:
        raise SystemExit("Build finished with errors")

    total = sum(path.stat().st_size for path in out.rglob("*") if path.is_file())
    print(f"built:   {out}")
    print(f"base:    {base_url or '(root-relative preview — pass --base-url before deploying)'}")
    print(f"files:   {copied} release file(s) copied")
    print(f"plugins: {packaged} archive(s) packaged, {remote} remote entr(ies) kept")
    print(f"size:    {total / 1024 / 1024:.1f} MB")
    if not base_url:
        print(f"next:    python3 -m http.server -d {out} 8080")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the NeoTodo download + plugin site.")
    parser.add_argument("--check", action="store_true", help="validate the committed site files only")
    parser.add_argument("--base-url", default="", help="public URL of the server, e.g. https://dl.example.com")
    parser.add_argument("--releases", default=str(DEFAULT_RELEASES), help="folder with the release binaries to publish")
    parser.add_argument("--out", default=str(DEFAULT_OUT), help="output folder (default: site/dist)")
    parser.add_argument("--no-plugins", action="store_true", help="skip packaging plugin archives")
    args = parser.parse_args()

    if args.check:
        check_site()
        if errors:
            raise SystemExit(1)
        return

    build(
        base_url=args.base_url,
        releases=Path(args.releases).expanduser().resolve(),
        out=Path(args.out).expanduser().resolve(),
        with_plugins=not args.no_plugins,
    )


if __name__ == "__main__":
    main()
