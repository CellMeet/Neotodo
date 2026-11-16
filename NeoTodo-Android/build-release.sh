#!/usr/bin/env bash
# Build the Play Console upload bundle (.aab) and, with --apk, a release APK.
#
#   ./build-release.sh            # signed AAB  -> ../NeoTodo-Android-release.aab
#   ./build-release.sh --apk      # also copy   -> ../NeoTodo-Android-release.apk
#
# The release build is signed with the upload key in ./keystore.properties
# (git-ignored). Without that file Gradle falls back to the debug key and the
# store will reject the upload, so this script stops and tells you what to do.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/.." && pwd)"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

want_apk=0
for arg in "$@"; do
  case "$arg" in
    --apk) want_apk=1 ;;
    -h|--help) sed -n '2,10p' "$0"; exit 0 ;;
    *) echo "Unknown argument: $arg" >&2; exit 2 ;;
  esac
done

if [ ! -f "$here/keystore.properties" ]; then
  echo "No keystore.properties — the bundle would be debug-signed and rejected." >&2
  echo "Create the upload key first (see docs/android-store-publish.md):" >&2
  echo "  keytool -genkeypair -v -keystore \"$here/neotodo-upload.jks\" \\" >&2
  echo "    -alias neotodo -keyalg RSA -keysize 4096 -validity 10000" >&2
  echo "  cp keystore.properties.example keystore.properties  # then fill it in" >&2
  exit 1
fi

"$here/sync-sources.sh"

cd "$here"
./gradlew --no-daemon bundleRelease
cp app/build/outputs/bundle/release/app-release.aab "$root/NeoTodo-Android-release.aab"
echo
echo "AAB: $root/NeoTodo-Android-release.aab"

if [ "$want_apk" = "1" ]; then
  ./gradlew --no-daemon assembleRelease
  cp app/build/outputs/apk/release/app-release.apk "$root/NeoTodo-Android-release.apk"
  echo "APK: $root/NeoTodo-Android-release.apk"
fi
