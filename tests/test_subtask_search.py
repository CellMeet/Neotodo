"""Subtask Search is one action: jump to the row and select it.

The plugin lists matches under the field. Clicking a result must not only
scroll the original subtask row into view: it must take the app's own row
selection path (the same handler a pointer click uses), so the note follows
without a second click. The drawer keeps its own frosted glass material, with
square corners, deep-black magnifiers and a width inside the ruled block. Its
blur radius is a plugin setting, tuned on the control page and shared with the
live drawer.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    plugin = (ROOT / "web" / "plugins" / "subtask-search" / "subtask-search.js").read_text(encoding="utf-8")

    # Jumping selects through the app's row handler, with a click fallback.
    assert "function selectRow(row)" in plugin
    assert "typeof selectCurrentSubtaskNote === \"function\"" in plugin
    assert "selectCurrentSubtaskNote(row);" in plugin
    assert "new MouseEvent(\"click\"" in plugin
    # The row is selected before the scroll is measured.
    jump = plugin.split("function jumpToResult(", 1)[1].split("function resetView(", 1)[0]
    assert jump.index("selectRow(picked)") < jump.index("requestAnimationFrame(")
    # Selecting happens after the finished-task drawer is opened.
    assert jump.index("toggleCompletedSubtasks(true)") < jump.index("selectRow(picked)")

    # Enter with no matches turns the typed words into a new subtask through the
    # app's own add-subtask action, then selects it like a search hit. The field
    # empties on the way out (jumpToResult clears it), and leaving the field
    # without Enter also empties it.
    assert "async function createSubtaskFromQuery()" in plugin
    assert 'action("add_subtask", { todo_id: todoId, name })' in plugin
    keyboard = plugin.split('input.addEventListener("keydown"', 1)[1].split("// Clicking anywhere", 1)[0]
    assert "createSubtaskFromQuery();" in keyboard
    assert "function scheduleBlurClear(event, panel)" not in plugin
    assert "let drawerPointerDown = false;" in plugin
    assert "if (drawerPointerDown) return;" in plugin
    assert 'document.addEventListener("pointerdown", (event) => {' in plugin
    assert "if (query) clearSearch(false);" in plugin
    assert '"Enter 新建"' in plugin

    # The blur is a setting: the live page paints --ss-search-blur from the
    # shared localStorage key and follows the control page's message.
    assert 'const BLUR_KEY = "neotodo.subtask-search.blur";' in plugin
    assert 'const BLUR_DEFAULT = 26;' in plugin
    assert 'setProperty("--ss-search-blur"' in plugin
    assert "window.setSubtaskSearchBlur" in plugin
    assert '"neotodo-subtask-search-blur"' in plugin
    assert 'event.key !== BLUR_KEY' in plugin

    css = (ROOT / "web" / "plugins" / "subtask-search" / "subtask-search.css").read_text(encoding="utf-8")

    # The pane is FocusWriter's recipe: one flat wash over a real blur, no
    # gloss and no dots. It is a solid, square-cornered box with one hairline
    # edge, and it spans the full width of the subtask rows instead of
    # shrink-wrapping to the field's content.
    drawer = css.split(".subtask-search-drawer {", 1)[1].split("\n}", 1)[0]
    assert "backdrop-filter: var(--ss-glass-blur)" in drawer
    assert "blur(var(--ss-search-blur, 26px))" in drawer
    assert "saturate(1.2)" in drawer
    assert "--ss-glass-speckle" not in css
    assert "--ss-glass-noise" not in css
    assert "background-image: none;" in drawer
    assert "border: 1px solid var(--ss-glass-edge);" in drawer
    assert "box-shadow: none;" in drawer
    assert "border-radius: 0;" in drawer
    assert "overflow: hidden;" in drawer
    assert "right: 0;" in drawer and "left: 0;" in drawer
    assert "min-width: 100%;" in drawer
    # The open pane owns a real strip: the script measures its height into
    # --ss-open-h and the whole subtask column (rows, Doing card, completed
    # card) is pushed down by exactly that much. Nothing overlaps the pane and
    # nothing in the column can paint over its bottom edge.
    push = css.split(
        "body.subtask-search-open .page-body > .todos-section > .current-half > .current-inner {",
        1,
    )[1].split("\n}", 1)[0]
    assert "height: calc(100% - var(--ss-open-h, 48px));" in push
    assert "transform: translate3d(0, var(--ss-open-h, 48px), 0);" in push
    # The pane and the whole column pop on one short beat: the same duration
    # and curve on both, so the search field can never lead or lag the rows
    # under it while the drawer opens.
    assert "--ss-pop-ms: 100ms;" in css
    assert "--ss-pop-ease: cubic-bezier(0.33, 1, 0.68, 1);" in css
    inner = css.split(
        "body.subtask-search-on .page-body > .todos-section > .current-half > .current-inner {",
        1,
    )[1].split("\n}", 1)[0]
    assert "transition:" in inner
    assert "transform var(--ss-pop-ms, 100ms) var(--ss-pop-ease" in inner
    assert "height var(--ss-pop-ms, 100ms) var(--ss-pop-ease" in inner
    open_drawer = css.split(".subtask-search-drawer.open {", 1)[1].split("\n}", 1)[0]
    assert "transform var(--ss-pop-ms, 100ms) var(--ss-pop-ease" in open_drawer
    assert "0.5s" not in open_drawer and "0.46s" not in open_drawer
    assert "function publishPaneHeight()" in plugin
    assert "function schedulePaneHeight()" in plugin
    assert "panel.offsetHeight" in plugin
    assert 'half.style.setProperty("--ss-open-h"' in plugin
    # The bar is a full row — a little taller than the 40px task row, so it
    # never reads as a clipped slot — and its hairline is inside that height.
    bar = css.split(".subtask-search-bar {", 1)[1].split("\n}", 1)[0]
    assert "height: var(--ss-field-h, 46px);" in bar
    assert "border-bottom: 1px solid var(--ss-glass-line);" in bar
    assert "box-sizing: border-box;" in bar
    # The focused field is a flat tint, not a gloss.
    focus_bar = css.split(".subtask-search-bar.is-focused {", 1)[1].split("\n}", 1)[0]
    assert "background: rgba(255, 255, 255, 0.10);" in focus_bar

    # The empty result row says what Enter does right where the results would be.
    assert ".subtask-search-empty-hint {" in css
    assert "text-transform" not in css.split(".subtask-search-empty-hint {", 1)[1].split("\n}", 1)[0]

    # Deep-black magnifiers: the field icon (bigger) and the rail card icon.
    field_icon = css.split(".subtask-search-field-icon {", 1)[1].split("\n}", 1)[0]
    assert "filter: brightness(0);" in field_icon
    assert "width: 20px;" in field_icon and "height: 20px;" in field_icon
    rail_icon = css.split(".subtask-search-rail-icon {", 1)[1].split("\n}", 1)[0]
    assert "filter: brightness(0)" in rail_icon
    assert "width: 36px;" in rail_icon and "height: 36px;" in rail_icon
    # A dark note paper keeps a light stamp so the icon never disappears.
    assert 'html[data-note-dark="true"] .subtask-search-rail-icon' in css
    assert "invert(1)" in css

    # The control page owns the slider and posts the value to the live page.
    page = (ROOT / "web" / "plugins" / "subtask-search" / "index.html").read_text(encoding="utf-8")
    assert 'id="ss-blur"' in page
    assert 'type="range" min="0" max="80"' in page
    control = (ROOT / "web" / "plugins" / "subtask-search" / "plugin.js").read_text(encoding="utf-8")
    assert 'const BLUR_KEY = "neotodo.subtask-search.blur";' in control
    assert "localStorage.setItem(BLUR_KEY" in control
    assert "setSubtaskSearchBlur" in control
    assert "neotodo-subtask-search-blur" in control
    # The preview field uses the same radius.
    preview = (ROOT / "web" / "plugins" / "subtask-search" / "plugin.css").read_text(encoding="utf-8")
    assert "blur(var(--ss-search-blur, 26px))" in preview
    assert "ss-blur-range" in preview

    print("the search result selects its subtask, and the frosted blur is adjustable")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
