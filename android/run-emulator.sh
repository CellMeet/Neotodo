#!/usr/bin/env bash
# Start the NeoTodo Android emulator (API 35 tablet) and install the APK.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/.." && pwd)"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$here/../..:$PATH"

APK="$root/NeoTodo-Android.apk"
AVD="${NEOTODO_AVD:-NeoTodo}"

if ! "$ANDROID_HOME/platform-tools/adb" get-state >/dev/null 2>&1; then
  echo "Starting emulator $AVD…"
  nohup "$ANDROID_HOME/emulator/emulator" -avd "$AVD" \
    -gpu host -no-boot-anim -netdelay none -netspeed full \
    >/tmp/neotodo-emulator.log 2>&1 &
fi

echo "Waiting for the emulator to finish booting…"
"$ANDROID_HOME/platform-tools/adb" wait-for-device
until [ "$("$ANDROID_HOME/platform-tools/adb" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ]; do
  sleep 2
done

if [ -f "$APK" ]; then
  echo "Installing $APK…"
  "$ANDROID_HOME/platform-tools/adb" install -r "$APK"
fi

"$ANDROID_HOME/platform-tools/adb" shell am start -n io.github.neotodo/.MainActivity
echo "NeoTodo is starting in the emulator."
