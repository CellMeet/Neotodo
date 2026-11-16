#!/bin/sh
# [linux] Refresh the vendored Linux-first sources in this folder.
#
# The project only develops the Linux version. app.py, startup.py and web/
# under NeoTodo-Linux/ are a snapshot of the Linux tree, refreshed on demand
# instead of being edited twice.
#
#   ./sync-sources.sh              # copy the current working tree
#   ./sync-sources.sh v0.0.2       # copy a git tag / commit instead
#
# After syncing, start the app with ./run.sh.
set -eu
cd "$(dirname "$0")"
ROOT="$(cd .. && pwd)"
REF="${1:-}"

if [ -n "$REF" ]; then
    rm -rf web
    git -C "$ROOT" archive "$REF" app.py startup.py web icon.svg icon.png icon-check.svg | tar -x -C .
else
    cp "$ROOT/app.py" "$ROOT/startup.py" .
    rm -rf web
    if command -v rsync >/dev/null 2>&1; then
        rsync -a --exclude '__pycache__' --exclude '*.pyc' --exclude '__*.html' "$ROOT/web/" web/
    else
        cp -R "$ROOT/web" web
        find web -name '__pycache__' -type d -prune -exec rm -rf {} +
        rm -f web/__*.html
    fi
    cp "$ROOT/icon.svg" "$ROOT/icon.png" "$ROOT/icon-check.svg" .
fi

echo "Synced app.py, startup.py, web/, icon.svg, icon.png and icon-check.svg from ${REF:-the working tree}."
