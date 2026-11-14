#!/usr/bin/env bash
# Build the NeoTodo Android APK and copy it next to the desktop sources.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/.." && pwd)"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

"$here/sync-sources.sh"

cd "$here"
./gradlew --no-daemon assembleDebug "$@"

out="$here/app/build/outputs/apk/debug/app-debug.apk"
cp "$out" "$root/NeoTodo-Android.apk"
echo
echo "APK: $root/NeoTodo-Android.apk"
