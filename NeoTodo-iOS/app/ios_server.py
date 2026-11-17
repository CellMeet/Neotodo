"""iOS entry point for the NeoTodo backend.

The iOS app embeds CPython through ``Python.xcframework`` (see
``Scripts/fetch-python.sh``) and calls :func:`start` from ``PythonRuntime.m``.
This module starts the same ``app.Store`` + ``ThreadingHTTPServer`` used by the
Linux, Windows, macOS and Android shells, so the notebook, notes, themes,
plugins and sounds are the shared implementation, not a port.

The only iOS-specific adaptations are:

* external links open in Safari through a native callback the shell
  registers as ``native_open_url``;
* the folder actions that need a desktop file manager answer with a clear
  message instead of trying to spawn ``xdg-open``;
* ``quit`` is a no-op: on iOS the system owns the app lifecycle.

Everything else (categories, todos, subtasks, archive, notes, settings, the
plugin installer and the community catalog) is the original Python code.
"""

from __future__ import annotations

import os
import threading

_lock = threading.Lock()
_server = None
_store = None
_port = 0

# Actions that need a desktop file manager or a windowing system.
_DESKTOP_ONLY = (
    "open_project_folder",
    "open_sounds_folder",
    "open_note_materials_folder",
    "open_plugins_folder",
    "open_theme_packs_folder",
    "open_note_themes_folder",
    "open_ai_themes_folder",
    "open_icon_themes_folder",
    "open_wallpaper_folder",
    "open_music_folder",
    "open_pictures_folder",
)


def _open_external(url: str) -> None:
    """Open http/https/mailto links in the user's browser or mail app."""
    handler = globals().get("native_open_url")
    if handler is None:
        raise RuntimeError("The iOS browser bridge is not ready")
    handler(url)


def _install_patches(backend) -> None:
    """Adapt the desktop-only actions without forking app.py."""
    if getattr(backend.Store, "_neotodo_ios_patched", False):
        return

    original_action = backend.Store.action

    def action(self, payload):
        name = payload.get("action") if isinstance(payload, dict) else None
        if name == "open_url":
            url = payload.get("url")
            if not isinstance(url, str) or not url.startswith(("https://", "http://", "mailto:")):
                return {"ok": False, "error": "Invalid link", "state": self.state()}
            try:
                _open_external(url)
            except Exception as error:
                return {"ok": False, "error": str(error), "state": self.state()}
            return {"ok": True, "state": self.state()}
        if name in _DESKTOP_ONLY:
            return {
                "ok": False,
                "error": "This folder is not available on iPhone or iPad.",
                "state": self.state(),
            }
        if name == "quit":
            # iOS suspends the app instead of quitting it; the home indicator
            # or the app switcher is the only way out.
            return {"ok": True, "state": self.state()}
        return original_action(self, payload)

    backend.Store.action = action
    backend.Store._neotodo_ios_patched = True


def start() -> int:
    """Start the local API server and return its loopback port."""
    global _server, _store, _port
    with _lock:
        if _server is not None:
            return _port
        os.environ.setdefault("NEOTODO_IOS", "1")

        # app.py imports itself as the backend module and places its data next
        # to Path.home(); PythonRuntime.m points HOME at the app container's
        # Application Support folder before this import.
        import app as backend

        _install_patches(backend)
        _store = backend.Store(backend.DATA_FILE)
        _server, _port = backend.start_server(_store)
        return _port


def stop() -> None:
    """Stop the backend (the process ending also handles this)."""
    global _server, _port
    with _lock:
        if _server is not None:
            try:
                _server.shutdown()
                _server.server_close()
            except Exception:
                pass
        _server = None
        _port = 0


def wait_forever() -> None:
    """Block the interpreter's main thread without holding the GIL."""
    threading.Event().wait()
