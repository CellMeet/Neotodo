#!/usr/bin/env bash
# Start the NeoTodo Android emulator (API 35 tablet), install the APK and launch it.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/.." && pwd)"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

APK="$root/NeoTodo-Android.apk"
AVD="${NEOTODO_AVD:-NeoTodo}"
PORT="${NEOTODO_PORT:-5558}"
SERIAL="emulator-$PORT"
ADB="$ANDROID_HOME/platform-tools/adb"

if ! "$ADB" -s "$SERIAL" get-state >/dev/null 2>&1; then
  if ! "$ANDROID_HOME/emulator/emulator" -list-avds | grep -qx "$AVD"; then
    echo "AVD '$AVD' not found. Create it with:"
    echo "  sdkmanager 'system-images;android-35;default;x86_64'"
    echo "  avdmanager create avd -n $AVD -k 'system-images;android-35;default;x86_64' -d pixel_tablet"
    exit 1
  fi
  echo "Starting the $AVD emulator on port $PORT (first boot can take a minute)…"
  # A SIGKILLed emulator leaves lock files behind; clear them before a cold boot.
  rm -f "$HOME/.android/avd/$AVD.avd"/*.lock 2>/dev/null || true
  # The host GPU backend can drop color buffers on some laptops; software GL is
  # slower but stable. Set NEOTODO_EMU_GPU=host to try the host GPU.
  GPU="${NEOTODO_EMU_GPU:-swiftshader_indirect}"
  # setsid keeps the emulator alive after this shell exits.
  setsid nohup "$ANDROID_HOME/emulator/emulator" -avd "$AVD" -port "$PORT" \
    -gpu "$GPU" -no-snapshot -no-boot-anim -netdelay none -netspeed full \
    >/tmp/neotodo-emulator.log 2>&1 < /dev/null &
fi

echo "Waiting for Android to finish booting…"
"$ADB" -s "$SERIAL" wait-for-device
for _ in $(seq 1 180); do
  booted="$("$ADB" -s "$SERIAL" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')"
  package="$("$ADB" -s "$SERIAL" shell service check package 2>/dev/null | tr -d '\r')"
  activity="$("$ADB" -s "$SERIAL" shell service check activity 2>/dev/null | tr -d '\r')"
  if [ "$booted" = "1" ] && echo "$package" | grep -q "found" && echo "$activity" | grep -q "found"; then
    break
  fi
  sleep 2
done
sleep 3

if [ ! -f "$APK" ]; then
  echo "No APK at $APK. Building it now…"
  "$here/build.sh"
fi

echo "Installing $APK…"
for attempt in 1 2 3; do
  if "$ADB" -s "$SERIAL" install -r "$APK"; then
    break
  fi
  echo "Install attempt $attempt failed; waiting for the package service…"
  sleep 5
done

"$ADB" -s "$SERIAL" shell am start -n io.github.neotodo/.MainActivity
echo
echo "NeoTodo is running in $SERIAL."
echo "The AVD keeps the app data between launches."
