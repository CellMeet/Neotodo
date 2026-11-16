# [macos] Native macOS shell for NeoTodo: PyObjC + WKWebView.
"""Replace the Linux GTK shell with a native macOS one.

The Python store, HTTP API and the whole ``web/`` workspace are the Linux-first
sources copied by ``sync-sources.sh``. This module only swaps the outer window:

* one ``NSWindow`` per notebook (WKWebView showing the local server),
* the same ``https://neotodo.local/...`` bridge the page already speaks
  (``/open``, ``/home``, ``/new-window``, ``/window/move``),
* native folder and wallpaper pickers for ``app.FOLDER_PICK_CALLBACK`` and
  ``app.FILE_PICK_CALLBACK``,
* the macOS menu bar, Cmd+Q cleanup and renderer-crash recovery.

Run it from source with ``./run-macos.sh`` after installing the PyObjC wheels.
``build.sh`` packages the same entry point with py2app.
"""

from __future__ import annotations

import signal
import sys
import threading
import traceback
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import AppKit
import objc
import WebKit
from AppKit import (
    NSApplication,
    NSApplicationActivationPolicyRegular,
    NSBackingStoreBuffered,
    NSColor,
    NSImage,
    NSMenu,
    NSMenuItem,
    NSOpenPanel,
    NSScreen,
    NSViewHeightSizable,
    NSViewWidthSizable,
    NSWindow,
    NSWindowStyleMaskClosable,
    NSWindowStyleMaskMiniaturizable,
    NSWindowStyleMaskResizable,
    NSWindowStyleMaskTitled,
    NSWorkspace,
)
from Foundation import (
    NSMakeRect,
    NSMakeSize,
    NSObject,
    NSTimer,
    NSURL,
    NSURLRequest,
)
from PyObjCTools import AppHelper

# WebKit enums are plain integers in PyObjC; keep fallbacks so a future wheel
# renaming a constant cannot stop the shell from starting.
POLICY_ALLOW = getattr(WebKit, "WKNavigationActionPolicyAllow", 1)
POLICY_CANCEL = getattr(WebKit, "WKNavigationActionPolicyCancel", 0)
MODAL_OK = getattr(AppKit, "NSModalResponseOK", 1)
TERMINATE_NOW = 1

APP_PAINTED_JS = "Boolean(document.body && document.body.classList.contains('app-painted'))"
READY_POLL_SECONDS = 0.05
READY_FALLBACK_SECONDS = 6.0


def resource_root() -> Path:
    """Folder that holds ``web/`` and ``icon.svg`` in both dev and app bundle."""
    if getattr(sys, "frozen", False):
        # .../NeoTodo.app/Contents/MacOS/NeoTodo -> .../NeoTodo.app/Contents/Resources
        return Path(sys.executable).resolve().parents[1] / "Resources"
    return Path(__file__).resolve().parent


def _log(message: str) -> None:
    try:
        print(f"[neotodo-macos] {message}", file=sys.stderr, flush=True)
    except Exception:
        pass


