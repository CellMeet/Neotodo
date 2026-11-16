#!/usr/bin/env bash
# [android] Refresh the vendored Linux-first sources inside this folder.
#
# The Android build is a one-time snapshot: app.py, startup.py and web/ are
# copied from the Linux tree into app/src/main/python/ and committed here, so
# the folder can be built on its own.
#
#   ./sync-sources.sh               # copy the current working tree
#   ./sync-sources.sh v0.0.2        # copy a git tag / commit instead
#
# After syncing, rebuild with ./build.sh (debug APK) or ./build-release.sh (AAB).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/.." && pwd)"
dest="$here/app/src/main/python"
ref="${1:-}"

rm -rf "$dest/web" "$dest/app.py" "$dest/startup.py"
mkdir -p "$dest"

if [ -n "$ref" ]; then
  git -C "$root" archive "$ref" app.py startup.py web | tar -x -C "$dest"
else
  cp "$root/app.py" "$root/startup.py" "$dest/"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --exclude '__pycache__' --exclude '*.pyc' --exclude '__*.html' "$root/web/" "$dest/web/"
  else
    cp -R "$root/web" "$dest/web"
  fi
fi

find "$dest" -name '__pycache__' -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "Synced app.py, startup.py and web/ into $dest from ${ref:-the working tree}"
