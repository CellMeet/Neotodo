#!/bin/sh
# Generate NeoTodo.xcodeproj from project.yml.
#
# XcodeGen is a small Homebrew tool; keeping the project as plain YAML means
# the file list, build settings and the Python build phase stay reviewable in
# git instead of living in a .pbxproj.
set -eu
cd "$(dirname "$0")/.."

if ! command -v xcodegen >/dev/null 2>&1; then
    echo "XcodeGen is required: brew install xcodegen" >&2
    exit 1
fi

xcodegen generate
echo "NeoTodo.xcodeproj is ready. Open it, pick your team in Signing & Capabilities, and run."
