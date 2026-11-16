#!/bin/sh
# [macos] Run NeoTodo from source on macOS.
#
#   ./run-macos.sh              # normal window
#   ./run-macos.sh --serve      # headless backend, open the URL in a browser
#
# Requirements: macOS 11+, Python 3.10+ and the PyObjC wheels:
#   python3 -m pip install -r requirements.txt
set -eu
cd "$(dirname "$0")"
PYTHON="${PYTHON:-python3}"

if ! "$PYTHON" -c "import AppKit, WebKit, objc" >/dev/null 2>&1; then
    cat >&2 <<'MSG'
NeoTodo for macOS needs PyObjC (AppKit + WebKit + Cocoa).

    python3 -m pip install -r requirements.txt

Use the python.org universal2 build (or a Homebrew arm64 Python) so the same
.interpreter can later be signed for distribution.
MSG
    exit 1
fi

exec "$PYTHON" main.py "$@"
