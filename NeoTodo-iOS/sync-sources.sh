#!/bin/sh
# [ios] Refresh the vendored Linux-first sources in this folder.
#
# The iOS build is a one-time snapshot: app.py, startup.py and web/ are copied
# from the Linux tree instead of being maintained twice. ios_server.py (the iOS
# entry point) is not touched.
#
#   ./sync-sources.sh              # copy the current working tree
#   ./sync-sources.sh v0.0.2       # copy a git tag / commit instead
#
# After syncing, rebuild in Xcode: the app/ folder is a bundle resource, so no
# other step is needed.
set -eu
cd "$(dirname "$0")"
ROOT="$(cd .. && pwd)"
REF="${1:-}"

mkdir -p app

if [ -n "$REF" ]; then
    tmp="$(mktemp -d)"
    trap 'rm -rf "$tmp"' EXIT
    git -C "$ROOT" archive "$REF" app.py startup.py web | tar -x -C "$tmp"
    cp "$tmp/app.py" "$tmp/startup.py" app/
    rm -rf app/web
    mv "$tmp/web" app/web
else
    cp "$ROOT/app.py" "$ROOT/startup.py" app/
    rm -rf app/web
    if command -v rsync >/dev/null 2>&1; then
        rsync -a --exclude '__pycache__' --exclude '*.pyc' --exclude '__*.html' "$ROOT/web/" app/web/
    else
        cp -R "$ROOT/web" app/web
        find app/web -name '__pycache__' -type d -prune -exec rm -rf {} +
        rm -f app/web/__*.html
    fi
fi

echo "Synced app.py, startup.py and web/ from ${REF:-the working tree} into app/."
