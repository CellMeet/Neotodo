"""Finishing and reopening a subtask is one click, with no ceremony.

The fan in a pending row submits the subtask straight away: no confirmation
dialog, no "Finished!" toast. Its counterpart in the finished lane sends the
row back to the board, and an AI run that keeps working on a finished subtask
reopens it before the message is sent.
"""
from __future__ import annotations

import os
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


class SubtaskFanFlowTests(unittest.TestCase):
    """The page wiring: one click completes, another click brings the row back."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        cls.app_py = (ROOT / "app.py").read_text(encoding="utf-8")

    def test_complete_fan_submits_without_dialog_or_toast(self):
        complete = block_after(
            self.app_js,
            'if (actionName === "complete-subtask") {',
            'if (actionName === "remove-samples") {',
        )
        self.assertNotIn("confirmDialog(", complete, "the fan still asks for confirmation")
        self.assertNotIn("finishedToast(", complete, "the fan still broadcasts a toast")
        self.assertIn('action("complete_subtask"', complete)
        self.assertIn("justCompletedSubtaskId = subtaskId;", complete)

    def test_finished_fan_and_ai_both_reopen_the_row(self):
        reopen = block_after(self.app_js, "async function reopenFinishedSubtask(", "\n}\n")
        self.assertIn('action("reopen_subtask"', reopen)
        self.assertIn("completedSubtasksOpen = false;", reopen)
        self.assertIn("revealNewSubtask = true;", reopen)
        # A double click must not send a second request and toast an error.
        self.assertIn("reopeningSubtaskIds.has(subtaskId)", reopen)

        done_fan = block_after(
            self.app_js,
            'const doneFan = event.target.closest(".history-subtask .h-sub-fan, .current-subtask.done .sub-fan");',
            "const logExpand =",
        )
        self.assertIn("reopenFinishedSubtask(currentTodo()?.id", done_fan)

        send = block_after(self.app_js, "async function sendAgentMessage() {", "\n  if (!agentLoadedIds")
        self.assertIn("if (owner?.subtask?.done) await reopenFinishedSubtask(", send)

        # A reopened row carries a fresh activity stamp, so the pending lane
        # lifts it above rows that were created later.
        activity = block_after(self.app_js, "function subtaskActivityStamp(subtask) {", "\n}\n")
        self.assertIn("stampValue(subtask?.reopened_at)", activity)

    def test_backend_reopen_clears_completion_stamps(self):
        backend = block_after(
            self.app_py,
            'elif name == "reopen_subtask":',
            'elif name == "bind_project_folder":',
        )
        self.assertIn('subtask["done"] = False', backend)
        self.assertIn('subtask["completed_at"] = None', backend)
        self.assertIn('subtask["time_cost"] = None', backend)
        self.assertIn('subtask["reopened_at"] =', backend)


class SubtaskReopenActionTests(unittest.TestCase):
    """The backend action itself: complete, reopen, and check the row again."""

    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.patches = [
            mock.patch.object(app, "load_data", side_effect=lambda *_args, **_kwargs: {
                "categories": [], "settings": {}, "archive": [], "trash": [],
            }),
            mock.patch.object(app, "save_data", lambda data, *_args, **_kwargs: None),
        ]
        for patch in self.patches:
            patch.start()
        self.store = app.Store(Path(self.root) / "data.json")
        category = self.store.action({"action": "add_category", "name": "AI DIY"})
        todo = self.store.action({
            "action": "add_todo",
            "category_id": category["created"],
            "name": "Neotodo",
        })
        self.todo_id = todo["created"]
        subtask = self.store.action({
            "action": "add_subtask",
            "todo_id": self.todo_id,
            "name": "子任务播报",
        })
        self.subtask_id = subtask["created"]

    def tearDown(self) -> None:
        for patch in reversed(self.patches):
            patch.stop()
        self.temp.cleanup()

    def stored_subtask(self) -> dict:
        state = self.store.state()
        todo = next(
            item for item in state["categories"][0]["todos"]
            if item["id"] == self.todo_id
        )
        return next(item for item in todo["subtasks"] if item["id"] == self.subtask_id)

    def test_complete_then_reopen_moves_the_row_back_to_pending(self):
        done = self.store.action({
            "action": "complete_subtask",
            "todo_id": self.todo_id,
            "subtask_id": self.subtask_id,
        })
        self.assertTrue(done["ok"])
        self.assertTrue(self.stored_subtask()["done"])
        self.assertIsNotNone(self.stored_subtask()["completed_at"])

        reopened = self.store.action({
            "action": "reopen_subtask",
            "todo_id": self.todo_id,
            "subtask_id": self.subtask_id,
        })
        self.assertTrue(reopened["ok"])
        subtask = self.stored_subtask()
        self.assertFalse(subtask["done"])
        self.assertIsNone(subtask["completed_at"])
        self.assertIsNone(subtask["time_cost"])
        self.assertIsNotNone(subtask["reopened_at"])

    def test_reopened_row_leads_the_pending_board(self):
        self.store.action({
            "action": "complete_subtask",
            "todo_id": self.todo_id,
            "subtask_id": self.subtask_id,
        })
        newer = self.store.action({
            "action": "add_subtask",
            "todo_id": self.todo_id,
            "name": "something newer",
        })
        self.assertTrue(newer["ok"])
        self.store.action({
            "action": "reopen_subtask",
            "todo_id": self.todo_id,
            "subtask_id": self.subtask_id,
        })
        subtasks = self.store.state()["categories"][0]["todos"][0]["subtasks"]
        self.assertEqual(subtasks[0]["id"], self.subtask_id)

    def test_reopen_rejects_a_pending_row(self):
        result = self.store.action({
            "action": "reopen_subtask",
            "todo_id": self.todo_id,
            "subtask_id": self.subtask_id,
        })
        self.assertFalse(result["ok"])
        self.assertIn("pending", (result.get("error") or "").lower())


if __name__ == "__main__":
    unittest.main()
