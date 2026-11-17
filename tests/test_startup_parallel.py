"""Startup loads the room, the cards and the AI sheet in one pass.

The board, the shelf lists and the AI console are independent reads. They used
to be awaited one after another, so the hidden window paid for the sum of their
latency before the background, the cards and the AI sheet could paint. These
checks guard the parallel bootstrap and the AI console's place in the first
frame, plus the work that used to sit in front of that first frame: the whole
notebook written back on every read (twice per click) and the conversation
store parsed in the constructor before the server could answer anyone.
"""
from __future__ import annotations

import json
import re
import sys
import tempfile
import threading
import time
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import app


def init_body() -> str:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    return app_js.split("async function init()", 1)[1]


class StartupParallelTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        cls.init = init_body()

    def test_board_and_ai_start_before_the_shelf_waits(self):
        init = self.init
        state_start = init.index("const stateReady =")
        ai_start = init.index("const aiConfigReady = loadAiConfig();")
        shelves_start = init.index("const shelvesReady = Promise.all([")
        theme_wait = init.index("await Promise.all([themePacksReady, iconThemesReady]);")
        self.assertLess(state_start, theme_wait)
        self.assertLess(ai_start, theme_wait)
        self.assertLess(shelves_start, theme_wait)
        # The old one-after-another waits are gone.
        self.assertNotIn("await loadInstalledPlugins();", init)
        self.assertNotIn("await loadThemePacks();", init)

    def test_every_independent_shelf_shares_the_parallel_shelf_wait(self):
        shelves = self.init.split("const shelvesReady = Promise.all([", 1)[1].split("]);", 1)[0]
        for call in (
            "loadInstalledPlugins(",
            "themePacksReady",
            "iconThemesReady",
            "loadSoundStyles(",
            "loadBackgroundMusicTracks(",
        ):
            self.assertIn(call, shelves)
        # The state request is not repeated once the shelves are in.
        self.assertIn("state.data = await stateReady;", self.init)
        self.assertIn("await shelvesReady;", self.init)

    def test_the_finished_shell_lays_out_while_the_window_is_still_hidden(self):
        init = self.init
        rendered = init.index("  render();")
        layout = init.index('document.body.classList.add("app-layout");')
        painted = init.index('document.body.classList.add("app-painted")')
        self.assertLess(rendered, layout)
        self.assertLess(layout, painted)
        # The layer outside the shell follows the same gate, so a fallback
        # reveal can never show the wallpaper before the rest of the page.
        style = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
        self.assertIn("body.app-layout .app-shell,", style)
        startup = (ROOT / "web" / "startup.css").read_text(encoding="utf-8")
        self.assertIn("html.booting #wallpaper-layer { visibility: hidden; }", startup)
        self.assertIn("body.app-layout #wallpaper-layer,", startup)

    def test_the_gtk_fallback_never_races_a_slow_but_finished_page(self):
        source = (ROOT / "app.py").read_text(encoding="utf-8")
        self.assertIn('GLib.timeout_add(10000, lambda: reveal_window("global-fallback"))', source)
        self.assertNotIn('GLib.timeout_add(1800, lambda: reveal_window("global-fallback"))', source)
        # A fast page must not wait for a fixed timer before the shell looks for
        # its painted flag.
        self.assertIn("GLib.timeout_add(0, poll_ready)", source)
        self.assertNotIn("GLib.timeout_add(1200, poll_ready)", source)
        # A fatal init paints its own error page, so the window does not need
        # the global fallback to reveal it.
        self.assertIn('document.body.classList.add("app-painted");\n});', self.app_js)
        self.assertIn("document.body.style.background", self.app_js)

    def test_every_boot_script_is_fetched_from_the_head(self):
        # The parser-blocking scripts at the end of <body> used to fetch one
        # after another, so the first frame paid a fresh round trip for each
        # one. A preload starts them while the stylesheets and body are still
        # parsing, and the later <script src> finds them in the cache.
        html = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
        head, body = html.split("\n<body", 1)
        script_srcs = re.findall(r'<script src="([^"]+)"', body)
        self.assertTrue(script_srcs)
        for src in script_srcs:
            self.assertIn(f'<link rel="preload" as="script" href="{src}">', head)

    def test_the_boot_document_carries_the_first_render_data(self):
        # The shell injects the exact payloads the loaders used to fetch one by
        # one, so the first render can run before WebKit's first layout pass.
        source = (ROOT / "app.py").read_text(encoding="utf-8")
        self.assertIn("def build_boot_payload", source)
        self.assertIn("neotodo-boot-data", source)
        self.assertIn('"state": safe(', source)
        self.assertIn('"themes": themes', source)
        self.assertIn('"icon_themes": icon_themes', source)
        self.assertIn('"sound_styles": sound_styles', source)
        self.assertIn('"background_music": background_music', source)
        self.assertIn('"plugins": plugins', source)
        self.assertIn("readBootData()", self.init)
        for preloaded in (
            "loadThemePacks(boot?.themes || null)",
            "loadIconThemes(boot?.icon_themes || null)",
            "loadInstalledPlugins(boot?.plugins || null)",
            "loadSoundStyles(boot?.sound_styles || null)",
            "loadBackgroundMusicTracks(boot?.background_music || null)",
        ):
            self.assertIn(preloaded, self.init)
        # A boot document without the block still falls back to the endpoints.
        self.assertIn('requestState()', self.init)
        for loader in ("loadThemePacks", "loadIconThemes", "loadSoundStyles", "loadBackgroundMusicTracks"):
            self.assertIn(f"async function {loader}(preloaded = null)", self.app_js)

    def test_card_faces_are_decoded_before_the_reveal(self):
        painted = self.app_js.split("function cardFacesPainted()", 1)[1].split("\n}\n", 1)[0]
        self.assertIn("floatingCardHosts().every(cardFacePainted)", painted)
        face = self.app_js.split("function cardFacePainted(", 1)[1].split("\n}\n", 1)[0]
        self.assertIn("media.decode?.()", face)
        self.assertIn('dataset.faceDecoded === "1"', face)
        # A still picture is cut from the room's own <img>; the cards do not
        # wait for the separate full-size bitmap copy to finish.
        prime = self.app_js.split("function primeSubcardPapers()", 1)[1].split("\n}\n", 1)[0]
        self.assertIn("subcardSampleObjectFor(wallpaper)", prime)
        self.assertNotIn("wallpaperBitmapCache.get(wallpaper.key)?.ready", prime)
        bind = self.app_js.split("function bindWallpaperMedia(", 1)[1].split("\n}\n", 1)[0]
        self.assertIn("primeSubcardPapers();", bind)

    def test_an_open_ai_sheet_waits_for_its_config_and_session(self):
        helper = self.app_js.split("function settleOpenAgentForFirstPaint(", 1)[1].split("\n}\n", 1)[0]
        self.assertIn("if (!agentTerminalOpen) return Promise.resolve();", helper)
        self.assertIn("configReady.catch", helper)
        self.assertIn("loadAgentModels()", helper)
        self.assertIn("loadAgentSession(agent.id)", helper)
        self.assertIn("Promise.race", helper)
        init = self.init
        gate = init.index("await settleOpenAgentForFirstPaint(aiConfigReady);")
        faces = init.index("const cardFacesReady = prewarmCardWallpaperFaces();")
        ready = init.index('document.body.classList.add("app-ready")')
        painted = init.index('document.body.classList.add("app-painted")')
        # The bake starts first, the AI wait overlaps it, and both finish before
        # the window is allowed to show or report itself painted.
        self.assertLess(faces, gate)
        self.assertLess(gate, ready)
        self.assertLess(gate, painted)

    def test_the_wallpaper_wait_overlaps_the_ai_wait(self):
        # Both waits belong to the same first frame. Starting the wallpaper
        # wait after the AI gate made a launch pay for the two one after the
        # other; they must leave together.
        init = self.init
        wallpaper = init.index("const wallpaperReady = waitForWallpaperFrame();")
        gate = init.index("await settleOpenAgentForFirstPaint(aiConfigReady);")
        awaited = init.index("await wallpaperReady;")
        self.assertLess(wallpaper, gate)
        self.assertLess(gate, awaited)
        self.assertNotIn("await waitForWallpaperFrame();", init)