def _redirect_to_log_file() -> None:
    """A bundled .app has no terminal; keep startup errors inspectable."""
    if not getattr(sys, "frozen", False):
        return
    try:
        log_dir = Path.home() / "Library" / "Logs"
        log_dir.mkdir(parents=True, exist_ok=True)
        stream = open(log_dir / "NeoTodo.log", "a", encoding="utf-8", buffering=1)
        sys.stdout = stream
        sys.stderr = stream
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Window controllers
# ---------------------------------------------------------------------------
class WindowController:
    """One native window plus its WKWebView and bridge state."""

    def __init__(self, shell, url: str, main: bool = False, width: int = 1280, height: int = 840):
        self.shell = shell
        self.main = main
        self.url = url
        self.revealed = False
        self.loaded = False
        self.closed_flag = False
        self.polling = False
        self.timers = []
        self.window = None
        self.webview = None
        self.window_delegate = None
        self.navigation_delegate = None
        self.ui_delegate = None
        self._build(width, height)

    # -- construction -------------------------------------------------------
    def _build(self, width: int, height: int) -> None:
        style = (
            NSWindowStyleMaskTitled
            | NSWindowStyleMaskClosable
            | NSWindowStyleMaskMiniaturizable
            | NSWindowStyleMaskResizable
        )
        try:
            visible = NSScreen.mainScreen().visibleFrame()
            width = int(min(width, max(760, visible.size.width - 80)))
            height = int(min(height, max(520, visible.size.height - 80)))
        except Exception:
            width, height = 1280, 840

        window = NSWindow.alloc().initWithContentRect_styleMask_backing_defer_(
            NSMakeRect(0, 0, width, height), style, NSBackingStoreBuffered, False
        )
        window.setTitle_("NeoTodo")
        window.setMinSize_(NSMakeSize(760, 520))
        window.setReleasedWhenClosed_(False)
        window.setBackgroundColor_(NSColor.windowBackgroundColor())
        window.center()
        if self.main:
            try:
                window.setFrameAutosaveName_("NeoTodoMainWindow")
            except Exception:
                pass

        config = WebKit.WKWebViewConfiguration.alloc().init()
        try:
            # The workspace is driven by the wheel and the keyboard; let WebAudio
            # (foley sounds, music plugin) start without a first click.
            config.setMediaTypesRequiringUserActionForPlayback_(0)
        except Exception:
            pass
        try:
            config.setWebsiteDataStore_(WebKit.WKWebsiteDataStore.defaultDataStore())
        except Exception:
            pass

        webview = WebKit.WKWebView.alloc().initWithFrame_configuration_(
            NSMakeRect(0, 0, width, height), config
        )
        webview.setAutoresizingMask_(NSViewWidthSizable | NSViewHeightSizable)
        try:
            webview.setAllowsBackForwardNavigationGestures_(False)
        except Exception:
            pass

        window.setContentView_(webview)

        self.window = window
        self.webview = webview
        self.window_delegate = WindowDelegate.alloc().initWithController_(self)
        self.navigation_delegate = NavigationDelegate.alloc().initWithController_(self)
        self.ui_delegate = DialogDelegate.alloc().initWithController_(self)
        window.setDelegate_(self.window_delegate)
        webview.setNavigationDelegate_(self.navigation_delegate)
        webview.setUIDelegate_(self.ui_delegate)

        # The window stays invisible until the finished page says it painted,
        # so a launch never flashes WebKit's white background.
        window.setAlphaValue_(0.0)

    # -- loading ------------------------------------------------------------
    def load(self) -> None:
        try:
            target = NSURL.URLWithString_(self.url)
            request = NSURLRequest.requestWithURL_(target)
            self.webview.loadRequest_(request)
        except Exception:
            _log("load failed:\n" + traceback.format_exc())
            self.reveal("load-error")

    def show(self) -> None:
        self.window.makeKeyAndOrderFront_(None)
        if self.main:
            try:
                NSApplication.sharedApplication().activateIgnoringOtherApps_(True)
            except Exception:
                pass

    def start_ready_poll(self) -> None:
        if self.revealed or self.closed_flag or self.polling:
            return
        self.polling = True
        poller = ReadyPoller.alloc().initWithController_(self)
        timer = NSTimer.scheduledTimerWithTimeInterval_target_selector_userInfo_repeats_(
            READY_POLL_SECONDS, poller, b"tick:", None, True
        )
        fallback = NSTimer.scheduledTimerWithTimeInterval_target_selector_userInfo_repeats_(
            READY_FALLBACK_SECONDS, poller, b"fallback:", None, False
        )
        self.timers.extend([timer, fallback])

    def evaluate_painted(self, timer) -> None:
        if self.revealed or self.closed_flag:
            self._stop_timers()
            return

        def done(result, error):
            if self.revealed or self.closed_flag:
                self._stop_timers()
                return
            if bool(result):
                self.reveal("painted")

        try:
            self.webview.evaluateJavaScript_completionHandler_(APP_PAINTED_JS, done)
        except Exception:
            # The 6 s fallback still reveals the window if the script bridge is
            # not ready yet; keep the poller alive instead of hanging at alpha 0.
            pass

    def reveal(self, reason: str) -> None:
        if self.revealed or self.closed_flag:
            return
        self.revealed = True
        self._stop_timers()
        try:
            AppKit.NSAnimationContext.beginGrouping()
            context = AppKit.NSAnimationContext.currentContext()
            context.setDuration_(0.16)
            self.window.animator().setAlphaValue_(1.0)
            AppKit.NSAnimationContext.endGrouping()
        except Exception:
            try:
                self.window.setAlphaValue_(1.0)
            except Exception:
                pass
        _log(f"window shown ({reason})")

    def _stop_timers(self) -> None:
        self.polling = False
        for timer in self.timers:
            try:
                timer.invalidate()
            except Exception:
                pass
        self.timers = []

    # -- window behaviour ---------------------------------------------------
    def dock_home(self) -> None:
        main = self.shell.main_controller
        if main is not None and main is not self:
            main.show()
        if not self.main:
            self.window.close()

    def begin_move(self) -> None:
        # Only detached panels ask for this. AppKit needs the live mouse event;
        # when the bridge arrives after the pointer is gone, the standard title
        # bar still moves the window.
        try:
            event = NSApplication.sharedApplication().currentEvent()
            if event is not None:
                self.window.performWindowDragWithEvent_(event)
        except Exception:
            pass

    def reload(self) -> None:
        try:
            self.webview.reload()
        except Exception:
            pass

    def closed(self) -> None:
        if self.closed_flag:
            return
        self.closed_flag = True
        self._stop_timers()
        self.shell.controller_closed(self)

    def detach_delegates(self) -> None:
        # Break the webView -> delegate -> controller cycle when the window
        # closes so a long session does not grow one controller per panel.
        try:
            self.webview.setNavigationDelegate_(None)
            self.webview.setUIDelegate_(None)
            self.window.setDelegate_(None)
        except Exception:
            pass


