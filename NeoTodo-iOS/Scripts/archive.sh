#!/bin/sh
# Archive the app and export an App Store .ipa.
#
#   TEAM_ID=ABCDE12345 ./Scripts/archive.sh
#   TEAM_ID=ABCDE12345 EXPORT_METHOD=app-store ./Scripts/archive.sh
#
# EXPORT_METHOD defaults to "app-store-connect" (Xcode 15.3 and newer). Use
# "app-store" on older Xcode versions.
#
# The .ipa lands in build/export/. Upload it with Transporter or:
#   xcrun altool --upload-app -f build/export/NeoTodo.ipa -t ios \
#       --apiKey "$ASC_KEY_ID" --apiIssuer "$ASC_ISSUER_ID"
set -eu
cd "$(dirname "$0")/.."

: "${TEAM_ID:?Set TEAM_ID to your Apple Developer team id (App Store Connect > Membership)}"
EXPORT_METHOD="${EXPORT_METHOD:-app-store-connect}"

if [ ! -d NeoTodo.xcodeproj ]; then
    ./Scripts/generate-project.sh
fi
if [ ! -d Python.xcframework ]; then
    echo "Python.xcframework is missing; run ./Scripts/fetch-python.sh first." >&2
    exit 1
fi

mkdir -p build

xcodebuild \
    -project NeoTodo.xcodeproj \
    -scheme NeoTodo \
    -configuration Release \
    -destination "generic/platform=iOS" \
    -archivePath build/NeoTodo.xcarchive \
    -allowProvisioningUpdates \
    archive

cat > build/ExportOptions.plist <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>method</key>
	<string>${EXPORT_METHOD}</string>
	<key>destination</key>
	<string>export</string>
	<key>signingStyle</key>
	<string>automatic</string>
	<key>teamID</key>
	<string>${TEAM_ID}</string>
	<key>uploadSymbols</key>
	<true/>
	<key>stripSwiftSymbols</key>
	<true/>
</dict>
</plist>
EOF

xcodebuild \
    -exportArchive \
    -archivePath build/NeoTodo.xcarchive \
    -exportOptionsPlist build/ExportOptions.plist \
    -exportPath build/export \
    -allowProvisioningUpdates

echo
echo "App Store build: build/export/NeoTodo.ipa"
echo "Upload it with Transporter, or:"
echo "  xcrun altool --upload-app -f build/export/NeoTodo.ipa -t ios --apiKey \"\$ASC_KEY_ID\" --apiIssuer \"\$ASC_ISSUER_ID\""
