"""The selection highlight colour is a reader-owned setting.

`settings.highlight` holds one #rrggbb colour (or nothing at all). Nothing means
"Auto": the active theme's accent paints the wash behind the active row and the
focused menu entry. The colour is validated on the way into the store and the
page publishes it as `--select-wash-rgb`, so the wash changes while the theme's
ink, checks and icons stay untouched. The data directory is redirected to a
temporary folder.
"""
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import app


def main() -> int:
    root = Path(tempfile.mkdtemp(prefix="neotodo-highlight-test-"))
    try:
        # Only a full #rrggbb is a highlight colour; anything else means Auto.
        assert app.normalize_highlight_color("#A1B2C3") == "#a1b2c3"
        for value in ("red", "#123", "#12345", "", None, 12, "url(javascript:1)"):
            assert app.normalize_highlight_color(value) == "", value

        store = app.Store(root / "NeoTodo.json")

        # A picked colour is stored in the ordinary settings block.
        result = store.action({
            "action": "save_settings",
            "settings": {"highlight": "#00FF88"},
        })
        assert result is not None, result
        saved = store.state()["settings"]
        assert saved["highlight"] == "#00ff88", saved.get("highlight")

        # Auto is a real choice: the key is removed, not written as junk.
        store.action({"action": "save_settings", "settings": {"highlight": ""}})
        assert "highlight" not in store.state()["settings"]

        # Invalid input can never reach the saved settings either.
        store.action({"action": "save_settings", "settings": {"highlight": "pink"}})
        assert "highlight" not in store.state()["settings"]

        # The Palette plugin owns the picker, the hex field and the Auto reset.
        app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
        palette_html = (ROOT / "web" / "plugins" / "palette" / "index.html").read_text(encoding="utf-8")
        assert 'id="highlight-color"' in palette_html
        assert 'id="highlight-color-hex"' in palette_html
        assert "data-pl-highlight-auto" in palette_html
        assert "resetHighlight()" in app_js
        assert 'setProperty("--select-wash-rgb"' in app_js
        assert 'root.dataset.select' in app_js

        # The wash is scoped to the saved colour, so Auto keeps every theme's
        # existing accent highlighting exactly as it was.
        style = (ROOT / "web" / "style.css").read_text(encoding="utf-8")
        assert "html[data-select] .current-subtask.selected" in style
        assert "html[data-select] .context-item:hover" in style
        assert "rgba(var(--select-wash-rgb)" in style
    finally:
        import shutil
        shutil.rmtree(root, ignore_errors=True)
    print("the selection highlight keeps a reader-owned colour outside the accent")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
