#!/bin/sh
# Build a Debug app for the simulator (default) or a connected device.
#
#   ./Scripts/build.sh
#   DEST="platform=iOS,name=My iPhone" ./Scripts/build.sh
#   DEST="generic/platform=iOS" ./Scripts/build.sh
set -eu
cd "$(dirname "$0")/.."

DEST="${DEST:-generic/platform=iOS Simulator}"

if [ ! -d NeoTodo.xcodeproj ]; then
    ./Scripts/generate-project.sh
fi
if [ ! -d Python.xcframework ]; then
    echo "Python.xcframework is missing; run ./Scripts/fetch-python.sh first." >&2
    exit 1
fi

xcodebuild \
    -project NeoTodo.xcodeproj \
    -scheme NeoTodo \
    -configuration Debug \
    -destination "$DEST" \
    -derivedDataPath build/DerivedData \
    -allowProvisioningUpdates \
    build
