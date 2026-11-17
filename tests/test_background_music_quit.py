#!/usr/bin/env python3
"""Quitting the notebook takes the background music with it.

The 百闻牌 track is an HTMLAudioElement that loops for as long as the page
lives. Quitting used to tear the window down without ever telling that element
to leave: the media pipeline kept its last buffers, and a fork window or a slow
agent shutdown could keep the track audible after the reader asked the app to
close. These checks pin the four parts of the fix:

  - the track can be stopped outright (the source is released, not just
    paused);
  - the quit button silences the page before it asks the backend to quit;
  - page teardown silences it too (pagehide/beforeunload);
  - the Linux shell mutes the view and calls the same hook at the very start of
    its shutdown, before it waits on agents or forks;
  - fork windows are marked `silent=1`, so a satellite window can never start a
    second copy of the track.
"""
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class BackgroundMusicQuitTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        cls.py = (ROOT / "app.py").read_text(encoding="utf-8")
        cls.music = cls.js.split("const BackgroundMusic = (() => {", 1)[1].split("})();", 1)[0]

    def test_the_track_can_be_released_not_only_paused(self):
        self.assertIn("function stop()", self.music)
        self.assertIn("node.removeAttribute(\"src\")", self.music)
        self.assertIn("node.load()", self.music)
        # The public API exposes it next to start/sync.
        self.assertIn("start: play,\n    stop,", self.music)

    def test_one_hook_silences_the_notebook(self):
        self.assertIn("function silenceNotebookAudio()", self.js)
        hook = self.js.split("function silenceNotebookAudio()", 1)[1].split("\n}\n", 1)[0]
        self.assertIn("BackgroundMusic.stop()", hook)
        self.assertIn('document.querySelectorAll("audio")', hook)
        self.assertIn("node.pause()", hook)
        # The Linux shell evaluates this exact name.
        self.assertIn("window.neotodoSilenceAudio = silenceNotebookAudio;", self.js)

    def test_quit_button_silences_before_the_backend_round_trip(self):
        quit_block = self.js.split('if (actionName === "quit-app") {', 1)[1].split("return;", 1)[0]
        self.assertIn("silenceNotebookAudio();", quit_block)
        self.assertLess(
            quit_block.index("silenceNotebookAudio();"),
            quit_block.index('persistAction("quit")'),
        )

    def test_page_teardown_silences_every_track(self):
        self.assertIn(
            'window.addEventListener("pagehide", () => { silenceNotebookAudio();',
            self.js,
        )
        self.assertIn('window.addEventListener("beforeunload", silenceNotebookAudio);', self.js)

    def test_linux_shutdown_silences_before_agent_and_fork_cleanup(self):
        shutdown = self.py.split("        def _shutdown(self):", 1)[1].split("\n        def quit_now", 1)[0]
        self.assertIn("view.set_is_muted(True)", shutdown)
        self.assertIn(
            "window.neotodoSilenceAudio&&window.neotodoSilenceAudio()",
            shutdown,
        )
        self.assertLess(shutdown.index("set_is_muted"), shutdown.index("shutdown_forks()"))
        self.assertLess(
            shutdown.index("neotodoSilenceAudio"),
            shutdown.index("agent_store.shutdown()"),
        )

    def test_fork_windows_are_silent_satellites(self):
        fork = self.py.split("def run_fork_gtk_window(", 1)[1].split("    def activate(", 1)[0]
        self.assertIn('"silent=1"', fork)
        self.assertIn("}silent=1", fork)
        # The page reads the marker and refuses to start the track.
        self.assertIn('params.get("silent") === "1"', self.js)


if __name__ == "__main__":
    unittest.main()