class OpencodeProbeCacheTests(unittest.TestCase):
    """CLI version and model probes are shared instead of run per request."""

    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        root = Path(self.temp.name)
        self._old = (
            app.AI_CONFIG_FILE, app.AI_OPENCODE_CONFIG, app.AI_ACTIVITY_FILE, app.DATA_DIR,
        )
        app.AI_CONFIG_FILE = root / "ai-config.json"
        app.AI_OPENCODE_CONFIG = root / "ai-opencode.json"
        app.AI_ACTIVITY_FILE = root / "agent-activity.log"
        app.DATA_DIR = root
        self.store = app.AgentStore(root / "agents.json")

    def tearDown(self) -> None:
        (app.AI_CONFIG_FILE, app.AI_OPENCODE_CONFIG, app.AI_ACTIVITY_FILE, app.DATA_DIR) = self._old
        self.temp.cleanup()

    def test_version_is_probed_once_and_reused(self):
        calls = []

        def fake_run(args, **_kwargs):
            calls.append(list(args))
            return mock.Mock(stdout="opencode v9.9.9\n", returncode=0)

        with mock.patch.object(app.shutil, "which", side_effect=lambda name: "/usr/bin/opencode" if name == "opencode" else ""), \
                mock.patch.object(app.subprocess, "run", side_effect=fake_run):
            first = self.store._opencode_info()
            second = self.store._opencode_info()

        self.assertEqual(calls, [["/usr/bin/opencode", "--version"]])
        self.assertEqual(first["opencode"]["version"], "opencode v9.9.9")
        self.assertIs(first, second)

    def test_concurrent_board_and_ai_model_reads_share_one_probe(self):
        calls = []
        entered = threading.Event()
        release = threading.Event()

        def fake_run(args, **_kwargs):
            calls.append(list(args))
            entered.set()
            release.wait(2)
            return mock.Mock(stdout="deepseek/test-model\n", returncode=0)

        results = []
        with mock.patch.object(app.shutil, "which", side_effect=lambda name: "/usr/bin/opencode" if name == "opencode" else ""), \
                mock.patch.object(app.subprocess, "run", side_effect=fake_run):
            first = threading.Thread(
                target=lambda: results.append(self.store._available_models()),
            )
            first.start()
            self.assertTrue(entered.wait(2))
            second = threading.Thread(
                target=lambda: results.append(self.store._available_models()),
            )
            second.start()
            time.sleep(0.05)
            release.set()
            first.join(2)
            second.join(2)

        self.assertEqual(calls, [["/usr/bin/opencode", "models", "--standalone"]])
        self.assertEqual(results, [["deepseek/test-model"], ["deepseek/test-model"]])

    def test_startup_warms_the_probes_in_parallel(self):
        source = (ROOT / "app.py").read_text(encoding="utf-8")
        start = source.split("def start_server(", 1)[1].split("def run_gtk(", 1)[0]
        self.assertIn("neotodo-ai-probe", start)
        self.assertIn("neotodo-ai-models", start)
        self.assertIn("_opencode_info", start)
        self.assertIn("_available_models", start)
        self.assertIn("daemon=True", start)

    def test_the_server_serves_before_the_warm_probes_run(self):
        # The page's first requests must not queue behind a GTK import and two
        # CLI probes. The HTTP thread starts first; the main thread warms the
        # caches beside it.
        source = (ROOT / "app.py").read_text(encoding="utf-8")
        start = source.split("def start_server(", 1)[1].split("def run_gtk(", 1)[0]
        served = start.index("thread.start()")
        self.assertLess(served, start.index("fork_window_supported()"))
        self.assertLess(served, start.index("neotodo-ai-probe"))


