# [win] Windows shell for NeoTodo.
"""Windows shell for NeoTodo.

The Linux app uses GTK4 + WebKitGTK. The web layer is platform-neutral, so the
Windows build reuses the same Python HTTP backend and renders it through Qt
WebEngine (Chromium). Build it with PyInstaller on Windows; see
.github/workflows/release.yml and installer.iss.

The shell mirrors the Linux behaviours the page relies on:

* the `neotodo.local` bridge (`new-window`, `open`, `home`, `window/move`,
  `window/resize`) through which the page asks for real OS windows;
* the native folder and wallpaper pickers behind `choose_project_folder` and
  `choose_wallpaper_file`;
* the `app-painted` reveal gate, so the first visible frame is the finished
  page instead of a blank WebEngine view;
* a named WebEngine profile under `%APPDATA%\\NeoTodo`, so volume, panel
  geometry and the plugin rail survive a restart;
* a clean quit that stops forks and agents before the process exits.

The release build is a PyInstaller bundle wrapped in an Inno Setup installer,
so the installed app needs neither Python nor PySide6 on the user's machine.
"""

from __future__ import annotations

import os
import sys
import threading
import traceback
from datetime import datetime
from urllib.parse import parse_qs

from PySide6.QtCore import QObject, Qt, QTimer, QUrl, Signal
from PySide6.QtGui import QColor, QIcon
from PySide6.QtWidgets import (
    QApplication,
    QFileDialog,
    QMainWindow,
    QWidget,
)

from PySide6.QtWebEngineCore import (
    QWebEnginePage,
    QWebEngineProfile,
    QWebEngineSettings,
)
from PySide6.QtWebEngineWidgets import QWebEngineView

import app as backend

BRIDGE_HOST = "neotodo.local"
BACKGROUND = "#120b06"
# The backend keeps the fixed loopback port for the first copy; a second copy
# takes a free port and must not share Chrome's profile lock.
PRIMARY_PORT = 47321
WALLPAPER_FILTER = (
    "Pictures and films (*.jpg *.jpeg *.png *.webp *.gif *.avif "
    "*.mp4 *.webm *.mov *.m4v *.ogv);;All files (*)"
)


def app_icon() -> QIcon:
    """The window/taskbar icon from the bundled files (the .ico has all sizes)."""
    for name in ("icon-check.ico", "icon-check.png"):
        path = backend.APP_DIR / name
        try:
            if path.is_file():
                return QIcon(str(path))
        except Exception:
            continue
    return QIcon()


def make_profile(application: QApplication, port: int) -> QWebEngineProfile:
    """A named, persistent WebEngine profile stored beside the notebook data.

    Without a named profile the page's localStorage is not guaranteed to
    survive a restart, so the installed app would forget volume, panel
    geometry and the plugin rail position every launch. Keeping storage under
    ``%APPDATA%\\NeoTodo`` also means uninstalling can remove one directory.
    """
    primary = port == PRIMARY_PORT
    folder = "webengine" if primary else f"webengine-{port}"
    storage = backend.DATA_DIR / folder
    try:
        storage.mkdir(parents=True, exist_ok=True)
    except Exception:
        pass
    profile = QWebEngineProfile("NeoTodo" if primary else f"NeoTodo-{port}", application)
    try:
        profile.setPersistentStoragePath(str(storage))
        profile.setCachePath(str(storage / "cache"))
        profile.setHttpCacheType(QWebEngineProfile.HttpCacheType.DiskHttpCache)
        profile.setPersistentCookiesPolicy(
            QWebEngineProfile.PersistentCookiesPolicy.ForcePersistentCookies
        )
    except Exception:
        pass
    settings = profile.settings()
    for name in (
        "JavascriptEnabled",
        "LocalStorageEnabled",
        "JavascriptCanOpenWindows",
        "JavascriptCanAccessClipboard",
        "JavascriptCanPaste",
        "LocalContentCanAccessRemoteUrls",
        "FullScreenSupportEnabled",
        "ScrollAnimatorEnabled",
    ):
        _enable(settings, name, True)
    # The notebook is driven with the mouse wheel and the speakers are part of
    # the design, so let audio start without a click.
    _enable(settings, "PlaybackRequiresUserGesture", False)
    return profile


def _enable(settings: QWebEngineSettings, name: str, value: bool) -> None:
    """Set a WebAttribute only when this Qt build knows it."""
    attribute = getattr(QWebEngineSettings.WebAttribute, name, None)
    if attribute is None:
        return
    try:
        settings.setAttribute(attribute, value)
    except Exception:
        pass


