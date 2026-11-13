"""Windows shell for NeoTodo.

The Linux app uses GTK4 + WebKitGTK. The web layer is platform-neutral, so the
Windows build reuses the same Python HTTP backend and renders it through Qt
WebEngine (Chromium). Build it with PyInstaller on Windows; see
.github/workflows/release.yml and installer.iss.
"""

from __future__ import annotations

import sys
import threading
from pathlib import Path

from PySide6.QtCore import Qt, QTimer, QUrl
from PySide6.QtGui import QColor, QIcon
from PySide6.QtWidgets import QApplication, QMainWindow
from PySide6.QtWebEngineCore import QWebEnginePage, QWebEngineSettings
from PySide6.QtWebEngineWidgets import QWebEngineView

import app as backend


class DetachedPage(QWebEnginePage):
    """Handle the webview's native window-move/resize bridge."""

    def __init__(self, profile, window, parent=None):
        super().__init__(profile, parent)
        self._host_window = window

    def acceptNavigationRequest(self, url, nav_type, is_main_frame):
        if url.host() == "neotodo.local":
            try:
                action = url.path().rsplit("/", 1)[-1]
                handle = self._host_window.windowHandle()
                if action == "home":
                    for widget in QApplication.topLevelWidgets():
                        if widget is self._host_window:
                            continue
                        if widget.isVisible():
                            widget.showNormal()
                            widget.raise_()
                            widget.activateWindow()
                            break
                    self._host_window.close()
                elif handle is not None:
                    if action == "move":
                        handle.startSystemMove()
                    elif action == "resize":
                        handle.startSystemResize(Qt.Edge.TopEdge)
            except Exception:
                pass
            return False
        return super().acceptNavigationRequest(url, nav_type, is_main_frame)


class NeoTodoWebView(QWebEngineView):
    """Main Qt view that can open AI/note panels as real detached windows."""

    def __init__(self, parent=None):
        super().__init__(parent)
        self.detached_windows = []
        self.setContextMenuPolicy(Qt.ContextMenuPolicy.NoContextMenu)
        self.page().setBackgroundColor(QColor("#120b06"))
        settings = self.page().profile().settings()
        settings.setAttribute(QWebEngineSettings.WebAttribute.JavascriptEnabled, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.LocalStorageEnabled, True)
        settings.setAttribute(QWebEngineSettings.WebAttribute.PlaybackRequiresUserGesture, False)
        try:
            settings.setAttribute(QWebEngineSettings.WebAttribute.JavascriptCanOpenWindows, True)
        except Exception:
            pass

    def createWindow(self, _window_type):
        view = NeoTodoWebView()
        window = QMainWindow()
        window.setWindowTitle("NeoTodo")
        window.setWindowIcon(QIcon(str(backend.APP_DIR / "icon-check.png")))
        page = DetachedPage(view.page().profile(), window, view)
        view.setPage(page)
        window.setCentralWidget(view)
        window.resize(960, 760)
        view.titleChanged.connect(lambda title, win=window: win.setWindowTitle(title or "NeoTodo"))
        self.detached_windows.append(window)
        window.destroyed.connect(lambda _obj=None, win=window: self._forget(win))
        window.show()
        return view

    def _forget(self, window):
        self.detached_windows = [win for win in self.detached_windows if win is not window]


def main() -> int:
    application = QApplication(sys.argv)
    application.setApplicationName("NeoTodo")
    application.setApplicationDisplayName("NeoTodo")
    application.setOrganizationName("CellMeet")

    store = backend.Store(backend.DATA_FILE)
    server, port = backend.start_server(store)

    def quit_app() -> None:
        QTimer.singleShot(0, application.quit)

    backend.QUIT_CALLBACK = quit_app

    def pick_project_folder():
        from PySide6.QtWidgets import QFileDialog
        result = {"path": None}
        done = threading.Event()

        def show_dialog():
            chosen = QFileDialog.getExistingDirectory(window, "Choose project folder")
            result["path"] = chosen or None
            done.set()

        QTimer.singleShot(0, show_dialog)
        done.wait(timeout=600)
        return result["path"]

    backend.FOLDER_PICK_CALLBACK = pick_project_folder
    application.aboutToQuit.connect(lambda: server.shutdown())

    view = NeoTodoWebView()
    view.load(QUrl(f"http://127.0.0.1:{port}/"))

    window = QMainWindow()
    window.setWindowTitle("NeoTodo")
    window.setWindowIcon(QIcon(str(backend.APP_DIR / "icon-check.png")))
    window.setWindowFlags(Qt.WindowType.FramelessWindowHint)
    window.setCentralWidget(view)
    window.showMaximized()

    return application.exec()


if __name__ == "__main__":
    raise SystemExit(main())
