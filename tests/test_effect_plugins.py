#!/usr/bin/env python3
"""Static checks for the independent Doing-card effect plugins.

The Doing card's warm glow (firelight), drifting specks (fireflies) and blue
lightning (lightning) are three separate chrome plugins. These tests keep them
wired into the notebook, listed in both community catalogs, and keep each
control page's script pointing at the ids its markup actually uses.
"""
from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web"
PLUGINS = WEB / "plugins"
EFFECTS = ("firelight", "fireflies", "lightning")


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


class EffectPluginWiringTests(unittest.TestCase):
    def test_manifests_and_preview_pages_exist(self) -> None:
        for plugin_id in EFFECTS:
            folder = PLUGINS / plugin_id
            manifest = json.loads(read(folder / "manifest.json"))
            self.assertEqual(manifest["id"], plugin_id)
            self.assertEqual(manifest["kind"], "chrome")
            self.assertTrue((folder / manifest["entry"]).is_file(), plugin_id)
            self.assertTrue((folder / manifest["icon"]).is_file(), plugin_id)
            self.assertTrue((folder / "plugin.css").is_file(), plugin_id)
            self.assertTrue((folder / "plugin.js").is_file(), plugin_id)

    def test_notebook_loads_every_effect(self) -> None:
        index = read(WEB / "index.html")
        for plugin_id in EFFECTS:
            self.assertIn(f'href="/plugins/{plugin_id}/{plugin_id}.css"', index)
            self.assertIn(f'src="/plugins/{plugin_id}/{plugin_id}.js"', index)

    def test_effect_javascript_registers_with_the_host(self) -> None:
        for plugin_id in EFFECTS:
            script = read(PLUGINS / plugin_id / f"{plugin_id}.js")
            self.assertIn(f'const PLUGIN_ID = "{plugin_id}"', script)
            self.assertIn("PLUGIN_REGISTRY[PLUGIN_ID]", script)
            # Off must remove the effect: each plugin mirrors its probe state
            # onto a root class and styles every rule behind that class.
            self.assertIn(f'"{plugin_id}-on"', script)
            css = read(PLUGINS / plugin_id / f"{plugin_id}.css")
            self.assertIn(f"html.{plugin_id}-on", css)

    def test_lightning_control_page_matches_its_markup(self) -> None:
        markup = read(PLUGINS / "lightning" / "index.html")
        script = read(PLUGINS / "lightning" / "plugin.js")
        ids = set(re.findall(r'id="(lg-[a-z-]+)"', markup))
        self.assertIn("lg-power", ids)
        referenced = set(re.findall(r'getElementById\("([a-z-]+)"\)', script))
        self.assertTrue(referenced)
        self.assertLessEqual(referenced, ids, "control script reads ids the page lacks")
        self.assertNotRegex(script, r'"(fl|ff)-', "control script still uses another plugin's ids")

    def test_lightning_is_bolts_not_a_ball(self) -> None:
        """The effect must read as natural lightning, never a plasma orb."""
        css = read(PLUGINS / "lightning" / "lightning.css")
        script = read(PLUGINS / "lightning" / "lightning.js")
        markup = read(PLUGINS / "lightning" / "index.html")
        # No elliptical halo/shell anywhere: the glow has to follow the filaments.
        for text in (css, script, markup):
            self.assertNotIn("storm-halo", text)
        self.assertNotIn("<ellipse", script, "storm markup drew a halo ellipse")
        self.assertIn("storm-glow", script)
        self.assertIn("storm-core", script)
        self.assertIn("storm-filament", script)
        # The mass must breathe and stay white instead of looping a sphere.
        self.assertIn("storm-breathe", css)
        self.assertIn("storm-mass", css)
        self.assertIn("#ffffff", css)
        self.assertIn("mask-image", css)
        self.assertIn("storm-glow", css)
        self.assertIn("blur(", css)

    def test_both_catalogs_list_the_three_effects(self) -> None:
        for catalog_path in (
            WEB / "plugins" / "community-catalog.json",
            ROOT / "community" / "catalog.json",
        ):
            catalog = json.loads(read(catalog_path))
            ids = {entry.get("id") for entry in catalog["plugins"]}
            self.assertLessEqual(set(EFFECTS), ids, catalog_path)


if __name__ == "__main__":
    unittest.main()
