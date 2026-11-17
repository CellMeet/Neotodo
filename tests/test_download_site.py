#!/usr/bin/env python3
"""Guards for the self-hosted download + plugin site.

The site is what an Aliyun server will actually serve, so these checks keep the
page, the version manifest, the catalog copy and the build script in one piece:

- the page still hooks the download grid, plugin grid and env-var snippet;
- downloads.json stays a valid, data-driven platform list;
- every plugin has a local icon and catalog entries keep their integrity rules;
- a full build produces installable .zip archives whose sha256 matches the
  generated catalog, with absolute https download URLs.

No browser and no server are needed: ``site/build.py`` is run in a temp folder.
"""
from __future__ import annotations

import hashlib
import json
import re
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
WEB = ROOT / "web"
COMMUNITY = ROOT / "community"


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    digest.update(path.read_bytes())
    return digest.hexdigest()


class DownloadSiteTests(unittest.TestCase):
    def test_page_wiring(self) -> None:
        page = (SITE / "index.html").read_text(encoding="utf-8")
        for hook in (
            'data-download-grid',
            'data-plugin-grid',
            'data-plugin-search',
            'data-primary-download',
            'data-copy-catalog',
            'data-copy-env',
            'data-catalog-env',
            'data-theme-toggle',
        ):
            self.assertIn(hook, page)
        self.assertIn('href="style.css"', page)
        self.assertIn('src="site.js"', page)
        self.assertIn('src="assets/icon.svg"', page)

        script = (SITE / "site.js").read_text(encoding="utf-8")
        for needle in ("downloads.json", "plugins/catalog.json", "NEOTODO_PLUGIN_CATALOG"):
            self.assertIn(needle, script)
        # OS detection drives the "recommended" card and the hero button.
        for platform in ("windows", "linux", "macos", "android", "ios"):
            self.assertIn(f'return "{platform}"', script)

    def test_download_manifest_is_data_driven(self) -> None:
        manifest = read_json(SITE / "downloads.json")
        self.assertEqual(manifest["schema"], 1)
        self.assertRegex(manifest["app"]["version"], r"^\d+\.\d+\.\d+$")
        self.assertTrue(manifest["app"]["releases"].startswith("https://"))

        platforms = manifest["platforms"]
        ids = [platform["id"] for platform in platforms]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual(set(ids), {"windows", "linux", "macos", "android", "ios"})
        for platform in platforms:
            self.assertIn(platform["status"], {"available", "build", "planned"})
            self.assertTrue(platform["name"])
            self.assertTrue(platform["requirements"])
            for artifact in platform.get("artifacts", []):
                self.assertTrue(artifact["url"].startswith("http"))
                self.assertIn(artifact["source"], {"github", "server", "docs"})

        # The desktop releases are real today; mobile/macOS are honest placeholders.
        available = {platform["id"] for platform in platforms if platform["status"] == "available"}
        self.assertEqual(available, {"windows", "linux"})

    def test_plugin_catalog_matches_the_app_shape(self) -> None:
        catalog = read_json(SITE / "plugins" / "catalog.json")
        source = read_json(COMMUNITY / "catalog.json")
        site_ids = [entry["id"] for entry in catalog["plugins"]]
        source_ids = {entry["id"] for entry in source["plugins"]}
        # This copy is the zero-build preview shelf; the deploy build always
        # regenerates it from community/catalog.json, so it may lag a new plugin
        # but must never invent one that the app has not seen.
        self.assertTrue(set(site_ids).issubset(source_ids))
        self.assertGreaterEqual(len(site_ids), 10)
        icons = SITE / "plugins" / "icons"
        for entry in catalog["plugins"]:
            self.assertTrue(entry["name"])
            self.assertTrue(entry["version"])
            if entry.get("download"):
                self.assertTrue(entry["download"].startswith("https://"), entry["id"])
                self.assertRegex(entry["sha256"], r"^[0-9a-f]{64}$")
            elif not entry.get("bundled"):
                self.fail(f"{entry['id']} is community-facing but has no download URL")
            extension = Path(entry["icon"].split("?")[0]).suffix.lower() or ".svg"
            self.assertTrue((icons / f"{entry['id']}{extension}").is_file(), entry["id"])

    def test_icons_are_published_for_the_website(self) -> None:
        catalog = read_json(SITE / "plugins" / "catalog.json")
        for entry in catalog["plugins"]:
            folder = WEB / "plugins" / entry["id"]
            manifest_path = folder / "manifest.json"
            source = None
            if manifest_path.is_file():
                manifest = read_json(manifest_path)
                source = folder / str(manifest.get("icon") or entry["icon"])
            elif entry.get("bundled") is False:
                source = COMMUNITY / "template" / Path(entry["icon"]).name
            self.assertIsNotNone(source, entry["id"])
            self.assertTrue(source.is_file(), entry["id"])

    def test_check_mode_passes(self) -> None:
        result = subprocess.run(
            [sys.executable, str(SITE / "build.py"), "--check"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            timeout=60,
        )
        self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
        self.assertIn("plugin(s)", result.stdout)

    def test_nginx_config_serves_archives_and_catalog(self) -> None:
        config = (SITE / "nginx" / "neotodo-downloads.conf").read_text(encoding="utf-8")
        for needle in (
            "server_name dl.example.com;",
            "gzip on;",
            "location = /plugins/catalog.json",
            "location /plugins/files/",
            "location /files/",
            "Access-Control-Allow-Origin",
            "Cache-Control",
        ):
            self.assertIn(needle, config)
        self.assertIn("certbot", (SITE / "README.md").read_text(encoding="utf-8"))

    def test_full_build_makes_installable_plugin_archives(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            out = Path(temporary) / "dist"
            result = subprocess.run(
                [
                    sys.executable,
                    str(SITE / "build.py"),
                    "--base-url",
                    "https://dl.example.test",
                    "--out",
                    str(out),
                    "--releases",
                    str(SITE / "releases"),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
                timeout=180,
            )
            self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
            self.assertTrue((out / "index.html").is_file())
            self.assertTrue((out / "downloads.json").is_file())

            catalog = read_json(out / "plugins" / "catalog.json")
            self.assertTrue(catalog["updated"])
            self.assertEqual(catalog["homepage"], "https://dl.example.test/")
            downloadable = 0
            for entry in catalog["plugins"]:
                download = entry.get("download") or ""
                if not download:
                    self.assertTrue(entry.get("bundled"), entry["id"])
                    continue
                downloadable += 1
                self.assertTrue(download.startswith("https://dl.example.test/plugins/files/"), download)
                self.assertTrue(entry["icon"].startswith("https://dl.example.test/plugins/icons/"))
                archive = out / "plugins" / "files" / download.rsplit("/", 1)[-1]
                self.assertTrue(archive.is_file(), archive)
                self.assertEqual(sha256(archive), entry["sha256"])
                with zipfile.ZipFile(archive) as bundle:
                    self.assertIn("manifest.json", bundle.namelist())
                    manifest = json.loads(bundle.read("manifest.json").decode("utf-8"))
                self.assertEqual(manifest["id"], entry["id"])
                self.assertEqual(manifest["version"], entry["version"])

            self.assertGreaterEqual(downloadable, len(catalog["plugins"]))
            built = (out / "site.js").read_text(encoding="utf-8")
            self.assertIn("plugins/catalog.json", built)
            self.assertFalse(re.search(r"file://", (out / "plugins" / "catalog.json").read_text(encoding="utf-8")))


    def test_release_files_are_published_with_checksums(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            workspace = Path(temporary)
            releases = workspace / "releases"
            releases.mkdir()
            payload = b"pretend this is a Linux source package\n"
            (releases / "NeoTodo-0.0.1-Linux-x86_64.tar.gz").write_bytes(payload)
            out = workspace / "dist"
            result = subprocess.run(
                [
                    sys.executable,
                    str(SITE / "build.py"),
                    "--base-url",
                    "https://dl.example.test",
                    "--out",
                    str(out),
                    "--releases",
                    str(releases),
                ],
                cwd=ROOT,
                capture_output=True,
                text=True,
                timeout=180,
            )
            self.assertEqual(result.returncode, 0, result.stderr + result.stdout)

            manifest = read_json(out / "downloads.json")
            linux = [platform for platform in manifest["platforms"] if platform["id"] == "linux"][0]
            artifact = linux["artifacts"][0]
            self.assertEqual(artifact["source"], "server")
            self.assertEqual(artifact["url"], "https://dl.example.test/files/NeoTodo-0.0.1-Linux-x86_64.tar.gz")
            self.assertEqual(artifact["size"], len(payload))
            self.assertEqual(
                artifact["sha256"],
                hashlib.sha256(payload).hexdigest(),
            )
            published = out / "files" / artifact["file"]
            self.assertEqual(published.read_bytes(), payload)

            # The untouched platforms keep pointing at GitHub.
            windows = [platform for platform in manifest["platforms"] if platform["id"] == "windows"][0]
            self.assertEqual(windows["artifacts"][0]["source"], "github")


if __name__ == "__main__":
    unittest.main()
