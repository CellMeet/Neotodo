#!/usr/bin/env python3
# [macos] Entry point for the macOS build of NeoTodo.
"""Start the shared NeoTodo backend inside the native macOS shell.

The backend (``app.py``), ``startup.py`` and the ``web/`` workspace are a
snapshot of the Linux-first sources, refreshed with ``sync-sources.sh``.
Headless previews keep working exactly like the Linux build:

    python3 main.py --serve
"""

from __future__ import annotations

import sys
import traceback
from pathlib import Path

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))


def _bootstrap_logging() -> None:
    """A double-clicked .app has no terminal; keep startup errors on disk."""
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


def main() -> int:
    _bootstrap_logging()
    try:
        import app as backend

        headless = {"--serve", "--fork-app", "--fork-window"}.intersection(sys.argv)
        if headless:
            backend.main()
            return 0

        import macos_shell

        return macos_shell.run(backend)
    except Exception:
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
