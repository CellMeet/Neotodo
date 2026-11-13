"""Windows shell for NeoTodo.

The Linux app uses GTK4 + WebKitGTK. The web layer is platform-neutral, so the
Windows build reuses the same Python HTTP backend and renders it through Qt
WebEngine (Chromium). Build it with PyInstaller on Windows; see
.github/workflows/release.yml and installer.iss.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PySide6.QtCore import Qt, QTimer, QUrl
from PySide6.QtGui import QColor, QIcon
from PySide6.QtWidgets import QApplication, QMainWindow
from PySide6.QtWebEngineCore import QWebEngineSettings
from PySide6.QtWebEngineWidgets import QWebEngineView

import app as backend


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
