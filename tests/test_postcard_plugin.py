"""The weekly postcard archive is a Settings-style plugin.

The top-right picture button used to open the archive drawer. It now opens
AI / Agent settings, and the archive lives on the left rail as
`/plugins/postcard`: an in-theme sheet that asks the host for the week list and
the existing postcard markup through `window.NeoTodoPostcards`.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
PLUGIN = WEB / "plugins" / "postcard"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def main() -> int:
    index = read(WEB / "index.html")
    app_js = read(WEB / "app.js")
    manifest = json.loads((PLUGIN / "manifest.json").read_text(encoding="utf-8"))
    palette = json.loads((WEB / "plugins" / "palette" / "manifest.json").read_text(encoding="utf-8"))

    assert manifest["id"] == "postcard"
    assert manifest["name"] == "明信片"
    assert manifest["icon"] == "postcard.svg"
    assert manifest["entry"] == "index.html"
    assert "intheme" in manifest["tags"]
    assert "intheme" in palette.get("tags", [])
    for name in ("index.html", "plugin.css", "plugin.js", "postcard.svg"):
        assert (PLUGIN / name).is_file(), name

    assert 'data-action="open-postcard"' in index
    assert 'data-plugin="postcard"' in index
    assert "/plugins/postcard/postcard.svg" in index
    assert "postcard-glyph" in read(WEB / "plugins" / "plugin-host.css")

    # The picture slot now manages AI agents instead of opening the archive.
    assert 'class="agent-settings-button"' in index
    assert 'data-action="open-ai-settings"' in index
    # The mark is an inline sprite symbol now, so it takes the same ink as the
    # music / gear / exit icons instead of a fixed black bitmap.
    assert '<symbol id="robot-agent"' in index
    assert '<use href="#robot-agent"></use>' in index
    assert (WEB / "robot-agent.svg").is_file()
    top_tools = index.split('<div class="top-tools"', 1)[1].split("</div>", 1)[0]
    assert 'data-action="open-archive"' not in top_tools

    assert 'id: "postcard"' in app_js
    assert 'tags: ["intheme", "postcard", "archive", "weekly"]' in app_js
    assert 'if (actionName === "open-postcard") { openPluginPanel("postcard"); return; }' in app_js
    assert 'if (actionName === "open-ai-settings") { openAiSettings(); return; }' in app_js
    # AI now has its own sheet behind the robot icon; it no longer rides in
    # the Settings nav.
    assert 'data-settings-tab="ai"' not in app_js
    assert "function pluginUsesInTheme(pluginId)" in app_js
    assert 'root.classList.toggle("plugin-glass", inTheme);' in app_js
    # Closing an in-theme sheet keeps its transparent stage until the fade
    # ends. Dropping the glass class first would paint the opaque paper over
    # the live notebook for one frame, which readers saw as a page refresh.
    close_block = app_js.split("function closePluginPanel() {", 1)[1].split("\n}", 1)[0]
    assert 'const inTheme = Boolean(root?.classList.contains("plugin-glass"));' in close_block
    assert "if (!inTheme) {" in close_block
    assert "if (openPluginId) return;" in close_block
    assert 'root.innerHTML = "";' in close_block
    assert "}, 220);" in close_block
    assert "window.NeoTodoPostcards = {" in app_js
    for method in ("list()", "article(cardId)", "open(cardId)", "markSeen(cardId)"):
        assert method in app_js, method
    # The plugin page has no sprite, so the bridge can swap the per-item icon.
    assert "function postcardArticleHtml(card, doneIcon = completedIcon())" in app_js
    assert 'postcardArticleHtml(card, \'<span class="pc-star" aria-hidden="true">✦</span>\')' in app_js

    plugin_html = read(PLUGIN / "index.html")
    assert 'href="/style.css"' in plugin_html
    assert 'class="settings-stage"' in plugin_html
    assert 'class="settings-panel"' in plugin_html
    assert "data-close" in plugin_html
    assert 'id="pc-archive"' in plugin_html

    plugin_js = read(PLUGIN / "plugin.js")
    assert "window.parent.NeoTodoPostcards" in plugin_js
    assert 'type: "neotodo-plugin-close"' in plugin_js
    assert "data-pc-card" in plugin_js

    for catalog_path in (ROOT / "community" / "catalog.json", WEB / "plugins" / "community-catalog.json"):
        catalog = json.loads(read(catalog_path))
        entries = {entry["id"]: entry for entry in catalog["plugins"]}
        assert entries["postcard"]["bundled"] is True
        assert "intheme" in entries["palette"]["tags"]

    print("the postcard archive is an in-theme plugin and the picture slot manages AI")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