class ReadyPoller(NSObject):
    """NSTimer target that asks the page whether its first frame is painted."""

    def initWithController_(self, controller):
        self = objc.super(ReadyPoller, self).init()
        if self is None:
            return None
        self.controller = controller
        return self

    def tick_(self, timer):
        controller = self.controller
        if controller is None:
            try:
                timer.invalidate()
            except Exception:
                pass
            return
        controller.evaluate_painted(timer)

    def fallback_(self, timer):
        controller = self.controller
        if controller is None:
            try:
                timer.invalidate()
            except Exception:
                pass
            return
        controller.reveal("fallback")


class WindowDelegate(NSObject):
    def initWithController_(self, controller):
        self = objc.super(WindowDelegate, self).init()
        if self is None:
            return None
        self.controller = controller
        return self

    def windowWillClose_(self, notification):
        controller = self.controller
        if controller is not None:
            controller.closed()


class NavigationDelegate(NSObject):
    """Answers the page's bridge URLs and keeps navigation on this machine."""

    def initWithController_(self, controller):
        self = objc.super(NavigationDelegate, self).init()
        if self is None:
            return None
        self.controller = controller
        return self

    def webView_decidePolicyForNavigationAction_decisionHandler_(self, webView, action, handler):
        try:
            url = action.request().URL()
            scheme = (url.scheme() or "").lower()
            host = (url.host() or "").lower()
            if host == "neotodo.local":
                controller = self.controller
                if controller is not None:
                    # Window creation/closing is deferred to the next run-loop
                    # turn, like the GTK shell's GLib.idle_add. A drag needs the
                    # live mouse event, so it runs right here.
                    if (url.path() or "").startswith("/window/"):
                        controller.shell.handle_bridge(url, controller)
                    else:
                        AppHelper.callAfter(controller.shell.handle_bridge, url, controller)
                handler(POLICY_CANCEL)
                return
            if scheme in ("http", "https") and host in ("127.0.0.1", "localhost"):
                handler(POLICY_ALLOW)
                return
            # Plugin iframes may start on about:blank / blob data; those never
            # touch the network and must load normally.
            if scheme in ("about", "data", "blob"):
                handler(POLICY_ALLOW)
                return
            # Anything that leaves the notebook opens in the default browser,
            # which keeps the WKWebView locked to the local workspace.
            if scheme in ("http", "https", "mailto"):
                NSWorkspace.sharedWorkspace().openURL_(url)
            handler(POLICY_CANCEL)
        except Exception:
            _log("navigation policy failed:\n" + traceback.format_exc())
            try:
                handler(POLICY_ALLOW)
            except Exception:
                pass

    def webView_didFinishNavigation_(self, webView, navigation):
        controller = self.controller
        if controller is None:
            return
        controller.loaded = True
        controller.start_ready_poll()

    def webView_didFailNavigation_withError_(self, webView, navigation, error):
        _log(f"navigation failed: {error}")
        controller = self.controller
        if controller is not None:
            controller.reveal("navigation-failed")

    def webView_didFailProvisionalNavigation_withError_(self, webView, navigation, error):
        _log(f"provisional navigation failed: {error}")
        controller = self.controller
        if controller is not None:
            controller.reveal("navigation-failed")

    def webViewWebContentProcessDidTerminate_(self, webView):
        # Match the GTK shell: a crashed renderer reloads instead of leaving a
        # blank window behind.
        _log("web content process terminated; reloading")
        try:
            webView.reload()
        except Exception:
            pass

    def webView_createWebViewWithConfiguration_forNavigationAction_windowFeatures_(
        self, webView, configuration, navigationAction, windowFeatures
    ):
        # window.open / target="_blank": keep local pages inside the app and
        # send anything else to the default browser.
        try:
            url = navigationAction.request().URL()
            if url is None:
                return None
            scheme = (url.scheme() or "").lower()
            host = (url.host() or "").lower()
            controller = self.controller
            if scheme in ("http", "https") and host in ("127.0.0.1", "localhost"):
                if controller is not None:
                    AppHelper.callAfter(
                        controller.shell.open_detached, url.absoluteString()
                    )
            elif scheme in ("http", "https", "mailto"):
                NSWorkspace.sharedWorkspace().openURL_(url)
        except Exception:
            pass
        return None


