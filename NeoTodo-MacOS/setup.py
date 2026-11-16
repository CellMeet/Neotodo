# [macos] py2app configuration.
#
# ``build.sh`` is the supported entry point: it generates NeoTodo.icns, runs
# ``python3 setup.py py2app`` and then copies ``web/`` into the bundle's
# Resources folder. Keeping the copy in build.sh means the snapshot under
# ``web/`` stays the single source of truth for the UI.
import os
from pathlib import Path

from setuptools import setup

HERE = Path(__file__).resolve().parent
VERSION = os.environ.get("NEOTODO_VERSION", "0.0.1")
BUILD = os.environ.get("NEOTODO_BUILD", "1")

PLIST = {
    "CFBundleName": "NeoTodo",
    "CFBundleDisplayName": "NeoTodo",
    "CFBundleIdentifier": os.environ.get("NEOTODO_BUNDLE_ID", "com.cellmeet.neotodo"),
    "CFBundleShortVersionString": VERSION,
    "CFBundleVersion": BUILD,
    "LSMinimumSystemVersion": "11.0",
    "LSApplicationCategoryType": "public.app-category.productivity",
    "NSHighResolutionCapable": True,
    "NSRequiresAquaSystemAppearance": False,
    "NSHumanReadableCopyright": "© 2026 CellMeet. All rights reserved.",
    "ITSAppUsesNonExemptEncryption": False,
    # The workspace is served from 127.0.0.1; ATS never needs the public net.
    "NSAppTransportSecurity": {"NSAllowsLocalNetworking": True},
}

OPTIONS = {
    "argv_emulation": False,
    "strip": False,
    "includes": ["app", "startup", "macos_shell"],
    "packages": ["objc", "AppKit", "Foundation", "WebKit", "PyObjCTools"],
    "excludes": ["tkinter"],
    "plist": PLIST,
}

icon = HERE / "NeoTodo.icns"
if icon.is_file():
    OPTIONS["iconfile"] = str(icon)

setup(
    app=["main.py"],
    name="NeoTodo",
    version=VERSION,
    options={"py2app": OPTIONS},
    setup_requires=["py2app"],
)
