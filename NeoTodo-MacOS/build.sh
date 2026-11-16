#!/bin/sh
# [macos] Build NeoTodo.app with py2app, sign it, and optionally notarize it.
#
#   ./build.sh                         # ad-hoc signed .app for this Mac
#   NEOTODO_SIGN_IDENTITY="Developer ID Application: Name (TEAMID)" ./build.sh
#   NEOTODO_SIGN_IDENTITY="Developer ID Application: Name (TEAMID)" \
#   NEOTODO_NOTARY_PROFILE="neotodo" ./build.sh
#   ./build.sh --appstore               # sandboxed .app + signed installer .pkg
#
# NEOTODO_NOTARY_PROFILE is a `xcrun notarytool store-credentials` profile.
# The App Store package needs NEOTODO_APPSTORE_IDENTITY (Apple Distribution /
# 3rd Party Mac Developer Application) and NEOTODO_INSTALLER_IDENTITY.
set -eu
cd "$(dirname "$0")"
PYTHON="${PYTHON:-python3}"
VERSION="${NEOTODO_VERSION:-0.0.1}"
BUILD_NUMBER="${NEOTODO_BUILD:-1}"
APPSTORE=0

for arg in "$@"; do
    case "$arg" in
        --appstore) APPSTORE=1 ;;
        --sync) ./sync-sources.sh ;;
        -h|--help)
            sed -n '2,12p' "$0"
            exit 0
            ;;
        *) echo "Unknown argument: $arg" >&2; exit 2 ;;
    esac
done

if [ "$(uname -s)" != "Darwin" ]; then
    echo "build.sh must run on macOS (py2app produces a Mach-O bundle)." >&2
    exit 1
fi
if ! "$PYTHON" -c "import AppKit, WebKit, objc" >/dev/null 2>&1; then
    echo "Install the macOS requirements first: $PYTHON -m pip install -r requirements.txt" >&2
    exit 1
fi

echo "==> Generating NeoTodo.icns"
ICONSET="build/NeoTodo.iconset"
rm -rf "$ICONSET"
mkdir -p "$ICONSET"
MASTER="icon-master.png"
if [ ! -f "$MASTER" ]; then
    MASTER="icon.png"
fi
sips -z 16 16 "$MASTER" --out "$ICONSET/icon_16x16.png" >/dev/null
sips -z 32 32 "$MASTER" --out "$ICONSET/icon_16x16@2x.png" >/dev/null
sips -z 32 32 "$MASTER" --out "$ICONSET/icon_32x32.png" >/dev/null
sips -z 64 64 "$MASTER" --out "$ICONSET/icon_32x32@2x.png" >/dev/null
sips -z 128 128 "$MASTER" --out "$ICONSET/icon_128x128.png" >/dev/null
sips -z 256 256 "$MASTER" --out "$ICONSET/icon_128x128@2x.png" >/dev/null
sips -z 256 256 "$MASTER" --out "$ICONSET/icon_256x256.png" >/dev/null
sips -z 512 512 "$MASTER" --out "$ICONSET/icon_256x256@2x.png" >/dev/null
sips -z 512 512 "$MASTER" --out "$ICONSET/icon_512x512.png" >/dev/null
sips -z 1024 1024 "$MASTER" --out "$ICONSET/icon_512x512@2x.png" >/dev/null
iconutil -c icns "$ICONSET" -o NeoTodo.icns

echo "==> Building NeoTodo.app (version $VERSION build $BUILD_NUMBER)"
rm -rf build/NeoTodo.app dist
NEOTODO_VERSION="$VERSION" NEOTODO_BUILD="$BUILD_NUMBER" "$PYTHON" setup.py py2app

APP="dist/NeoTodo.app"
if [ ! -d "$APP" ]; then
    echo "py2app did not produce $APP" >&2
    exit 1
fi

echo "==> Copying the web workspace and icons into Resources"
RESOURCES="$APP/Contents/Resources"
rm -rf "$RESOURCES/web"
ditto web "$RESOURCES/web"
cp icon.svg icon.png icon-master.png "$RESOURCES/" 2>/dev/null || cp icon.svg icon.png "$RESOURCES/"

if [ "$APPSTORE" -eq 1 ] && [ -n "${NEOTODO_PROVISION_PROFILE:-}" ]; then
    echo "==> Embedding the Mac App Store provisioning profile"
    cp "$NEOTODO_PROVISION_PROFILE" "$APP/Contents/embedded.provisionprofile"
fi

echo "==> Ad-hoc or Developer ID signing"
if [ "$APPSTORE" -eq 1 ]; then
    IDENTITY="${NEOTODO_APPSTORE_IDENTITY:-${NEOTODO_SIGN_IDENTITY:-}}"
    ENTITLEMENTS="entitlements-appstore.plist"
else
    IDENTITY="${NEOTODO_SIGN_IDENTITY:-}"
    ENTITLEMENTS="entitlements.plist"
fi

if [ -n "$IDENTITY" ]; then
    # Sign inside-out: Mach-O helpers first, then the bundle, so Gatekeeper can
    # verify every embedded Python extension and framework.
    find "$APP/Contents" -type f \( -name '*.so' -o -name '*.dylib' \) -print0 \
        | xargs -0 -I{} codesign --force --timestamp --options runtime --sign "$IDENTITY" "{}" >/dev/null 2>&1 || true
    codesign --force --deep --timestamp --options runtime \
        --entitlements "$ENTITLEMENTS" --sign "$IDENTITY" "$APP"
else
    echo "    No identity set: ad-hoc signing (runs locally, cannot be distributed)."
    codesign --force --deep --sign - "$APP"
fi

if [ "$APPSTORE" -eq 1 ]; then
    INSTALLER="${NEOTODO_INSTALLER_IDENTITY:-}"
    if [ -z "$INSTALLER" ]; then
        echo "Set NEOTODO_INSTALLER_IDENTITY to build an App Store installer .pkg" >&2
        exit 1
    fi
    echo "==> Building the Mac App Store installer package"
    xcrun productbuild --component "$APP" /Applications \
        --sign "$INSTALLER" "dist/NeoTodo-$VERSION.pkg"
    echo
    echo "Upload dist/NeoTodo-$VERSION.pkg with Transporter or:"
    echo "  xcrun altool --upload-app -f dist/NeoTodo-$VERSION.pkg -t macos \\"
    echo "    --apiKey \"\$ASC_KEY_ID\" --apiIssuer \"\$ASC_ISSUER_ID\""
    exit 0
fi

if [ -n "${NEOTODO_NOTARY_PROFILE:-}" ] && [ -n "${NEOTODO_SIGN_IDENTITY:-}" ]; then
    echo "==> Notarizing"
    ditto -c -k --keepParent "$APP" "dist/NeoTodo-$VERSION.zip"
    xcrun notarytool submit "dist/NeoTodo-$VERSION.zip" \
        --keychain-profile "$NEOTODO_NOTARY_PROFILE" --wait
    xcrun stapler staple "$APP"
fi

echo
echo "Built: $APP"
echo "Run it with: open \"$APP\""
