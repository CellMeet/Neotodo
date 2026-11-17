"""Changing Settings pages patches the sheet instead of rebuilding it.

Every tab used to go through one `panel.innerHTML` write. That threw away the
nav, the brand, the close button and the current page and recreated all of them
for a switch that only changes what sits under the title. The click therefore
paid for the whole sheet, dropped keyboard focus off the nav, and the page the
reader had just settled on blinked again whenever an async shelf fetch answered.

The page swap now keeps the shell and reprints only `.settings-view`:

* the active nav item is a class flip;
* the title and the calligraphic top row are updated in place;
* an identical view string is not written a second time, so the sound/theme
  shelf reload that follows a switch settles in one write instead of three.

The AI sheet already worked this way, so both Settings windows now switch pages
on the same path.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def block_after(text: str, marker: str) -> str:
    assert marker in text, f"missing marker: {marker}"
    return text.split(marker, 1)[1]


def check_shell_is_reused(app_js: str) -> None:
    render = block_after(app_js, "function renderSettings() {").split(
        "\nlet focusTimer", 1
    )[0]
    assert render.count("panel.innerHTML") == 1, (
        "a Settings page switch still replaces the whole panel"
    )
    assert 'panel.querySelector(":scope > .settings-nav")' in render
    assert 'panel.querySelector(":scope > .settings-main")' in render
    assert 'main?.querySelector(":scope > .settings-topbar")' in render
    assert 'main?.querySelector(":scope > .settings-scroll > .settings-view")' in render
    assert "nav.querySelectorAll(\"[data-settings-tab]\")" in render
    assert 'button.classList.toggle("active", button.dataset.settingsTab === settingsTab)' in render
    assert "title.textContent = pageTitle" in render
    assert 'title.classList.toggle("settings-page-title-art", artTitle)' in render
    assert 'topbar.classList.toggle("settings-topbar-art", artTitle)' in render
    assert "viewHost.innerHTML = view" in render
    assert "if (viewHost._settingsView !== view)" in render, (
        "an unchanged page is printed again"
    )
    # The full write is the first-paint fallback only.
    fallback = block_after(render, "} else {")
    assert "panel.innerHTML" in fallback
    assert "freshView._settingsView = view" in fallback


def check_shelves_reprint_once(app_js: str) -> None:
    theme = block_after(app_js, "function refreshThemeShelves() {").split("\n}", 1)[0]
    sound = block_after(app_js, "function refreshSoundShelves() {").split("\n}", 1)[0]
    for name, helper in (("theme", theme), ("sound", sound)):
        assert "Promise.all(" in helper, f"{name} shelves still repaint once per fetch"
        assert helper.count("renderSettings()") == 1, (
            f"{name} page is reprinted more than once"
        )

    open_settings = block_after(app_js, "function openSettings(tab = \"theme\") {").split(
        "\n}\n", 1
    )[0]
    assert "refreshThemeShelves();" in open_settings
    assert "refreshSoundShelves();" in open_settings
    assert ".then(() => { if (settingsTab ===" not in open_settings, (
        "opening Settings still repaints once per folder"
    )

    tab_click = block_after(app_js, 'const settingsTabNode = event.target.closest("[data-settings-tab]");')
    tab_click = tab_click.split("return;", 1)[0]
    assert "refreshSoundShelves();" in tab_click
    assert ".then(() => { if (settingsTab ===" not in tab_click, (
        "the Music tab still repaints once per folder"
    )


def check_ai_sheet_stays_patched(app_js: str) -> None:
    view = block_after(app_js, "function renderAiSettingsModal() {").split("\n}", 1)[0]
    assert 'view.innerHTML = aiSettings();' in view
    assert ".settings-panel" not in view, "the AI page swap rebuilds its shell"


def main() -> int:
    app_js = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    check_shell_is_reused(app_js)
    check_shelves_reprint_once(app_js)
    check_ai_sheet_stays_patched(app_js)
    print("Settings page switches patch the view and reprint the shelves once")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