class UiDispatcher(QObject):
    """Run a callable on the Qt GUI thread and wait for its result.

    The HTTP backend calls the pickers from request threads; Qt dialogs may
    only be opened on the thread that owns the widgets. Emitting a signal is
    thread-safe, so the request is queued onto the GUI thread that created the
    dispatcher.
    """

    _invoke = Signal(object)

    def __init__(self) -> None:
        super().__init__()
        self._invoke.connect(self._run)

    def _run(self, request) -> None:
        fn, box, done = request
        try:
            box["value"] = fn()
        except Exception as error:  # noqa: BLE001 - reported to the caller
            box["error"] = error
        finally:
            done.set()

    def call(self, fn, timeout: float = 600.0):
        box = {"value": None, "error": None}
        done = threading.Event()
        self._invoke.emit((fn, box, done))
        if not done.wait(timeout):
            return None
        if box["error"] is not None:
            raise box["error"]
        return box["value"]

    def post(self, fn) -> None:
        self._invoke.emit((fn, {"value": None, "error": None}, threading.Event()))


class NeoTodoPage(QWebEnginePage):
    """Route the `neotodo.local` bridge to the shell."""

    def __init__(self, profile, view: "NeoTodoWebView") -> None:
        super().__init__(profile, view)
        self._view = view

    def acceptNavigationRequest(self, url, nav_type, is_main_frame):
        if url.host() == BRIDGE_HOST:
            # Answer the bridge on the next event-loop turn, like Linux's
            # GLib.idle_add: opening or closing windows inside a navigation
            # callback is not safe for the web engine.
            QTimer.singleShot(0, lambda target=QUrl(url): self._answer(target))
            return False
        return super().acceptNavigationRequest(url, nav_type, is_main_frame)

    def _answer(self, url: QUrl) -> None:
        try:
            self._view.handle_bridge(url)
        except Exception:
            pass


class NeoTodoWebView(QWebEngineView):
    """Web view that knows the shell, its window and the bridge."""

    def __init__(
        self,
        shell: "NeoTodoShell",
        profile: QWebEngineProfile,
        *,
        main: bool = False,
        parent=None,
    ):
        super().__init__(parent)
        self.shell = shell
        self.is_main = main
        self.setContextMenuPolicy(Qt.ContextMenuPolicy.NoContextMenu)
        self.setPage(NeoTodoPage(profile, self))
        self.page().setBackgroundColor(QColor(BACKGROUND))
        try:
            # A crashed renderer must come back by itself, like WebKitGTK's
            # web-process-terminated reload on Linux.
            self.page().renderProcessTerminated.connect(self._recover_renderer)
        except Exception:
            pass

    def _recover_renderer(self, _status=None, _code=0) -> None:
        def reload_now():
            try:
                self.reload()
            except RuntimeError:
                pass

        QTimer.singleShot(250, reload_now)

    # -- bridge ---------------------------------------------------------
    def handle_bridge(self, url: QUrl) -> None:
        path = url.path().strip("/")
        params = parse_qs(url.query())
        if path == "home":
            self.shell.dock_panel(self)
        elif path == "open":
            target = (params.get("url") or [""])[0]
            follow = (params.get("follow") or ["0"])[0] == "1"
            if target:
                self.shell.open_panel_window(target, follow=follow)
        elif path == "new-window":
            self.shell.open_main_window()
        elif path.startswith("window/"):
            self.shell.window_command(self, path.split("/", 1)[-1])

    def createWindow(self, _window_type):
        # window.open() from the page (forks and fork tabs) becomes a real
        # NeoTodo window instead of a tab in the same view.
        return self.shell.create_popup_view(self)

    # -- first frame ----------------------------------------------------
    def reveal_after_first_paint(self, window: QWidget, timeout_ms: int = 5000) -> None:
        """Keep the window invisible until the page painted its first frame.

        The page adds `app-painted` after the wallpaper decode and two frames,
        exactly like the Linux shell waits for it. The timeout only covers a
        page that never becomes ready, so its error is still reachable.
        """
        state = {"done": False}

        def reveal() -> None:
            if state["done"]:
                return
            state["done"] = True
            try:
                window.setWindowOpacity(1.0)
            except RuntimeError:
                pass

        def check() -> None:
            if state["done"]:
                return
            try:
                self.page().runJavaScript(
                    "Boolean(document.body && document.body.classList.contains('app-painted'))",
                    lambda ready: reveal() if ready else QTimer.singleShot(16, check),
                )
            except RuntimeError:
                return

        try:
            window.setWindowOpacity(0.0)
        except RuntimeError:
            return
        window.destroyed.connect(lambda *_args: state.update(done=True))
        QTimer.singleShot(16, check)
        QTimer.singleShot(timeout_ms, reveal)


