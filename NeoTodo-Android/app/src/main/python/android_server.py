"""Android entry point for the NeoTodo backend.

Chaquopy embeds CPython inside the APK. This module starts the same
``app.Store`` + ``ThreadingHTTPServer`` used by the Linux and Windows shells, so
the Android app reuses the desktop workspace logic and web assets unchanged.

The only Android-specific adaptations are:

* external links open through an Android ``Intent`` instead of ``xdg-open``;
* folder-open actions report that Android has no desktop file manager here.

Everything else (categories, todos, subtasks, archive, notes, settings) is the
original Python implementation.
"""

from __future__ import annotations

import os
import threading

_lock = threading.Lock()
_server = None
_store = None
_port = 0
_activity = None


def _open_external(url: str) -> None:
    """Open http/https/mailto links in the user's browser or mail app."""
    if _activity is None:
        raise RuntimeError("Android activity is not ready")
    from java import jclass  # Provided by Chaquopy.

    intent_class = jclass("android.content.Intent")
    uri_class = jclass("android.net.Uri")
    intent = intent_class("android.intent.action.VIEW")
    intent.setData(uri_class.parse(url))
    intent.addFlags(0x10000000)  # Intent.FLAG_ACTIVITY_NEW_TASK
    _activity.startActivity(intent)


def _install_patches(backend) -> None:
    """Adapt the two desktop-only actions without forking app.py."""
    if getattr(backend.Store, "_neotodo_android_patched", False):
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
        if name in ("open_sounds_folder", "open_note_materials_folder", "open_music_folder"):
            return {
                "ok": False,
                "error": "This folder cannot be opened on Android.",
                "state": self.state(),
            }
        return original_action(self, payload)

    backend.Store.action = action
    backend.Store._neotodo_android_patched = True


def start(activity=None) -> int:
    """Start the local API server and return its loopback port."""
    global _server, _store, _port, _activity
    with _lock:
        if _server is not None:
            return _port
        _activity = activity
        os.environ.setdefault("NEOTODO_ANDROID", "1")

        import app as backend

        _install_patches(backend)
        _store = backend.Store(backend.DATA_FILE)
        _server, _port = backend.start_server(_store)
        return _port


def stop() -> None:
    """Stop the backend (process shutdown also handles this automatically)."""
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
