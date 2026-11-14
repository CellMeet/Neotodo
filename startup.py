"""Startup splash helpers.

This module owns the last-page screenshot and the Gtk.Picture preview. Keeping
it separate from app.py makes the first frame deterministic: either the last
rendered page is shown instantly, or the window stays hidden until the live
page is ready. It never paints a half-initialised theme.
"""

from pathlib import Path


def make_preview(snapshot_path: Path):
    """Return a Gtk.Picture for the last-page PNG, or None."""
    try:
        from gi.repository import Gtk

        if not snapshot_path.exists() or snapshot_path.stat().st_size <= 0:
            return None
        picture = Gtk.Picture.new_for_filename(str(snapshot_path))
        picture.set_content_fit(Gtk.ContentFit.COVER)
        picture.set_can_shrink(True)
        picture.set_hexpand(True)
        picture.set_vexpand(True)
        picture.set_can_target(False)
        picture.set_can_focus(False)
        try:
            picture.add_css_class("startup-preview")
        except Exception:
            pass
        return picture
    except Exception:
        return None


def capture_view(view, snapshot_path: Path, callback=None) -> None:
    """Capture the visible web view to a PNG, then call callback exactly once."""
    from gi.repository import GLib, WebKit

    finished = {"done": False}

    def finish():
        if finished["done"]:
            return
        finished["done"] = True
        try:
            view.evaluate_javascript(
                "document.body.classList.remove('snapshot-clean')",
                -1, None, None, None, None, None,
            )
        except Exception:
            pass
        if callback is not None:
            try:
                callback()
            except Exception:
                pass

    def done(target, result, _data=None):
        try:
            texture = target.get_snapshot_finish(result)
            if texture is not None:
                snapshot_path.parent.mkdir(parents=True, exist_ok=True)
                texture.save_to_png(str(snapshot_path))
        except Exception:
            pass
        finish()

    def snapshot_now():
        try:
            view.get_snapshot(
                WebKit.SnapshotRegion.VISIBLE,
                WebKit.SnapshotOptions.NONE,
                None,
                done,
                None,
            )
            # Never let a stalled snapshot keep the app open.
            GLib.timeout_add(1500, lambda: (finish(), False)[1])
        except Exception:
            finish()
        return False

    # The hidden utility bar can be expanded when quitting from its buttons.
    # Capture the default header (brand, clock, achievements) instead.
    try:
        view.evaluate_javascript(
            "document.body.classList.add('snapshot-clean');"
            "const m=document.getElementById('modal-root');if(m)m.innerHTML='';"
            "const sp=document.getElementById('sound-panel');if(sp)sp.hidden=true;",
            -1, None, None, None,
            lambda _v, _r, _d=None: GLib.timeout_add(60, snapshot_now),
            None,
        )
    except Exception:
        snapshot_now()
