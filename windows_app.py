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

    view = QWebEngineView()
    view.setContextMenuPolicy(Qt.ContextMenuPolicy.NoContextMenu)
    view.page().setBackgroundColor(QColor("#120b06"))
    settings = view.page().profile().settings()
    settings.setAttribute(QWebEngineSettings.WebAttribute.JavascriptEnabled, True)
    settings.setAttribute(QWebEngineSettings.WebAttribute.LocalStorageEnabled, True)
    settings.setAttribute(QWebEngineSettings.WebAttribute.PlaybackRequiresUserGesture, False)
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