class NeoTodoShell:
    """Owns the HTTP backend hooks and every NeoTodo window."""

    def __init__(self, port: int, profile: QWebEngineProfile) -> None:
        self.port = port
        self.profile = profile
        self.ui = UiDispatcher()
        self.server = None
        self.main_windows: list[QMainWindow] = []
        self.detached_windows: list[QMainWindow] = []
        self.closing = False

    # -- backend hooks --------------------------------------------------
    def bind_backend(self, server) -> None:
        self.server = server
        backend.QUIT_CALLBACK = self.request_quit
        backend.FOLDER_PICK_CALLBACK = self.pick_project_folder
        backend.FILE_PICK_CALLBACK = self.pick_wallpaper_file

    def request_quit(self) -> None:
        # Called from an HTTP request thread: hand the quit to the GUI loop.
        self.ui.post(QApplication.quit)

    def pick_project_folder(self):
        def choose():
            chosen = QFileDialog.getExistingDirectory(
                self.active_window(), "Choose project folder"
            )
            return chosen or None

        return self.ui.call(choose)

    def pick_wallpaper_file(self):
        def choose():
            chosen, _selected = QFileDialog.getOpenFileName(
                self.active_window(), "Choose wallpaper", "", WALLPAPER_FILTER
            )
            return chosen or None

        return self.ui.call(choose)

    # -- windows --------------------------------------------------------
    def active_window(self):
        window = QApplication.activeWindow()
        if window is not None:
            return window
        alive = self.alive(self.main_windows) + self.alive(self.detached_windows)
        return alive[-1] if alive else None

    @staticmethod
    def alive(windows) -> list[QMainWindow]:
        result = []
        for window in list(windows):
            try:
                if window is not None:
                    window.windowTitle()
            except RuntimeError:
                continue
            result.append(window)
        return result

    def url_for(self, path: str = "/") -> QUrl:
        return QUrl(f"http://127.0.0.1:{self.port}{path}")

    def main_url(self) -> QUrl:
        return self.url_for("/?desktop=1")

    def open_main_window(self) -> QMainWindow:
        view = NeoTodoWebView(self, self.profile, main=True)
        window = MainWindow(self, view)
        self.main_windows.append(window)
        window.destroyed.connect(
            lambda *_args, win=window: self._forget(self.main_windows, win)
        )
        view.reveal_after_first_paint(window)
        window.showMaximized()
        view.load(self.main_url())
        return window

    def create_detached_window(
        self, *, title: str = "NeoTodo", reveal: bool = False
    ) -> tuple[QMainWindow, NeoTodoWebView]:
        view = NeoTodoWebView(self, self.profile, main=False)
        window = DetachedWindow(self, view)
        window.setWindowTitle(title)
        window.setWindowIcon(app_icon())
        window.setCentralWidget(view)
        window.resize(960, 760)
        window.setAttribute(Qt.WidgetAttribute.WA_DeleteOnClose, True)
        self.detached_windows.append(window)
        window.destroyed.connect(
            lambda *_args, win=window: self._forget(self.detached_windows, win)
        )
        if reveal:
            # The sheet is part of NeoTodo, so it can wait for the same first
            # paint the main window waits for instead of showing a blank view.
            view.reveal_after_first_paint(window, timeout_ms=4000)
        window.show()
        return window, view

    def open_panel_window(self, target: str, *, follow: bool = False) -> QMainWindow | None:
        """Open the note/AI sheet the page asked to pop out as a real window."""
        url = QUrl(target)
        if url.scheme() not in ("http", "https") or url.host() not in ("127.0.0.1", "localhost"):
            return None
        window, view = self.create_detached_window(reveal=True)
        view.load(url)
        if follow:
            # The pointer is already down when the request arrives; starting
            # the system move a moment later lets the WM follow that pointer.
            def begin_move():
                handle = window.windowHandle()
                if handle is not None:
                    handle.startSystemMove()

            QTimer.singleShot(90, begin_move)
        return window

    def create_popup_view(self, _owner: NeoTodoWebView) -> NeoTodoWebView:
        """A window.open() popup: a real window whose content Qt will load."""
        window, view = self.create_detached_window()
        view.titleChanged.connect(
            lambda title, win=window: win.setWindowTitle(title or "NeoTodo")
        )
        return view

    def dock_panel(self, view: NeoTodoWebView) -> None:
        """The sheet's handle clicked in a detached window: dock it back home."""
        main = self.alive(self.main_windows)
        if main:
            window = main[0]
            try:
                if window.isMinimized():
                    window.showNormal()
                window.raise_()
                window.activateWindow()
            except RuntimeError:
                pass
        host = view.window()
        if host is not None and host not in main:
            host.close()

    def window_command(self, view: NeoTodoWebView, action: str) -> None:
        """Native drag/resize for a detached sheet (its own frame is thin)."""
        if view.is_main:
            return
        window = view.window()
        handle = window.windowHandle() if window is not None else None
        if handle is None:
            return
        if action == "move":
            handle.startSystemMove()
        elif action == "resize":
            handle.startSystemResize(Qt.Edge.TopEdge)

    @staticmethod
    def _forget(windows, window) -> None:
        windows[:] = [item for item in windows if item is not window]

    # -- shutdown -------------------------------------------------------
    def shutdown(self) -> None:
        if self.closing:
            return
        self.closing = True
        try:
            backend.shutdown_forks()
        except Exception:
            pass
        try:
            agent_store = backend.ApiHandler.agent_store
            if agent_store is not None:
                agent_store.shutdown()
        except Exception:
            pass
        for window in self.alive(self.detached_windows):
            try:
                window.close()
            except RuntimeError:
                pass
        try:
            if self.server is not None:
                self.server.shutdown()
                self.server.server_close()
        except Exception:
            pass