class BoardReadDoesNotRewriteTests(unittest.TestCase):
    """Reading the board is a read; only a real change writes the file.

    `/api/state` builds the payload a click is answered with, so the whole
    notebook used to be printed to disk twice per action: once by the action
    and once by the read. On a large board that was the delay the click sat
    through.
    """

    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "NeoTodo.json"
        self.path.write_text(
            json.dumps({
                "categories": [{"id": "c1", "name": "Category", "todos": []}],
                "settings": {},
            }),
            encoding="utf-8",
        )
        self.store = app.Store(self.path)

    def tearDown(self) -> None:
        self.temp.cleanup()

    def test_a_clean_read_writes_nothing(self):
        writes = []
        with mock.patch.object(app, "save_data", side_effect=lambda *a, **k: writes.append(1)):
            self.store.state()
            self.store.state()
        self.assertEqual(writes, [])

    def test_a_current_board_is_not_rewritten_at_launch(self):
        # setUp already normalised the file once. Opening it again must be a
        # read: the launch used to print the whole notebook before the window
        # could appear.
        writes = []
        with mock.patch.object(app, "save_data", side_effect=lambda *a, **k: writes.append(1)):
            reopened = app.Store(self.path)
        self.assertEqual(writes, [])
        self.assertEqual(reopened.state()["categories"][0]["name"], "Category")

    def test_a_launch_that_migrates_still_persists(self):
        legacy = Path(self.temp.name) / "legacy.json"
        legacy.write_text(
            json.dumps({"categories": [{"name": "Category", "todos": []}]}),
            encoding="utf-8",
        )
        writes = []
        with mock.patch.object(app, "save_data", side_effect=lambda *a, **k: writes.append(1)):
            app.Store(legacy)
        self.assertEqual(writes, [1])

    def test_one_action_writes_the_board_once(self):
        writes = []
        with mock.patch.object(app, "save_data", side_effect=lambda *a, **k: writes.append(1)):
            result = self.store.action({"action": "select_category", "id": "c1"})
        self.assertTrue(result["ok"])
        self.assertEqual(writes, [1])

    def test_a_weekly_rollover_still_persists_itself(self):
        # The weekly archive is the one thing a read can move; that move must
        # still reach the disk.
        self.store.data["categories"][0]["todos"].append({
            "id": "t1",
            "name": "Very old",
            "done": True,
            "completed_at": "2020-01-06T09:00:00",
            "subtasks": [],
        })
        writes = []
        with mock.patch.object(app, "save_data", side_effect=lambda *a, **k: writes.append(1)):
            state = self.store.state()
        self.assertEqual(writes, [1])
        self.assertEqual(state["categories"][0]["todos"], [])
        self.assertTrue(state["archive"])


