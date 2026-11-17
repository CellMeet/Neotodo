#!/bin/sh
# Download the CPython XCFramework that the app embeds.
#
# The framework comes from the BeeWare "python-apple-support" releases: a
# CPython build for iOS (device + simulator) plus the standard library the
# Xcode build phase installs next to the app sources.
#
#   ./Scripts/fetch-python.sh          # newest 3.13 iOS build
#   ./Scripts/fetch-python.sh 3.14     # a specific minor version
#   FORCE=1 ./Scripts/fetch-python.sh  # re-download over an existing copy
#
# Run this on the Mac that builds the app; the download is ~40 MB.
set -eu
cd "$(dirname "$0")/.."
VERSION="${1:-3.13}"

if [ -d Python.xcframework ] && [ "${FORCE:-0}" != "1" ]; then
    echo "Python.xcframework already exists. Set FORCE=1 to download it again."
    exit 0
fi

command -v python3 >/dev/null 2>&1 || {
    echo "python3 is required to read the release list." >&2
    exit 1
}

URL="$(curl -fsSL "https://api.github.com/repos/beeware/python-apple-support/releases?per_page=40" \
    | python3 -c '
import json
import sys

version = sys.argv[1]
prefix = "Python-" + version + "-iOS-support"
for release in json.load(sys.stdin):
    if not release.get("tag_name", "").startswith(version + "-"):
        continue
    for asset in release.get("assets", []):
        name = asset.get("name", "")
        if name.startswith(prefix) and name.endswith(".tar.gz"):
            print(asset["browser_download_url"])
            raise SystemExit
raise SystemExit("No iOS support build found for Python " + version)
' "$VERSION")"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Downloading $(basename "$URL")"
curl -fL --progress-bar -o "$TMP/support.tar.gz" "$URL"
mkdir -p "$TMP/unpack"
tar -xzf "$TMP/support.tar.gz" -C "$TMP/unpack"

SOURCE="$TMP/unpack"
if [ ! -d "$SOURCE/Python.xcframework" ]; then
    INNER="$(find "$TMP/unpack" -maxdepth 3 -name Python.xcframework -type d | head -n 1)"
    if [ -z "$INNER" ]; then
        echo "error: the download does not contain Python.xcframework" >&2
        exit 1
    fi
    SOURCE="$(dirname "$INNER")"
fi

rm -rf Python.xcframework support
cp -R "$SOURCE"/. .

if [ ! -f Python.xcframework/build/utils.sh ]; then
    echo "error: Python.xcframework/build/utils.sh is missing; the build phase needs it." >&2
    exit 1
fi

STDLIB="$(find . -maxdepth 4 -type d -path '*lib/python3.*' ! -path '*lib-dynload*' | head -n 1)"
echo "Python.xcframework is ready${STDLIB:+ (standard library: ${STDLIB#./})}."
echo "Next: ./Scripts/generate-project.sh"
