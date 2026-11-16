"""The subtask body menu is Fork + Cut only.

Right-clicking a live subtask row (or its inline rename input) opens one small
menu. The body is a quick action, not a text editor: Fork branches the row and
Cut removes the whole subtask (or the selected part of its name while
renaming). Copy and Paste do not belong in this menu, while the generic editor
menu used by the note/AI text fields keeps its clipboard trio.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    source = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    menu = source.split("function showCurrentSubtaskMenu(", 1)[1].split(
        "function showHistoryMenu(", 1
    )[0]

    # Fork stays on top, but only when the Forktree plugin is installed.
    assert 'label: "Fork"' in menu
    assert 'pluginEnabled("forktree")' in menu
    # Cut keeps its two targets: the rename selection or the whole subtask.
    assert 'label: "Cut"' in menu
    assert "subtaskSelectedText(input)" in menu
    assert "deleteSubtaskRows([row])" in menu

    # The body menu never offers Copy or Paste.
    assert 'label: "Copy"' not in menu
    assert 'label: "Paste"' not in menu
    assert "readClipboardText" not in source

    # The generic editor menu still serves the note and AI text fields.
    editor = source.split('const editable = event.target.closest("input, textarea', 1)[1].split(
        "if (postcard || completedOpen", 1
    )[0]
    assert 'label: "Copy"' in editor
    assert 'label: "Paste"' in editor
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