class DialogDelegate(NSObject):
    """Native alert / confirm / prompt for plugin iframes."""

    def initWithController_(self, controller):
        self = objc.super(DialogDelegate, self).init()
        if self is None:
            return None
        self.controller = controller
        return self

    def webView_runJavaScriptAlertPanelWithMessage_initiatedByFrame_completionHandler_(
        self, webView, message, frame, handler
    ):
        try:
            alert = AppKit.NSAlert.alloc().init()
            alert.setMessageText_("NeoTodo")
            alert.setInformativeText_(str(message))
            alert.addButtonWithTitle_("OK")
            alert.runModal()
        except Exception:
            pass
        handler()

    def webView_runJavaScriptConfirmPanelWithMessage_initiatedByFrame_completionHandler_(
        self, webView, message, frame, handler
    ):
        accepted = False
        try:
            alert = AppKit.NSAlert.alloc().init()
            alert.setMessageText_("NeoTodo")
            alert.setInformativeText_(str(message))
            alert.addButtonWithTitle_("OK")
            alert.addButtonWithTitle_("Cancel")
            accepted = alert.runModal() == 1000
        except Exception:
            accepted = False
        handler(bool(accepted))

    def webView_runJavaScriptTextInputPanelWithPrompt_defaultText_initiatedByFrame_completionHandler_(
        self, webView, prompt, defaultText, frame, handler
    ):
        answer = None
        try:
            alert = AppKit.NSAlert.alloc().init()
            alert.setMessageText_("NeoTodo")
            alert.setInformativeText_(str(prompt))
            field = AppKit.NSTextField.alloc().initWithFrame_(NSMakeRect(0, 0, 320, 24))
            field.setStringValue_(str(defaultText or ""))
            alert.setAccessoryView_(field)
            alert.addButtonWithTitle_("OK")
            alert.addButtonWithTitle_("Cancel")
            if alert.runModal() == 1000:
                answer = str(field.stringValue())
        except Exception:
            answer = None
        handler(answer)


