"""The storage box is switched by its rail icon and unfolded by its box icon.

The strip under Categories is now a single centred box artwork: the empty-box
hint, the "收纳箱" label and the expand/collapse caret are gone. Clicking the
box on the hidden left rail opens or closes the strip (what is inside stays),
and clicking the box icon on the strip unfolds or folds the stored categories.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLUGIN = ROOT / "web" / "plugins" / "storage-box"


def main() -> int:
    js = (PLUGIN / "storage-box.js").read_text(encoding="utf-8")
    css = (PLUGIN / "storage-box.css").read_text(encoding="utf-8")

    # The empty-state sentence the user asked to remove.
    assert "还没有收纳分类" not in js
    assert "storage-box-empty" not in js
    assert ".storage-box-empty" not in css

    # No label text and no caret on the strip.
    assert "storage-box-name" not in js
    assert "storage-box-caret" not in js
    assert ".storage-box-name" not in css
    assert ".storage-box-caret" not in css

    # The rail button is the box's on/off switch.
    assert "setCollecting(!active)" in js

    # The strip's box icon toggles the stored categories.
    assert "expanded = !expanded;" in js
    assert "data-storage-box-toggle" in js

    head = css.split(".storage-box-head {", 1)[1].split("}", 1)[0]
    assert "justify-content: center" in head, "the box icon sits in the middle"
    assert "height: 40px" in head

    # Count badge rides the icon corner without pulling it off centre.
    count = css.split(".storage-box-count {", 1)[1].split("}", 1)[0]
    assert "position: absolute" in count

    # The restore-all shortcut only matters when the box holds something.
    assert "exitNode.hidden = !stored.length" in js
    assert ".storage-box-exit[hidden]" in css

    print("storage box: rail icon switches it, centre box icon unfolds categories")
    return 0


if __name__ == "__main__":
    sys.exit(main())