class MainWindow(QMainWindow):
    """The frameless main notebook window; closing it quits the whole app."""

    def __init__(self, shell: NeoTodoShell, view: NeoTodoWebView) -> None:
        super().__init__()
        self.shell = shell
        self.setWindowTitle("NeoTodo")
        self.setWindowIcon(app_icon())
        self.setWindowFlags(Qt.WindowType.FramelessWindowHint)
        self.setCentralWidget(view)
        self.resize(1280, 840)
        try:
            view.page().windowCloseRequested.connect(self._quit)
        except Exception:
            pass

    @staticmethod
    def _quit() -> None:
        QApplication.quit()

    def closeEvent(self, event) -> None:
        # Closing the notebook ends every fork and agent, like the Linux shell.
        event.accept()
        QTimer.singleShot(0, QApplication.quit)


class DetachedWindow(QMainWindow):
    """A note/AI/popup window; closing it only closes that window."""

    def __init__(self, shell: NeoTodoShell, view: NeoTodoWebView) -> None:
        super().__init__()
        self.shell = shell
        try:
            view.page().windowCloseRequested.connect(self.close)
        except Exception:
            pass


def _set_taskbar_identity() -> None:
    """Give the PyInstaller build its own Windows taskbar identity."""
    if not sys.platform.startswith("win"):
        return
    try:
        import ctypes

        ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID("CellMeet.NeoTodo")
    except Exception:
        pass


def _crash_log_path():
    return backend.DATA_DIR / "windows-crash.log"


def report_fatal(error_text: str) -> None:
    """Record a fatal error where the installed app can still be inspected.

    The packaged build is windowed, so a traceback has nowhere to go. The log
    lives beside the notebook data and a small message box names it.
    """
    path = _crash_log_path()
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8") as handle:
            handle.write(
                f"\n===== {datetime.now().isoformat(timespec='seconds')} =====\n"
                f"{error_text}\n"
            )
    except Exception:
        pass
    if sys.platform.startswith("win"):
        try:
            import ctypes

            last = (error_text.strip().splitlines() or ["Unknown error"])[-1]
            ctypes.windll.user32.MessageBoxW(
                None,
                f"NeoTodo 无法启动。\n\n错误：{last[:400]}\n\n日志：{path}",
                "NeoTodo",
                0x10,
            )
        except Exception:
            pass


def main() -> int:
    os.environ.setdefault(
        "QTWEBENGINE_CHROMIUM_FLAGS", "--autoplay-policy=no-user-gesture-required"
    )
    application = QApplication(sys.argv)
    application.setApplicationName("NeoTodo")
    application.setApplicationDisplayName("NeoTodo")
    application.setOrganizationName("CellMeet")
    _set_taskbar_identity()

    store = backend.Store(backend.DATA_FILE)
    # Fork records from an earlier run must never point at a reused port.
    try:
        backend.cleanup_stale_fork_records()
    except Exception:
        pass
    server, port = backend.start_server(store)

    profile = make_profile(application, port)
    shell = NeoTodoShell(port, profile)
    shell.bind_backend(server)
    application.aboutToQuit.connect(shell.shutdown)

    shell.open_main_window()
    return application.exec()


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except SystemExit:
        raise
    except BaseException:
        report_fatal(traceback.format_exc())
        raise