# ---------------------------------------------------------------------------
# Shell
# ---------------------------------------------------------------------------
class Shell:
    def __init__(self, app_module):
        self.app = app_module
        self.port = 0
        self.server = None
        self.store = None
        self.main_controller = None
        self.controllers = []
        self.main_controllers = []
        self.shutting_down = False
        self.app_delegate = None
        self.menu_target = None

    # -- backend ------------------------------------------------------------
    def _point_backend_at_resources(self) -> None:
        root = resource_root()
        # The web workspace ships inside the (read-only) bundle, but APP_DIR is
        # also the agent's fallback working folder, so point it at the writable
        # notebook data folder and keep a copy of the icon there for /icon.svg.
        data_dir = Path(self.app.DATA_DIR)
        try:
            data_dir.mkdir(parents=True, exist_ok=True)
            icon_source = root / "icon.svg"
            icon_target = data_dir / "icon.svg"
            if icon_source.is_file() and not icon_target.is_file():
                icon_target.write_bytes(icon_source.read_bytes())
        except Exception:
            pass
        self.app.APP_DIR = data_dir
        self.app.WEB_DIR = root / "web"

    def _start_backend(self) -> None:
        app = self.app
        self.store = app.Store(app.DATA_FILE)
        try:
            app.cleanup_stale_fork_records()
        except Exception:
            pass
        self.server, self.port = app.start_server(self.store)
        _log(f"serving http://127.0.0.1:{self.port}/ from {app.WEB_DIR}")

    # -- lifecycle ----------------------------------------------------------
    def run(self) -> None:
        _redirect_to_log_file()
        self._point_backend_at_resources()
        self._start_backend()

        app = self.app
        app.QUIT_CALLBACK = self.quit_async
        app.FOLDER_PICK_CALLBACK = self.pick_project_folder
        app.FILE_PICK_CALLBACK = self.pick_wallpaper_file

        self._install_signal_handlers()

        nsapp = NSApplication.sharedApplication()
        nsapp.setActivationPolicy_(NSApplicationActivationPolicyRegular)
        self._set_dock_icon(nsapp)

        self.app_delegate = AppDelegate.alloc().initWithShell_(self)
        nsapp.setDelegate_(self.app_delegate)

        self.menu_target = MenuTarget.alloc().initWithShell_(self)
        self._build_menu(nsapp)

        _log("starting Cocoa event loop")
        # Drive NSApplication directly instead of AppHelper.runEventLoop's
        # NSApplicationMain default: this process has no nib, and finishing the
        # launch ourselves means applicationDidFinishLaunching opens the first
        # window exactly once.
        try:
            nsapp.finishLaunching()
            nsapp.run()
        finally:
            self.shutdown()

    def on_launch(self) -> None:
        self.open_main_window()

    def _set_dock_icon(self, nsapp) -> None:
        # The bundle's .icns is used by Finder/Dock; this also gives the
        # from-source run the right icon instead of the Python rocket.
        for name in ("icon-master.png", "icon.png"):
            candidate = resource_root() / name
            if candidate.is_file():
                try:
                    image = NSImage.alloc().initWithContentsOfFile_(str(candidate))
                    if image is not None:
                        nsapp.setApplicationIconImage_(image)
                        return
                except Exception:
                    pass

    def _install_signal_handlers(self) -> None:
        def quit_from_signal(*_args):
            self.quit_async()

        for name in ("SIGTERM", "SIGINT", "SIGHUP"):
            sig = getattr(signal, name, None)
            if sig is None:
                continue
            try:
                signal.signal(sig, quit_from_signal)
            except Exception:
                pass

    def quit_async(self) -> None:
        try:
            AppHelper.callAfter(NSApplication.sharedApplication().terminate_, None)
        except Exception:
            self.shutdown()

    def shutdown(self) -> None:
        if self.shutting_down:
            return
        self.shutting_down = True
        _log("shutting down")
        # Forks are child processes owned by this notebook and agents are
        # interrupted before the process leaves, matching the GTK close.
        try:
            self.app.shutdown_forks()
        except Exception:
            pass
        try:
            agent_store = getattr(self.app.ApiHandler, "agent_store", None)
            if agent_store is not None:
                agent_store.shutdown()
        except Exception:
            pass

    # -- windows ------------------------------------------------------------
    def open_main_window(self):
        url = f"http://127.0.0.1:{self.port}/?desktop=1"
        controller = WindowController(self, url, main=True, width=1280, height=840)
        self.controllers.append(controller)
        self.main_controllers.append(controller)
        self.main_controller = controller
        controller.show()
        controller.load()
        return controller

    def open_detached(self, url: str):
        parsed = urlparse(url or "")
        if parsed.scheme != "http" or parsed.hostname not in ("127.0.0.1", "localhost"):
            _log(f"refused detached window for {url!r}")
            return None
        kind = parse_qs(parsed.query).get("detached", [""])[0]
        if kind == "ai":
            title = "NeoTodo · AI"
        elif kind == "note":
            title = "NeoTodo · Note"
        else:
            title = "NeoTodo"
        controller = WindowController(self, url, main=False, width=960, height=760)
        controller.window.setTitle_(title)
        self.controllers.append(controller)
        controller.show()
        controller.load()
        return controller

    def controller_closed(self, controller) -> None:
        if controller in self.controllers:
            self.controllers.remove(controller)
        if controller in self.main_controllers:
            self.main_controllers.remove(controller)
        if controller is self.main_controller:
            self.main_controller = self.main_controllers[-1] if self.main_controllers else None
        controller.detach_delegates()
        # Closing the notebook ends the app (forks and agents included); a
        # detached panel closing on its own does not.
        if not self.main_controllers and not self.shutting_down:
            self.quit_async()

    # -- bridge -------------------------------------------------------------
    def handle_bridge(self, url, controller) -> None:
        try:
            path = url.path() or "/"
            params = parse_qs(url.query() or "")
            if path == "/open":
                self.open_detached(params.get("url", [""])[0])
            elif path == "/new-window":
                self.open_main_window()
            elif path == "/home":
                controller.dock_home()
            elif path.startswith("/window/"):
                action = path.rsplit("/", 1)[-1]
                if action == "move":
                    controller.begin_move()
                # "resize" is a no-op: the native window already has live edges.
        except Exception:
            _log("bridge failed:\n" + traceback.format_exc())

    def reload_active(self) -> None:
        for controller in reversed(self.controllers):
            try:
                if controller.window.isKeyWindow():
                    controller.reload()
                    return
            except Exception:
                pass
        if self.main_controller is not None:
            self.main_controller.reload()

    # -- native pickers -----------------------------------------------------
    def _on_main_thread(self, work, timeout: float = 180.0):
        from Foundation import NSThread

        if NSThread.isMainThread():
            return work()
        result = {"value": None}
        done = threading.Event()

        def runner():
            try:
                result["value"] = work()
            except Exception:
                _log("picker failed:\n" + traceback.format_exc())
            finally:
                done.set()

        AppHelper.callAfter(runner)
        done.wait(timeout)
        return result["value"]

    def pick_project_folder(self):
        def show():
            panel = NSOpenPanel.openPanel()
            panel.setTitle_("Choose project folder")
            panel.setMessage_("The crew reads and writes inside this folder.")
            panel.setCanChooseFiles_(False)
            panel.setCanChooseDirectories_(True)
            panel.setAllowsMultipleSelection_(False)
            panel.setResolvesAliases_(True)
            if panel.runModal() == MODAL_OK:
                return panel.URL().path()
            return None

        return self._on_main_thread(show)

    def pick_wallpaper_file(self):
        def show():
            panel = NSOpenPanel.openPanel()
            panel.setTitle_("Choose wallpaper")
            panel.setMessage_("Pick an image or a short film. NeoTodo reads it in place.")
            panel.setCanChooseFiles_(True)
            panel.setCanChooseDirectories_(False)
            panel.setAllowsMultipleSelection_(False)
            panel.setResolvesAliases_(True)
            try:
                panel.setAllowedFileTypes_([
                    "jpg", "jpeg", "png", "webp", "gif", "avif",
                    "mp4", "webm", "mov", "m4v", "ogv",
                ])
            except Exception:
                pass
            if panel.runModal() == MODAL_OK:
                return panel.URL().path()
            return None

        return self._on_main_thread(show)

    # -- menu ---------------------------------------------------------------
    def _build_menu(self, nsapp) -> None:
        main_menu = NSMenu.alloc().init()

        app_item = NSMenuItem.alloc().init()
        main_menu.addItem_(app_item)
        app_menu = NSMenu.alloc().init()
        app_menu.addItemWithTitle_action_keyEquivalent_(
            "About NeoTodo", "orderFrontStandardAboutPanel:", ""
        )
        app_menu.addItem_(NSMenuItem.separatorItem())
        app_menu.addItemWithTitle_action_keyEquivalent_("Hide NeoTodo", "hide:", "h")
        hide_others = app_menu.addItemWithTitle_action_keyEquivalent_(
            "Hide Others", "hideOtherApplications:", "h"
        )
        try:
            hide_others.setKeyEquivalentModifierMask_(
                AppKit.NSEventModifierFlagCommand | AppKit.NSEventModifierFlagOption
            )
        except Exception:
            pass
        app_menu.addItemWithTitle_action_keyEquivalent_("Show All", "unhideAllApplications:", "")
        app_menu.addItem_(NSMenuItem.separatorItem())
        app_menu.addItemWithTitle_action_keyEquivalent_("Quit NeoTodo", "terminate:", "q")
        app_item.setSubmenu_(app_menu)

        file_item = NSMenuItem.alloc().init()
        file_item.setTitle_("File")
        main_menu.addItem_(file_item)
        file_menu = NSMenu.alloc().init()
        file_menu.addItemWithTitle_action_keyEquivalent_(
            "New Window", "newWindow:", "n"
        ).setTarget_(self.menu_target)
        file_menu.addItemWithTitle_action_keyEquivalent_(
            "Show Notebook Folder", "openDataFolder:", ""
        ).setTarget_(self.menu_target)
        file_menu.addItem_(NSMenuItem.separatorItem())
        file_menu.addItemWithTitle_action_keyEquivalent_("Close Window", "performClose:", "w")
        file_item.setSubmenu_(file_menu)

        edit_item = NSMenuItem.alloc().init()
        edit_item.setTitle_("Edit")
        main_menu.addItem_(edit_item)
        edit_menu = NSMenu.alloc().init()
        edit_menu.addItemWithTitle_action_keyEquivalent_("Undo", "undo:", "z")
        redo = edit_menu.addItemWithTitle_action_keyEquivalent_("Redo", "redo:", "z")
        try:
            redo.setKeyEquivalentModifierMask_(
                AppKit.NSEventModifierFlagCommand | AppKit.NSEventModifierFlagShift
            )
        except Exception:
            pass
        edit_menu.addItem_(NSMenuItem.separatorItem())
        edit_menu.addItemWithTitle_action_keyEquivalent_("Cut", "cut:", "x")
        edit_menu.addItemWithTitle_action_keyEquivalent_("Copy", "copy:", "c")
        edit_menu.addItemWithTitle_action_keyEquivalent_("Paste", "paste:", "v")
        edit_menu.addItemWithTitle_action_keyEquivalent_("Select All", "selectAll:", "a")
        edit_item.setSubmenu_(edit_menu)

        view_item = NSMenuItem.alloc().init()
        view_item.setTitle_("View")
        main_menu.addItem_(view_item)
        view_menu = NSMenu.alloc().init()
        view_menu.addItemWithTitle_action_keyEquivalent_(
            "Reload", "reloadWindow:", "r"
        ).setTarget_(self.menu_target)
        full_screen = view_menu.addItemWithTitle_action_keyEquivalent_(
            "Enter Full Screen", "toggleFullScreen:", "f"
        )
        try:
            full_screen.setKeyEquivalentModifierMask_(
                AppKit.NSEventModifierFlagCommand | AppKit.NSEventModifierFlagControl
            )
        except Exception:
            pass
        view_item.setSubmenu_(view_menu)

        window_item = NSMenuItem.alloc().init()
        window_item.setTitle_("Window")
        main_menu.addItem_(window_item)
        window_menu = NSMenu.alloc().init()
        window_menu.addItemWithTitle_action_keyEquivalent_("Minimize", "performMiniaturize:", "m")
        window_menu.addItemWithTitle_action_keyEquivalent_("Zoom", "performZoom:", "")
        window_item.setSubmenu_(window_menu)

        nsapp.setMainMenu_(main_menu)