class AgentSettleBesideLaunchTests(unittest.TestCase):
    """The conversation store settles beside the launch, not in front of it."""

    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "agents.json"

    def tearDown(self) -> None:
        self.temp.cleanup()

    def test_the_constructor_does_not_wait_for_the_settle(self):
        entered = threading.Event()
        release = threading.Event()

        def slow_settle(_store):
            entered.set()
            release.wait(2)

        with mock.patch.object(app.AgentStore, "_settle_all_pending", slow_settle):
            store = app.AgentStore(self.path, settle_pending=True)
            # Construction came back while the pass is still running.
            self.assertTrue(entered.wait(2))
            self.assertFalse(store.settled.is_set())
            release.set()
        self.assertTrue(store.settled.wait(2))

    def test_a_conversation_request_waits_for_the_settle(self):
        release = threading.Event()
        settled_first = []

        def slow_settle(_store):
            release.wait(2)
            settled_first.append(True)

        with mock.patch.object(app.AgentStore, "_settle_all_pending", slow_settle):
            store = app.AgentStore(self.path, settle_pending=True)
            answers = []
            worker = threading.Thread(target=lambda: answers.append(store.action({"action": "list"})))
            worker.start()
            time.sleep(0.1)
            # The read is parked until the store is settled, never answered
            # with a half-settled conversation.
            self.assertEqual(answers, [])
            release.set()
            worker.join(2)
        self.assertEqual(settled_first, [True])
        self.assertTrue(answers and answers[0]["ok"])

    def test_a_shared_window_does_not_own_the_settle(self):
        # Fork windows and second copies must not touch the owner's runs, and
        # must not wait for a pass they never run.
        store = app.AgentStore(self.path, settle_pending=False)
        self.assertTrue(store.settled.is_set())


if __name__ == "__main__":
    unittest.main()
