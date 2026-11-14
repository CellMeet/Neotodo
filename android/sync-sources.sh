#!/usr/bin/env bash
# Copy the shared Python backend and web workspace into the Android module.
# The root project stays the single source of truth; these copies are generated
# and excluded from git.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/.." && pwd)"
dest="$here/app/src/main/python"

rm -rf "$dest/web" "$dest/app.py" "$dest/startup.py"
mkdir -p "$dest"
cp "$root/app.py" "$root/startup.py" "$dest/"
cp -a "$root/web" "$dest/web"

echo "Synced app.py, startup.py and web/ into $dest"