class MenuTarget(NSObject):
    def initWithShell_(self, shell):
        self = objc.super(MenuTarget, self).init()
        if self is None:
            return None
        self.shell = shell
        return self

    def newWindow_(self, sender):
        self.shell.open_main_window()

    def openDataFolder_(self, sender):
        try:
            NSWorkspace.sharedWorkspace().openURL_(
                NSURL.fileURLWithPath_(str(self.shell.app.DATA_DIR))
            )
        except Exception:
            pass

    def reloadWindow_(self, sender):
        self.shell.reload_active()


class AppDelegate(NSObject):
    def initWithShell_(self, shell):
        self = objc.super(AppDelegate, self).init()
        if self is None:
            return None
        self.shell = shell
        return self

    def applicationDidFinishLaunching_(self, notification):
        self.shell.on_launch()

    def applicationShouldTerminateAfterLastWindowClosed_(self, sender):
        return True

    def applicationShouldTerminate_(self, sender):
        self.shell.shutdown()
        return TERMINATE_NOW

    def applicationWillTerminate_(self, notification):
        self.shell.shutdown()


def run(app_module) -> int:
    """Entry point used by main.py; returns after the app terminates."""
    try:
        shell = Shell(app_module)
        shell.run()
        return 0
    except Exception:
        _log("fatal:\n" + traceback.format_exc())
        try:
            alert = AppKit.NSAlert.alloc().init()
            alert.setMessageText_("NeoTodo could not start")
            alert.setInformativeText_(
                "See ~/Library/Logs/NeoTodo.log for details.\n\n"
                + traceback.format_exc(limit=2)
            )
            alert.runModal()
        except Exception:
            pass
        return 1


def main() -> int:
    # Standalone convenience: import the vendored backend and run the shell.
    import app as backend

    return run(backend)


if __name__ == "__main__":
    raise SystemExit(main())
