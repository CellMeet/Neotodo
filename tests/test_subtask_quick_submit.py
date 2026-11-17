"""Twenty finished subtasks are the board's finish line.

A long todo no longer has to wait for its last pending row: once twenty of its
subtasks are done, completing the todo submits it in one click and the rest are
marked done with it. The submitted todo then carries the squash mark in place of
the gold headphone, because it was turned in with a subtask board.
"""
from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import app


def block_after(text: str, marker: str, stop: str) -> str:
    assert marker in text, f"missing marker: {marker}"
    return text.split(marker, 1)[1].split(stop, 1)[0]


class SubtaskQuickSubmitTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.patches = [
            mock.patch.object(app, "load_data", side_effect=lambda *_args, **_kwargs: {
                "categories": [], "settings": {}, "archive": [], "trash": [],
            }),
            mock.patch.object(app, "save_data", lambda data, *_args, **_kwargs: None),
        ]
        for patch in self.patches:
            patch.start()
        self.store = app.Store(Path(self.temp.name) / "data.json")
        category = self.store.action({"action": "add_category", "name": "AI DIY"})
        todo = self.store.action({
            "action": "add_todo",
            "category_id": category["created"],
            "name": "Neotodo",
        })
        self.todo_id = todo["created"]
        self.subtask_ids = []

    def tearDown(self) -> None:
        for patch in reversed(self.patches):
            patch.stop()
        self.temp.cleanup()

    def add_subtasks(self, count: int) -> None:
        for index in range(count):
            result = self.store.action({
                "action": "add_subtask",
                "todo_id": self.todo_id,
                "name": f"subtask {index}",
            })
            self.assertTrue(result["ok"], result)
            self.subtask_ids.append(result["created"])

    def finish(self, count: int) -> None:
        for subtask_id in self.subtask_ids[:count]:
            result = self.store.action({
                "action": "complete_subtask",
                "todo_id": self.todo_id,
                "subtask_id": subtask_id,
            })
            self.assertTrue(result["ok"], result)

    def stored_todo(self) -> dict:
        state = self.store.state()
        return next(
            item for item in state["categories"][0]["todos"]
            if item["id"] == self.todo_id
        )

    def test_twenty_done_subtasks_submit_the_todo_and_finish_the_tail(self):
        self.add_subtasks(25)
        self.finish(20)

        result = self.store.action({"action": "complete_todo", "id": self.todo_id})

        self.assertTrue(result["ok"], result)
        self.assertEqual(result.get("auto_completed"), 5)
        todo = self.stored_todo()
        self.assertTrue(todo["done"])
        self.assertIsNotNone(todo["completed_at"])
        self.assertTrue(all(subtask["done"] for subtask in todo["subtasks"]))
        swept = [subtask for subtask in todo["subtasks"] if subtask.get("submitted_early")]
        self.assertEqual(len(swept), 5)
        self.assertTrue(all(subtask["time_cost"] == 0 for subtask in swept))

    def test_nineteen_done_subtasks_still_wait_for_the_pending_row(self):
        self.add_subtasks(21)
        self.finish(19)

        result = self.store.action({"action": "complete_todo", "id": self.todo_id})

        self.assertFalse(result["ok"])
        self.assertIn("pending", (result.get("error") or "").lower())
        self.assertFalse(self.stored_todo()["done"])

    def test_all_done_still_submits_without_a_tail(self):
        self.add_subtasks(3)
        self.finish(3)

        result = self.store.action({"action": "complete_todo", "id": self.todo_id})

        self.assertTrue(result["ok"], result)
        self.assertNotIn("auto_completed", result)
        self.assertTrue(self.stored_todo()["done"])


class SubtaskSubmitMarkTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        cls.app_py = (ROOT / "app.py").read_text(encoding="utf-8")

    def test_backend_and_page_share_the_twenty_row_finish_line(self):
        self.assertIn("SUBTASK_QUICK_SUBMIT = 20", self.app_py)
        self.assertIn("const SUBTASK_QUICK_SUBMIT = 20;", self.app_js)

    def test_submitted_todo_with_subtasks_uses_the_squash_picture(self):
        gif = ROOT / "web" / "stickers" / "squash-done.gif"
        self.assertTrue(gif.is_file() and gif.stat().st_size > 0)
        self.assertIn('src="/stickers/squash-done.gif"', self.app_js)
        history = block_after(
            self.app_js,
            "const historyRows = done.map((todo, index) => {",
            "const historyFillerCount",
        )
        self.assertIn("const trophy = hasSubs", history)
        self.assertIn("${SUBTASK_DONE_ICON}", history)
        self.assertIn("h-trophy-squash", history)
        log = block_after(
            self.app_js,
            "const row = (item) => {",
            'list.innerHTML = filtered.length',
        )
        self.assertIn("${SUBTASK_DONE_ICON}", log)
        self.assertIn("log-trophy-squash", log)

        css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
        squash = block_after(css, "The squash mark on a submitted todo", "Twenty finished subtasks")
        self.assertIn("height: 34px", squash, "the squash mark is still the old 24px one")
        self.assertIn("max-width: 30px", squash)
        # The finished-subtask sunshroom sits with its name, not above it.
        self.assertIn(".history-subtask .h-sub-fan", squash)
        self.assertIn("transform: translateY(3px)", squash)

    def test_category_counter_cherry_is_enlarged_with_the_other_marks(self):
        css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
        counter = block_after(
            css,
            "The category counter's cherry sits at the right end",
            "Twenty finished subtasks",
        )
        self.assertIn(".category-item .cat-count .moon-icon", counter)
        self.assertIn("width: 28px !important", counter)
        self.assertIn("height: 28px !important", counter)


if __name__ == "__main__":
    unittest.main()
