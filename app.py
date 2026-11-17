# [shared] NeoTodo backend: Linux-first, also used by Windows (windows_app.py)
# and Android (synced by android/sync-sources.sh). Do not create a Windows
# or Android fork of this file; sync later as a batch.
#!/usr/bin/python3
from __future__ import annotations

import base64
import hashlib
import io
import json
import mimetypes
import os
import re
import shutil
import signal
import socket
import ssl
import subprocess
import tempfile

import startup
import sys
import threading
import time
import urllib.error
import urllib.request
import uuid
import zipfile
from datetime import date, datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, quote, unquote, urlparse

if getattr(sys, "frozen", False):
    APP_DIR = Path(getattr(sys, "_MEIPASS", Path(sys.executable).resolve().parent))
else:
    APP_DIR = Path(__file__).resolve().parent
WEB_DIR = APP_DIR / "web"


def app_data_dir() -> Path:
    if sys.platform == "win32":
        base = os.environ.get("APPDATA") or os.environ.get("LOCALAPPDATA") or str(Path.home())
        return Path(base) / "NeoTodo"
    if sys.platform == "darwin":
        return Path.home() / "Library" / "Application Support" / "NeoTodo"
    return Path.home() / ".local/share/neotodo"


DATA_DIR = app_data_dir()
DATA_FILE = DATA_DIR / "NeoTodo.json"
LEGACY_FILE = DATA_DIR / "data.json"
AGENT_FILE = DATA_DIR / "agents.json"
# Legacy journal from the old resume-after-restart behavior. It is deleted at
# startup so an existing install cannot replay a cut-off instruction.
AGENT_RUNS_FILE = DATA_DIR / "agent-runs.json"
AGENT_FILES_DIR = DATA_DIR / "agent-files"
# AI settings live beside the conversations. `ai-opencode.json` is generated
# from the custom provider rows and handed to OpenCode through OPENCODE_CONFIG,
# so NeoTodo never rewrites the user's global OpenCode configuration.
AI_CONFIG_FILE = DATA_DIR / "ai-config.json"
AI_OPENCODE_CONFIG = DATA_DIR / "ai-opencode.json"
AI_ACTIVITY_FILE = DATA_DIR / "agent-activity.log"
AI_MODEL_RE = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.:#/-]+$")
AI_PROVIDER_ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,47}$")
AI_NOTIFICATION_SOUNDS = (
    "trainWhistle", "chime", "ding", "guitarPluck", "itemGet", "completeTap", "achievementTap",
)
AI_AGENT_KINDS = ("captain", "todo", "subtask")
AI_DEFAULT_CONFIG = {
    "version": 1,
    "default_agent": "opencode",
    "default_model": "",
    "default_mode": "chat",
    "agent_models": {"captain": "", "todo": "", "subtask": ""},
    "agent_modes": {"captain": "chat", "todo": "chat", "subtask": "build"},
    "enabled_models": [],
    "notifications": True,
    "notification_sound": "trainWhistle",
    "auto_attach_note": True,
    "save_chats": False,
    "custom_instructions": "",
    "providers": [],
    "commands": [],
    "environment": [],
    "activity_log": True,
    "timeout_minutes": 15,
    "max_parallel": 12,
}
# Retired last-page cache from older builds (a saved HTML copy and a launch
# screenshot). Startup now restores the live page itself, so these files are
# deleted on launch instead of being painted before the app is ready.
LEGACY_STARTUP_FILES = (DATA_DIR / "last-page.html", DATA_DIR / "last-page.png")
SOUNDS_DIR = DATA_DIR / "sounds"
NOTE_MATERIALS_DIR = DATA_DIR / "note-materials"
PICTURES_DIR = DATA_DIR / "pictures"
MUSIC_DIR = DATA_DIR / "music"
DETACH_PREVIEW_FILE = DATA_DIR / "detach-preview.png"
# Fork windows are separate NeoTodo instances owned by this notebook. Each one
# owns a data file and an ephemeral port, so finishing its fake todo never
# touches this notebook's achievements or history. They run as child processes
# (never detached), so quitting the notebook ends every fork and the agents it
# started instead of leaving an orphan test process behind.
FORK_DIR = DATA_DIR / "forks"
FORK_SERVERS: dict[str, dict] = {}
FORK_SERVERS_LOCK = threading.Lock()
FORK_PROCS: dict[str, subprocess.Popen] = {}
FORK_PROCS_LOCK = threading.Lock()
FORK_ID_RE = re.compile(r"[0-9a-f]{8,64}")
PLUGINS_DIR = DATA_DIR / "plugins"
PLUGIN_CATALOG_CACHE = DATA_DIR / "plugin-catalog.json"
# The community index lives in the repository so a pull request is the only
# upload step. The bundled copy in web/plugins is the offline fallback.
PLUGIN_CATALOG_URL = os.environ.get(
    "NEOTODO_PLUGIN_CATALOG",
    "https://raw.githubusercontent.com/CellMeet/Neotodo/main/community/catalog.json",
).strip()
PLUGIN_CATALOG_TTL = 12 * 60 * 60
PLUGIN_ARCHIVE_MAX_BYTES = 24_000_000
PLUGIN_ARCHIVE_MAX_FILES = 400
PLUGIN_ARCHIVE_MAX_UNCOMPRESSED = 48_000_000
PLUGIN_ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,63}$")

# Theme packs are the community unit for colours, wallpapers, sounds and
# achievement icons. A pack is a normal folder with theme.json at its root; the
# web community publishes zipped folders so a pull request is still the only
# upload step. Bundled packs in web/theme-packs are the offline storefront and
# the source used when a catalog entry is marked "bundled".
THEME_PACKS_DIR = DATA_DIR / "theme-packs"
THEME_EXPORTS_DIR = DATA_DIR / "theme-exports"
# Icon themes replace only the small marks around the notebook: the napkin,
# headphones, fans, fork flame and the AI badge. They are deliberately separate
# from app themes, so switching the paper never switches the icons (and the
# other way round). Bundled sets live in web/icon-themes; a user can add their
# own folder to <data>/icon-themes/.
ICON_THEMES_DIR = DATA_DIR / "icon-themes"
ICON_THEME_SLOTS = (
    "tissue", "fan", "fanDone", "aiRunning", "aiDone", "aiDoneFinal",
    "achievement", "achievementGold", "checkDone", "rowBurn", "fork",
)
ICON_THEME_IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg"}
# The notebook and the AI console own their themes. Each one keeps its palette
# in its own folder, so a NeoTodo pack in theme-packs can never repaint either
# pane, and a note or AI palette can never change the app paper.
NOTE_THEMES_DIR = DATA_DIR / "note-theme"
AI_THEMES_DIR = DATA_DIR / "ai-theme"
# Legacy: before page_line existed the sheet boundary kept its own colour in
# this file. It is still read once as the migration seed for page_line and the
# old action is kept for compatibility, but page dividers are now owned by
# page-line.json and the line never reads a NeoTodo theme.
BASELINE_COLOR_FILE = DATA_DIR / "baseline-color.json"
BASELINE_COLOR_DEFAULT = "#333333"
# `page_line` is the single owner of the page's horizontal dividers: the ruled
# grid of the header, the task rows and the empty desk, plus the boundary where
# the desk begins. It keeps its own file so no theme, wallpaper, note palette
# or AI palette can give one row a different line colour from another. A
# wallpaper is the room (priority 1); these lines print on top of it (priority
# 2), which is why the colour is stored here and not read from a theme.
PAGE_LINE_FILE = DATA_DIR / "page-line.json"
PAGE_LINE_ROW_MIN = 32
PAGE_LINE_ROW_MAX = 64
PAGE_LINE_THICKNESS_MIN = 1
PAGE_LINE_THICKNESS_MAX = 4
PAGE_LINE_DEFAULT = {
    "color": BASELINE_COLOR_DEFAULT,
    "opacity": 1.0,
    "row": 40,
    "thickness": 1,
}
# The row baseline is a separate idea from the page divider: it is the hairline
# inside the floating cards (Doing and finished subtasks). It keeps its own file
# so a colour edit on the page rule can never erase the card pattern.
BASELINE_RULE_FILE = DATA_DIR / "baseline-rule.json"
BASELINE_ROW_MODES = ("solid", "gradient", "height")
BASELINE_ROW_DEFAULT = {
    "mode": "solid",
    "color": BASELINE_COLOR_DEFAULT,
    "color2": "#a8691f",
    "angle": 0,
}
THEME_CATALOG_CACHE = DATA_DIR / "theme-catalog.json"
THEME_CATALOG_URL = os.environ.get(
    "NEOTODO_THEME_CATALOG",
    "https://raw.githubusercontent.com/CellMeet/Neotodo/main/community/themes.json",
).strip()
THEME_CATALOG_TTL = 12 * 60 * 60
THEME_ARCHIVE_MAX_BYTES = 24_000_000
THEME_ARCHIVE_MAX_FILES = 400
THEME_ARCHIVE_MAX_UNCOMPRESSED = 64_000_000
THEME_ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,63}$")
THEME_ASSET_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"}
THEME_ASSET_AUDIO_EXTS = {".wav", ".mp3", ".ogg", ".flac", ".m4a"}
SOUND_AUDIO_EXTS = {".wav", ".mp3", ".ogg", ".flac", ".m4a"}
# Sound styles are folders under <data>/sounds/. "classical" is the bundled
# NeoTodo set; any other folder the reader drops there becomes a style.
DEFAULT_SOUND_STYLE = "classical"
THEME_SOUND_KEYS = (
    "type", "enter", "drawerOpen", "drawerClose", "waterFlow",
    "trickle", "windScroll", "train", "paperTear", "steamHiss",
)
THEME_STICKER_KEYS = ("completed", "focus")
# A theme may own the small colours around the page as well as the paper: the
# rule under the text, the add/complete accent and the wash behind a selected
# cell. They are saved in the normal baseline/highlight files when applied.
THEME_CHROME_KEYS = ("baseline", "row", "submit", "highlight")
THEME_PALETTE_FALLBACKS = {
    "paper": "#f7efe3", "paper2": "#ecdfcd", "ink": "#332b2d",
    "muted": "#88786a", "accent": "#c56f4a", "accent2": "#5f7f8b",
    "border": "#d8c3a9", "stamp": "#b0563f",
    "line": "#b6a48e", "rule": "#c9bba7",
}

WALLPAPER_MODES = ("none", "static", "dynamic")
PICTURE_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
PICTURE_VIDEO_EXTS = {".mp4", ".webm", ".mov", ".m4v", ".ogv"}
WALLPAPER_VIDEO_MAX_BYTES = 120_000_000
MUSIC_EXTS = {".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac", ".opus"}
MUSIC_COLORS = ("#ff4d9d", "#41e0d0", "#8f8cff", "#ffb45e", "#7cd4ff", "#b6ff6b")

PALETTE = [
    "#89b4fa", "#a6e3a1", "#f9e2af", "#fab387", "#cba6f7", "#94e2d5",
    "#f38ba8", "#f5c2e7", "#74c7ec", "#b4befe", "#eba0ac", "#f2cdcd",
    "#a3be8c", "#81a1c1", "#b48ead", "#8fbcbb", "#ff6b6b", "#ffd93d",
    "#6bcb77", "#4d96ff", "#9b5de5", "#f15bb5", "#00bbf9", "#00f5d4",
]

THEMES = [
    "light", "dark",
    "tokyo", "space", "aurora", "ocean",
    "forest", "vintage", "alpine", "desert", "emerald",
    "rain", "field", "deco", "bauhaus",
]

QUIT_CALLBACK = None
FOLDER_PICK_CALLBACK = None
# The wallpaper is a file the reader owns. On the desktop shell this callback
# opens a native picture picker and only the path is remembered; on platforms
# without one the web UI falls back to an upload.
FILE_PICK_CALLBACK = None

PROJECT_FILE_LIMIT = 160


def sound_style_id(raw) -> str:
    """A single folder name under sounds/, never a path."""
    name = str(raw or "").strip()
    if not name or name in (".", "..") or "\\" in name or "/" in name:
        return ""
    if Path(name).name != name:
        return ""
    return name


def sound_style_label(name: str) -> str:
    label = str(name or "").replace("-", " ").replace("_", " ").strip()
    return (label[:1].upper() + label[1:]) if label else str(name or "")


def ensure_sounds_dir() -> Path:
    """Create the sounds shelf, one folder per style, and seed classical/.

    The bundled set lives in ``sounds/classical/``. Older installs kept the
    sample files flat in ``sounds/``; those are folded into classical/ once so
    the style picker always has one folder per set and nothing is lost.
    """
    try:
        SOUNDS_DIR.mkdir(parents=True, exist_ok=True)
        classical = SOUNDS_DIR / DEFAULT_SOUND_STYLE
        classical.mkdir(parents=True, exist_ok=True)
        bundled = WEB_DIR / "sounds"
        if bundled.is_dir():
            for src in bundled.iterdir():
                if not src.is_file():
                    continue
                dest = classical / src.name
                if not dest.exists():
                    shutil.copy2(src, dest)
        for item in SOUNDS_DIR.iterdir():
            if not item.is_file() or item.suffix.lower() not in SOUND_AUDIO_EXTS:
                continue
            dest = classical / item.name
            if not dest.exists():
                shutil.move(str(item), str(dest))
    except Exception:
        pass
    return SOUNDS_DIR


def sound_style_dir(style: str = "") -> Path | None:
    """The folder for one sound style, or None when it does not exist."""
    ensure_sounds_dir()
    raw = str(style or "").strip()
    name = sound_style_id(raw) if raw else DEFAULT_SOUND_STYLE
    if not name:
        return None
    try:
        candidate = (SOUNDS_DIR / name).resolve()
        if candidate.is_relative_to(SOUNDS_DIR.resolve()) and candidate.is_dir():
            return candidate
    except Exception:
        pass
    return None


def discover_sound_styles() -> list[dict]:
    """Every folder on the sound shelf, classical/ first, with its audio files."""
    ensure_sounds_dir()
    try:
        folders = [
            item for item in SOUNDS_DIR.iterdir()
            if item.is_dir() and not item.name.startswith(".")
        ]
    except Exception:
        folders = []
    folders.sort(key=lambda item: (item.name != DEFAULT_SOUND_STYLE, item.name.lower()))
    styles = []
    for folder in folders:
        try:
            files = sorted(
                item.name for item in folder.iterdir()
                if item.is_file() and item.suffix.lower() in SOUND_AUDIO_EXTS
            )
        except Exception:
            files = []
        styles.append({
            "id": folder.name,
            "name": sound_style_label(folder.name),
            "files": files,
        })
    if not styles:
        styles.append({
            "id": DEFAULT_SOUND_STYLE,
            "name": sound_style_label(DEFAULT_SOUND_STYLE),
            "files": [],
        })
    return styles


def ensure_note_materials_dir() -> Path:
    """Create a user-editable note material folder seeded with bundled CSS.

    A built-in material is refreshed when the shipped file is newer than the
    copy in the data folder, so a build can update Paper/Glass/Focus without
    asking the user to delete the folder. ``copy2`` keeps the shipped mtime,
    and a copy the user edited afterwards has a newer mtime, so their edits
    stay untouched.
    """
    try:
        NOTE_MATERIALS_DIR.mkdir(parents=True, exist_ok=True)
        bundled = WEB_DIR / "note-materials"
        if bundled.is_dir():
            for src in bundled.iterdir():
                if not src.is_file() or src.suffix.lower() != ".css":
                    continue
                dest = NOTE_MATERIALS_DIR / src.name
                try:
                    if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
                        continue
                except OSError:
                    continue
                shutil.copy2(src, dest)
    except Exception:
        pass
    return NOTE_MATERIALS_DIR


def ensure_pictures_dir() -> Path:
    """Create the pictures folder only when something is actually written.

    Wallpapers are chosen files now, so the app no longer copies anything in
    here itself. The folder remains for older wallpapers that were stored as a
    bare name and for the browser-upload fallback used where a native file
    picker is not available.
    """
    try:
        PICTURES_DIR.mkdir(parents=True, exist_ok=True)
    except Exception:
        pass
    return PICTURES_DIR


def music_has_audio(folder: Path) -> bool:
    try:
        return any(
            item.is_file() and item.suffix.lower() in MUSIC_EXTS
            for item in folder.iterdir()
        )
    except Exception:
        return False


def ensure_music_dir() -> Path:
    """Create the user's music library and seed bundled tracks on first use.

    Once the folder contains audio, it is never re-seeded, so deleting or
    replacing a bundled track actually sticks.
    """
    try:
        MUSIC_DIR.mkdir(parents=True, exist_ok=True)
        if music_has_audio(MUSIC_DIR):
            return MUSIC_DIR
        bundled = WEB_DIR / "music"
        if bundled.is_dir():
            for src in bundled.iterdir():
                if not src.is_file():
                    continue
                if src.suffix.lower() not in MUSIC_EXTS and src.suffix.lower() not in (".lrc", ".json", ".md"):
                    continue
                dest = MUSIC_DIR / src.name
                if not dest.exists():
                    shutil.copy2(src, dest)
    except Exception:
        pass
    return MUSIC_DIR


def music_file(name: str) -> Path | None:
    """Resolve a bare audio filename from the user library or bundled folder."""
    if not isinstance(name, str):
        return None
    name = name.strip()
    if not name or Path(name).name != name:
        return None
    if Path(name).suffix.lower() not in MUSIC_EXTS:
        return None
    ensure_music_dir()
    folders = [MUSIC_DIR]
    if not music_has_audio(MUSIC_DIR):
        folders.append(WEB_DIR / "music")
    for folder in folders:
        candidate = folder / name
        if candidate.is_file():
            return candidate
    return None


def music_lyrics(lrc_name: str, stem: str) -> str:
    """Read a sidecar LRC file, capped so a stray huge file cannot wedge the UI."""
    candidates = []
    raw = str(lrc_name or "").strip()
    if raw and Path(raw).name == raw and raw.lower().endswith(".lrc"):
        candidates.append(raw)
    candidates.append(f"{stem}.lrc")
    ensure_music_dir()
    folders = [MUSIC_DIR] if music_has_audio(MUSIC_DIR) else [MUSIC_DIR, WEB_DIR / "music"]
    for name in candidates:
        for folder in folders:
            path = folder / name
            try:
                if not path.is_file():
                    continue
                data = path.read_bytes()
                if len(data) > 260_000:
                    return ""
                return data.decode("utf-8", errors="replace")
            except Exception:
                continue
    return ""


def music_manifest() -> dict:
    """Read library.json, preferring the user's editable copy."""
    ensure_music_dir()
    for path in (MUSIC_DIR / "library.json", WEB_DIR / "music" / "library.json"):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                return data
        except Exception:
            continue
    return {}


def music_tracks() -> list:
    """Build the player playlist from library.json plus any loose audio files."""
    ensure_music_dir()
    manifest = music_manifest()
    rows = manifest.get("tracks")
    if not isinstance(rows, list):
        rows = []
    tracks = []
    seen = set()
    for index, row in enumerate(rows):
        if not isinstance(row, dict):
            continue
        path = music_file(str(row.get("file") or ""))
        if path is None or path.name in seen:
            continue
        seen.add(path.name)
        title = str(row.get("title") or path.stem).strip() or path.stem
        artist = str(row.get("artist") or "Local file").strip() or "Local file"
        album = str(row.get("album") or "").strip()
        color = str(row.get("color") or "").strip().lower()
        if not re.fullmatch(r"#[0-9a-f]{6}", color):
            color = MUSIC_COLORS[index % len(MUSIC_COLORS)]
        tags = row.get("tags")
        if not isinstance(tags, list):
            tags = []
        tags = [str(tag)[:24] for tag in tags if isinstance(tag, str) and tag.strip()][:6]
        lyrics = music_lyrics(row.get("lrc"), path.stem)
        track = {
            "id": path.name,
            "file": path.name,
            "src": f"/user-music/{quote(path.name)}",
            "title": title,
            "artist": artist,
            "album": album,
            "color": color,
            "tags": tags,
            "instrumental": bool(row.get("instrumental", False)),
        }
        if lyrics:
            track["lrc"] = lyrics
        tracks.append(track)

    for folder in ([MUSIC_DIR] if music_has_audio(MUSIC_DIR) else [MUSIC_DIR, WEB_DIR / "music"]):
        try:
            loose = sorted(
                (
                    item for item in folder.iterdir()
                    if item.is_file() and item.suffix.lower() in MUSIC_EXTS
                ),
                key=lambda item: item.name.lower(),
            )
        except Exception:
            loose = []
        for path in loose:
            if path.name in seen:
                continue
            seen.add(path.name)
            lyrics = music_lyrics("", path.stem)
            track = {
                "id": path.name,
                "file": path.name,
                "src": f"/user-music/{quote(path.name)}",
                "title": path.stem.replace("_", " ").replace("-", " ").strip() or path.stem,
                "artist": "Local file",
                "album": "",
                "color": MUSIC_COLORS[len(tracks) % len(MUSIC_COLORS)],
                "tags": [],
                "instrumental": not bool(lyrics),
            }
            if lyrics:
                track["lrc"] = lyrics
            tracks.append(track)
    return tracks


def ensure_plugins_dir() -> Path:
    """Create the user plugin shelf and return it."""
    try:
        PLUGINS_DIR.mkdir(parents=True, exist_ok=True)
    except Exception:
        pass
    return PLUGINS_DIR


def normalized_plugin_id(value) -> str:
    raw = str(value or "").strip().lower()
    return raw if PLUGIN_ID_RE.fullmatch(raw) else ""


def sanitize_plugin_states(raw) -> dict:
    """Keep the per-plugin switch records so a restart remembers what was off.

    Settings are validated field by field, and plugins are plugins: the host
    only needs to persist each plugin's installed/enabled flags and its small
    bag of toggle/choice values. Anything that does not look like a plugin
    record is dropped instead of being written back to the notebook.
    """
    if not isinstance(raw, dict):
        return {}
    clean = {}
    for plugin_id, record in list(raw.items())[:200]:
        if not isinstance(plugin_id, str) or not PLUGIN_ID_RE.fullmatch(plugin_id):
            continue
        if not isinstance(record, dict):
            continue
        item = {}
        if isinstance(record.get("installed"), bool):
            item["installed"] = record["installed"]
        if isinstance(record.get("enabled"), bool):
            item["enabled"] = record["enabled"]
        settings = record.get("settings")
        values = {}
        if isinstance(settings, dict):
            for key, value in list(settings.items())[:40]:
                if not isinstance(key, str) or not re.fullmatch(r"[a-z0-9_-]{1,64}", key):
                    continue
                if isinstance(value, bool):
                    values[key] = value
                elif isinstance(value, (int, float)):
                    values[key] = value
                elif isinstance(value, str) and len(value) <= 200:
                    values[key] = value
        item["settings"] = values
        clean[plugin_id] = item
    return clean


def safe_http_url(value) -> str:
    raw = str(value or "").strip()
    if not raw or len(raw) > 2000:
        return ""
    parsed = urlparse(raw)
    if parsed.scheme not in ("https", "http") or not parsed.netloc:
        return ""
    return raw


def plugin_setting_rows(raw) -> list:
    """Keep the small controls a plugin manifest declares.

    Plugins can offer switches and one-of-many choices (the Head Bar's bottle
    colour is a choice). The host only needs a stable description of each
    control so Settings can rebuild the same row after a restart; the chosen
    values themselves live in the reader's saved plugin state.
    """
    rows = []
    if not isinstance(raw, list):
        return rows
    for item in raw[:12]:
        if not isinstance(item, dict):
            continue
        kind = item.get("type")
        if kind not in ("toggle", "choice"):
            continue
        setting_id = str(item.get("id") or "").strip()
        if not re.fullmatch(r"[a-z0-9_-]{1,40}", setting_id):
            continue
        label = str(item.get("label") or setting_id)[:80]
        detail = str(item.get("detail") or "")[:220]
        if kind == "toggle":
            rows.append(
                {
                    "id": setting_id,
                    "label": label,
                    "detail": detail,
                    "type": "toggle",
                    "default": item.get("default") is not False,
                }
            )
            continue
        options = []
        seen = set()
        raw_options = item.get("options")
        if not isinstance(raw_options, list):
            raw_options = []
        for option in raw_options:
            if isinstance(option, str):
                value, option_label, option_detail = option, option, ""
            elif isinstance(option, dict):
                value = str(option.get("value") or "").strip()
                option_label = str(option.get("label") or value)
                option_detail = str(option.get("detail") or "")
            else:
                continue
            if not value or len(value) > 64 or value in seen:
                continue
            if not re.fullmatch(r"[A-Za-z0-9_:#.-]+", value):
                continue
            seen.add(value)
            options.append(
                {
                    "value": value,
                    "label": option_label[:80],
                    "detail": option_detail[:220],
                }
            )
            if len(options) >= 12:
                break
        if not options:
            continue
        default = str(item.get("default") or "").strip()
        if default not in seen:
            default = options[0]["value"]
        rows.append(
            {
                "id": setting_id,
                "label": label,
                "detail": detail,
                "type": "choice",
                "default": default,
                "options": options,
            }
        )
    return rows


def normalize_plugin_manifest(raw, folder: Path, source: str) -> dict | None:
    """Validate one manifest and turn it into the registry shape."""
    if not isinstance(raw, dict):
        return None
    plugin_id = normalized_plugin_id(raw.get("id") or getattr(folder, "name", ""))
    if not plugin_id:
        return None
    entry = str(raw.get("entry") or "index.html").strip().replace("\\", "/").lstrip("/")
    if not entry or ".." in Path(entry).parts:
        return None
    if Path(entry).suffix.lower() not in (".html", ".htm"):
        return None
    try:
        if not (folder / entry).is_file():
            return None
    except Exception:
        return None
    icon = str(raw.get("icon") or "").strip().replace("\\", "/").lstrip("/")
    if not icon or ".." in Path(icon).parts or not (folder / icon).is_file():
        icon = ""
    colors = raw.get("colors") if isinstance(raw.get("colors"), dict) else {}
    tags = raw.get("tags")
    if not isinstance(tags, list):
        tags = []
    return {
        "id": plugin_id,
        "name": str(raw.get("name") or plugin_id)[:80],
        "englishName": str(raw.get("englishName") or "")[:80],
        "version": str(raw.get("version") or "1.0.0")[:32],
        "description": str(raw.get("description") or "")[:600],
        "icon": icon,
        "entry": entry,
        "author": str(raw.get("author") or "Community")[:80],
        "category": str(raw.get("category") or "Interface")[:40],
        "kind": str(raw.get("kind") or "")[:32],
        "homepage": safe_http_url(raw.get("homepage")),
        "repository": safe_http_url(raw.get("repository")),
        "license": str(raw.get("license") or "")[:60],
        "tags": [str(tag)[:24] for tag in tags if isinstance(tag, str) and tag.strip()][:6],
        "colors": {
            "accent": str(colors.get("accent") or "")[:32],
            "paper": str(colors.get("paper") or "")[:32],
        },
        "settings": plugin_setting_rows(raw.get("settings")),
        "source": source,
    }


def read_plugin_manifest(folder: Path, source: str) -> dict | None:
    try:
        raw = json.loads((folder / "manifest.json").read_text(encoding="utf-8"))
    except Exception:
        return None
    return normalize_plugin_manifest(raw, folder, source)


def discover_plugins() -> list:
    """Merge bundled plugins with everything the user installed.

    A user folder with the same id wins, so a downloaded plugin can shadow a
    built-in one during development. Dot-prefixed folders are staging areas and
    are ignored.
    """
    found: dict[str, dict] = {}
    for source, root in (("bundled", WEB_DIR / "plugins"), ("user", ensure_plugins_dir())):
        try:
            folders = sorted(
                (item for item in root.iterdir() if item.is_dir() and not item.name.startswith(".")),
                key=lambda item: item.name.lower(),
            )
        except Exception:
            folders = []
        for folder in folders:
            manifest = read_plugin_manifest(folder, source)
            if manifest is None:
                continue
            found[manifest["id"]] = manifest
    return sorted(found.values(), key=lambda item: (item["source"] != "user", item["name"].lower()))


def plugin_file_path(plugin_id, relative) -> Path | None:
    """Resolve a plugin asset from the user shelf, then the bundled shelf."""
    plugin_id = normalized_plugin_id(plugin_id)
    if not plugin_id:
        return None
    rel = unquote(str(relative or "")).replace("\\", "/").lstrip("/")
    if not rel or ".." in Path(rel).parts:
        return None
    for folder in (PLUGINS_DIR / plugin_id, WEB_DIR / "plugins" / plugin_id):
        try:
            root = folder.resolve()
            candidate = (folder / rel).resolve()
            if candidate.is_relative_to(root) and candidate.is_file():
                return candidate
        except Exception:
            continue
    return None


def _read_json_file(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def normalize_baseline_color(value) -> str:
    """Accept one #rrggbb value; anything else falls back to the fixed default."""
    if isinstance(value, str):
        color = value.strip()
        if re.fullmatch(r"#[0-9a-fA-F]{6}", color):
            return color.lower()
    return BASELINE_COLOR_DEFAULT


def normalize_highlight_color(value) -> str:
    """Accept one #rrggbb selection-highlight colour; empty hands it to the theme."""
    if isinstance(value, str):
        color = value.strip()
        if re.fullmatch(r"#[0-9a-fA-F]{6}", color):
            return color.lower()
    return ""


def read_baseline_color() -> str:
    """Read ``baseline-color.json``; the file is the only source of the colour."""
    raw = _read_json_file(BASELINE_COLOR_FILE)
    if isinstance(raw, dict):
        return normalize_baseline_color(
            raw.get("color") or raw.get("baseline-color") or raw.get("baseline_color")
        )
    return BASELINE_COLOR_DEFAULT


def write_baseline_color(value) -> str:
    """Persist the page baseline colour outside the notebook settings."""
    color = normalize_baseline_color(value)
    try:
        BASELINE_COLOR_FILE.parent.mkdir(parents=True, exist_ok=True)
        BASELINE_COLOR_FILE.write_text(
            json.dumps({"color": color}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    except Exception:
        pass
    return color


def _page_line_number(value, fallback, minimum, maximum):
    """Clamp a numeric page_line setting so a hand-edited file cannot break CSS."""
    try:
        number = float(value)
    except (TypeError, ValueError):
        return fallback
    if number != number:  # NaN
        return fallback
    return max(minimum, min(maximum, number))


def normalize_page_line(raw) -> dict:
    """Validate the ``page_line`` object: one colour plus its layout."""
    if isinstance(raw, dict) and isinstance(raw.get("page_line"), dict):
        raw = raw["page_line"]
    if not isinstance(raw, dict):
        raw = {}
    color = raw.get("color") or raw.get("page-line") or raw.get("page_line")
    color = color.strip() if isinstance(color, str) else ""
    if not re.fullmatch(r"#[0-9a-fA-F]{6}", color):
        color = PAGE_LINE_DEFAULT["color"]
    opacity = round(
        _page_line_number(raw.get("opacity"), PAGE_LINE_DEFAULT["opacity"], 0.0, 1.0), 2
    )
    row = int(round(
        _page_line_number(
            raw.get("row"),
            PAGE_LINE_DEFAULT["row"],
            PAGE_LINE_ROW_MIN,
            PAGE_LINE_ROW_MAX,
        )
    ))
    thickness = int(round(
        _page_line_number(
            raw.get("thickness"),
            PAGE_LINE_DEFAULT["thickness"],
            PAGE_LINE_THICKNESS_MIN,
            PAGE_LINE_THICKNESS_MAX,
        )
    ))
    return {
        "color": color.lower(),
        "opacity": opacity,
        "row": row,
        "thickness": thickness,
    }


def read_page_line() -> dict:
    """Read ``page-line.json``; the file is the only source of the page dividers."""
    raw = _read_json_file(PAGE_LINE_FILE)
    if isinstance(raw, dict):
        return normalize_page_line(raw)
    # Before page_line existed the sheet boundary kept its colour in
    # baseline-color.json. Reuse that choice once so it is not silently
    # discarded; every later write goes to page-line.json.
    legacy = _read_json_file(BASELINE_COLOR_FILE)
    if isinstance(legacy, dict):
        color = normalize_baseline_color(
            legacy.get("color") or legacy.get("baseline-color") or legacy.get("baseline_color")
        )
        if color != BASELINE_COLOR_DEFAULT:
            return {**PAGE_LINE_DEFAULT, "color": color}
    return dict(PAGE_LINE_DEFAULT)


def write_page_line(patch) -> dict:
    """Merge a patch into the stored page line and persist the whole object."""
    if isinstance(patch, dict) and isinstance(patch.get("page_line"), dict):
        patch = patch["page_line"]
    if not isinstance(patch, dict):
        patch = {}
    merged = {**read_page_line(), **patch}
    page_line = normalize_page_line(merged)
    try:
        PAGE_LINE_FILE.parent.mkdir(parents=True, exist_ok=True)
        PAGE_LINE_FILE.write_text(
            json.dumps(page_line, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    except Exception:
        pass
    return page_line


def _baseline_row_color(value, fallback: str) -> str:
    if isinstance(value, str):
        color = value.strip()
        if re.fullmatch(r"#[0-9a-fA-F]{6}", color):
            return color.lower()
    return fallback


def normalize_baseline_row_rule(raw) -> dict:
    """Validate the row-rule file. It is structured so a gradient survives."""
    raw = raw.get("rule") if isinstance(raw, dict) and isinstance(raw.get("rule"), dict) else raw
    if not isinstance(raw, dict):
        raw = {}
    mode = raw.get("mode")
    mode = mode.strip().lower() if isinstance(mode, str) else ""
    if mode not in BASELINE_ROW_MODES:
        mode = BASELINE_ROW_DEFAULT["mode"]
    try:
        angle = int(round(float(raw.get("angle", BASELINE_ROW_DEFAULT["angle"]))))
    except (TypeError, ValueError):
        angle = BASELINE_ROW_DEFAULT["angle"]
    return {
        "mode": mode,
        "color": _baseline_row_color(raw.get("color"), BASELINE_ROW_DEFAULT["color"]),
        "color2": _baseline_row_color(
            raw.get("color2") or raw.get("color_2"),
            BASELINE_ROW_DEFAULT["color2"],
        ),
        "angle": max(0, min(180, angle)),
    }


def read_baseline_row_rule() -> dict:
    """Read ``baseline-rule.json``; it is independent of every theme file."""
    return normalize_baseline_row_rule(_read_json_file(BASELINE_RULE_FILE))


def write_baseline_row_rule(raw) -> dict:
    """Persist the row baseline without touching the page-divider colour."""
    rule = normalize_baseline_row_rule(raw)
    try:
        BASELINE_RULE_FILE.parent.mkdir(parents=True, exist_ok=True)
        BASELINE_RULE_FILE.write_text(
            json.dumps({"rule": rule}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    except Exception:
        pass
    return rule


def _catalog_entry(raw) -> dict | None:
    if not isinstance(raw, dict):
        return None
    plugin_id = normalized_plugin_id(raw.get("id"))
    if not plugin_id:
        return None
    tags = raw.get("tags")
    if not isinstance(tags, list):
        tags = []
    return {
        "id": plugin_id,
        "name": str(raw.get("name") or plugin_id)[:80],
        "englishName": str(raw.get("englishName") or "")[:80],
        "version": str(raw.get("version") or "1.0.0")[:32],
        "description": str(raw.get("description") or "")[:900],
        "author": str(raw.get("author") or "Community")[:80],
        "category": str(raw.get("category") or "Interface")[:40],
        "icon": str(raw.get("icon") or "")[:500],
        "download": safe_http_url(raw.get("download")),
        "homepage": safe_http_url(raw.get("homepage")),
        "repository": safe_http_url(raw.get("repository")),
        "license": str(raw.get("license") or "")[:60],
        "sha256": str(raw.get("sha256") or "").strip().lower()[:64],
        "tags": [str(tag)[:24] for tag in tags if isinstance(tag, str) and tag.strip()][:8],
        "featured": bool(raw.get("featured", False)),
        "bundled": bool(raw.get("bundled", False)),
        "official": bool(raw.get("official", False)),
    }


def normalize_catalog(raw) -> dict | None:
    if not isinstance(raw, dict):
        return None
    plugins = raw.get("plugins")
    if not isinstance(plugins, list):
        return None
    entries = []
    seen = set()
    for item in plugins[:500]:
        entry = _catalog_entry(item)
        if entry is None or entry["id"] in seen:
            continue
        seen.add(entry["id"])
        entries.append(entry)
    return {
        "schema": int(raw.get("schema") or 1),
        "name": str(raw.get("name") or "NeoTodo Plugin Community")[:80],
        "homepage": safe_http_url(raw.get("homepage")) or "https://github.com/CellMeet/Neotodo/tree/main/community",
        "updated": str(raw.get("updated") or "")[:40],
        "plugins": entries,
    }


def _ssl_context() -> ssl.SSLContext:
    """Use certifi when the platform Python has no system CA bundle."""
    try:
        import certifi

        return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        return ssl.create_default_context()


def _fetch_json_url(url: str, max_bytes: int = 1_500_000) -> dict | None:
    parsed = urlparse(url)
    if parsed.scheme not in ("https", "http") or not parsed.netloc:
        return None
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "NeoTodo/0.0.1 Plugin Community", "Accept": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=12, context=_ssl_context()) as response:
        body = response.read(max_bytes + 1)
    if len(body) > max_bytes:
        raise ValueError("Catalog is too large")
    return json.loads(body.decode("utf-8"))


def _load_catalog_override() -> dict | None:
    """Allow a local path or URL through NEOTODO_PLUGIN_CATALOG for development."""
    source = PLUGIN_CATALOG_URL
    if not source or source.lower() in ("off", "none", "0"):
        return None
    if source.startswith(("http://", "https://")):
        return _fetch_json_url(source)
    path = Path(source).expanduser()
    if path.is_file():
        return _read_json_file(path)
    return None


def _merge_bundled_catalog(catalog: dict | None, bundled: dict | None) -> dict | None:
    """Keep bundled plugins visible even when the cache or remote index is old.

    A community refresh can lag behind the app, and a cached index may predate a
    plugin that shipped with this build. Bundled entries are part of the app, so
    they are always appended when the catalogue does not list them yet.
    """
    if not catalog:
        return bundled
    if not bundled:
        return catalog
    plugins = list(catalog.get("plugins") or [])
    known = {entry.get("id") for entry in plugins}
    for entry in bundled.get("plugins") or []:
        if entry.get("id") not in known:
            plugins.append(entry)
            known.add(entry.get("id"))
    return {**catalog, "plugins": plugins}


def community_catalog(refresh: bool = False) -> dict:
    """Return the community index with a cached/offline fallback.

    The notebook must open even when the network is slow or the catalog host is
    unreachable, so every failure degrades to the bundled index.
    """
    bundled = normalize_catalog(_read_json_file(WEB_DIR / "plugins" / "community-catalog.json"))
    cached_raw = _read_json_file(PLUGIN_CATALOG_CACHE)
    cached = normalize_catalog(cached_raw)
    cache_age = None
    try:
        cache_age = max(0, int(time.time() - PLUGIN_CATALOG_CACHE.stat().st_mtime))
    except Exception:
        cache_age = None

    should_fetch = bool(PLUGIN_CATALOG_URL) and PLUGIN_CATALOG_URL.lower() not in ("off", "none", "0")
    if should_fetch and not refresh and cached is not None and cache_age is not None and cache_age < PLUGIN_CATALOG_TTL:
        should_fetch = False

    catalog = cached or bundled or {
        "name": "NeoTodo Plugin Community",
        "homepage": "https://github.com/CellMeet/Neotodo/tree/main/community",
        "updated": "",
        "plugins": [],
    }
    source = "cache" if cached is not None else "bundled"
    error = ""
    if should_fetch:
        try:
            fetched = normalize_catalog(_load_catalog_override())
            if fetched is None:
                raise ValueError("Catalog did not contain a plugins list")
            catalog = fetched
            source = "remote"
            try:
                DATA_DIR.mkdir(parents=True, exist_ok=True)
                PLUGIN_CATALOG_CACHE.write_text(
                    json.dumps(fetched, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8",
                )
            except Exception:
                pass
        except Exception as fetch_error:
            error = str(fetch_error) or "Could not refresh the catalog"

    return {
        **_merge_bundled_catalog(catalog, bundled),
        "catalog_source": source,
        "catalog_error": error,
        "cached_at": cache_age,
        "catalog_url": PLUGIN_CATALOG_URL,
    }


def _zip_parts(name: str) -> list[str]:
    clean = name.replace("\\", "/")
    if clean.startswith("/") or re.match(r"^[A-Za-z]:", clean):
        raise ValueError("Archive contains an absolute path")
    parts = [part for part in clean.split("/") if part not in ("", ".")]
    if any(part == ".." for part in parts):
        raise ValueError("Archive contains a parent-directory path")
    return parts


def _extract_plugin_archive(data: bytes, staging: Path) -> Path:
    """Extract one plugin folder from a zip and return the folder holding manifest.json."""
    try:
        archive = zipfile.ZipFile(io.BytesIO(data))
    except Exception as error:
        raise ValueError("That file is not a valid plugin .zip") from error
    with archive:
        infos = archive.infolist()
        if len(infos) > PLUGIN_ARCHIVE_MAX_FILES:
            raise ValueError("The plugin archive contains too many files")
        candidates = []
        total = 0
        for info in infos:
            parts = _zip_parts(info.filename)
            if info.is_dir():
                continue
            total += max(0, int(info.file_size or 0))
            if total > PLUGIN_ARCHIVE_MAX_UNCOMPRESSED:
                raise ValueError("The plugin archive is too large when unpacked")
            if parts and parts[-1] == "manifest.json":
                candidates.append(parts[:-1])
        if not candidates:
            raise ValueError("No manifest.json found in the plugin archive")
        prefix = min(candidates, key=len)
        staging.mkdir(parents=True, exist_ok=True)
        for info in infos:
            if info.is_dir():
                continue
            mode = (info.external_attr >> 16) & 0o170000
            if mode == 0o120000:
                raise ValueError("The plugin archive contains a symbolic link")
            parts = _zip_parts(info.filename)
            if parts[: len(prefix)] != prefix or len(parts) <= len(prefix):
                continue
            relative = parts[len(prefix):]
            target = staging.joinpath(*relative)
            root = staging.resolve()
            try:
                if not target.resolve().is_relative_to(root):
                    raise ValueError("The plugin archive escapes its folder")
            except Exception as error:
                raise ValueError("The plugin archive contains an unsafe path") from error
            target.parent.mkdir(parents=True, exist_ok=True)
            with archive.open(info, "r") as source, target.open("wb") as sink:
                remaining = PLUGIN_ARCHIVE_MAX_BYTES
                while True:
                    chunk = source.read(64 * 1024)
                    if not chunk:
                        break
                    remaining -= len(chunk)
                    if remaining < 0:
                        raise ValueError("The plugin archive is too large")
                    sink.write(chunk)
    return staging


def install_plugin_archive(data: bytes, expected_id: str = "", expected_sha256: str = "") -> dict:
    """Validate an archive and atomically move it onto the user plugin shelf."""
    if not isinstance(data, (bytes, bytearray)) or not data:
        raise ValueError("The plugin archive is empty")
    if len(data) > PLUGIN_ARCHIVE_MAX_BYTES:
        raise ValueError("The plugin archive is larger than 24 MB")
    expected_sha256 = str(expected_sha256 or "").strip().lower()
    if expected_sha256:
        if not re.fullmatch(r"[0-9a-f]{64}", expected_sha256):
            raise ValueError("The expected sha256 is not valid")
        actual = hashlib.sha256(data).hexdigest()
        if actual != expected_sha256:
            raise ValueError("The plugin checksum does not match")
    ensure_plugins_dir()
    temp_root = Path(tempfile.mkdtemp(prefix=".install-", dir=str(PLUGINS_DIR)))
    staging = temp_root / "plugin"
    try:
        _extract_plugin_archive(data, staging)
        manifest = read_plugin_manifest(staging, "user")
        if manifest is None:
            raise ValueError("manifest.json is missing a valid id, entry or index.html")
        expected = normalized_plugin_id(expected_id)
        if expected and manifest["id"] != expected:
            raise ValueError(f"The archive contains '{manifest['id']}', not '{expected}'")
        if (WEB_DIR / "plugins" / manifest["id"]).is_dir():
            raise ValueError(f"'{manifest['id']}' is a built-in plugin id; choose another id")
        destination = PLUGINS_DIR / manifest["id"]
        backup = None
        if destination.exists():
            backup = PLUGINS_DIR / f".backup-{manifest['id']}-{uuid.uuid4().hex[:8]}"
            destination.rename(backup)
        try:
            staging.rename(destination)
        except Exception:
            if backup is not None and backup.exists() and not destination.exists():
                backup.rename(destination)
            raise
        if backup is not None:
            shutil.rmtree(backup, ignore_errors=True)
        return manifest
    finally:
        shutil.rmtree(temp_root, ignore_errors=True)


def download_plugin_archive(url: str) -> bytes:
    url = safe_http_url(url)
    if not url:
        raise ValueError("The plugin download URL must start with https://")
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "NeoTodo/0.0.1 Plugin Community", "Accept": "application/zip, application/octet-stream"},
    )
    with urllib.request.urlopen(request, timeout=30, context=_ssl_context()) as response:
        body = response.read(PLUGIN_ARCHIVE_MAX_BYTES + 1)
    if len(body) > PLUGIN_ARCHIVE_MAX_BYTES:
        raise ValueError("The plugin archive is larger than 24 MB")
    return body


def uninstall_plugin_files(plugin_id) -> dict:
    plugin_id = normalized_plugin_id(plugin_id)
    if not plugin_id:
        raise ValueError("Unknown plugin")
    destination = PLUGINS_DIR / plugin_id
    if not destination.is_dir():
        raise ValueError("That plugin is not installed in the user plugin folder")
    shutil.rmtree(destination)
    return {"id": plugin_id, "folder": str(destination)}


def ensure_theme_packs_dir() -> Path:
    """Create the user's installed theme-pack shelf."""
    try:
        THEME_PACKS_DIR.mkdir(parents=True, exist_ok=True)
    except Exception:
        pass
    return THEME_PACKS_DIR


def seed_bundled_theme_packs() -> None:
    """Put real theme folders in a fresh shelf, once.

    Appearance → Theme → Manage opens ``<data>/theme-packs``. A new notebook
    has no user packs there, so the folder used to open empty even though the
    Theme list was full of palettes. Copy the bundled packs into the shelf the
    first time the folder is opened; every shelf entry then has a folder the
    reader can inspect, edit or delete. A marker keeps the copy from coming
    back after a pack is removed on purpose.
    """
    root = ensure_theme_packs_dir()
    marker = root / ".bundled-packs-seeded"
    if marker.exists():
        return
    try:
        marker.write_text(
            "Bundled theme packs were copied here once. Delete a pack folder to "
            "remove it; delete this marker to copy the bundled packs again.\n",
            encoding="utf-8",
        )
    except Exception:
        return
    try:
        bundles = sorted(
            (
                item
                for item in (WEB_DIR / "theme-packs").iterdir()
                if item.is_dir() and not item.name.startswith(".")
            ),
            key=lambda item: item.name.lower(),
        )
    except Exception:
        return
    for source in bundles:
        pack = read_theme_manifest(source, "bundled")
        if pack is None or pack["id"] in THEMES:
            continue
        destination = root / pack["id"]
        if destination.exists():
            continue
        staging = root / f".seed-{pack['id']}-{uuid.uuid4().hex[:8]}"
        try:
            shutil.copytree(source, staging)
            staging.rename(destination)
        except Exception:
            shutil.rmtree(staging, ignore_errors=True)


def ensure_theme_exports_dir() -> Path:
    try:
        THEME_EXPORTS_DIR.mkdir(parents=True, exist_ok=True)
    except Exception:
        pass
    return THEME_EXPORTS_DIR


def normalized_theme_id(value) -> str:
    raw = str(value or "").strip().lower().replace("_", "-").replace(" ", "-")
    raw = re.sub(r"[^a-z0-9-]+", "-", raw).strip("-")[:64]
    return raw if THEME_ID_RE.fullmatch(raw) else ""


# ---------------------------------------------------------------------------
# Icon theme shelf
# ---------------------------------------------------------------------------
def ensure_icon_themes_dir() -> Path:
    """Create the user's icon-theme shelf (bundled sets are read-only)."""
    try:
        ICON_THEMES_DIR.mkdir(parents=True, exist_ok=True)
    except Exception:
        pass
    return ICON_THEMES_DIR


def _icon_theme_asset_rel(raw, folder: Path) -> str:
    """Only accept an image that really lives inside the icon-theme folder."""
    rel = str(raw or "").strip().replace("\\", "/").lstrip("/")
    if not rel or ".." in Path(rel).parts:
        return ""
    suffix = Path(rel).suffix.lower()
    if suffix not in ICON_THEME_IMAGE_EXTS:
        return ""
    try:
        root = folder.resolve()
        candidate = (folder / rel).resolve()
        if candidate.is_relative_to(root) and candidate.is_file():
            return rel
    except Exception:
        pass
    return ""


def normalize_icon_theme_manifest(raw, folder: Path, source: str) -> dict | None:
    """Read ``icon-themes/<id>/theme.json``; unknown slots are ignored."""
    if not isinstance(raw, dict):
        return None
    theme_id = normalized_theme_id(raw.get("id") or folder.name)
    if not theme_id:
        return None
    raw_icons = raw.get("icons")
    if not isinstance(raw_icons, dict):
        raw_icons = {}
    icons = {}
    for slot in ICON_THEME_SLOTS:
        rel = _icon_theme_asset_rel(raw_icons.get(slot), folder)
        if rel:
            icons[slot] = rel
    return {
        "id": theme_id,
        "name": str(raw.get("name") or theme_id)[:80],
        "englishName": str(raw.get("englishName") or raw.get("english_name") or "")[:80],
        "version": str(raw.get("version") or "")[:32],
        "description": str(raw.get("description") or "")[:240],
        "author": str(raw.get("author") or "")[:80],
        "source": source,
        "builtin": bool(raw.get("builtin")) or source == "bundled",
        "icons": icons,
    }


def _read_icon_theme_folder(folder: Path, source: str) -> dict | None:
    try:
        raw = json.loads((folder / "theme.json").read_text(encoding="utf-8"))
    except Exception:
        return None
    return normalize_icon_theme_manifest(raw, folder, source)


def discover_icon_themes() -> list:
    """Bundled icon sets first, then any folders the reader added."""
    themes: dict[str, dict] = {}
    for source, root in (("bundled", WEB_DIR / "icon-themes"), ("user", ensure_icon_themes_dir())):
        try:
            folders = sorted(
                (item for item in root.iterdir() if item.is_dir() and not item.name.startswith(".")),
                key=lambda item: item.name.lower(),
            )
        except Exception:
            folders = []
        for folder in folders:
            manifest = _read_icon_theme_folder(folder, source)
            if manifest is not None:
                # A user folder may update a bundled set under the same id.
                themes[manifest["id"]] = manifest
    themes.setdefault("classical", {
        "id": "classical",
        "name": "Classical",
        "englishName": "Classical",
        "version": "",
        "description": "NeoTodo's original icons.",
        "author": "NeoTodo",
        "source": "bundled",
        "builtin": True,
        "icons": {},
    })
    return sorted(themes.values(), key=lambda item: (item["id"] != "classical", item["name"].lower()))


def icon_theme_asset_path(theme_id, relative) -> Path | None:
    """Resolve an icon-theme asset from the user shelf, then the bundle."""
    theme_id = normalized_theme_id(theme_id)
    if not theme_id:
        return None
    rel = unquote(str(relative or "")).replace("\\", "/").lstrip("/")
    if not rel or ".." in Path(rel).parts:
        return None
    for folder in (ICON_THEMES_DIR / theme_id, WEB_DIR / "icon-themes" / theme_id):
        try:
            root = folder.resolve()
            candidate = (folder / rel).resolve()
            if candidate.is_relative_to(root) and candidate.is_file():
                return candidate
        except Exception:
            continue
    return None


def normalize_theme_color(value, fallback: str = "") -> str:
    raw = str(value or "").strip()
    if re.fullmatch(r"#[0-9a-fA-F]{6}", raw):
        return raw.lower()
    if re.fullmatch(r"#[0-9a-fA-F]{3}", raw):
        return "#" + "".join(ch * 2 for ch in raw[1:].lower())
    return fallback


def normalize_theme_alpha(value, fallback: float) -> float:
    try:
        alpha = float(value)
    except (TypeError, ValueError):
        return fallback
    return round(max(0.03, min(1.0, alpha)), 3)


def normalize_theme_chrome(raw) -> dict | None:
    """Optional colours a theme contributes to the page chrome.

    ``baseline`` is the page divider, ``row`` the hairline under task rows,
    ``submit`` the colour of the add/complete actions and ``highlight`` the
    wash behind a selected cell. Only valid ``#rrggbb`` values are kept; a pack
    with none of them simply leaves the reader's own files untouched.
    """
    if not isinstance(raw, dict):
        return None
    chrome = {}
    for key in THEME_CHROME_KEYS:
        color = normalize_theme_color(raw.get(key))
        if color:
            chrome[key] = color
    row2 = normalize_theme_color(raw.get("row2"))
    if row2:
        chrome["row2"] = row2
    return chrome or None


def normalize_theme_palette(raw) -> dict | None:
    """Validate the colours a pack contributes to the postcard theme."""
    if not isinstance(raw, dict):
        return None
    # A pack must at least describe its paper and ink. Everything else can be
    # derived so tiny community palettes still produce a readable page.
    if not normalize_theme_color(raw.get("paper")) or not normalize_theme_color(raw.get("ink")):
        return None
    paper = normalize_theme_color(raw.get("paper"), THEME_PALETTE_FALLBACKS["paper"])
    ink = normalize_theme_color(raw.get("ink"), THEME_PALETTE_FALLBACKS["ink"])
    accent = normalize_theme_color(raw.get("accent"), ink)
    palette = {
        "paper": paper,
        "paper2": normalize_theme_color(raw.get("paper2"), paper),
        "ink": ink,
        "muted": normalize_theme_color(raw.get("muted"), ink),
        "accent": accent,
        "accent2": normalize_theme_color(raw.get("accent2"), accent),
        "border": normalize_theme_color(raw.get("border"), paper),
        "stamp": normalize_theme_color(raw.get("stamp"), accent),
        # Optional line colours. Older packs leave these empty so the client
        # keeps deriving its subtle ink rule from the palette.
        "line": normalize_theme_color(raw.get("line"), ""),
        "rule": normalize_theme_color(raw.get("rule"), ""),
        "lineAlpha": normalize_theme_alpha(raw.get("lineAlpha"), 0.42),
        "ruleAlpha": normalize_theme_alpha(raw.get("ruleAlpha"), 0.28),
        "glow": str(raw.get("glow") or "")[:80],
        "motif": str(raw.get("motif") or "✦")[:8],
        "quote": str(raw.get("quote") or "A theme from the NeoTodo community.")[:220],
    }
    if not re.fullmatch(r"rgba?\([^)]{1,60}\)", palette["glow"]):
        palette["glow"] = ""
    return palette


NOTE_PANE_PALETTE_KEYS = (
    "paper", "ink", "muted", "rule", "accent", "accent2", "handle",
)
AI_PANE_PALETTE_KEYS = (
    "bg", "soft", "ink", "inkSoft", "muted", "faint", "line", "lineStrong",
    "accent", "notice", "handle",
)


def normalize_note_palette(raw) -> dict | None:
    """Validate the optional notebook theme a pack may contribute."""
    if not isinstance(raw, dict):
        return None
    paper = normalize_theme_color(raw.get("paper"))
    ink = normalize_theme_color(raw.get("ink"))
    if not paper or not ink:
        return None
    palette = {
        "paper": paper,
        "ink": ink,
        "muted": normalize_theme_color(raw.get("muted"), ""),
        "rule": normalize_theme_color(raw.get("rule"), ""),
        "accent": normalize_theme_color(raw.get("accent"), ""),
        "accent2": normalize_theme_color(raw.get("accent2"), ""),
        "handle": normalize_theme_color(raw.get("handle"), ""),
    }
    return {key: palette[key] for key in NOTE_PANE_PALETTE_KEYS}


def normalize_ai_palette(raw) -> dict | None:
    """Validate the optional AI console theme a pack may contribute."""
    if not isinstance(raw, dict):
        return None
    background = normalize_theme_color(raw.get("bg") or raw.get("paper"))
    ink = normalize_theme_color(raw.get("ink"))
    if not background or not ink:
        return None
    palette = {
        "bg": background,
        "soft": normalize_theme_color(raw.get("soft"), ""),
        "ink": ink,
        "inkSoft": normalize_theme_color(raw.get("inkSoft") or raw.get("ink_soft"), ""),
        "muted": normalize_theme_color(raw.get("muted"), ""),
        "faint": normalize_theme_color(raw.get("faint"), ""),
        "line": normalize_theme_color(raw.get("line"), ""),
        "lineStrong": normalize_theme_color(raw.get("lineStrong") or raw.get("line_strong"), ""),
        "accent": normalize_theme_color(raw.get("accent"), ""),
        "notice": normalize_theme_color(raw.get("notice"), ""),
        "handle": normalize_theme_color(raw.get("handle"), ""),
    }
    return {key: palette[key] for key in AI_PANE_PALETTE_KEYS}


# ---------------------------------------------------------------------------
# Note and AI theme shelves
# ---------------------------------------------------------------------------
# A NeoTodo theme pack may describe a notebook palette and an AI console
# palette. Those palettes belong to the notebook and the console, not to the
# app paper, so they are saved into their own folders as plain JSON files. The
# app theme shelf (theme-packs/) and the two pane shelves never share a file:
# changing the app paper cannot recolor the notebook or the console.
PANE_THEME_SHELVES = {
    "note": NOTE_THEMES_DIR,
    "ai": AI_THEMES_DIR,
}
PANE_THEME_KINDS = tuple(PANE_THEME_SHELVES)


def pane_theme_folder(kind: str) -> Path:
    folder = PANE_THEME_SHELVES.get(kind)
    if folder is None:
        raise ValueError("Unknown theme shelf")
    return folder


def ensure_pane_themes_dir(kind: str) -> Path:
    folder = pane_theme_folder(kind)
    try:
        folder.mkdir(parents=True, exist_ok=True)
    except Exception:
        pass
    return folder


def _pane_palette(kind: str, raw) -> dict | None:
    return normalize_note_palette(raw) if kind == "note" else normalize_ai_palette(raw)


def normalize_pane_theme(kind: str, raw, fallback_id: str = "") -> dict | None:
    """Validate one ``note-theme/*.json`` / ``ai-theme/*.json`` palette file."""
    if not isinstance(raw, dict):
        return None
    theme_id = normalized_theme_id(raw.get("id") or fallback_id)
    if not theme_id:
        return None
    palette = _pane_palette(kind, raw.get("palette") or raw.get(kind))
    if palette is None:
        return None
    return {
        "id": theme_id,
        "name": str(raw.get("name") or theme_id)[:80],
        "englishName": str(raw.get("englishName") or raw.get("english_name") or "")[:80],
        "source": str(raw.get("source") or "user")[:24],
        "palette": palette,
    }


def discover_pane_themes(kind: str) -> list:
    """Read one pane shelf. Only *.json files in that folder are considered."""
    root = ensure_pane_themes_dir(kind)
    try:
        files = sorted(root.glob("*.json"), key=lambda item: item.name.lower())
    except Exception:
        files = []
    themes = []
    for path in files:
        record = normalize_pane_theme(kind, _read_json_file(path), fallback_id=path.stem)
        if record is not None:
            themes.append(record)
    return sorted(themes, key=lambda item: item["name"].lower())


def write_pane_theme(kind: str, record: dict) -> Path:
    """Save one palette file into the note-theme / ai-theme folder."""
    if not isinstance(record, dict):
        raise ValueError("Invalid theme")
    theme_id = normalized_theme_id(record.get("id"))
    if not theme_id:
        raise ValueError("A note or AI theme needs a valid id")
    palette = _pane_palette(kind, record.get("palette"))
    if palette is None:
        raise ValueError("A note or AI theme needs valid colours")
    folder = ensure_pane_themes_dir(kind)
    path = folder / f"{theme_id}.json"
    payload = {
        "id": theme_id,
        "name": str(record.get("name") or theme_id)[:80],
        "englishName": str(record.get("englishName") or "")[:80],
        "source": str(record.get("source") or "user")[:24],
        "palette": palette,
    }
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return path


def read_pane_theme(kind: str, theme_id) -> dict | None:
    theme_id = normalized_theme_id(theme_id)
    if not theme_id:
        return None
    try:
        path = ensure_pane_themes_dir(kind) / f"{theme_id}.json"
        if not path.is_file():
            return None
        return normalize_pane_theme(kind, _read_json_file(path), fallback_id=theme_id)
    except Exception:
        return None


def remove_pane_theme(kind: str, theme_id, only_pack: bool = False) -> None:
    """Delete one pane palette. ``only_pack`` keeps user-made files intact."""
    theme_id = normalized_theme_id(theme_id)
    if not theme_id:
        return
    try:
        current = read_pane_theme(kind, theme_id)
        if only_pack and current is not None and current.get("source") != "pack":
            return
        (ensure_pane_themes_dir(kind) / f"{theme_id}.json").unlink(missing_ok=True)
    except Exception:
        pass


def sync_theme_pack_pane_themes(manifest: dict | None) -> None:
    """Mirror a pack's optional note/ai palettes into their own folders.

    ``theme-packs/`` stays the NeoTodo app-theme shelf. The notebook and the
    console read only ``note-theme/`` and ``ai-theme/``, so applying a NeoTodo
    theme never rewrites the active note or AI theme.
    """
    if not isinstance(manifest, dict):
        return
    pack_id = normalized_theme_id(manifest.get("id"))
    if not pack_id:
        return
    for kind in PANE_THEME_KINDS:
        palette = manifest.get(kind)
        if palette:
            write_pane_theme(kind, {
                "id": pack_id,
                "name": manifest.get("name") or pack_id,
                "englishName": manifest.get("englishName") or "",
                "source": "pack",
                "palette": palette,
            })
        else:
            remove_pane_theme(kind, pack_id, only_pack=True)


def sync_all_theme_pack_pane_themes() -> None:
    """Backfill note-theme/ and ai-theme/ for packs installed before the split."""
    try:
        packs = discover_theme_packs()
    except Exception:
        return
    for pack in packs:
        try:
            sync_theme_pack_pane_themes(pack)
        except Exception:
            continue


def _theme_asset_rel(raw, folder: Path, extensions: set) -> str:
    """Only allow a relative asset that actually lives inside the pack."""
    rel = unquote(str(raw or "")).replace("\\", "/").lstrip("/")
    if not rel or ".." in Path(rel).parts:
        return ""
    if Path(rel).suffix.lower() not in extensions:
        return ""
    try:
        root = folder.resolve()
        candidate = (folder / rel).resolve()
        if candidate.is_relative_to(root) and candidate.is_file():
            return rel
    except Exception:
        pass
    return ""


def normalize_theme_manifest(raw, folder: Path, source: str) -> dict | None:
    """Validate one theme.json and turn it into the catalog/API shape."""
    if not isinstance(raw, dict):
        return None
    theme_id = normalized_theme_id(raw.get("id") or getattr(folder, "name", ""))
    if not theme_id:
        return None
    palette = normalize_theme_palette(raw.get("theme") or raw.get("palette"))
    if palette is None:
        return None
    preview = _theme_asset_rel(raw.get("preview"), folder, THEME_ASSET_IMAGE_EXTS)
    icon = _theme_asset_rel(raw.get("icon"), folder, THEME_ASSET_IMAGE_EXTS)
    wallpaper = _theme_asset_rel(raw.get("wallpaper"), folder, THEME_ASSET_IMAGE_EXTS)
    sounds = {}
    raw_sounds = raw.get("sounds")
    if isinstance(raw_sounds, dict):
        for key in THEME_SOUND_KEYS:
            rel = _theme_asset_rel(raw_sounds.get(key), folder, THEME_ASSET_AUDIO_EXTS)
            if rel:
                sounds[key] = rel
    icons = {}
    raw_icons = raw.get("icons")
    if isinstance(raw_icons, dict):
        for key in THEME_STICKER_KEYS:
            rel = _theme_asset_rel(raw_icons.get(key), folder, THEME_ASSET_IMAGE_EXTS)
            if rel:
                icons[key] = rel
    tags = raw.get("tags")
    if not isinstance(tags, list):
        tags = []
    return {
        "id": theme_id,
        "name": str(raw.get("name") or theme_id)[:80],
        "englishName": str(raw.get("englishName") or "")[:80],
        "version": str(raw.get("version") or "1.0.0")[:32],
        "description": str(raw.get("description") or "")[:900],
        "author": str(raw.get("author") or "Community")[:80],
        "license": str(raw.get("license") or "")[:60],
        "homepage": safe_http_url(raw.get("homepage")),
        "repository": safe_http_url(raw.get("repository")),
        "tags": [str(tag)[:24] for tag in tags if isinstance(tag, str) and tag.strip()][:8],
        "palette": palette,
        "chrome": normalize_theme_chrome(raw.get("chrome")),
        "note": normalize_note_palette(raw.get("note")),
        "ai": normalize_ai_palette(raw.get("ai")),
        "preview": preview,
        "icon": icon,
        "wallpaper": wallpaper,
        "sounds": sounds,
        "icons": icons,
        "source": source,
    }


def read_theme_manifest(folder: Path, source: str) -> dict | None:
    try:
        raw = json.loads((folder / "theme.json").read_text(encoding="utf-8"))
    except Exception:
        return None
    return normalize_theme_manifest(raw, folder, source)


def discover_theme_packs() -> list:
    """Installed user packs. Bundled packs stay in the catalog until installed."""
    root = ensure_theme_packs_dir()
    try:
        folders = sorted(
            (item for item in root.iterdir() if item.is_dir() and not item.name.startswith(".")),
            key=lambda item: item.name.lower(),
        )
    except Exception:
        folders = []
    packs = []
    for folder in folders:
        manifest = read_theme_manifest(folder, "user")
        if manifest is not None and manifest["id"] not in THEMES:
            packs.append(manifest)
    return sorted(packs, key=lambda item: item["name"].lower())


def bundled_theme_pack(theme_id) -> dict | None:
    theme_id = normalized_theme_id(theme_id)
    if not theme_id:
        return None
    folder = WEB_DIR / "theme-packs" / theme_id
    if not folder.is_dir():
        return None
    return read_theme_manifest(folder, "bundled")


def theme_pack_by_id(theme_id) -> dict | None:
    """Resolve an installed pack first, then a bundled one for previews."""
    theme_id = normalized_theme_id(theme_id)
    if not theme_id:
        return None
    for pack in discover_theme_packs():
        if pack["id"] == theme_id:
            return pack
    return bundled_theme_pack(theme_id)


def installed_theme_ids() -> set:
    return {pack["id"] for pack in discover_theme_packs()}


def theme_pack_asset_path(theme_id, relative) -> Path | None:
    """Resolve a pack asset from the user shelf, then the bundled shelf."""
    theme_id = normalized_theme_id(theme_id)
    if not theme_id:
        return None
    rel = unquote(str(relative or "")).replace("\\", "/").lstrip("/")
    if not rel or ".." in Path(rel).parts:
        return None
    for folder in (THEME_PACKS_DIR / theme_id, WEB_DIR / "theme-packs" / theme_id):
        try:
            root = folder.resolve()
            candidate = (folder / rel).resolve()
            if candidate.is_relative_to(root) and candidate.is_file():
                return candidate
        except Exception:
            continue
    return None


def _theme_catalog_entry(raw) -> dict | None:
    if not isinstance(raw, dict):
        return None
    theme_id = normalized_theme_id(raw.get("id"))
    if not theme_id:
        return None
    tags = raw.get("tags")
    if not isinstance(tags, list):
        tags = []
    preview = str(raw.get("preview") or "").strip().replace("\\", "/").lstrip("/")
    if preview and (".." in Path(preview).parts or Path(preview).suffix.lower() not in THEME_ASSET_IMAGE_EXTS):
        preview = ""
    palette = normalize_theme_palette(raw.get("theme") or raw.get("palette")) or {}
    return {
        "id": theme_id,
        "name": str(raw.get("name") or theme_id)[:80],
        "englishName": str(raw.get("englishName") or "")[:80],
        "version": str(raw.get("version") or "1.0.0")[:32],
        "description": str(raw.get("description") or "")[:900],
        "author": str(raw.get("author") or "Community")[:80],
        "tags": [str(tag)[:24] for tag in tags if isinstance(tag, str) and tag.strip()][:8],
        "preview": preview,
        "download": safe_http_url(raw.get("download")),
        "homepage": safe_http_url(raw.get("homepage")),
        "repository": safe_http_url(raw.get("repository")),
        "license": str(raw.get("license") or "")[:60],
        "sha256": str(raw.get("sha256") or "").strip().lower()[:64],
        "palette": palette,
        "chrome": normalize_theme_chrome(raw.get("chrome")),
        "note": normalize_note_palette(raw.get("note")),
        "ai": normalize_ai_palette(raw.get("ai")),
        "featured": bool(raw.get("featured", False)),
        "bundled": bool(raw.get("bundled", False)),
        "official": bool(raw.get("official", False)),
    }


def normalize_theme_catalog(raw) -> dict | None:
    if not isinstance(raw, dict):
        return None
    rows = raw.get("themes")
    if not isinstance(rows, list):
        return None
    entries = []
    seen = set()
    for item in rows[:500]:
        entry = _theme_catalog_entry(item)
        if entry is None or entry["id"] in seen:
            continue
        seen.add(entry["id"])
        entries.append(entry)
    return {
        "schema": int(raw.get("schema") or 1),
        "name": str(raw.get("name") or "NeoTodo Theme Community")[:80],
        "homepage": safe_http_url(raw.get("homepage")) or "https://github.com/CellMeet/Neotodo/tree/main/community",
        "updated": str(raw.get("updated") or "")[:40],
        "themes": entries,
    }


def _load_theme_catalog_override() -> dict | None:
    source = THEME_CATALOG_URL
    if not source or source.lower() in ("off", "none", "0"):
        return None
    if source.startswith(("http://", "https://")):
        return _fetch_json_url(source)
    path = Path(source).expanduser()
    if path.is_file():
        return _read_json_file(path)
    return None


def _merge_bundled_theme_catalog(catalog: dict | None, bundled: dict | None) -> dict | None:
    """Keep bundled theme packs visible even when the cache is older.

    A cached or remote index may predate a pack that shipped with this build.
    Bundled packs are part of the app, so append the missing entries.
    """
    if not catalog:
        return bundled
    if not bundled:
        return catalog
    themes = list(catalog.get("themes") or [])
    by_id = {entry.get("id"): entry for entry in themes}
    for entry in bundled.get("themes") or []:
        theme_id = entry.get("id")
        if theme_id not in by_id:
            themes.append(entry)
            by_id[theme_id] = entry
            continue
        # An older cached entry may predate the chrome block; keep the richer
        # bundled metadata so the shelf can show the same badges offline.
        existing = by_id[theme_id]
        if not existing.get("chrome") and entry.get("chrome"):
            existing["chrome"] = entry["chrome"]
    return {**catalog, "themes": themes}


def community_theme_catalog(refresh: bool = False) -> dict:
    """Return the theme index with the same cached/offline fallback as plugins."""
    bundled = normalize_theme_catalog(_read_json_file(WEB_DIR / "theme-packs" / "community-catalog.json"))
    cached_raw = _read_json_file(THEME_CATALOG_CACHE)
    cached = normalize_theme_catalog(cached_raw)
    cache_age = None
    try:
        cache_age = max(0, int(time.time() - THEME_CATALOG_CACHE.stat().st_mtime))
    except Exception:
        cache_age = None

    should_fetch = bool(THEME_CATALOG_URL) and THEME_CATALOG_URL.lower() not in ("off", "none", "0")
    if should_fetch and not refresh and cached is not None and cache_age is not None and cache_age < THEME_CATALOG_TTL:
        should_fetch = False

    catalog = cached or bundled or {
        "name": "NeoTodo Theme Community",
        "homepage": "https://github.com/CellMeet/Neotodo/tree/main/community",
        "updated": "",
        "themes": [],
    }
    source = "cache" if cached is not None else "bundled"
    error = ""
    if should_fetch:
        try:
            fetched = normalize_theme_catalog(_load_theme_catalog_override())
            if fetched is None:
                raise ValueError("Catalog did not contain a themes list")
            catalog = fetched
            source = "remote"
            try:
                DATA_DIR.mkdir(parents=True, exist_ok=True)
                THEME_CATALOG_CACHE.write_text(
                    json.dumps(fetched, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8",
                )
            except Exception:
                pass
        except Exception as fetch_error:
            error = str(fetch_error) or "Could not refresh the catalog"

    return {
        **_merge_bundled_theme_catalog(catalog, bundled),
        "catalog_source": source,
        "catalog_error": error,
        "cached_at": cache_age,
        "catalog_url": THEME_CATALOG_URL,
    }


def _extract_theme_archive(data: bytes, staging: Path) -> Path:
    """Extract a zipped theme pack without allowing path escapes."""
    try:
        archive = zipfile.ZipFile(io.BytesIO(data))
    except Exception as error:
        raise ValueError("That file is not a valid theme .zip") from error
    with archive:
        infos = archive.infolist()
        if len(infos) > THEME_ARCHIVE_MAX_FILES:
            raise ValueError("The theme archive contains too many files")
        candidates = []
        total = 0
        for info in infos:
            parts = _zip_parts(info.filename)
            if info.is_dir():
                continue
            total += max(0, int(info.file_size or 0))
            if total > THEME_ARCHIVE_MAX_UNCOMPRESSED:
                raise ValueError("The theme archive is too large when unpacked")
            if parts and parts[-1] == "theme.json":
                candidates.append(parts[:-1])
        if not candidates:
            raise ValueError("No theme.json found in the theme archive")
        prefix = min(candidates, key=len)
        staging.mkdir(parents=True, exist_ok=True)
        for info in infos:
            if info.is_dir():
                continue
            mode = (info.external_attr >> 16) & 0o170000
            if mode == 0o120000:
                raise ValueError("The theme archive contains a symbolic link")
            parts = _zip_parts(info.filename)
            if parts[: len(prefix)] != prefix or len(parts) <= len(prefix):
                continue
            target = staging.joinpath(*parts[len(prefix):])
            try:
                if not target.resolve().is_relative_to(staging.resolve()):
                    raise ValueError("The theme archive escapes its folder")
            except Exception as error:
                raise ValueError("The theme archive contains an unsafe path") from error
            target.parent.mkdir(parents=True, exist_ok=True)
            with archive.open(info, "r") as source, target.open("wb") as sink:
                remaining = THEME_ARCHIVE_MAX_BYTES
                while True:
                    chunk = source.read(64 * 1024)
                    if not chunk:
                        break
                    remaining -= len(chunk)
                    if remaining < 0:
                        raise ValueError("The theme archive is too large")
                    sink.write(chunk)
    return staging


def _move_theme_pack_into_place(staging: Path, theme_id: str) -> None:
    destination = THEME_PACKS_DIR / theme_id
    backup = None
    if destination.exists():
        backup = THEME_PACKS_DIR / f".backup-{theme_id}-{uuid.uuid4().hex[:8]}"
        destination.rename(backup)
    try:
        staging.rename(destination)
    except Exception:
        if backup is not None and backup.exists() and not destination.exists():
            backup.rename(destination)
        raise
    if backup is not None:
        shutil.rmtree(backup, ignore_errors=True)
    try:
        sync_theme_pack_pane_themes(read_theme_manifest(destination, "user"))
    except Exception:
        pass


def install_theme_archive(data: bytes, expected_id: str = "", expected_sha256: str = "") -> dict:
    if not isinstance(data, (bytes, bytearray)) or not data:
        raise ValueError("The theme archive is empty")
    if len(data) > THEME_ARCHIVE_MAX_BYTES:
        raise ValueError("The theme archive is larger than 24 MB")
    expected_sha256 = str(expected_sha256 or "").strip().lower()
    if expected_sha256:
        if not re.fullmatch(r"[0-9a-f]{64}", expected_sha256):
            raise ValueError("The expected sha256 is not valid")
        actual = hashlib.sha256(data).hexdigest()
        if actual != expected_sha256:
            raise ValueError("The theme checksum does not match")
    ensure_theme_packs_dir()
    temp_root = Path(tempfile.mkdtemp(prefix=".install-", dir=str(THEME_PACKS_DIR)))
    staging = temp_root / "theme"
    try:
        _extract_theme_archive(data, staging)
        manifest = read_theme_manifest(staging, "user")
        if manifest is None:
            raise ValueError("theme.json is missing valid colours or an id")
        if manifest["id"] in THEMES:
            raise ValueError(f"'{manifest['id']}' is a built-in theme id; choose another id")
        expected = normalized_theme_id(expected_id)
        if expected and manifest["id"] != expected:
            raise ValueError(f"The archive contains '{manifest['id']}', not '{expected}'")
        _move_theme_pack_into_place(staging, manifest["id"])
        return manifest
    finally:
        shutil.rmtree(temp_root, ignore_errors=True)


def install_bundled_theme(theme_id) -> dict:
    pack = bundled_theme_pack(theme_id)
    if pack is None:
        raise ValueError("That bundled theme was not found")
    if pack["id"] in THEMES:
        raise ValueError("That id is reserved by a built-in theme")
    ensure_theme_packs_dir()
    temp_root = Path(tempfile.mkdtemp(prefix=".install-", dir=str(THEME_PACKS_DIR)))
    staging = temp_root / "theme"
    try:
        shutil.copytree(WEB_DIR / "theme-packs" / pack["id"], staging)
        _move_theme_pack_into_place(staging, pack["id"])
        installed = read_theme_manifest(THEME_PACKS_DIR / pack["id"], "user")
        if installed is None:
            raise ValueError("That bundled theme could not be installed")
        return installed
    finally:
        shutil.rmtree(temp_root, ignore_errors=True)


def uninstall_theme_pack(theme_id) -> dict:
    theme_id = normalized_theme_id(theme_id)
    if not theme_id:
        raise ValueError("Unknown theme")
    destination = THEME_PACKS_DIR / theme_id
    if not destination.is_dir():
        raise ValueError("That theme is not installed in the user theme folder")
    shutil.rmtree(destination)
    # The pack's note and AI palettes live in their own folders; drop the copies
    # it contributed, but never delete a file the user edited by hand.
    for kind in PANE_THEME_KINDS:
        remove_pane_theme(kind, theme_id, only_pack=True)
    return {"id": theme_id, "folder": str(destination)}


def save_theme_pack(payload: dict) -> dict:
    """Write a user-made palette to its own theme-pack folder.

    The appearance picker treats every installed pack as a deletable custom
    theme, so the palette lives in ``<data>/theme-packs/<id>/theme.json`` just
    like a downloaded community pack.
    """
    if not isinstance(payload, dict):
        raise ValueError("Invalid theme")
    name = str(payload.get("name") or "Custom theme").strip()[:80] or "Custom theme"
    theme_id = normalized_theme_id(payload.get("id") or "")
    if not theme_id:
        theme_id = f"custom-{new_id()[:8]}"
    if theme_id in THEMES:
        raise ValueError("That id is reserved by a built-in theme")
    palette = normalize_theme_palette(payload.get("theme"))
    if palette is None:
        raise ValueError("A custom theme needs valid paper and ink colours")
    ensure_theme_packs_dir()
    temp_root = Path(tempfile.mkdtemp(prefix=".save-", dir=str(THEME_PACKS_DIR)))
    staging = temp_root / "theme"
    staging.mkdir(parents=True, exist_ok=True)
    manifest = {
        "id": theme_id,
        "name": name,
        "englishName": str(payload.get("englishName") or "")[:80],
        "version": "1.0.0",
        "description": str(payload.get("description") or "A custom palette made in NeoTodo.")[:900],
        "author": str(payload.get("author") or "You")[:80],
        "license": "",
        "tags": ["custom"],
        "theme": palette,
        "preview": "preview.svg",
    }
    chrome = normalize_theme_chrome(payload.get("chrome"))
    if chrome:
        manifest["chrome"] = chrome
    try:
        try:
            (staging / "preview.svg").write_text(_theme_preview_svg(palette), encoding="utf-8")
        except Exception:
            manifest.pop("preview", None)
        (staging / "theme.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        _move_theme_pack_into_place(staging, theme_id)
    finally:
        shutil.rmtree(temp_root, ignore_errors=True)
    installed = read_theme_manifest(THEME_PACKS_DIR / theme_id, "user")
    if installed is None:
        raise ValueError("That custom theme could not be saved")
    return installed


def download_theme_archive(url: str) -> bytes:
    url = safe_http_url(url)
    if not url:
        raise ValueError("The theme download URL must start with https://")
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "NeoTodo/0.0.1 Theme Community", "Accept": "application/zip, application/octet-stream"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        body = response.read(THEME_ARCHIVE_MAX_BYTES + 1)
    if len(body) > THEME_ARCHIVE_MAX_BYTES:
        raise ValueError("The theme archive is larger than 24 MB")
    return body


def _theme_export_asset(ref, prefixes: dict):
    """Resolve a local asset URL used by the exporter (pictures, sounds, packs)."""
    raw = str(ref or "").strip()
    if not raw:
        return None
    if raw.startswith("data:"):
        return None
    parsed = urlparse(raw)
    path = unquote(parsed.path or raw)
    for prefix, root in prefixes.items():
        if not path.startswith(prefix):
            continue
        name = path[len(prefix):].strip("/")
        parts = [part for part in name.split("/") if part]
        if not parts or len(parts) > 2:
            return None
        if any(part in (".", "..") or "\\" in part or part != Path(part).name for part in parts):
            return None
        # Sounds live in a style folder now; a legacy flat name still reads the
        # classical set, exactly like the /user-sounds/ route.
        candidates = [root.joinpath(*parts)]
        if prefix == "/user-sounds/" and len(parts) == 1:
            candidates.append(root / DEFAULT_SOUND_STYLE / parts[0])
        for candidate in candidates:
            resolved = candidate.resolve()
            try:
                if resolved.is_relative_to(root.resolve()) and resolved.is_file():
                    return resolved
            except Exception:
                continue
        return None
    if path.startswith("/theme-assets/"):
        rest = path[len("/theme-assets/"):]
        theme_id, _, relative = rest.partition("/")
        return theme_pack_asset_path(theme_id, relative)
    return None


def _theme_preview_svg(palette: dict) -> str:
    paper = palette.get("paper") or "#f7efe3"
    paper2 = palette.get("paper2") or paper
    ink = palette.get("ink") or "#332b2d"
    accent = palette.get("accent") or "#c56f4a"
    accent2 = palette.get("accent2") or accent
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300">'
        f'<rect width="1000" height="300" fill="{paper}"/>'
        f'<rect y="190" width="1000" height="110" fill="{paper2}"/>'
        f'<circle cx="780" cy="78" r="42" fill="{accent}"/>'
        f'<path d="M0 238 C170 196 320 258 500 224 C690 188 830 252 1000 214 L1000 300 L0 300Z" fill="{accent2}" opacity=".72"/>'
        f'<path d="M70 120 H340 M70 150 H280 M70 180 H310" stroke="{ink}" stroke-width="8" stroke-linecap="round" opacity=".72"/>'
        f'<rect x="70" y="60" width="120" height="8" rx="4" fill="{ink}" opacity=".28"/>'
        '</svg>'
    )


def _decode_theme_icon(value):
    raw = str(value or "").strip()
    match = re.fullmatch(r"data:image/(png|jpe?g|webp|gif);base64,([A-Za-z0-9+/=\s]+)", raw)
    if not match:
        return None, ""
    try:
        data = base64.b64decode(re.sub(r"\s+", "", match.group(2)), validate=True)
    except Exception:
        return None, ""
    if not data or len(data) > 4_000_000:
        return None, ""
    suffix = ".jpg" if match.group(1).startswith("jpeg") else f".{match.group(1)}"
    return data, suffix


def export_theme_pack(payload: dict) -> dict:
    """Zip the current palette and selected local assets into a shareable pack."""
    if not isinstance(payload, dict):
        raise ValueError("Invalid theme pack")
    name = str(payload.get("name") or "My NeoTodo Theme").strip()[:80] or "My NeoTodo Theme"
    theme_id = normalized_theme_id(payload.get("id") or name)
    if not theme_id:
        theme_id = f"theme-{new_id()[:8]}"
    palette = normalize_theme_palette(payload.get("theme"))
    if palette is None:
        raise ValueError("The current theme has no valid colours")
    ensure_theme_exports_dir()
    temp_root = Path(tempfile.mkdtemp(prefix=".export-", dir=str(THEME_EXPORTS_DIR)))
    staging = temp_root / "theme"
    staging.mkdir(parents=True, exist_ok=True)
    manifest = {
        "id": theme_id,
        "name": name,
        "englishName": str(payload.get("englishName") or "")[:80],
        "version": str(payload.get("version") or "1.0.0")[:32],
        "description": str(payload.get("description") or "Exported from NeoTodo.")[:900],
        "author": str(payload.get("author") or "You")[:80],
        "license": str(payload.get("license") or "")[:60],
        "theme": palette,
        "tags": ["exported"],
    }
    chrome = normalize_theme_chrome(payload.get("chrome"))
    if chrome:
        manifest["chrome"] = chrome
    note_palette = normalize_note_palette(payload.get("note"))
    if note_palette is not None:
        manifest["note"] = note_palette
    ai_palette = normalize_ai_palette(payload.get("ai"))
    if ai_palette is not None:
        manifest["ai"] = ai_palette
    prefixes = {"/user-pictures/": PICTURES_DIR, "/user-sounds/": SOUNDS_DIR}
    try:
        wallpaper_ref = str(payload.get("wallpaper") or "").strip()
        if wallpaper_ref and not wallpaper_ref.startswith(("art:", "theme:")):
            wallpaper_path = _theme_export_asset(wallpaper_ref, prefixes)
            if wallpaper_path and wallpaper_path.suffix.lower() in THEME_ASSET_IMAGE_EXTS:
                wallpaper_name = f"wallpaper{wallpaper_path.suffix.lower()}"
                shutil.copy2(wallpaper_path, staging / wallpaper_name)
                manifest["wallpaper"] = wallpaper_name

        sounds = payload.get("sounds")
        if isinstance(sounds, dict):
            manifest_sounds = {}
            (staging / "sounds").mkdir(exist_ok=True)
            for key in THEME_SOUND_KEYS:
                sound_path = _theme_export_asset(sounds.get(key), prefixes)
                if not sound_path or sound_path.suffix.lower() not in THEME_ASSET_AUDIO_EXTS:
                    continue
                sound_name = f"{key}{sound_path.suffix.lower()}"
                shutil.copy2(sound_path, staging / "sounds" / sound_name)
                manifest_sounds[key] = f"sounds/{sound_name}"
            if manifest_sounds:
                manifest["sounds"] = manifest_sounds

        icons = payload.get("icons")
        if isinstance(icons, dict):
            manifest_icons = {}
            (staging / "icons").mkdir(exist_ok=True)
            for key in THEME_STICKER_KEYS:
                data, suffix = _decode_theme_icon(icons.get(key))
                if data is None:
                    continue
                icon_name = f"{key}{suffix}"
                (staging / "icons" / icon_name).write_bytes(data)
                manifest_icons[key] = f"icons/{icon_name}"
            if manifest_icons:
                manifest["icons"] = manifest_icons

        (staging / "preview.svg").write_text(_theme_preview_svg(palette), encoding="utf-8")
        manifest["preview"] = "preview.svg"
        (staging / "theme.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        (staging / "README.txt").write_text(
            "NeoTodo theme pack\n\n"
            "Install with Settings -> 主题社区 -> Import .zip, or put this folder in\n"
            f"{THEME_PACKS_DIR}\n\n"
            "Share it by opening a pull request to community/themes.json.\n",
            encoding="utf-8",
        )
        archive_path = THEME_EXPORTS_DIR / f"{theme_id}.zip"
        tmp_archive = archive_path.with_suffix(".tmp")
        with zipfile.ZipFile(tmp_archive, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            for path in sorted(staging.rglob("*")):
                if path.is_file():
                    archive.write(path, path.relative_to(staging).as_posix())
        tmp_archive.replace(archive_path)
        return {
            "id": theme_id,
            "name": name,
            "file": archive_path.name,
            "path": str(archive_path),
            "folder": str(THEME_EXPORTS_DIR),
        }
    finally:
        shutil.rmtree(temp_root, ignore_errors=True)


def picture_file_names() -> dict:
    ensure_pictures_dir()
    images, videos = [], []
    try:
        for item in sorted(PICTURES_DIR.iterdir()):
            if not item.is_file():
                continue
            suffix = item.suffix.lower()
            if suffix in PICTURE_IMAGE_EXTS:
                images.append(item.name)
            elif suffix in PICTURE_VIDEO_EXTS:
                videos.append(item.name)
    except Exception:
        pass
    return {"images": images, "videos": videos, "folder": str(PICTURES_DIR)}


def sanitize_picture_name(value, extensions) -> str:
    """Only allow a bare filename that exists in the pictures folder."""
    if not isinstance(value, str):
        return ""
    name = value.strip()
    if not name or Path(name).name != name:
        return ""
    if Path(name).suffix.lower() not in extensions:
        return ""
    try:
        if not (PICTURES_DIR / name).is_file():
            return ""
    except Exception:
        return ""
    return name


def save_postcard_art(items) -> dict:
    """Write the web-drawn postcard scenes into the wallpaper folder.

    Each scene is stored once as ``postcard-<id>.jpg``. An existing file is
    never overwritten, so a picture the reader edited or replaced in the folder
    survives the next export.
    """
    ensure_pictures_dir()
    saved: list[str] = []
    existing: list[str] = []
    failed = 0
    for item in items[:64]:
        if not isinstance(item, dict):
            failed += 1
            continue
        stem = re.sub(r"[^a-z0-9-]+", "-", Path(str(item.get("name") or "")).stem.lower()).strip("-")[:64]
        data = item.get("data")
        if not stem or not stem.startswith("postcard-"):
            stem = f"postcard-{stem}" if stem else ""
        if not stem or not isinstance(data, str) or not data:
            failed += 1
            continue
        dest = PICTURES_DIR / f"{stem}.jpg"
        if dest.exists():
            existing.append(dest.name)
            continue
        try:
            raw = base64.b64decode(data, validate=True)
        except Exception:
            raw = b""
        if not raw or len(raw) > 30_000_000:
            failed += 1
            continue
        try:
            dest.write_bytes(raw)
            saved.append(dest.name)
        except Exception:
            failed += 1
    return {"saved": saved, "existing": existing, "failed": failed, "folder": str(PICTURES_DIR)}


def sanitize_wallpaper_file_path(value) -> str:
    """An absolute picture path the reader picked.

    A picked file is linked (or copied across filesystems) into
    ``pictures/wallpapers`` by :func:`import_wallpaper_file`; this sanitizer
    only checks the shape. A path that is temporarily unavailable (an
    unmounted drive, a renamed folder) is still remembered and read when the
    wallpaper is served.
    """
    if not isinstance(value, str):
        return ""
    raw = value.strip()
    if not raw or len(raw) > 4096:
        return ""
    if "\x00" in raw or "\n" in raw:
        return ""
    try:
        path = Path(raw).expanduser()
        if not path.is_absolute():
            return ""
        if path.suffix.lower() not in (PICTURE_IMAGE_EXTS | PICTURE_VIDEO_EXTS):
            return ""
        return str(path)
    except Exception:
        return ""


WALLPAPER_RECENT_LIMIT = 6


def ensure_wallpaper_shelf_dir() -> Path:
    """The dedicated folder that holds every wallpaper option.

    ``Choose`` opens the system picker, but the picked picture is linked into
    this folder so the picker's recent options and the folder always describe
    the same files. Deleting a file here removes that option.
    """
    folder = PICTURES_DIR / "wallpapers"
    try:
        folder.mkdir(parents=True, exist_ok=True)
    except Exception:
        pass
    return folder


def _wallpaper_source_path(value) -> Path | None:
    """Resolve a saved choice to the picture or film it points at."""
    name = sanitize_wallpaper_file_path(value)
    if name:
        return Path(name)
    bare = sanitize_picture_name(value, PICTURE_IMAGE_EXTS | PICTURE_VIDEO_EXTS)
    if bare:
        return Path(PICTURES_DIR) / bare
    return None


def _wallpaper_shelf_match(folder: Path, source: Path) -> Path | None:
    """Find an existing shelf entry for ``source`` so links are never doubled."""
    try:
        stat = source.stat()
    except Exception:
        return None
    try:
        candidates = [item for item in folder.iterdir() if item.is_file()]
    except Exception:
        return None
    for candidate in candidates:
        try:
            cstat = candidate.stat()
        except Exception:
            continue
        if cstat.st_dev == stat.st_dev and cstat.st_ino == stat.st_ino:
            return candidate
        # A copy (different filesystem) has no shared inode; the original name,
        # size and mtime still identify the same file across repeated syncs.
        if (
            candidate.name == source.name
            and cstat.st_size == stat.st_size
            and int(cstat.st_mtime) == int(stat.st_mtime)
        ):
            return candidate
    return None


def import_wallpaper_file(value) -> str:
    """Link or copy one picked wallpaper into the dedicated shelf.

    Returns the shelf path, or "" when the value is not a readable picture or
    film. A hard link keeps the reader's original file untouched while giving
    the option its own entry: deleting the shelf entry removes the option and
    leaves the original in place.
    """
    source = _wallpaper_source_path(value)
    if source is None:
        return ""
    try:
        folder = ensure_wallpaper_shelf_dir().resolve()
        source = source.expanduser()
        if not source.is_file():
            return ""
        resolved = source.resolve()
        if resolved.is_relative_to(folder):
            return str(resolved)
        suffix = resolved.suffix.lower()
        if suffix not in (PICTURE_IMAGE_EXTS | PICTURE_VIDEO_EXTS):
            return ""
        matched = _wallpaper_shelf_match(folder, resolved)
        if matched is not None:
            return str(matched)
        stem = re.sub(r'[\\/:*?"<>|\x00-\x1f]+', "-", resolved.stem, flags=re.UNICODE)
        stem = stem.strip(" .-_")[:64] or "wallpaper"
        destination = folder / f"{stem}{suffix}"
        if destination.exists():
            destination = folder / f"{stem}-{new_id()[:8]}{suffix}"
        try:
            os.link(resolved, destination)
        except OSError:
            shutil.copy2(resolved, destination)
        return str(destination)
    except Exception:
        return ""


def import_wallpaper_shelf(settings: dict) -> bool:
    """Point an older notebook's wallpaper choices at the dedicated shelf."""
    if not isinstance(settings, dict):
        return False
    changed = False
    current = settings.get("wallpaper")
    if isinstance(current, str) and _wallpaper_source_path(current) is not None:
        moved = import_wallpaper_file(current)
        if moved and moved != current:
            settings["wallpaper"] = moved
            changed = True
    recent = settings.get("wallpaper_recent")
    if isinstance(recent, list):
        next_recent = []
        seen = set()
        for item in recent:
            if not isinstance(item, str):
                continue
            source = _wallpaper_source_path(item)
            if source is not None:
                try:
                    if not source.expanduser().is_file():
                        changed = True
                        continue
                except Exception:
                    changed = True
                    continue
                moved = import_wallpaper_file(item) or item
            else:
                moved = item
            if moved in seen:
                continue
            seen.add(moved)
            next_recent.append(moved)
        if next_recent != recent:
            settings["wallpaper_recent"] = next_recent
            changed = True
    return changed


def prune_wallpaper_shelf(settings: dict) -> bool:
    """Drop options whose shelf file was deleted by hand."""
    if not isinstance(settings, dict):
        return False
    try:
        folder = ensure_wallpaper_shelf_dir().resolve()
    except Exception:
        return False

    def missing(value) -> bool:
        source = _wallpaper_source_path(value)
        if source is None:
            return False
        try:
            path = source.expanduser().resolve()
            if not path.is_relative_to(folder):
                return False
            return not path.is_file()
        except Exception:
            return False

    changed = False
    recent = settings.get("wallpaper_recent")
    if isinstance(recent, list):
        kept = [item for item in recent if isinstance(item, str) and not missing(item)]
        if kept != recent:
            settings["wallpaper_recent"] = kept
            changed = True
    current = settings.get("wallpaper")
    if isinstance(current, str) and missing(current):
        settings["wallpaper"] = ""
        changed = True
    return changed


def sanitize_wallpaper_recent(raw) -> list:
    """The last few wallpaper files, in most-recently-picked order."""
    if not isinstance(raw, list):
        return []
    seen = set()
    recent = []
    for item in raw:
        name = sanitize_wallpaper_file_path(item)
        if not name or name in seen:
            continue
        seen.add(name)
        recent.append(name)
        if len(recent) >= WALLPAPER_RECENT_LIMIT:
            break
    return recent


def wallpaper_file_allowed(raw, settings: dict) -> Path | None:
    """Resolve a path only when the reader actually chose it."""
    name = sanitize_wallpaper_file_path(raw)
    if not name or not isinstance(settings, dict):
        return None
    allowed = {str(settings.get("wallpaper") or "")}
    allowed.update(sanitize_wallpaper_recent(settings.get("wallpaper_recent")))
    if name not in allowed:
        return None
    candidate = Path(name)
    try:
        if not candidate.is_file():
            return None
    except Exception:
        return None
    return candidate


def sanitize_wallpaper_static(value) -> str:
    """A static wallpaper is postcard art, a theme-pack image or a picture file."""
    if not isinstance(value, str):
        return ""
    name = value.strip()
    if name.startswith("art:"):
        return name if name[4:] in THEMES else ""
    if name.startswith("theme:"):
        pack = theme_pack_by_id(name[6:])
        return name if pack and pack.get("wallpaper") else ""
    picked = sanitize_wallpaper_file_path(name)
    if picked:
        return picked
    return sanitize_picture_name(name, PICTURE_IMAGE_EXTS)


def sanitize_wallpaper_value(value) -> str:
    """The single wallpaper choice: a picked file, art, a theme picture or a legacy name."""
    if not isinstance(value, str):
        return ""
    name = value.strip()
    if name.startswith("art:"):
        return name if name[4:] in THEMES else ""
    if name.startswith("theme:"):
        pack = theme_pack_by_id(name[6:])
        return name if pack and pack.get("wallpaper") else ""
    picked = sanitize_wallpaper_file_path(name)
    if picked:
        return picked
    return sanitize_picture_name(name, PICTURE_IMAGE_EXTS | PICTURE_VIDEO_EXTS)


def sanitize_wallpaper_settings(settings: dict, derive_legacy: bool = True) -> None:
    """Keep pattern (wallpaper) and colour (theme) as independent choices."""
    postcard = str(settings.get("resolved_postcard") or settings.get("postcard") or "light")
    if postcard not in THEMES and theme_pack_by_id(postcard) is None:
        postcard = "light"
    mode = settings.get("wallpaper_mode")
    # Older builds treated the postcard art as part of the theme. That art is
    # now the default static wallpaper, so the first launch keeps the look.
    if mode == "theme":
        mode = "static"
    if mode not in WALLPAPER_MODES:
        mode = "none"
    static_name = sanitize_wallpaper_static(settings.get("wallpaper_static"))
    dynamic_name = sanitize_picture_name(settings.get("wallpaper_dynamic"), PICTURE_VIDEO_EXTS)
    if mode == "static" and not static_name:
        static_name = f"art:{postcard}"
    settings["wallpaper_mode"] = mode
    settings["wallpaper_static"] = static_name
    settings["wallpaper_dynamic"] = dynamic_name
    # Pictures and films share one choice now. A file saved by an older build
    # is folded in, so the room keeps the same wallpaper after upgrading. A
    # client that sends `wallpaper` directly (including an empty one, which
    # means "no wallpaper") always wins over the retired fields.
    wallpaper = sanitize_wallpaper_value(settings.get("wallpaper"))
    if not wallpaper and derive_legacy:
        if mode == "dynamic" and dynamic_name:
            wallpaper = dynamic_name
        elif mode == "static" and static_name:
            wallpaper = static_name
    settings["wallpaper"] = wallpaper
    settings["wallpaper_recent"] = sanitize_wallpaper_recent(settings.get("wallpaper_recent"))


def note_material_file_names() -> list:
    ensure_note_materials_dir()
    try:
        return sorted(
            item.name for item in NOTE_MATERIALS_DIR.iterdir()
            if item.is_file() and item.suffix.lower() == ".css"
        )
    except Exception:
        return []


def sound_file_names(style: str = "") -> list:
    """Audio files inside one style folder (classical/ when none is given)."""
    folder = sound_style_dir(style)
    if folder is None:
        return []
    try:
        return sorted(
            item.name for item in folder.iterdir()
            if item.is_file() and item.suffix.lower() in SOUND_AUDIO_EXTS
        )
    except Exception:
        return []


def agent_workspace(folder: str = "") -> Path:
    """Folder the AI agent actually works in for a todo or subtask.

    A linked project folder wins when it is still on disk. Otherwise the agent
    falls back to NeoTodo's own folder (or ``NEOTODO_AGENT_CWD`` when the crew
    runner sets one), so the napkin card can always show the real working path
    instead of an empty "no folder" state.
    """
    candidates = []
    raw = str(folder or "").strip()
    if raw:
        candidates.append(raw)
    candidates.append(os.environ.get("NEOTODO_AGENT_CWD") or str(APP_DIR))
    candidates.append(str(APP_DIR))
    for candidate in candidates:
        try:
            path = Path(candidate).expanduser()
            if path.is_dir():
                return path.resolve()
        except Exception:
            continue
    return APP_DIR


def list_folder_files(folder: str, limit: int = PROJECT_FILE_LIMIT) -> list:
    """Relative files in a linked project folder, skipping noisy directories."""
    try:
        root = Path(folder).expanduser()
        if not root.is_dir():
            return []
        skip = {".git", ".hg", ".svn", "node_modules", "__pycache__", ".venv", "venv",
                "dist", "build", ".next", ".cache", ".idea", ".vscode"}
        files = []
        for path in sorted(root.rglob("*")):
            if len(files) >= limit:
                break
            try:
                rel = path.relative_to(root)
            except ValueError:
                continue
            if any(part in skip or part.startswith(".") for part in rel.parts):
                continue
            if path.is_file():
                files.append(str(rel))
        return files
    except Exception:
        return []


def list_folder_dir(folder: str, subpath: str = "", limit: int = PROJECT_FILE_LIMIT) -> list:
    """One level of a linked project folder, for the working-folder card.

    Each entry is ``{path, name, dir, count}`` where ``path`` stays relative to
    the linked folder and ``count`` is a folder's direct child count. Listings
    are lazy: the card fetches a folder's children only when it is expanded.
    Noisy folders (``.git``, ``node_modules``, caches) stay hidden, matching the
    file list the agent prompt receives.
    """
    try:
        root = Path(folder).expanduser()
        if not root.is_dir():
            return []
        base = root
        rel_sub = str(subpath or "").strip().strip("/")
        if rel_sub:
            base = (root / rel_sub).resolve()
            base.relative_to(root.resolve())  # a path outside the folder is not a folder
            if not base.is_dir():
                return []
    except Exception:
        return []
    skip = {".git", ".hg", ".svn", "node_modules", "__pycache__", ".venv", "venv",
            "dist", "build", ".next", ".cache", ".idea", ".vscode"}
    try:
        children = sorted(
            base.iterdir(),
            key=lambda item: (item.is_file(), item.name.lower()),
        )
    except OSError:
        return []
    entries = []
    for child in children:
        if len(entries) >= limit:
            break
        if child.name in skip or child.name.startswith("."):
            continue
        try:
            is_dir = child.is_dir()
        except OSError:
            continue
        try:
            rel = child.relative_to(root)
        except ValueError:
            continue
        count = 0
        if is_dir:
            try:
                count = sum(
                    1 for sub in child.iterdir()
                    if sub.name not in skip and not sub.name.startswith(".")
                )
            except OSError:
                count = 0
        entries.append({
            "path": rel.as_posix(),
            "name": child.name,
            "dir": is_dir,
            "count": count,
        })
    return entries


def _gvariant_string_list(values: list[str]) -> str:
    """Render strings as a GVariant ``as`` literal for ``gdbus``."""
    def one(value: str) -> str:
        return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"
    return "[" + ", ".join(one(value) for value in values) + "]"


def file_manager_reveal_commands(target: Path) -> list[list[str]]:
    """Commands that show ``target`` selected inside its parent folder.

    The working folder is never drawn by NeoTodo: the desktop's own file
    manager opens on the parent folder with the folder highlighted, which is
    exactly what clicking the folder once in that window looks like. The
    freedesktop ``FileManager1.ShowItems`` call covers Nautilus, Dolphin, Nemo
    and Caja; managers without a DBus service get their own ``--select`` flag
    and a plain ``xdg-open`` on the parent folder is the last resort.
    """
    target = Path(target).expanduser()
    try:
        # A deleted or unmounted folder still has a place on disk: reveal the
        # nearest parent that exists instead of failing the whole click.
        while not target.exists() and target != target.parent:
            target = target.parent
        target = target.resolve()
    except OSError:
        pass
    commands: list[list[str]] = []
    gdbus = shutil.which("gdbus")
    if gdbus:
        commands.append([
            gdbus, "call", "--session",
            "--dest", "org.freedesktop.FileManager1",
            "--object-path", "/org/freedesktop/FileManager1",
            "--method", "org.freedesktop.FileManager1.ShowItems",
            _gvariant_string_list([target.as_uri()]), "",
        ])
    for name in ("nautilus", "dolphin", "nemo", "caja"):
        binary = shutil.which(name)
        if binary:
            commands.append([binary, "--select", str(target)])
    xdg_open = shutil.which("xdg-open")
    if xdg_open:
        commands.append([xdg_open, str(target.parent)])
    return commands


def _spawn_detached_process(command: list[str]) -> subprocess.Popen:
    """Start a desktop helper (file manager) outside NeoTodo's process group."""
    kwargs = {"stdout": subprocess.DEVNULL, "stderr": subprocess.DEVNULL}
    if os.name == "posix":
        kwargs["start_new_session"] = True
    else:
        kwargs["creationflags"] = (
            subprocess.CREATE_NEW_PROCESS_GROUP | subprocess.DETACHED_PROCESS
        )
    return subprocess.Popen(command, **kwargs)


def reveal_in_file_manager(target: Path) -> None:
    """Open the system file manager with ``target`` selected in its parent."""
    if sys.platform == "win32":
        _spawn_detached_process(["explorer", f"/select,{Path(target).expanduser()}"])
        return
    if sys.platform == "darwin":
        _spawn_detached_process(["open", "-R", str(Path(target).expanduser())])
        return
    for command in file_manager_reveal_commands(target):
        try:
            process = _spawn_detached_process(command)
        except OSError:
            continue
        try:
            returncode = process.wait(timeout=4)
        except subprocess.TimeoutExpired:
            # A fresh file manager keeps the window in the foreground; that is
            # a success, not a hang, so leave the process alone.
            return
        if returncode == 0:
            return
    raise RuntimeError("No file manager could show this folder")


def new_id() -> str:
    return uuid.uuid4().hex


STICKER_TARGET_IDS = ("completed", "focus")


def sanitize_sticker_backgrounds(raw) -> dict:
    """Keep only valid per-sticker pictures and crop values."""
    if not isinstance(raw, dict):
        return {}
    clean = {}
    for target_id in STICKER_TARGET_IDS:
        item = raw.get(target_id)
        if not isinstance(item, dict):
            continue
        image = item.get("image")
        if not isinstance(image, str) or not image.startswith("data:image/") or len(image) > 4_000_000:
            continue
        try:
            zoom = max(1.0, min(2.6, float(item.get("zoom", 1))))
            x = max(0.0, min(100.0, float(item.get("x", 50))))
            y = max(0.0, min(100.0, float(item.get("y", 50))))
        except (TypeError, ValueError):
            continue
        clean[target_id] = {
            "image": image,
            "zoom": round(zoom, 3),
            "x": round(x, 2),
            "y": round(y, 2),
        }
    return clean


def default_data() -> dict:
    return {
        "categories": [],
        "selected_category": None,
        "selected_todo": None,
        "opened_category": None,
        "archive": [],
        "trash": [],
        "settings": {
            "theme": "postcard",
            "postcard": "light",
            "resolved_postcard": "light",
            "light_postcard": "light",
            "dark_postcard": "dark",
            "font": "serif",
            "note_font": "pen",
            "scale": 1,
            "body_font_size": 16,
            "note_font_size": 14,
            "body_font_color": "",
            "note_font_color": "",
            "show_time_cost": False,
            "show_clock": True,
            "show_brand": True,
            "show_achievements": True,
            "focus_count": 0,
            "focus_log": [],
            "caret_blink": False,
            "caret_shape": "line",
            "caret_color": "#1b1b1b",
            "note_material": "paper",
            "note_theme": "default",
            "ai_theme": "auto",
            "icon_theme": "classical",
            "note_background": "",
            "note_background_image": "",
            "note_blur": 16,
            "sticker_backgrounds": {},
            "wallpaper_mode": "static",
            "wallpaper_static": "art:light",
            "wallpaper_dynamic": "",
            "wallpaper": "art:light",
            "wallpaper_recent": [],
            "wallpaper_blur": 30,
            "wallpaper_blur_on": False,
            "wallpaper_cards": True,
            "postcards_exported": False,
        },
    }


def _activity_stamp(item: dict) -> float:
    """Latest meaningful timestamp for ordering; 0 when no usable date."""
    stamp = 0.0
    for key in ("created_at", "reopened_at", "completed_at"):
        value = item.get(key)
        if not value:
            continue
        try:
            stamp = max(stamp, datetime.fromisoformat(str(value)).timestamp())
        except Exception:
            continue
    return stamp


def load_data(path: Path | None = None) -> dict:
    target = Path(path) if path is not None else DATA_FILE
    try:
        if target == DATA_FILE and not DATA_FILE.exists() and LEGACY_FILE.exists():
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            LEGACY_FILE.replace(DATA_FILE)
        if target.exists():
            data = json.loads(target.read_text())
            if not isinstance(data, dict):
                return default_data()
            categories = data.get("categories")
            if not isinstance(categories, list):
                categories = []
            now = datetime.now().isoformat(timespec="seconds")
            for category in categories:
                category.setdefault("id", new_id())
                category.setdefault("name", "Untitled")
                category.setdefault("color", PALETTE[0])
                category.setdefault("todos", [])
                for todo in category["todos"]:
                    todo.setdefault("id", new_id())
                    todo.setdefault("name", "Untitled")
                    todo.setdefault("done", False)
                    todo.setdefault("completed_at", None)
                    todo.setdefault("created_at", None)
                    todo.setdefault("time_cost", None)
                    todo.setdefault("subtasks", [])
                    todo.setdefault("note", "")
                    if not todo.get("created_at"):
                        todo["created_at"] = todo.get("completed_at") or now
                    if todo.get("done") and not todo.get("completed_at"):
                        todo["completed_at"] = now
                    for subtask in todo["subtasks"]:
                        subtask.setdefault("id", new_id())
                        subtask.setdefault("name", "Untitled")
                        subtask.setdefault("done", False)
                        subtask.setdefault("completed_at", None)
                        subtask.setdefault("created_at", None)
                        subtask.setdefault("time_cost", None)
                        subtask.setdefault("note", "")
                        if not subtask.get("created_at"):
                            subtask["created_at"] = subtask.get("completed_at") or now
                        if subtask.get("done") and not subtask.get("completed_at"):
                            subtask["completed_at"] = now
                    # Newest activity first: a freshly added subtask opens at
                    # the top, while work finished later rises above it.
                    todo["subtasks"].sort(key=_activity_stamp, reverse=True)
                # Keep todos in the same recency order, so a newly created todo
                # leads its category and older finished work follows it.
                category["todos"].sort(key=_activity_stamp, reverse=True)
            data["categories"] = categories
            data.setdefault("selected_category", None)
            data.setdefault("selected_todo", None)
            data.setdefault("opened_category", None)
            data.setdefault("archive", [])
            if not isinstance(data["archive"], list):
                data["archive"] = []
            data.setdefault("trash", [])
            if not isinstance(data["trash"], list):
                data["trash"] = []
            data["trash"] = [
                item for item in data["trash"]
                if isinstance(item, dict) and item.get("id")
            ][:100]
            settings = data.get("settings")
            if not isinstance(settings, dict):
                settings = {}
            settings["theme"] = "postcard"
            settings.setdefault("postcard", "light")
            settings.setdefault("resolved_postcard", "light")
            if settings.get("postcard") not in THEMES and settings.get("postcard") != "random":
                settings["postcard"] = "light"
            if settings.get("resolved_postcard") not in THEMES:
                settings["resolved_postcard"] = "light"
            light_themes = ("light", "ocean", "forest", "vintage", "alpine", "desert", "emerald")
            dark_themes = ("dark", "tokyo", "space", "aurora")
            if settings.get("light_postcard") not in light_themes:
                settings["light_postcard"] = (
                    settings["resolved_postcard"] if settings.get("resolved_postcard") in light_themes else "light"
                )
            if settings.get("dark_postcard") not in dark_themes:
                settings["dark_postcard"] = (
                    settings["resolved_postcard"] if settings.get("resolved_postcard") in dark_themes else "dark"
                )
            settings.setdefault("font", "serif")
            settings.setdefault("note_font", "pen")
            settings.setdefault("scale", 1)
            settings.setdefault("body_font_size", 16)
            settings.setdefault("note_font_size", 14)
            settings.setdefault("body_font_color", "")
            settings.setdefault("note_font_color", "")
            settings["show_time_cost"] = settings.get("show_time_cost") is True
            settings["show_clock"] = settings.get("show_clock") is not False
            settings["show_brand"] = settings.get("show_brand") is not False
            settings["show_achievements"] = settings.get("show_achievements") is not False
            try:
                settings["focus_count"] = max(0, int(settings.get("focus_count", 0)))
            except (TypeError, ValueError):
                settings["focus_count"] = 0
            if not isinstance(settings.get("focus_log"), list):
                settings["focus_log"] = []
            settings["caret_blink"] = settings.get("caret_blink") is True
            settings["note_material"] = "paper"
            # One note style only: the beige `default` sticky note. Older ids
            # (white, pack references) and the Paper / Glass / Focus surfaces
            # collapse back to it.
            settings["note_theme"] = "default"
            ai_theme = settings.get("ai_theme")
            if not isinstance(ai_theme, str) or not re.fullmatch(r"[a-z0-9:_-]{1,80}", ai_theme):
                settings["ai_theme"] = "auto"
            background = settings.get("note_background")
            image = settings.get("note_background_image")
            if isinstance(background, str) and background.startswith("data:"):
                image = background
                background = "__custom"
            if background not in ("", "__custom"):
                background = ""
            if not isinstance(image, str) or len(image) > 8_000_000:
                image = ""
            if background == "__custom" and not image:
                background = ""
            settings["note_background"] = background
            settings["note_background_image"] = image
            try:
                settings["note_blur"] = max(0, min(40, int(settings.get("note_blur", 16))))
            except (TypeError, ValueError):
                settings["note_blur"] = 16
            if settings.get("caret_shape") not in ("line", "block"):
                settings["caret_shape"] = "line"
            if not isinstance(settings.get("caret_color"), str) or not re.fullmatch(r"#[0-9a-fA-F]{6}", settings["caret_color"]):
                settings["caret_color"] = "#1b1b1b"
            settings["sticker_backgrounds"] = sanitize_sticker_backgrounds(settings.get("sticker_backgrounds"))
            settings.setdefault("wallpaper_mode", "theme")
            settings.setdefault("wallpaper_static", "")
            settings.setdefault("wallpaper_dynamic", "")
            settings.setdefault("wallpaper", "art:light")
            settings.setdefault("wallpaper_recent", [])
            # Wallpaper glass (Blur) and the wallpaper-built card scheme. Older
            # notebooks get the same defaults the front end assumes: glass off,
            # cards made from the wallpaper.
            settings.setdefault("wallpaper_blur", 30)
            try:
                settings["wallpaper_blur"] = max(0, min(100, int(settings.get("wallpaper_blur", 30))))
            except (TypeError, ValueError):
                settings["wallpaper_blur"] = 30
            settings["wallpaper_blur_on"] = settings.get("wallpaper_blur_on") is True
            settings["wallpaper_cards"] = settings.get("wallpaper_cards") is not False
            settings.setdefault("postcards_exported", False)
            # "wallpaper" is the reader's one choice. An empty value is a real
            # choice — the theme paper shows through — so the retired
            # static/dynamic shelf must not resurrect a picture on load.
            sanitize_wallpaper_settings(settings, derive_legacy=False)
            # Options whose shelf file was deleted by hand leave the picker.
            # Older external picks are linked into the shelf when Wallpaper →
            # Manage or the folder chip is opened, not during startup.
            prune_wallpaper_shelf(settings)
            data["settings"] = settings
            for card in data["archive"]:
                card.setdefault("id", new_id())
                card.setdefault("week_start", "")
                card.setdefault("week_end", "")
                card.setdefault("year", 0)
                card.setdefault("month", 0)
                card.setdefault("week", 0)
                card.setdefault("theme", "alpine")
                card.setdefault("seen", True)
                card.setdefault("items", [])
            return data
    except Exception:
        pass
    return default_data()


def save_data(data: dict, path: Path | None = None) -> None:
    target = Path(path) if path is not None else DATA_FILE
    try:
        target.parent.mkdir(parents=True, exist_ok=True)
        tmp = target.with_suffix(".tmp")
        tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2))
        tmp.replace(target)
    except Exception:
        pass


def next_theme(archive: list) -> str:
    if not archive:
        return THEMES[0]
    last = archive[-1].get("theme")
    try:
        index = THEMES.index(last)
    except ValueError:
        index = len(archive) % len(THEMES)
    return THEMES[(index + 1) % len(THEMES)]


class Store:
    def __init__(self, path: Path):
        self.path = path
        self.lock = threading.RLock()
        # A fork app runs its own Store in the same process. Quitting it must
        # stop that server instead of the main window.
        self.quit_callback = None
        self.data = load_data(self.path)
        with self.lock:
            self._archive_finished_weeks()
            # Persist load-time migrations such as created_at/time_cost.
            save_data(self.data, self.path)

    def categories(self) -> list:
        return self.data.get("categories", [])

    def _completion_date(self, todo):
        value = todo.get("completed_at")
        if not value:
            return None
        try:
            return datetime.fromisoformat(value).date()
        except Exception:
            return None

    def _archive_finished_weeks(self) -> bool:
        today = date.today()
        current_week_start = today - timedelta(days=today.weekday())
        groups: dict[date, list[dict]] = {}
        changed = False
        for category in self.categories():
            kept = []
            for todo in category.get("todos", []):
                if todo.get("done"):
                    completed = self._completion_date(todo)
                    if completed is not None and completed < current_week_start:
                        week_start = completed - timedelta(days=completed.weekday())
                        groups.setdefault(week_start, []).append(
                            {
                                "category": category.get("name", "Untitled"),
                                "color": category.get("color", PALETTE[0]),
                                "name": todo.get("name", "Untitled"),
                                "completed_at": todo.get("completed_at"),
                                "note": todo.get("note", ""),
                                "subtasks": [
                                    {
                                        "name": sub.get("name", "Untitled"),
                                        "done": sub.get("done", False),
                                        "created_at": sub.get("created_at"),
                                        "time_cost": sub.get("time_cost"),
                                        "note": sub.get("note", ""),
                                    }
                                    for sub in todo.get("subtasks", [])
                                ],
                            }
                        )
                        changed = True
                        continue
                kept.append(todo)
            category["todos"] = kept
        if not changed:
            return False
        archive = self.data.setdefault("archive", [])
        for week_start, items in groups.items():
            key = week_start.isoformat()
            card = None
            for existing in archive:
                if existing.get("week_start") == key:
                    card = existing
                    break
            if card is None:
                week_end = week_start + timedelta(days=6)
                chosen = None
                settings = self.data.get("settings", {})
                if settings.get("theme") in ("postcard", "lavender"):
                    candidate = settings.get("resolved_postcard") or settings.get("postcard")
                    if candidate in THEMES:
                        chosen = candidate
                card = {
                    "id": new_id(),
                    "week_start": key,
                    "week_end": week_end.isoformat(),
                    "year": week_start.year,
                    "month": week_start.month,
                    "week": week_start.isocalendar().week,
                    "theme": chosen or next_theme(archive),
                    "seen": False,
                    "items": [],
                }
                archive.append(card)
            card.setdefault("items", []).extend(items)
        archive.sort(key=lambda card: card.get("week_start", ""))
        return True

    def trophy_count(self) -> int:
        # A fork window is a fake todo app: finishing its work must never earn
        # a trophy in that window or in the notebook that created it.
        if self.data.get("fork"):
            return 0
        count = sum(
            1
            for category in self.categories()
            for todo in category.get("todos", [])
            if todo.get("done")
        )
        for card in self.data.get("archive", []):
            if card.get("sample"):
                continue
            count += len(card.get("items", []))
        return count

    def state(self) -> dict:
        with self.lock:
            self._archive_finished_weeks()
            # Persist load-time migrations such as created_at/time_cost.
            save_data(self.data, self.path)
            selected = self.data.get("selected_category")
            if selected is None and self.categories():
                selected = self.categories()[0]["id"]
                self.data["selected_category"] = selected
            return {
                "categories": self.categories(),
                "archive": sorted(
                    self.data.get("archive", []),
                    key=lambda card: card.get("week_start", ""),
                ),
                "trash": sorted(
                    self.data.get("trash", []),
                    key=lambda item: item.get("deleted_at", ""),
                    reverse=True,
                ),
                "selected_category": selected,
                "trophy_count": self.trophy_count(),
                "today": date.today().isoformat(),
                "settings": self.data.get("settings", {}),
                # The page baseline is a standalone colour file, not a theme
                # slot. It is published with the state so the page can paint it
                # before Settings is opened.
                "baseline_color": read_baseline_color(),
                # The page's horizontal dividers (the ruled grid of the header,
                # the task rows and the desk) are one object with its own file.
                # It is published with the state so the page can paint before
                # Settings is opened, and it never reads a theme palette.
                "page_line": read_page_line(),
                # The row baseline (subtask / Doing hairlines) is its own file
                # and can carry a gradient or a per-row height ramp.
                "baseline_rule": read_baseline_row_rule(),
                # Present only in a fork window; it marks the fake todo that
                # must never add to the parent notebook's achievements.
                "fork": self.data.get("fork"),
                # Shown by the napkin card for todos that have not linked a
                # project folder yet: it is where their agents really run.
                "default_project_folder": str(agent_workspace()),
            }

    def _find_category(self, category_id: str):
        for category in self.categories():
            if category.get("id") == category_id:
                return category
        return None

    def _find_todo(self, todo_id: str):
        for category in self.categories():
            for todo in category.get("todos", []):
                if todo.get("id") == todo_id:
                    return category, todo
        return None, None

    def _find_subtask(self, todo, subtask_id):
        if not todo or not subtask_id:
            return None
        for subtask in todo.get("subtasks", []):
            if subtask.get("id") == subtask_id:
                return subtask
        return None

    def _remember_deleted_subtasks(self, category, todo, subtasks):
        trash = self.data.setdefault("trash", [])
        now = datetime.now().isoformat(timespec="seconds")
        for subtask in subtasks:
            if not isinstance(subtask, dict) or not subtask.get("id"):
                continue
            subtask_id = str(subtask.get("id"))
            trash[:] = [item for item in trash if str(item.get("id")) != subtask_id]
            entry = dict(subtask)
            entry.update({
                "todo_id": todo.get("id"),
                "todo_name": todo.get("name", ""),
                "category_id": category.get("id") if category else None,
                "category_name": category.get("name", "") if category else "",
                "deleted_at": now,
            })
            trash.append(entry)
        if len(trash) > 100:
            del trash[:-100]

    def action(self, payload: dict) -> dict:
        # The native folder picker is async on the GTK main loop; never hold
        # the store lock while the user is choosing a directory.
        if payload.get("action") == "choose_project_folder":
            if FOLDER_PICK_CALLBACK is None:
                return {"ok": False, "error": "Folder picker is not available"}
            path = FOLDER_PICK_CALLBACK()
            return {"ok": True, "path": path or "", "cancelled": not bool(path), "state": self.state()}
        # The native picker returns a path. The file is linked into the
        # dedicated pictures/wallpapers shelf so the recent list and the folder
        # button describe one set of options. Platforms without the picker fall
        # back to the browser file input and let the client upload instead.
        if payload.get("action") == "choose_wallpaper_file":
            if FILE_PICK_CALLBACK is None:
                return {"ok": False, "fallback": "upload", "error": "File picker is not available"}
            path = FILE_PICK_CALLBACK()
            picked = sanitize_wallpaper_file_path(path)
            if path and not picked:
                return {"ok": False, "error": "Choose an image or a film"}
            if not picked:
                return {"ok": True, "path": "", "cancelled": True}
            # The picker opens the reader's own folder; the choice is linked
            # into pictures/wallpapers so the recent options and the folder
            # button describe the same entries. If the link fails the original
            # path still works, so a wallpaper is never lost.
            picked = import_wallpaper_file(picked) or picked
            # Remember the pick before answering: /user-wallpaper only serves a
            # path the store already knows, and the page mounts the picture the
            # moment it hears this answer. Saving here makes the first image
            # request allowed; otherwise it answers 404, the page drops the
            # choice, and the reader has to pick the same file a second time.
            with self.lock:
                current = self.data.setdefault("settings", {})
                current["wallpaper"] = picked
                current["wallpaper_recent"] = sanitize_wallpaper_recent([
                    picked,
                    *(current.get("wallpaper_recent") or []),
                ])
                save_data(self.data, self.path)
                state = self.state()
            return {"ok": True, "path": picked, "cancelled": False, "state": state}
        with self.lock:
            name = payload.get("action")
            result = {}
            error = None
            if name == "quit":
                callback = self.quit_callback or QUIT_CALLBACK
                if callback:
                    callback()
            elif name == "open_url":
                url = payload.get("url")
                if isinstance(url, str) and url.startswith(("https://", "http://", "mailto:")):
                    try:
                        if sys.platform == "win32":
                            os.startfile(url)
                        elif sys.platform == "darwin":
                            subprocess.Popen(["open", url], start_new_session=True)
                        else:
                            subprocess.Popen(
                                ["xdg-open", url],
                                stdout=subprocess.DEVNULL,
                                stderr=subprocess.DEVNULL,
                                start_new_session=True,
                            )
                    except Exception:
                        error = "Could not open link"
                else:
                    error = "Invalid link"
            elif name == "select_category":
                category = self._find_category(payload.get("id"))
                if category is None:
                    error = "Category not found"
                else:
                    self.data["selected_category"] = category["id"]
                    self.data["opened_category"] = category["id"]
            elif name == "add_category":
                title = str(payload.get("name", "")).strip()
                if not title:
                    error = "Name cannot be empty"
                else:
                    color = PALETTE[len(self.categories()) % len(PALETTE)]
                    category = {
                        "id": new_id(),
                        "name": title,
                        "color": color,
                        "todos": [],
                    }
                    # A category added inside a fork window belongs to that
                    # branch, so the fork's own index keeps showing it.
                    fork_root = payload.get("fork_root")
                    if isinstance(fork_root, str) and fork_root and self._find_category(fork_root) is not None:
                        category["fork_root"] = fork_root
                    self.categories().append(category)
                    self.data["selected_category"] = category["id"]
                    self.data["opened_category"] = category["id"]
                    result["created"] = category["id"]
            elif name == "rename_category":
                category = self._find_category(payload.get("id"))
                title = str(payload.get("name", "")).strip()
                if category is None:
                    error = "Category not found"
                elif not title:
                    error = "Name cannot be empty"
                else:
                    category["name"] = title
            elif name == "delete_category":
                category = self._find_category(payload.get("id"))
                if category is None:
                    error = "Category not found"
                elif category.get("todos"):
                    error = "This category still has todos"
                else:
                    self.data["categories"] = [
                        item for item in self.categories()
                        if item.get("id") != category["id"]
                    ]
                    if self.data.get("selected_category") == category["id"]:
                        self.data["selected_category"] = (
                            self.categories()[0]["id"] if self.categories() else None
                        )
            elif name == "add_todo":
                category = self._find_category(payload.get("category_id"))
                title = str(payload.get("name", "")).strip()
                if category is None:
                    error = "Category not found"
                elif not title:
                    error = "Name cannot be empty"
                elif any(not todo.get("done") for todo in category.get("todos", [])):
                    error = "Complete the current todo first"
                else:
                    now = datetime.now().isoformat(timespec="seconds")
                    todo = {
                        "id": new_id(),
                        "name": title,
                        "done": False,
                        "created_at": now,
                        "completed_at": None,
                        "time_cost": None,
                        "note": "",
                        "subtasks": [],
                    }
                    # A new todo is the latest activity, so it leads the category.
                    category.setdefault("todos", []).insert(0, todo)
                    self.data["selected_category"] = category["id"]
                    result["created"] = todo["id"]
            elif name == "rename_todo":
                _, todo = self._find_todo(payload.get("id"))
                title = str(payload.get("name", "")).strip()
                if todo is None:
                    error = "Todo not found"
                elif todo.get("done"):
                    error = "Completed todos are locked"
                elif not title:
                    error = "Name cannot be empty"
                else:
                    todo["name"] = title
            elif name == "rename_subtask":
                _, todo = self._find_todo(payload.get("todo_id"))
                subtask = None
                if todo is not None:
                    for item in todo.get("subtasks", []):
                        if item.get("id") == payload.get("subtask_id"):
                            subtask = item
                            break
                title = str(payload.get("name", "")).strip()
                if subtask is None:
                    error = "Subtask not found"
                elif subtask.get("done"):
                    error = "Completed subtasks are locked"
                elif not title:
                    error = "Name cannot be empty"
                else:
                    subtask["name"] = title
            elif name == "rename_subtasks":
                _, todo = self._find_todo(payload.get("todo_id"))
                names = payload.get("names") or []
                if todo is None:
                    error = "Todo not found"
                elif todo.get("done"):
                    error = "Completed todos are locked"
                elif not isinstance(names, list):
                    error = "Invalid names"
                else:
                    by_id = {item.get("id"): item for item in todo.get("subtasks", [])}
                    for item in names:
                        subtask = by_id.get(str(item.get("subtask_id")))
                        if subtask is None or subtask.get("done"):
                            continue
                        subtask["name"] = str(item.get("name", ""))
            elif name == "delete_subtask":
                category, todo = self._find_todo(payload.get("todo_id"))
                subtask = self._find_subtask(todo, payload.get("subtask_id"))
                if todo is None:
                    error = "Todo not found"
                elif subtask is None:
                    error = "Subtask not found"
                elif subtask.get("done"):
                    error = "Completed subtasks are locked"
                else:
                    self._remember_deleted_subtasks(category, todo, [subtask])
                    todo["subtasks"] = [
                        item
                        for item in todo.get("subtasks", [])
                        if item.get("id") != payload.get("subtask_id")
                    ]
            elif name == "delete_subtasks":
                category, todo = self._find_todo(payload.get("todo_id"))
                subtask_ids = payload.get("subtask_ids") or []
                if todo is None:
                    error = "Todo not found"
                elif todo.get("done"):
                    error = "Completed todos are locked"
                elif not isinstance(subtask_ids, list) or not subtask_ids:
                    error = "No subtasks selected"
                else:
                    wanted = {str(item) for item in subtask_ids}
                    removed = [
                        item for item in todo.get("subtasks", [])
                        if not item.get("done") and str(item.get("id")) in wanted
                    ]
                    self._remember_deleted_subtasks(category, todo, removed)
                    todo["subtasks"] = [
                        item
                        for item in todo.get("subtasks", [])
                        if item.get("done") or str(item.get("id")) not in wanted
                    ]
            elif name == "restore_subtask":
                target_id = str(payload.get("id") or "")
                trash = self.data.setdefault("trash", [])
                entry = next(
                    (item for item in trash if str(item.get("id")) == target_id),
                    None,
                )
                if entry is None:
                    error = "Deleted subtask not found"
                else:
                    _, todo = self._find_todo(entry.get("todo_id"))
                    if todo is None:
                        error = "The original todo no longer exists"
                    elif todo.get("done"):
                        error = "Completed todos are locked"
                    else:
                        restored = {
                            key: entry[key]
                            for key in ("id", "name", "note", "created_at")
                            if key in entry
                        }
                        restored["done"] = False
                        if not any(str(item.get("id")) == target_id for item in todo.get("subtasks", [])):
                            subtasks = todo.setdefault("subtasks", [])
                            restored_stamp = _activity_stamp(restored)
                            at = 0
                            while at < len(subtasks) and _activity_stamp(subtasks[at]) > restored_stamp:
                                at += 1
                            subtasks.insert(at, restored)
                        self.data["trash"] = [
                            item for item in trash
                            if str(item.get("id")) != target_id
                        ]
                        result["restored"] = target_id
            elif name == "clear_trash":
                self.data["trash"] = []
            elif name == "add_subtask":
                _, todo = self._find_todo(payload.get("todo_id"))
                title = str(payload.get("name", "")).strip()
                if todo is None:
                    error = "Todo not found"
                elif todo.get("done"):
                    error = "Completed todos are locked"
                elif not title:
                    error = "Name cannot be empty"
                else:
                    subtask = {
                        "id": new_id(),
                        "name": title,
                        "done": False,
                        "created_at": datetime.now().isoformat(timespec="seconds"),
                        "completed_at": None,
                        "time_cost": None,
                    }
                    # New work is the latest activity, so it opens at the top
                    # of the stored list; the board uses the same recency order.
                    todo.setdefault("subtasks", []).insert(0, subtask)
                    result["created"] = subtask["id"]
            elif name == "fork_subtask":
                # A fork branches one subtask into a board of its own: the
                # parent todo becomes the category name and the subtask becomes
                # the active todo. The original subtask is left untouched, so
                # the same task can be forked as many times as wanted.
                category, todo = self._find_todo(payload.get("todo_id"))
                subtask = self._find_subtask(todo, payload.get("subtask_id"))
                if todo is None:
                    error = "Todo not found"
                elif subtask is None:
                    error = "Subtask not found"
                else:
                    now = datetime.now().isoformat(timespec="seconds")
                    branch = {
                        "category_id": category.get("id") if category else None,
                        "category_name": category.get("name", "") if category else "",
                        "todo_id": todo.get("id"),
                        "todo_name": todo.get("name", ""),
                        "subtask_id": subtask.get("id"),
                        "subtask_name": subtask.get("name", ""),
                        "at": now,
                    }
                    forked_todo = {
                        "id": new_id(),
                        "name": str(subtask.get("name") or "Untitled"),
                        "done": False,
                        "created_at": now,
                        "completed_at": None,
                        "time_cost": None,
                        "note": str(subtask.get("note") or ""),
                        "subtasks": [],
                        "forked_from": dict(branch),
                    }
                    # The branch continues the same work, so it keeps the
                    # parent's linked project folder.
                    if todo.get("project_folder"):
                        forked_todo["project_folder"] = todo["project_folder"]
                        if todo.get("project_file_count"):
                            forked_todo["project_file_count"] = todo["project_file_count"]
                    fork_category = {
                        "id": new_id(),
                        "name": str(todo.get("name") or "Untitled"),
                        "color": (category or {}).get("color") or PALETTE[len(self.categories()) % len(PALETTE)],
                        "todos": [forked_todo],
                        "forked_from": dict(branch),
                    }
                    self.categories().insert(0, fork_category)
                    result["created"] = fork_category["id"]
                    result["forked_todo"] = forked_todo["id"]
                    result["forked_name"] = forked_todo["name"]
            elif name == "complete_todo":
                category, todo = self._find_todo(payload.get("id"))
                if todo is None:
                    error = "Todo not found"
                elif todo.get("done"):
                    error = "Already completed"
                elif any(
                    not subtask.get("done")
                    for subtask in todo.get("subtasks", [])
                ):
                    error = "Complete the pending subtask first"
                else:
                    now = datetime.now()
                    start = None
                    if todo.get("created_at"):
                        try:
                            start = datetime.fromisoformat(todo["created_at"])
                        except Exception:
                            start = None
                    todo["done"] = True
                    todo["completed_at"] = now.isoformat(timespec="seconds")
                    todo["time_cost"] = max(0, int((now - start).total_seconds())) if start else 0
                    # A finished todo rises to the top of its category, so the
                    # stored order matches the board and the next todo follows it.
                    if category is not None:
                        todos = category.setdefault("todos", [])
                        todos[:] = [
                            item for item in todos
                            if str(item.get("id")) != str(todo.get("id"))
                        ]
                        todos.insert(0, todo)
                    result["trophy"] = True
            elif name == "complete_subtask":
                _, todo = self._find_todo(payload.get("todo_id"))
                subtask = None
                if todo is not None:
                    for item in todo.get("subtasks", []):
                        if item.get("id") == payload.get("subtask_id"):
                            subtask = item
                            break
                if todo is None or subtask is None:
                    error = "Subtask not found"
                elif subtask.get("done"):
                    error = "Already completed"
                else:
                    now = datetime.now()
                    start = None
                    # Time cost belongs to the work run, not to the row's whole
                    # lifetime: a reopened subtask restarts the clock.
                    start_stamp = subtask.get("reopened_at") or subtask.get("created_at")
                    if start_stamp:
                        try:
                            start = datetime.fromisoformat(start_stamp)
                        except Exception:
                            start = None
                    subtask["done"] = True
                    subtask["completed_at"] = now.isoformat(timespec="seconds")
                    subtask["time_cost"] = max(0, int((now - start).total_seconds())) if start else 0
                    # The finished subtask is the latest activity, so it leads
                    # the stored list; a newer task can still open above it.
                    subtasks = todo.setdefault("subtasks", [])
                    subtasks[:] = [
                        item for item in subtasks
                        if str(item.get("id")) != str(subtask.get("id"))
                    ]
                    subtasks.insert(0, subtask)
            elif name == "reopen_subtask":
                # A finished subtask can go back to the board: clicking its fan
                # in the finished card, or continuing it with the AI, sends it
                # back to the pending lane instead of leaving it done.
                _, todo = self._find_todo(payload.get("todo_id"))
                subtask = self._find_subtask(todo, payload.get("subtask_id"))
                if todo is None or subtask is None:
                    error = "Subtask not found"
                elif todo.get("done"):
                    error = "Completed todos are locked"
                elif not subtask.get("done"):
                    error = "Subtask is still pending"
                else:
                    subtask["done"] = False
                    subtask["completed_at"] = None
                    subtask["time_cost"] = None
                    # Reopening starts a fresh work run: it leads the board and
                    # the next completion measures from this moment.
                    subtask["reopened_at"] = datetime.now().isoformat(timespec="seconds")
                    subtasks = todo.setdefault("subtasks", [])
                    subtasks[:] = [
                        item for item in subtasks
                        if str(item.get("id")) != str(subtask.get("id"))
                    ]
                    subtasks.insert(0, subtask)
            elif name == "bind_project_folder":
                _, todo = self._find_todo(payload.get("id"))
                raw = str(payload.get("path") or "").strip()
                folder = Path(raw).expanduser() if raw else None
                if todo is None:
                    error = "Todo not found"
                elif folder is None or not folder.is_dir():
                    error = "Folder not found"
                else:
                    files = list_folder_files(str(folder))
                    todo["project_folder"] = str(folder)
                    todo["project_file_count"] = len(files)
                    result["files"] = files
            elif name == "clear_project_folder":
                _, todo = self._find_todo(payload.get("id"))
                if todo is None:
                    error = "Todo not found"
                else:
                    todo.pop("project_folder", None)
                    todo.pop("project_file_count", None)
            elif name == "project_files":
                _, todo = self._find_todo(payload.get("id"))
                if todo is None:
                    error = "Todo not found"
                else:
                    linked = str(todo.get("project_folder") or "").strip()
                    folder = str(agent_workspace(linked))
                    linked_path = Path(linked).expanduser() if linked else None
                    subpath = str(payload.get("path") or "")
                    entries = list_folder_dir(folder, subpath)
                    result["folder"] = folder
                    result["linked"] = bool(linked)
                    result["linked_exists"] = bool(linked_path and linked_path.is_dir())
                    result["path"] = subpath
                    result["files"] = [entry["path"] for entry in entries if not entry["dir"]]
                    result["entries"] = entries
                    result["truncated"] = len(entries) >= PROJECT_FILE_LIMIT
                    result["exists"] = Path(folder).is_dir()
            elif name == "open_project_folder":
                _, todo = self._find_todo(payload.get("id"))
                folder = agent_workspace(todo.get("project_folder") if todo else "")
                if not folder.is_dir():
                    error = "Folder not found"
                else:
                    try:
                        reveal_in_file_manager(folder)
                    except Exception as exc:
                        error = f"Could not open folder: {exc}"
            elif name == "open_sounds_folder":
                # The shelf itself: it holds classical/ and every style folder,
                # so a new style can be made just by adding a folder there.
                ensure_sounds_dir()
                target = SOUNDS_DIR
                try:
                    if sys.platform == "win32":
                        os.startfile(str(target))
                    elif sys.platform == "darwin":
                        subprocess.Popen(["open", str(target)], start_new_session=True)
                    else:
                        subprocess.Popen(["xdg-open", str(target)], start_new_session=True,
                                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                except Exception as open_error:
                    error = str(open_error)
                result["folder"] = str(target)
            elif name == "open_note_materials_folder":
                ensure_note_materials_dir()
                try:
                    if sys.platform == "win32":
                        os.startfile(str(NOTE_MATERIALS_DIR))
                    elif sys.platform == "darwin":
                        subprocess.Popen(["open", str(NOTE_MATERIALS_DIR)], start_new_session=True)
                    else:
                        subprocess.Popen(["xdg-open", str(NOTE_MATERIALS_DIR)], start_new_session=True,
                                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                except Exception as open_error:
                    error = str(open_error)
                result["folder"] = str(NOTE_MATERIALS_DIR)
            elif name == "open_plugins_folder":
                ensure_plugins_dir()
                try:
                    if sys.platform == "win32":
                        os.startfile(str(PLUGINS_DIR))
                    elif sys.platform == "darwin":
                        subprocess.Popen(["open", str(PLUGINS_DIR)], start_new_session=True)
                    else:
                        subprocess.Popen(["xdg-open", str(PLUGINS_DIR)], start_new_session=True,
                                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                except Exception as open_error:
                    error = str(open_error)
                result["folder"] = str(PLUGINS_DIR)
            elif name in ("open_theme_packs_folder", "open_theme_exports_folder",
                          "open_note_themes_folder", "open_ai_themes_folder",
                          "open_icon_themes_folder", "open_wallpaper_folder"):
                if name == "open_theme_packs_folder":
                    seed_bundled_theme_packs()
                    folder = ensure_theme_packs_dir()
                elif name == "open_note_themes_folder":
                    folder = ensure_pane_themes_dir("note")
                elif name == "open_ai_themes_folder":
                    folder = ensure_pane_themes_dir("ai")
                elif name == "open_icon_themes_folder":
                    folder = ensure_icon_themes_dir()
                elif name == "open_wallpaper_folder":
                    # The dedicated shelf, not the reader's own wallpaper
                    # folder: it holds exactly the recent options. Older
                    # external picks are linked in first, and deleted shelf
                    # files drop out of the list.
                    current_settings = self.data.setdefault("settings", {})
                    import_wallpaper_shelf(current_settings)
                    prune_wallpaper_shelf(current_settings)
                    folder = ensure_wallpaper_shelf_dir()
                    result["state"] = self.state()
                else:
                    folder = ensure_theme_exports_dir()
                try:
                    if sys.platform == "win32":
                        os.startfile(str(folder))
                    elif sys.platform == "darwin":
                        subprocess.Popen(["open", str(folder)], start_new_session=True)
                    else:
                        subprocess.Popen(["xdg-open", str(folder)], start_new_session=True,
                                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                except Exception as open_error:
                    error = str(open_error)
                result["folder"] = str(folder)
            elif name == "note_material_files":
                result["files"] = note_material_file_names()
                result["folder"] = str(NOTE_MATERIALS_DIR)
            elif name == "open_music_folder":
                ensure_music_dir()
                try:
                    if sys.platform == "win32":
                        os.startfile(str(MUSIC_DIR))
                    elif sys.platform == "darwin":
                        subprocess.Popen(["open", str(MUSIC_DIR)], start_new_session=True)
                    else:
                        subprocess.Popen(["xdg-open", str(MUSIC_DIR)], start_new_session=True,
                                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                except Exception as open_error:
                    error = str(open_error)
                result["folder"] = str(MUSIC_DIR)
            elif name == "open_pictures_folder":
                ensure_pictures_dir()
                try:
                    if sys.platform == "win32":
                        os.startfile(str(PICTURES_DIR))
                    elif sys.platform == "darwin":
                        subprocess.Popen(["open", str(PICTURES_DIR)], start_new_session=True)
                    else:
                        subprocess.Popen(["xdg-open", str(PICTURES_DIR)], start_new_session=True,
                                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                except Exception as open_error:
                    error = str(open_error)
                result["folder"] = str(PICTURES_DIR)
            elif name == "wallpaper_files":
                files = picture_file_names()
                result["images"] = files["images"]
                result["videos"] = files["videos"]
                result["folder"] = files["folder"]
            elif name == "upload_wallpaper":
                kind = payload.get("kind")
                name = payload.get("name")
                data = payload.get("data")
                extensions = PICTURE_IMAGE_EXTS if kind == "image" else PICTURE_VIDEO_EXTS
                if kind not in ("image", "video"):
                    error = "Invalid wallpaper kind"
                elif not isinstance(data, str) or not data:
                    error = "No wallpaper data"
                elif len(data) > 170_000_000:
                    error = "Wallpaper is too large"
                else:
                    suffix = Path(str(name or "")).suffix.lower()
                    if suffix not in extensions:
                        error = "Unsupported wallpaper format"
                    else:
                        try:
                            raw = base64.b64decode(data, validate=True)
                        except Exception:
                            raw = b""
                        if not raw:
                            error = "Could not read wallpaper"
                        elif len(raw) > (
                            WALLPAPER_VIDEO_MAX_BYTES if kind == "video" else 30_000_000
                        ):
                            error = "Wallpaper is too large"
                        else:
                            folder = ensure_wallpaper_shelf_dir()
                            stem = re.sub(r"[^\w-]+", "-", Path(str(name)).stem, flags=re.UNICODE).strip("-_")[:48] or "wallpaper"
                            dest = folder / f"{stem}-{new_id()[:8]}{suffix}"
                            try:
                                dest.write_bytes(raw)
                                result["file"] = str(dest)
                                result["kind"] = kind
                            except Exception as write_error:
                                error = str(write_error)
            elif name == "sync_wallpaper_shelf":
                # Called when Wallpaper → Manage opens: link any older pick
                # into the dedicated folder and drop options deleted there.
                current_settings = self.data.setdefault("settings", {})
                import_wallpaper_shelf(current_settings)
                prune_wallpaper_shelf(current_settings)
                result["state"] = self.state()
            elif name == "save_postcard_art":
                items = payload.get("items")
                if not isinstance(items, list):
                    error = "No artwork"
                else:
                    result.update(save_postcard_art(items))
            elif name == "sound_files":
                result["files"] = sound_file_names(payload.get("style"))
                result["styles"] = discover_sound_styles()
                result["folder"] = str(sound_style_dir(payload.get("style")) or SOUNDS_DIR)
            elif name == "save_note":
                _, todo = self._find_todo(payload.get("id"))
                subtask_id = payload.get("subtask_id")
                subtask = None
                if todo is not None and subtask_id:
                    for item in todo.get("subtasks", []):
                        if item.get("id") == subtask_id:
                            subtask = item
                            break
                if todo is None:
                    error = "Todo not found"
                elif subtask_id and subtask is None:
                    error = "Subtask not found"
                elif subtask is not None:
                    subtask["note"] = str(payload.get("note", ""))
                else:
                    todo["note"] = str(payload.get("note", ""))
            elif name == "save_settings":
                incoming = payload.get("settings")
                if not isinstance(incoming, dict):
                    error = "Invalid settings"
                else:
                    current = self.data.setdefault("settings", {})
                    allowed_themes = set(THEMES) | installed_theme_ids()
                    current["theme"] = "postcard"
                    if incoming.get("postcard") in allowed_themes or incoming.get("postcard") == "random":
                        current["postcard"] = incoming["postcard"]
                    if incoming.get("resolved_postcard") in allowed_themes:
                        current["resolved_postcard"] = incoming["resolved_postcard"]
                    if incoming.get("light_postcard") in allowed_themes:
                        current["light_postcard"] = incoming["light_postcard"]
                    if incoming.get("dark_postcard") in allowed_themes:
                        current["dark_postcard"] = incoming["dark_postcard"]
                    if current.get("theme") == "postcard" and current.get("postcard") in allowed_themes:
                        current["resolved_postcard"] = current["postcard"]
                    if current.get("resolved_postcard") not in allowed_themes:
                        current["resolved_postcard"] = "light"
                    if incoming.get("font") in ("serif", "humanist", "bookman", "mono", "hand", "pen"):
                        current["font"] = incoming["font"]
                    if incoming.get("note_font") in ("serif", "humanist", "bookman", "mono", "hand", "pen"):
                        current["note_font"] = incoming["note_font"]
                    if "body_font_size" in incoming:
                        try:
                            current["body_font_size"] = max(14, min(20, int(incoming["body_font_size"])))
                        except (TypeError, ValueError):
                            pass
                    if "note_font_size" in incoming:
                        try:
                            current["note_font_size"] = max(10, min(28, int(incoming["note_font_size"])))
                        except (TypeError, ValueError):
                            pass
                    for color_key in ("body_font_color", "note_font_color"):
                        color = incoming.get(color_key)
                        if isinstance(color, str) and re.fullmatch(r"#[0-9a-fA-F]{6}", color):
                            current[color_key] = color.lower()
                        elif color == "":
                            current.pop(color_key, None)
                    for key in ("show_time_cost", "show_clock", "show_brand", "show_achievements"):
                        if isinstance(incoming.get(key), bool):
                            current[key] = incoming[key]
                    try:
                        current["focus_count"] = max(0, int(incoming.get("focus_count", 0)))
                    except (TypeError, ValueError):
                        pass
                    if isinstance(incoming.get("focus_log"), list):
                        current["focus_log"] = incoming["focus_log"][-200:]
                    if isinstance(incoming.get("caret_blink"), bool):
                        current["caret_blink"] = incoming["caret_blink"]
                    if incoming.get("caret_shape") in ("line", "block"):
                        current["caret_shape"] = incoming["caret_shape"]
                    current["note_material"] = "paper"
                    current["note_theme"] = "default"
                    value = incoming.get("ai_theme")
                    if isinstance(value, str) and re.fullmatch(r"[a-z0-9:_-]{1,80}", value):
                        current["ai_theme"] = value
                    # An icon theme is a separate shelf: it never changes the
                    # app paper, the note palette or the AI palette.
                    icon_theme = normalized_theme_id(incoming.get("icon_theme"))
                    if icon_theme and icon_theme in {pack["id"] for pack in discover_icon_themes()}:
                        current["icon_theme"] = icon_theme
                    try:
                        current["saved_at"] = int(incoming.get("saved_at", 0))
                    except (TypeError, ValueError):
                        pass
                    background = incoming.get("note_background")
                    if isinstance(background, str) and background.startswith("data:") and len(background) <= 8_000_000:
                        current["note_background_image"] = background
                        current["note_background"] = "__custom"
                    elif background in ("", "__custom"):
                        current["note_background"] = background
                    image = incoming.get("note_background_image")
                    if isinstance(image, str) and len(image) <= 8_000_000:
                        current["note_background_image"] = image
                    try:
                        current["note_blur"] = max(0, min(40, int(incoming.get("note_blur", 16))))
                    except (TypeError, ValueError):
                        pass
                    if isinstance(incoming.get("caret_color"), str) and re.fullmatch(r"#[0-9a-fA-F]{6}", incoming["caret_color"]):
                        current["caret_color"] = incoming["caret_color"].lower()
                    # The selection highlight is a reader-owned wash colour. An
                    # empty value is meaningful: the active theme's accent inks
                    # the active row and menu entry again.
                    if "highlight" in incoming:
                        highlight = normalize_highlight_color(incoming.get("highlight"))
                        if highlight:
                            current["highlight"] = highlight
                        else:
                            current.pop("highlight", None)
                    if "sticker_backgrounds" in incoming:
                        current["sticker_backgrounds"] = sanitize_sticker_backgrounds(incoming.get("sticker_backgrounds"))
                    if incoming.get("wallpaper_mode") in (*WALLPAPER_MODES, "theme"):
                        current["wallpaper_mode"] = incoming["wallpaper_mode"]
                    if isinstance(incoming.get("wallpaper_static"), str):
                        current["wallpaper_static"] = incoming["wallpaper_static"]
                    if isinstance(incoming.get("wallpaper_dynamic"), str):
                        current["wallpaper_dynamic"] = incoming["wallpaper_dynamic"]
                    if isinstance(incoming.get("wallpaper"), str):
                        current["wallpaper"] = incoming["wallpaper"]
                    if "wallpaper_recent" in incoming:
                        current["wallpaper_recent"] = sanitize_wallpaper_recent(incoming.get("wallpaper_recent"))
                    try:
                        current["wallpaper_blur"] = max(0, min(100, int(incoming.get("wallpaper_blur", 30))))
                    except (TypeError, ValueError):
                        pass
                    if isinstance(incoming.get("wallpaper_blur_on"), bool):
                        current["wallpaper_blur_on"] = incoming["wallpaper_blur_on"]
                    if isinstance(incoming.get("wallpaper_cards"), bool):
                        current["wallpaper_cards"] = incoming["wallpaper_cards"]
                    if isinstance(incoming.get("postcards_exported"), bool):
                        current["postcards_exported"] = incoming["postcards_exported"]
                    sanitize_wallpaper_settings(current, derive_legacy="wallpaper" not in incoming)
                    prune_wallpaper_shelf(current)
                    if "sound_style" in incoming:
                        style = sound_style_id(incoming.get("sound_style"))
                        if style and (SOUNDS_DIR / style).is_dir():
                            current["sound_style"] = style
                    if "sound_overrides" in incoming:
                        overrides = {}
                        raw_overrides = incoming.get("sound_overrides")
                        if isinstance(raw_overrides, dict):
                            for key in THEME_SOUND_KEYS:
                                url = raw_overrides.get(key)
                                if not isinstance(url, str):
                                    continue
                                match = re.fullmatch(r"/theme-assets/([a-z0-9-]{2,64})/([^\s]+)", url)
                                if not match:
                                    continue
                                if theme_pack_asset_path(match.group(1), match.group(2)) is not None:
                                    overrides[key] = url
                        current["sound_overrides"] = overrides
                    if "plugins" in incoming:
                        current["plugins"] = sanitize_plugin_states(incoming.get("plugins"))
                    try:
                        scale = float(incoming.get("scale", 1))
                        current["scale"] = max(0.85, min(1.25, scale))
                    except (TypeError, ValueError):
                        pass
            elif name == "save_baseline_color":
                color = payload.get("color")
                if not isinstance(color, str) or not re.fullmatch(r"#[0-9a-fA-F]{6}", color.strip()):
                    error = "Invalid baseline colour"
                else:
                    result["color"] = write_baseline_color(color)
            elif name == "save_page_line":
                # The page dividers are a single object: colour, opacity and
                # the two layout numbers (row pitch and line weight). A partial
                # patch is merged with the stored values so one slider never
                # resets the others.
                raw_line = payload.get("page_line")
                result["page_line"] = write_page_line(
                    raw_line if isinstance(raw_line, dict) else payload
                )
            elif name == "save_baseline_rule":
                # Row hairlines have their own file. Normalising here keeps an
                # unknown mode or a bad hex from ever reaching the stylesheet.
                raw_rule = payload.get("rule")
                result["rule"] = write_baseline_row_rule(
                    raw_rule if isinstance(raw_rule, dict) else payload
                )
            elif name == "mark_seen":
                if payload.get("all"):
                    for card in self.data.get("archive", []):
                        card["seen"] = True
                else:
                    for card in self.data.get("archive", []):
                        if card.get("id") == payload.get("card_id"):
                            card["seen"] = True
                            break
            elif name == "remove_samples":
                self.data["archive"] = [
                    card for card in self.data.get("archive", [])
                    if not card.get("sample")
                ]
                self.data["categories"] = [
                    category for category in self.categories()
                    if not category.get("sample")
                ]
                if self.data.get("selected_category") not in {
                    category["id"] for category in self.categories()
                }:
                    self.data["selected_category"] = (
                        self.categories()[0]["id"] if self.categories() else None
                    )
            elif name == "reorder_categories":
                ids = payload.get("ids")
                categories = self.categories()
                if not isinstance(ids, list) or len(ids) != len(categories) or set(ids) != {item["id"] for item in categories}:
                    error = "Invalid category order"
                else:
                    by_id = {item["id"]: item for item in categories}
                    self.data["categories"] = [by_id[item_id] for item_id in ids]
            else:
                error = "Unknown action"
            if error:
                return {"ok": False, "error": error, "state": self.state()}
            save_data(self.data, self.path)
            return {"ok": True, "state": self.state(), **result}


def clean_ai_config(raw: dict) -> dict:
    """Normalize the AI settings file and keep secrets out of bad shapes."""
    raw = raw if isinstance(raw, dict) else {}
    config = json.loads(json.dumps(AI_DEFAULT_CONFIG))
    agent = str(raw.get("default_agent") or "opencode").strip().lower()
    config["default_agent"] = agent if agent in ("opencode", "claude", "codex") else "opencode"
    model = str(raw.get("default_model") or "").strip()
    if model and AI_MODEL_RE.match(model):
        config["default_model"] = model
    mode = str(raw.get("default_mode") or "chat").strip().lower()
    config["default_mode"] = mode if mode in ("chat", "build") else "chat"
    agent_models = raw.get("agent_models") if isinstance(raw.get("agent_models"), dict) else {}
    for kind in AI_AGENT_KINDS:
        value = str(agent_models.get(kind) or "").strip()
        if value and AI_MODEL_RE.match(value):
            config["agent_models"][kind] = value
    agent_modes = raw.get("agent_modes") if isinstance(raw.get("agent_modes"), dict) else {}
    for kind in AI_AGENT_KINDS:
        value = str(agent_modes.get(kind) or config["agent_modes"][kind]).strip().lower()
        config["agent_modes"][kind] = value if value in ("chat", "build") else config["agent_modes"][kind]
    enabled = raw.get("enabled_models") if isinstance(raw.get("enabled_models"), list) else []
    config["enabled_models"] = [
        str(item).strip() for item in enabled[:500]
        if isinstance(item, str) and AI_MODEL_RE.match(item.strip())
    ]
    config["notifications"] = raw.get("notifications") is not False
    sound = str(raw.get("notification_sound") or "trainWhistle")
    config["notification_sound"] = sound if sound in AI_NOTIFICATION_SOUNDS else "trainWhistle"
    config["auto_attach_note"] = raw.get("auto_attach_note") is not False
    config["save_chats"] = raw.get("save_chats") is True
    instructions = raw.get("custom_instructions")
    config["custom_instructions"] = instructions[:20000] if isinstance(instructions, str) else ""
    providers = []
    for item in raw.get("providers") if isinstance(raw.get("providers"), list) else []:
        if not isinstance(item, dict):
            continue
        provider_id = str(item.get("id") or "").strip().lower()
        if not AI_PROVIDER_ID_RE.match(provider_id):
            continue
        base_url = str(item.get("base_url") or "").strip()
        if not re.match(r"^https?://", base_url):
            continue
        provider_models = []
        for model_id in item.get("models") if isinstance(item.get("models"), list) else []:
            text = str(model_id or "").strip()
            if text and re.fullmatch(r"[A-Za-z0-9_.:/#-]{1,160}", text):
                provider_models.append(text)
        if not provider_models:
            continue
        api_key = item.get("api_key")
        providers.append({
            "id": provider_id,
            "name": str(item.get("name") or provider_id)[:80],
            "base_url": base_url[:500],
            "api_key": api_key[:800] if isinstance(api_key, str) else "",
            "models": provider_models[:120],
            "enabled": item.get("enabled") is not False,
        })
    config["providers"] = providers[:24]
    commands = []
    for item in raw.get("commands") if isinstance(raw.get("commands"), list) else []:
        if not isinstance(item, dict):
            continue
        prompt = item.get("prompt")
        if not isinstance(prompt, str) or not prompt.strip():
            continue
        command_id = re.sub(r"[^a-z0-9_-]+", "-", str(item.get("id") or item.get("name") or "").lower()).strip("-")
        if not command_id:
            continue
        commands.append({
            "id": command_id[:64],
            "name": str(item.get("name") or command_id)[:80],
            "prompt": prompt[:12000],
            "show_in_menu": item.get("show_in_menu") is not False,
        })
    config["commands"] = commands[:80]
    environment = []
    for item in raw.get("environment") if isinstance(raw.get("environment"), list) else []:
        if not isinstance(item, dict):
            continue
        name = str(item.get("name") or "").strip()
        value = item.get("value")
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", name) or not isinstance(value, str):
            continue
        environment.append({"name": name, "value": value[:4000]})
    config["environment"] = environment[:32]
    config["activity_log"] = raw.get("activity_log") is not False
    try:
        config["timeout_minutes"] = max(1, min(120, int(raw.get("timeout_minutes") or 15)))
    except (TypeError, ValueError):
        config["timeout_minutes"] = 15
    try:
        config["max_parallel"] = max(1, min(32, int(raw.get("max_parallel") or 12)))
    except (TypeError, ValueError):
        config["max_parallel"] = 12
    return config


def read_ai_config() -> dict:
    try:
        raw = json.loads(AI_CONFIG_FILE.read_text(encoding="utf-8"))
    except Exception:
        raw = {}
    return clean_ai_config(raw)


def write_ai_config(config: dict) -> dict:
    clean = clean_ai_config(config)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    temp = AI_CONFIG_FILE.with_suffix(".tmp")
    temp.write_text(json.dumps(clean, ensure_ascii=False, indent=2), encoding="utf-8")
    try:
        os.chmod(temp, 0o600)
    except Exception:
        pass
    temp.replace(AI_CONFIG_FILE)
    return clean


def ai_public_config(config: dict) -> dict:
    """The settings page never receives stored API keys back."""
    public = json.loads(json.dumps(config))
    for provider in public.get("providers", []):
        provider["api_key_set"] = bool(provider.pop("api_key", ""))
    return public


def ai_opencode_env(config: dict) -> dict:
    """Environment for `opencode` children: custom providers + user env rows."""
    env = os.environ.copy()
    custom = [item for item in config.get("providers", []) if item.get("enabled", True)]
    if custom:
        base = {"$schema": "https://opencode.ai/config.json"}
        existing = os.environ.get("OPENCODE_CONFIG")
        if existing:
            try:
                loaded = json.loads(Path(existing).expanduser().read_text(encoding="utf-8"))
                if isinstance(loaded, dict):
                    base.update(loaded)
            except Exception:
                pass
        providers = base.get("provider") if isinstance(base.get("provider"), dict) else {}
        for provider in custom:
            options = {"baseURL": provider.get("base_url") or ""}
            if provider.get("api_key"):
                options["apiKey"] = provider["api_key"]
            providers[provider["id"]] = {
                "name": provider.get("name") or provider["id"],
                "options": options,
                "models": {
                    model_id: {"name": model_id}
                    for model_id in provider.get("models", [])
                },
            }
        base["provider"] = providers
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        AI_OPENCODE_CONFIG.write_text(json.dumps(base, ensure_ascii=False, indent=2), encoding="utf-8")
        try:
            os.chmod(AI_OPENCODE_CONFIG, 0o600)
        except Exception:
            pass
        env["OPENCODE_CONFIG"] = str(AI_OPENCODE_CONFIG)
    for item in config.get("environment", []):
        name = str(item.get("name") or "").strip()
        if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", name):
            env[name] = str(item.get("value") or "")
    return env


def ai_log_activity(config: dict, entry: dict) -> None:
    if not config.get("activity_log", True):
        return
    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        row = {"at": datetime.now().isoformat(timespec="seconds"), **entry}
        with AI_ACTIVITY_FILE.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")
        if AI_ACTIVITY_FILE.stat().st_size > 2_000_000:
            lines = AI_ACTIVITY_FILE.read_text(encoding="utf-8", errors="replace").splitlines()[-800:]
            AI_ACTIVITY_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")
    except Exception:
        pass


class _AgentStopped(Exception):
    """Raised when a run is cancelled before it can start its process."""


class AgentStore:
    """Per-agent OpenCode sessions for the AI terminal.

    Every todo and subtask owns an independent OpenCode session. Planning
    agents run with the read-only plan agent; subtask executors run with
    --auto behind a global lock so only one of them edits the project at a
    time. Requests wait for the lock instead of being rejected.
    """

    def __init__(self, path: Path, settle_pending: bool = True):
        self.path = path
        self.lock = threading.Lock()
        # Build agents run in parallel. Only agents whose instructions name a
        # file that another running agent is already touching wait for it.
        self.build_cond = threading.Condition()
        self.build_active = {}
        self.build_waiting = {}
        self.build_seq = 0
        self.running_agents = set()
        # A chat request spends a moment discovering models and preparing files
        # before it owns a worker. Esc must still land during that gap, so the
        # request is visible here from the moment it is accepted.
        self.starting_agents = set()
        self.build_max = max(1, int(os.environ.get("NEOTODO_AGENT_PARALLEL", "12") or 12))
        self.live_lock = threading.Lock()
        self.live = {}
        self.procs = {}
        self.procs_lock = threading.Lock()
        self.interrupts = set()
        # Per-todo file reads shared by every agent working on that todo.
        self.shared_files = {}
        self.shared_lock = threading.Lock()
        self.models_cache = None
        self.models_at = 0.0
        self.config_lock = threading.Lock()
        try:
            self.build_max = max(1, min(32, int(read_ai_config().get("max_parallel") or self.build_max)))
        except Exception:
            pass
        # Closing the app ends every agent turn; reopening it never restarts
        # an old instruction. The user writes a new one to start again.
        self.stopping = threading.Event()
        if settle_pending:
            # A previous process may have died mid-run. No turn survives an
            # app close, so every streaming placeholder is settled as
            # interrupted. Fork windows share this file but must not touch a
            # run the notebook is still working on, so only the notebook (or
            # a headless server) passes settle_pending=True.
            self._settle_all_pending()
            # Drop the legacy run journal so an old install cannot resume a turn.
            try:
                AGENT_RUNS_FILE.unlink(missing_ok=True)
            except Exception:
                pass

    @staticmethod
    def _settle_pending(messages: list) -> list:
        """Turn an orphaned streaming reply into a finished interrupted turn."""
        settled = []
        for message in messages if isinstance(messages, list) else []:
            if isinstance(message, dict) and message.get("role") == "assistant" and message.get("pending"):
                item = dict(message)
                text = str(item.get("content") or "").strip()
                item.pop("pending", None)
                item["content"] = (text + "\n\n（已中断）").strip() if text else "已中断。"
                # The board must read this as a stopped run, not a finished
                # one, so it never plays the completion ceremony for it.
                item["interrupted"] = True
                settled.append(item)
            else:
                settled.append(message)
        return settled

    def _load(self) -> dict:
        try:
            data = json.loads(self.path.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                data.setdefault("agents", {})
                return data
        except Exception:
            pass
        return {"agents": {}}

    def _settle_all_pending(self) -> None:
        """Settle every streaming reply left over by a killed app process."""
        try:
            with self.lock:
                data = self._load()
                changed = False
                for stored in data.get("agents", {}).values():
                    if not isinstance(stored, dict):
                        continue
                    messages = stored.get("messages")
                    if not isinstance(messages, list):
                        continue
                    settled = self._settle_pending(messages)
                    if settled != messages:
                        stored["messages"] = settled
                        changed = True
                if changed:
                    self._save(data)
        except Exception:
            pass

    def _save(self, data: dict) -> None:
        try:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            tmp = self.path.with_suffix(".tmp")
            tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            tmp.replace(self.path)
        except Exception:
            pass

    def copy_session(self, source_id: str, target_id: str) -> bool:
        """Carry a subtask's conversation into a forked todo's AI panel.

        The fork is a separate app, but the work should not start from a blank
        chat: the messages are copied to the new todo's agent id. Run markers,
        pending flags and local attachment lists are stripped so the new panel
        reads as finished history rather than a live run from another window.
        """
        source_key = str(source_id or "")
        target_key = str(target_id or "")
        if not source_key or not target_key:
            return False
        with self.lock:
            data = self._load()
            agents = data.setdefault("agents", {})
            source = agents.get(source_key)
            if not isinstance(source, dict):
                return False
            messages = source.get("messages")
            if not isinstance(messages, list) or not messages:
                return False
            copied = json.loads(json.dumps(source))
            copied["messages"] = [
                {key: value for key, value in message.items() if key not in ("pending", "live")}
                for message in copied.get("messages", [])
                if isinstance(message, dict)
            ]
            for key in ("opencode_session", "usage", "files", "live", "queued"):
                copied.pop(key, None)
            copied["mode"] = "chat"
            agents[target_key] = copied
            self._save(data)
            return True

    @staticmethod
    def _kill_group(process_group: int, force: bool = True) -> None:
        """Kill a whole agent session, including the tools it spawned."""
        if os.name != "posix" or not process_group:
            return
        try:
            os.killpg(int(process_group), signal.SIGKILL if force else signal.SIGTERM)
        except Exception:
            pass

    @staticmethod
    def _stop_process(process, force: bool = False) -> None:
        """Stop an agent process and the tools it started.

        Agent runs get their own session, so a pause also ends the shell
        commands OpenCode spawned instead of leaving them holding the pipe.
        """
        if process is None:
            return
        try:
            if process.poll() is not None:
                if force:
                    # The leader is gone but a background tool may still hold
                    # the session; sweep the group as well.
                    AgentStore._kill_group(process.pid, force=True)
                return
        except Exception:
            pass
        if os.name == "posix":
            try:
                os.killpg(os.getpgid(process.pid), signal.SIGKILL if force else signal.SIGTERM)
                return
            except Exception:
                pass
        try:
            if force:
                process.kill()
            else:
                process.terminate()
        except Exception:
            try:
                process.kill()
            except Exception:
                pass

    def _settle_stored(self, agent_id: str) -> None:
        """Mark any abandoned streaming reply as interrupted for one agent."""
        try:
            with self.lock:
                data = self._load()
                stored = data.get("agents", {}).get(agent_id)
                if not isinstance(stored, dict):
                    return
                messages = stored.get("messages")
                if not isinstance(messages, list):
                    return
                settled = self._settle_pending(messages)
                if settled != messages:
                    stored["messages"] = settled
                    self._save(data)
        except Exception:
            pass

    def shutdown(self) -> None:
        """Closing the app interrupts every agent; nothing resumes on restart."""
        self.stopping.set()
        with self.procs_lock:
            procs = list(self.procs.values())
            active = sorted(self.running_agents | self.starting_agents)
            # Workers treat this like a manual pause, so the reply they leave
            # behind is marked interrupted instead of finished.
            self.interrupts.update(active)
        # Queued build agents must not get a slot and start OpenCode while the
        # window is closing.
        with self.build_cond:
            for agent_id in list(self.build_waiting):
                self.interrupts.add(agent_id)
            self.build_waiting.clear()
            self.build_cond.notify_all()
        for process in procs:
            self._stop_process(process)
        # Give OpenCode a moment to exit; anything still alive is forced down
        # so the window does not hang on a stuck child.
        deadline = time.time() + 2.0
        for process in procs:
            try:
                process.wait(timeout=max(0.05, deadline - time.time()))
            except Exception:
                self._stop_process(process, force=True)
        # A worker that was between Popen and registration may have published
        # its process after the snapshot above: sweep until the table is quiet.
        while time.time() < deadline:
            with self.procs_lock:
                late = [p for p in self.procs.values() if p.poll() is None]
            if not late:
                break
            for process in late:
                self._stop_process(process, force=True)
            time.sleep(0.05)
        # A worker that was mid-turn may not get to write once the window is
        # gone, so settle those streaming turns here as well.
        drain = time.time() + 1.5
        while active and time.time() < drain:
            with self.procs_lock:
                if not (self.running_agents & set(active)):
                    break
            time.sleep(0.05)
        for agent_id in active:
            self._settle_stored(agent_id)
        try:
            AGENT_RUNS_FILE.unlink(missing_ok=True)
        except Exception:
            pass

    def _config(self) -> dict:
        with self.config_lock:
            return read_ai_config()

    def _save_config(self, config: dict) -> dict:
        with self.config_lock:
            clean = write_ai_config(config)
        self.models_cache = None
        self.models_at = 0.0
        self.build_max = max(1, min(32, int(clean.get("max_parallel") or 12)))
        return clean

    def _opencode_info(self) -> dict:
        path = shutil.which("opencode") or ""
        version = ""
        if path:
            try:
                process = subprocess.run(
                    [path, "--version"], capture_output=True, text=True, timeout=8,
                )
                version = (process.stdout or "").strip().splitlines()[-1][:40]
            except Exception:
                version = ""
        info = {
            "opencode": {"id": "opencode", "name": "OpenCode", "available": bool(path), "supported": True, "version": version, "path": path},
            "claude": {"id": "claude", "name": "Claude", "available": bool(shutil.which("claude")), "supported": False, "version": "", "path": shutil.which("claude") or ""},
            "codex": {"id": "codex", "name": "Codex", "available": bool(shutil.which("codex")), "supported": False, "version": "", "path": shutil.which("codex") or ""},
        }
        return info

    def _available_models(self) -> list:
        now = time.time()
        if self.models_cache is not None and now - self.models_at < 600:
            return self.models_cache
        config = self._config()
        opencode = shutil.which("opencode")
        models = []
        if opencode:
            try:
                process = subprocess.run(
                    [opencode, "models", "--standalone"],
                    capture_output=True,
                    text=True,
                    timeout=40,
                    env=ai_opencode_env(config),
                )
                models = [
                    line.strip()
                    for line in (process.stdout or "").splitlines()
                    if re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.:#/-]+", line.strip())
                ]
            except Exception:
                models = []
        # Custom provider rows are part of the picker even before discovery has
        # refreshed, so a freshly added endpoint is immediately selectable.
        for provider in config.get("providers", []):
            if not provider.get("enabled", True):
                continue
            for model_id in provider.get("models", []):
                candidate = f"{provider['id']}/{model_id}"
                if candidate not in models:
                    models.append(candidate)
        if not models:
            models = ["deepseek/deepseek-flash"]
        self.models_cache = models
        self.models_at = now
        return models

    @staticmethod
    def _configured_model() -> str:
        override = os.environ.get("NEOTODO_AGENT_MODEL") or ""
        if re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.:#/-]+", override):
            return override
        config = Path(
            os.environ.get("OPENCODE_CONFIG")
            or (Path.home() / ".config" / "opencode" / "opencode.jsonc")
        )
        try:
            text = config.read_text(encoding="utf-8")
            match = re.search(r'"model"\s*:\s*"([A-Za-z0-9_.-]+/[A-Za-z0-9_.:#/-]+)"', text)
            if match:
                return match.group(1)
        except Exception:
            pass
        return ""

    def _default_model(self, kind: str = "") -> str:
        models = self._available_models()
        config = self._config()
        candidates = []
        if kind:
            candidates.append(config["agent_models"].get(kind) or "")
        candidates.append(config.get("default_model") or "")
        candidates.append(self._configured_model())
        for candidate in candidates:
            if candidate and candidate in models:
                return candidate
        for model in models:
            if model.startswith("deepseek/"):
                return model
        return models[0] if models else "deepseek/deepseek-flash"

    def _enabled_models(self) -> list:
        models = self._available_models()
        config = self._config()
        enabled = config.get("enabled_models") or []
        if not enabled:
            return models
        wanted = set(enabled)
        for kind in AI_AGENT_KINDS:
            value = config["agent_models"].get(kind) or ""
            if value:
                wanted.add(value)
        wanted.add(self._default_model())
        filtered = [model for model in models if model in wanted]
        return filtered or models

    def _agent_defaults(self) -> dict:
        config = self._config()
        return {
            kind: {
                "model": self._default_model(kind),
                "mode": config["agent_modes"].get(kind) or ("build" if kind == "subtask" else "chat"),
            }
            for kind in AI_AGENT_KINDS
        }

    def _provider_list(self) -> list:
        config = self._config()
        providers = {}
        for model in self._available_models():
            provider_id = model.split("/")[0]
            entry = providers.setdefault(provider_id, {
                "id": provider_id,
                "name": "",
                "models": [],
                "custom": False,
                "enabled": True,
                "base_url": "",
                "api_key_set": False,
                "status": "ready",
            })
            entry["models"].append(model)
        for provider in config.get("providers", []):
            entry = providers.get(provider["id"]) or {
                "id": provider["id"],
                "name": provider.get("name") or provider["id"],
                "models": [],
                "custom": True,
                "enabled": provider.get("enabled", True),
                "base_url": provider.get("base_url") or "",
                "api_key_set": bool(provider.get("api_key")),
                "status": "api-key" if provider.get("api_key") else "key-required",
            }
            entry["custom"] = True
            entry["enabled"] = provider.get("enabled", True)
            entry["base_url"] = provider.get("base_url") or ""
            entry["api_key_set"] = bool(provider.get("api_key"))
            local = bool(re.match(r"^https?://(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(?::|/|$)", entry["base_url"]))
            entry["status"] = (
                "disabled" if not entry["enabled"]
                else ("local" if local else ("api-key" if entry["api_key_set"] else "key-required"))
            )
            entry["name"] = provider.get("name") or provider["id"]
            for model in provider.get("models", []):
                ref = f"{provider['id']}/{model}"
                if ref not in entry["models"]:
                    entry["models"].append(ref)
            providers[provider["id"]] = entry
        for entry in providers.values():
            entry["count"] = len(entry["models"])
            if not entry["name"]:
                entry["name"] = self._provider_for_model(f"{entry['id']}/model")
        return sorted(providers.values(), key=lambda item: (not item["custom"], item["id"]))

    def _activity_tail(self, limit: int = 60) -> list:
        try:
            lines = AI_ACTIVITY_FILE.read_text(encoding="utf-8", errors="replace").splitlines()
        except Exception:
            return []
        rows = []
        for line in lines[-600:]:
            try:
                item = json.loads(line)
            except Exception:
                continue
            if isinstance(item, dict):
                rows.append(item)
        return rows[-limit:]

    def _skill_roots(self) -> list:
        home = Path.home()
        return [
            (home / ".agents" / "skills", "global", "Global · Agents"),
            (home / ".claude" / "skills", "global", "Global · Claude"),
            (home / ".config" / "opencode" / "skills", "global", "Global · OpenCode"),
            (APP_DIR / ".agents" / "skills", "project", "Project · Agents"),
            (APP_DIR / ".claude" / "skills", "project", "Project · Claude"),
            (APP_DIR / ".opencode" / "skills", "project", "Project · OpenCode"),
        ]

    @staticmethod
    def _skill_meta(path: Path, skill_id: str, scope: str, source: str) -> dict:
        name = skill_id
        description = ""
        try:
            text = path.read_text(encoding="utf-8", errors="replace")[:12000]
        except Exception:
            text = ""
        match = re.match(r"^---\s*\n(.*?)\n---", text, re.S)
        if match:
            front = match.group(1)
            name_match = re.search(r"^name:\s*(.+?)\s*$", front, re.M)
            desc_match = re.search(r"^description:\s*(.+?)\s*$", front, re.M)
            if name_match:
                name = name_match.group(1).strip().strip("\"'")[:120]
            if desc_match:
                description = desc_match.group(1).strip().strip("\"'")[:500]
        if not description:
            body = re.sub(r"^---\s*\n.*?\n---", "", text, flags=re.S).strip()
            first = next((line.strip() for line in body.splitlines() if line.strip()), "")
            description = re.sub(r"^#+\s*", "", first)[:300]
        return {
            "id": skill_id,
            "name": name,
            "description": description,
            "scope": scope,
            "source": source,
            "path": str(path),
        }

    def _skill_list(self) -> list:
        skills = {}
        for root, scope, label in self._skill_roots():
            if not root.is_dir():
                continue
            try:
                files = list(root.glob("*.md"))[:100]
                files += list(root.glob("*/SKILL.md"))[:100]
                files += list(root.glob("*/*/SKILL.md"))[:100]
            except Exception:
                continue
            for path in files:
                if not path.is_file():
                    continue
                skill_id = path.parent.name if path.name == "SKILL.md" else path.stem
                if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]{0,63}", skill_id):
                    continue
                # Project skills come after global roots, so they overwrite.
                skills[skill_id] = self._skill_meta(path, skill_id, scope, label)
        return sorted(skills.values(), key=lambda item: (item["scope"] == "project", item["name"].lower()))

    def _config_payload(self) -> dict:
        config = self._config()
        return {
            "ok": True,
            "config": ai_public_config(config),
            "models": self._available_models(),
            "enabled_models": self._enabled_models(),
            "default_model": self._default_model(),
            "agent_defaults": self._agent_defaults(),
            "providers": self._provider_list(),
            "skills": self._skill_list(),
            "backends": self._opencode_info(),
            "activity": self._activity_tail(40),
            "paths": {
                "ai_config": str(AI_CONFIG_FILE),
                "opencode_config": str(AI_OPENCODE_CONFIG),
                "activity_log": str(AI_ACTIVITY_FILE),
                "data": str(DATA_DIR),
                "project_skills": str(APP_DIR / ".opencode" / "skills"),
                "global_skills": str(Path.home() / ".config" / "opencode" / "skills"),
            },
        }

    @staticmethod
    def _test_provider(row: dict) -> dict:
        base_url = str(row.get("base_url") or "").strip().rstrip("/")
        if not re.match(r"^https?://", base_url):
            return {"ok": False, "error": "Enter an http(s) Base URL"}
        api_key = str(row.get("api_key") or "").strip()
        headers = {"Accept": "application/json"}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        request = urllib.request.Request(f"{base_url}/models", headers=headers, method="GET")
        started = time.time()
        try:
            with urllib.request.urlopen(request, timeout=15) as response:
                payload = json.loads(response.read(2_000_000).decode("utf-8", errors="replace") or "{}")
            models = []
            for item in payload.get("data", []) if isinstance(payload, dict) else []:
                if isinstance(item, dict) and item.get("id"):
                    models.append(str(item["id"]))
            return {
                "ok": True,
                "models": models[:300],
                "count": len(models),
                "latency_ms": int((time.time() - started) * 1000),
            }
        except Exception as error:
            return {"ok": False, "error": str(error)[:300]}

    @staticmethod
    def _model_leaf(model: str) -> str:
        value = str(model or "")
        return value.split("/")[-1] if "/" in value else value

    @classmethod
    def _provider_for_model(cls, model: str) -> str:
        prefix = str(model or "").split("/")[0].lower() if "/" in str(model or "") else ""
        if prefix == "deepseek":
            return "DeepSeek"
        if prefix == "openai":
            return "OpenAI"
        if prefix in ("anthropic", "claude"):
            return "Anthropic"
        if prefix == "opencode":
            return "OpenCode"
        if prefix:
            return prefix.capitalize()
        return "AI"

    @staticmethod
    def _system_prompt(scope: dict, title: str, allow_edits: bool = False) -> str:
        kind = str(scope.get("kind") or "captain")
        category = str(scope.get("category") or "")
        todo = str(scope.get("todo") or "")
        subtask = str(scope.get("subtask") or "")
        context = str(scope.get("context") or "")
        base = (
            "You are an AI agent inside NeoTodo, a local GTK4/WebKit desktop todo app. "
            f"The project source is at {APP_DIR} on the user's current machine. "
            "The interface is HTML/CSS/JS; the backend is Python; the Linux shell is GTK4 + WebKitGTK; "
            "a Windows shell uses PySide6/Qt WebEngine. "
            "Be practical and concise. Use Markdown, complete code snippets, and exact file paths. "
            + "Platform rule: this task is Linux-first. Do not launch the Android emulator "
            "(android/run-emulator.sh, emulator, adb), do not run Gradle/Android builds, and do not "
            "edit android/**, windows_app.py, installer.iss or .github/workflows/release.yml. "
            "Windows and Android are updated together later in a separate platform-sync pass. "
            + (
                "You may read and edit files in the project to complete the instruction. Keep changes scoped."
                if allow_edits else
                "You are planning only: read what you need, but never edit files in this mode."
            )
        )
        if kind == "captain":
            role = "You are the project architect for the whole NeoTodo project."
        elif kind == "subtask":
            role = (
                f"You are the agent for the subtask '{subtask}' under todo '{todo}'"
                f"{f' in category {category}' if category else ''}."
            )
        else:
            role = (
                f"You are the architect for the todo '{todo}'"
                f"{f' in category {category}' if category else ''}. "
                "Plan the work and its subtasks."
            )
        return f"{base}\n\n{role}\n\nCurrent workspace: {context}"

    @classmethod
    def _build_prompt(cls, scope: dict, title: str, message: str) -> str:
        context = str(scope.get("context") or "")
        return (
            f"{cls._system_prompt(scope, title, True)}\n\n"
            f"Project root: {APP_DIR}\n"
            f"Current workspace: {context}\n\n"
            f"User instruction:\n{message}"
        )

    @staticmethod
    def _executor_prompt(scope: dict, title: str, message: str) -> str:
        subtask = str(scope.get("subtask") or title)
        todo = str(scope.get("todo") or "")
        category = str(scope.get("category") or "")
        context = str(scope.get("context") or "")
        return (
            "[NeoTodo crew executor]\n"
            f"You are the crew agent for the subtask '{subtask}'"
            f"{f' under todo {todo}' if todo else ''}"
            f"{f' in category {category}' if category else ''}.\n"
            f"Project root: {APP_DIR}\n"
            "Complete the user's instruction for this subtask. Keep edits scoped to this subtask; "
            "do not refactor unrelated modules or overlap other agents' work. Other agents may be handling "
            "other subtasks, so only touch files needed for this subtask. The user has approved automatic execution.\n"
            "Platform rule: Linux-first only. Do not start the Android emulator (android/run-emulator.sh, "
            "emulator, adb), do not run Gradle/Android builds, and do not edit android/**, windows_app.py, "
            "installer.iss or .github/workflows/release.yml; Windows and Android are synced later.\n\n"
            f"Current workspace: {context}\n\n"
            f"User instruction:\n{message}"
        )

    @staticmethod
    def _agent_folder(agent_id: str) -> Path:
        safe = re.sub(r"[^A-Za-z0-9_.-]+", "_", str(agent_id or "")).strip("._") or "agent"
        return AGENT_FILES_DIR / safe

    @classmethod
    def _clean_files(cls, agent_id: str, files: list) -> list:
        folder = cls._agent_folder(agent_id)
        cleaned = []
        seen = set()
        for item in files if isinstance(files, list) else []:
            if not isinstance(item, dict):
                continue
            name = Path(str(item.get("name") or "").replace("\\", "/")).name.strip()
            if not name or name in (".", "..") or name in seen:
                continue
            path = folder / name
            if not path.exists() or not path.is_file():
                continue
            seen.add(name)
            cleaned.append({
                "name": name,
                "size": int(item.get("size") or path.stat().st_size),
                "added_at": str(item.get("added_at") or ""),
            })
        return cleaned

    @staticmethod
    def _unique_file_name(name: str, taken: set) -> str:
        """Return a file name that is not already used by an attachment.

        Clipboard images reach the web UI under one generic name every time
        ("image.png" in WebKitGTK) and the store is keyed by name, so a second
        screenshot used to overwrite the one pasted before it. A numbered
        suffix keeps every pasted file instead of displacing it.
        """
        if name not in taken:
            return name
        stem = Path(name).stem or "file"
        suffix = Path(name).suffix
        index = 2
        candidate = f"{stem}-{index}{suffix}"
        while candidate in taken:
            index += 1
            candidate = f"{stem}-{index}{suffix}"
        return candidate

    @classmethod
    def _agent_file_args(cls, agent_id: str, agent: dict) -> tuple[list, list]:
        folder = cls._agent_folder(agent_id)
        args = []
        files = cls._clean_files(agent_id, agent.get("files") if isinstance(agent.get("files"), list) else [])
        for item in files:
            args += ["--file", str(folder / item["name"])]
        return args, files

    @staticmethod
    def _session_usage(session_id: str) -> dict:
        opencode = shutil.which("opencode")
        if not opencode or not session_id:
            return {}
        try:
            process = subprocess.run(
                [opencode, "session", "export", session_id, "--standalone"],
                capture_output=True,
                text=True,
                timeout=25,
            )
            data = json.loads(process.stdout or "{}")
            info = data.get("info") if isinstance(data.get("info"), dict) else {}
            tokens = info.get("tokens") if isinstance(info.get("tokens"), dict) else {}
            cache = tokens.get("cache") if isinstance(tokens.get("cache"), dict) else {}
            total = (
                int(tokens.get("input") or 0)
                + int(tokens.get("output") or 0)
                + int(tokens.get("reasoning") or 0)
            )
            context = 0
            for message in reversed(data.get("messages") or []):
                if not isinstance(message, dict) or message.get("type") != "assistant":
                    continue
                message_tokens = message.get("tokens") if isinstance(message.get("tokens"), dict) else {}
                message_cache = message_tokens.get("cache") if isinstance(message_tokens.get("cache"), dict) else {}
                context = int(message_tokens.get("input") or 0) + int(message_cache.get("read") or 0)
                break
            if not context:
                context = int(tokens.get("input") or 0) + int(cache.get("read") or 0)
            return {
                "tokens": total,
                "cost": round(float(info.get("cost") or 0), 6),
                "context": context,
                "cumulative": True,
            }
        except Exception:
            return {}

    def _update_live(self, agent_id: str, **changes) -> None:
        with self.live_lock:
            current = self.live.get(agent_id)
            if current is None:
                return
            current.update(changes)

    def _clear_live(self, agent_id: str) -> None:
        with self.live_lock:
            self.live.pop(agent_id, None)

    def _normalize_mode(self, value, kind: str) -> str:
        text = str(value or "")
        if text == "execute":
            text = "build"
        if text in ("chat", "build"):
            return text
        configured = (self._config().get("agent_modes") or {}).get(kind)
        if configured in ("chat", "build"):
            return configured
        return "build" if kind == "subtask" else "chat"

    def _cache_shared_read(self, key: str, root: Path, path: str, output) -> None:
        if not key or not path or output is None:
            return
        try:
            target = Path(path)
            if not target.is_absolute():
                target = root / target
            target = target.resolve()
            relative = target.relative_to(root.resolve())
        except Exception:
            return
        text = output if isinstance(output, str) else None
        if text is None:
            try:
                text = json.dumps(output, ensure_ascii=False, indent=2)
            except Exception:
                text = str(output)
        text = text.strip()
        if not text or len(text) > 200_000:
            return
        try:
            stat = target.stat()
        except Exception:
            return
        with self.shared_lock:
            files = self.shared_files.setdefault(key, {})
            files[str(relative)] = {
                "content": text,
                "mtime": stat.st_mtime,
                "size": stat.st_size,
                "at": time.time(),
            }
            if len(files) > 80:
                oldest = sorted(files.items(), key=lambda item: item[1].get("at", 0))[:-80]
                for name, _ in oldest:
                    files.pop(name, None)

    def _invalidate_shared_file(self, key: str, root: Path, path: str) -> None:
        if not key or not path:
            return
        try:
            target = Path(path)
            if not target.is_absolute():
                target = root / target
            relative = str(target.resolve().relative_to(root.resolve()))
        except Exception:
            return
        with self.shared_lock:
            self.shared_files.get(key, {}).pop(relative, None)

    def _shared_file_context(self, key: str, root: Path) -> str:
        with self.shared_lock:
            items = dict(self.shared_files.get(key) or {})
        if not items:
            return ""
        blocks = []
        total = 0
        root_resolved = root.resolve()
        for relative, item in sorted(items.items(), key=lambda entry: entry[1].get("at", 0), reverse=True):
            if len(blocks) >= 8 or total >= 18_000:
                break
            target = root_resolved / relative
            try:
                stat = target.stat()
            except Exception:
                continue
            if stat.st_mtime != item.get("mtime") or stat.st_size != item.get("size"):
                continue
            content = str(item.get("content") or "").strip()
            if not content:
                continue
            snippet = content[:3000]
            if len(content) > 3000:
                snippet += "\n… (truncated)"
            block = f"--- {relative} ---\n{snippet}"
            if total + len(block) > 18_000:
                break
            blocks.append(block)
            total += len(block)
        if not blocks:
            return ""
        return (
            "\n\nShared file context from sibling agents on this todo "
            "(these files were already read; reuse this instead of reading them again):\n"
            + "\n\n".join(blocks)
        )

    def _save_partial(self, agent_id: str, title: str, model: str, mode: str,
                      reply_text: str, process_text: str) -> None:
        """Persist an in-flight answer so a renderer/app crash cannot lose it."""
        if self.stopping.is_set():
            # Closing: the shutdown pass settles this turn as interrupted.
            return
        entry = {
            "role": "assistant",
            "content": str(reply_text or "")[-12_000:],
            "process": str(process_text or "")[-12_000:],
            "model": model,
            "pending": True,
        }
        with self.lock:
            data = self._load()
            stored = data.setdefault("agents", {}).setdefault(agent_id, {"messages": []})
            messages = stored.get("messages") if isinstance(stored.get("messages"), list) else []
            if messages and messages[-1].get("role") == "assistant" and messages[-1].get("pending"):
                messages[-1] = entry
            else:
                messages.append(entry)
            stored["messages"] = messages[-40:]
            stored["title"] = title
            stored["mode"] = mode
            stored["model"] = model
            self._save(data)

    @staticmethod
    def _project_key(scope: dict) -> str:
        raw = str(scope.get("project_folder") or "").strip()
        if not raw:
            return ""
        try:
            path = Path(raw).expanduser()
            return str(path.resolve()) if path.is_dir() else ""
        except Exception:
            return ""

    @staticmethod
    def _intended_paths(text: str) -> set:
        pattern = re.compile(
            r"(?<![\w.-])((?:[\w.-]+/)*[\w.-]+\.(?:py|js|mjs|cjs|ts|tsx|jsx|css|scss|html?|jsonc?|md|txt|ya?ml|toml|ini|sh|rs|go|java|kt|c|h|cpp|hpp|svg|xml|iss))",
            re.IGNORECASE,
        )
        found = set()
        for match in pattern.finditer(str(text or "")):
            value = match.group(1).replace("\\", "/").lstrip("./")
            if value and not value.startswith(".."):
                found.add(value)
        return found

    @staticmethod
    def _claim_key(value, project_dir=None) -> str:
        raw = str(value or "").strip()
        if not raw:
            return ""
        try:
            path = Path(raw)
            if project_dir is not None and path.is_absolute():
                try:
                    path = path.resolve().relative_to(Path(project_dir).resolve())
                except Exception:
                    pass
            return str(path).replace("\\", "/").lstrip("./")
        except Exception:
            return raw.replace("\\", "/").lstrip("./")

    def _acquire_build_slot(self, agent_id: str, project_key: str, intended: set) -> bool:
        """Join the FIFO queue and start when a slot and files are free.

        Up to build_max agents run together. Queue order is otherwise strict,
        but a job blocked by a real file conflict does not stall the whole
        line: later jobs whose files are free may start first.
        """
        with self.build_cond:
            if agent_id not in self.build_waiting and agent_id not in self.build_active:
                self.build_seq += 1
                self.build_waiting[agent_id] = {
                    "project": project_key,
                    "files": set(intended),
                    "seq": self.build_seq,
                    "requested": time.time(),
                }
            while True:
                if agent_id not in self.build_waiting:
                    # Cancelled while queued (Esc).
                    self.interrupts.discard(agent_id)
                    return False
                if self.stopping.is_set() or agent_id in self.interrupts:
                    self.build_waiting.pop(agent_id, None)
                    self.interrupts.discard(agent_id)
                    self.build_cond.notify_all()
                    return False
                ordered = sorted(self.build_waiting.items(), key=lambda item: item[1].get("seq", 0))
                runnable = None
                for other_id, entry in ordered:
                    if len(self.build_active) >= self.build_max:
                        break
                    blocked = False
                    for active in self.build_active.values():
                        if active.get("project") != entry.get("project"):
                            continue
                        if active.get("files", set()) & entry.get("files", set()):
                            blocked = True
                            break
                    if not blocked:
                        runnable = other_id
                        break
                if runnable == agent_id:
                    entry = self.build_waiting.pop(agent_id)
                    self.build_active[agent_id] = {
                        "project": project_key,
                        "files": set(intended),
                        "conflicts": set(),
                        "started": time.time(),
                    }
                    self.build_cond.notify_all()
                    return True
                self.build_cond.wait(timeout=1.0)

    def _claim_build_file(self, agent_id: str, project_dir, value) -> None:
        key = self._claim_key(value, project_dir)
        if not key:
            return
        with self.build_cond:
            entry = self.build_active.get(agent_id)
            if not entry:
                return
            for other_id, other in self.build_active.items():
                if other_id == agent_id or other.get("project") != entry.get("project"):
                    continue
                if key in other.get("files", set()):
                    entry["conflicts"].add(key)
                    other["conflicts"].add(key)
            entry["files"].add(key)
            self.build_cond.notify_all()

    def _release_build_slot(self, agent_id: str) -> set:
        with self.build_cond:
            entry = self.build_active.pop(agent_id, None)
            self.build_cond.notify_all()
            return set(entry.get("conflicts", set())) if entry else set()

    def _finish_agent_error(self, agent_id: str, title: str, model: str, mode: str, error: str) -> None:
        with self.lock:
            data = self._load()
            stored = data.setdefault("agents", {}).setdefault(agent_id, {"messages": []})
            messages = stored.get("messages") if isinstance(stored.get("messages"), list) else []
            entry = {
                "role": "assistant",
                "content": f"（错误：{error}）",
                "process": "",
                "model": model,
            }
            if messages and messages[-1].get("role") == "assistant" and messages[-1].get("pending"):
                messages[-1] = entry
            else:
                messages.append(entry)
            stored["messages"] = messages[-40:]
            stored["title"] = title
            stored["mode"] = mode
            stored["model"] = model
            self._save(data)

    def queue_status(self, agent_id: str) -> tuple:
        with self.build_cond:
            if agent_id not in self.build_waiting:
                return False, 0, len(self.build_waiting)
            ordered = sorted(self.build_waiting, key=lambda key: self.build_waiting[key].get("seq", 0))
            return True, ordered.index(agent_id) + 1, len(ordered)

    def _run_opencode(self, agent_id: str, agent: dict, title: str, scope: dict,
                      message: str, model: str, mode: str,
                      file_args: list | None = None,
                      partial_cb=None) -> tuple[str, str, str, dict, bool]:
        opencode = shutil.which("opencode")
        if not opencode:
            raise RuntimeError(
                "OpenCode CLI not found. Install opencode and make sure it is on PATH."
            )
        # A linked project folder becomes the agent's workspace, so subtasks
        # can read that project's files as their work content.
        project_folder = str(scope.get("project_folder") or "").strip()
        project_dir = Path(project_folder).expanduser() if project_folder else None
        linked_dir = project_dir if project_dir is not None and project_dir.is_dir() else None
        cwd = agent_workspace(project_folder)
        if not cwd.exists():
            raise RuntimeError(f"Agent project directory not found: {cwd}")
        project_key = str(linked_dir.resolve()) if linked_dir is not None else ""
        shared_key = f"{str(scope.get('todo_id') or '')}|{project_key}" if project_key else ""
        if mode == "build":
            if str(scope.get("kind") or "") == "subtask":
                prompt = self._executor_prompt(scope, title, message)
            else:
                prompt = self._build_prompt(scope, title, message)
        else:
            prompt = f"{self._system_prompt(scope, title)}\n\nUser message:\n{message}"
        if linked_dir is not None:
            files = list_folder_files(str(linked_dir), limit=120)
            listing = "\n".join(f"- {name}" for name in files) if files else "(no readable files found)"
            prompt += (
                f"\n\nActive project folder: {linked_dir}\n"
                "Read files from this folder as the work content for this todo/subtask. "
                "Keep outputs inside this folder when the user asks you to write files.\n"
                f"Files:\n{listing}"
            )
        if shared_key:
            prompt += self._shared_file_context(shared_key, linked_dir)
        # Settings → AI custom instructions are appended to every run, so they
        # apply to chat, planning and executor agents alike.
        ai_config = self._config()
        extra_instructions = str(ai_config.get("custom_instructions") or "").strip()
        if extra_instructions:
            prompt += (
                "\n\nNeoTodo AI instructions (Settings → AI):\n"
                + extra_instructions[:20000]
            )
        session_id = str(agent.get("opencode_session") or "")
        command = [
            opencode, "run", "--standalone", "--format", "json",
            "--title", f"NeoTodo · {title}",
        ]
        line_buffer = shutil.which("stdbuf")
        if line_buffer:
            command = [line_buffer, "-oL"] + command
        if model and "/" in model:
            command += ["--model", model]
        if mode == "build":
            command += ["--auto"]
        else:
            command += ["--agent", "plan"]
        if session_id:
            command += ["--session", session_id]
        if file_args:
            command += list(file_args)
        command.append(prompt)

        with self.live_lock:
            self.live[agent_id] = {
                "process": "",
                "text": "",
                "usage": {"tokens": 0, "cost": 0.0, "context": 0},
                "started": time.time(),
                "model": model,
                "mode": mode,
            }
        texts = []
        process_lines = []
        raw_lines = []
        new_session = session_id
        usage = {"tokens": 0, "cost": 0.0, "context": 0}
        process = None
        last_partial_save = 0.0
        try:
            # A run may have been paused (or the app may be closing) while
            # this thread waited for a build slot. Never start OpenCode then.
            with self.procs_lock:
                cancelled = self.stopping.is_set() or agent_id in self.interrupts
                self.interrupts.discard(agent_id)
            if cancelled:
                raise _AgentStopped()
            process = subprocess.Popen(
                command,
                cwd=str(cwd),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                start_new_session=(os.name == "posix"),
                env=ai_opencode_env(ai_config),
            )
            with self.procs_lock:
                self.procs[agent_id] = process
                # Closing the app or pausing during Popen must not leave a
                # fresh OpenCode process running behind us.
                cancelled = self.stopping.is_set() or agent_id in self.interrupts
                self.interrupts.discard(agent_id)
            if cancelled:
                self._stop_process(process, force=True)
                raise _AgentStopped()
            deadline = time.time() + max(60, int(ai_config.get("timeout_minutes") or 15) * 60)
            assert process.stdout is not None
            for line in process.stdout:
                if time.time() > deadline:
                    self._stop_process(process, force=True)
                    raise RuntimeError(
                        f"The agent timed out after {max(1, int(ai_config.get('timeout_minutes') or 15))} minutes."
                    )
                line = line.strip()
                if not line:
                    continue
                try:
                    event = json.loads(line)
                except Exception:
                    raw_lines.append(line)
                    continue
                event_session = event.get("sessionID") or event.get("sessionId")
                if event_session:
                    new_session = str(event_session)
                part = event.get("part") if isinstance(event.get("part"), dict) else {}
                event_type = event.get("type")
                if event_type == "text":
                    text = part.get("text")
                    if isinstance(text, str) and text.strip():
                        texts.append(text.strip())
                        live_text = "\n\n".join(texts[-6:])[-12_000:]
                        self._update_live(agent_id, text=live_text)
                        now = time.time()
                        if partial_cb and now - last_partial_save > 1.0:
                            last_partial_save = now
                            partial_cb(live_text, "\n".join(process_lines)[-12_000:])
                elif event_type == "tool_use":
                    tool = str(part.get("tool") or "tool")
                    state = part.get("state") if isinstance(part.get("state"), dict) else {}
                    tool_input = state.get("input") if isinstance(state.get("input"), dict) else {}
                    command_text = tool_input.get("command")
                    path = tool_input.get("filePath") or tool_input.get("path") or tool_input.get("file")
                    if tool == "shell" and command_text:
                        process_lines.append(f"$ {command_text}")
                    elif path:
                        process_lines.append(f"→ {tool} {path}")
                    else:
                        process_lines.append(f"→ {tool}")
                    output = state.get("output")
                    if path and tool in ("write", "edit", "patch", "multiedit", "apply_patch"):
                        self._claim_build_file(agent_id, project_dir, path)
                    if shared_key and path:
                        if tool in ("read", "view"):
                            self._cache_shared_read(shared_key, project_dir, path, output)
                        elif tool in ("write", "edit", "patch", "multiedit", "apply_patch"):
                            self._invalidate_shared_file(shared_key, project_dir, path)
                    if output:
                        clean = re.sub(r"\x1b\[[0-9;]*m", "", str(output)).strip()
                        if clean:
                            process_lines.append("  " + "\n  ".join(clean.splitlines()[:8])[:700])
                    process_text = "\n".join(process_lines)[-12_000:]
                    self._update_live(agent_id, process=process_text)
                    now = time.time()
                    if partial_cb and now - last_partial_save > 1.0:
                        last_partial_save = now
                        partial_cb("\n\n".join(texts[-6:])[-12_000:], process_text)
                elif event_type == "step_finish":
                    tokens = part.get("tokens") if isinstance(part.get("tokens"), dict) else {}
                    try:
                        usage["tokens"] += (
                            int(tokens.get("input") or 0)
                            + int(tokens.get("output") or 0)
                            + int(tokens.get("reasoning") or 0)
                        )
                        usage["context"] = max(usage["context"], int(tokens.get("input") or 0))
                    except (TypeError, ValueError):
                        pass
                    try:
                        usage["cost"] += float(part.get("cost") or 0)
                    except (TypeError, ValueError):
                        pass
                    self._update_live(agent_id, usage=dict(usage))
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                self._stop_process(process, force=True)
                process.wait(timeout=5)
        finally:
            try:
                if process is not None and process.stdout is not None:
                    process.stdout.close()
            except Exception:
                pass
            with self.procs_lock:
                self.procs.pop(agent_id, None)
                interrupted = agent_id in self.interrupts
                self.interrupts.discard(agent_id)
            # Even a finished agent must not leave a background tool behind:
            # every child/grandchild lives in this run's session group.
            if process is not None and os.name == "posix":
                self._kill_group(process.pid, force=True)
            reply = "\n\n".join(texts[-6:]).strip()
            if interrupted:
                reply = (reply + "\n\n(已打断)").strip() if reply else "已打断。"
            elif not reply:
                fallback = "\n".join(raw_lines).strip()
                fallback = re.sub(r"\x1b\[[0-9;]*m", "", fallback)
                code = process.returncode if process else "?"
                reply = fallback[-4000:] or f"The agent exited with code {code}."
            if not interrupted and process is not None and process.returncode not in (0, None) and not texts:
                reply = f"{reply}\n\n(OpenCode exit code {process.returncode})"
            self._clear_live(agent_id)
        exported = self._session_usage(new_session)
        if exported:
            usage = exported
        return reply[-20000:], new_session, "\n".join(process_lines)[-12000:], usage, interrupted

    def _spawn_run(self, agent_id: str, title: str, scope: dict, message: str,
                   model: str, mode: str, file_args: list | None, history: list) -> None:
        """Run one agent turn in a worker thread."""
        def save_partial(reply_text, process_text):
            self._save_partial(agent_id, title, model, mode, reply_text, process_text)

        def worker():
            started_at = time.time()
            try:
                with self.lock:
                    agent_state = (self._load().get("agents", {}) or {}).get(agent_id) or {}
                if not isinstance(agent_state, dict):
                    agent_state = {}
                ai_log_activity(self._config(), {
                    "event": "start",
                    "agent": agent_id,
                    "title": title,
                    "model": model,
                    "mode": mode,
                })
                conflicts = set()
                interrupted = False
                try:
                    if self.stopping.is_set():
                        raise _AgentStopped()
                    if mode == "build":
                        project_key = self._project_key(scope)
                        intended = self._intended_paths(f"{title}\n{message}")
                        if not self._acquire_build_slot(agent_id, project_key, intended):
                            reply, opencode_session, process_text = "已打断。", "", ""
                            usage = {"tokens": 0, "cost": 0.0, "context": 0}
                            interrupted = True
                        else:
                            try:
                                reply, opencode_session, process_text, usage, interrupted = self._run_opencode(
                                    agent_id, agent_state, title, scope, message, model, mode,
                                    file_args, save_partial,
                                )
                            finally:
                                conflicts = self._release_build_slot(agent_id)
                    else:
                        reply, opencode_session, process_text, usage, interrupted = self._run_opencode(
                            agent_id, agent_state, title, scope, message, model, mode,
                            file_args, save_partial,
                        )
                    if conflicts:
                        reply = (reply + "\n\n(注意：以下文件与并行 agent 同时修改，请检查是否冲突："
                                 + ", ".join(sorted(conflicts)) + "）").strip()
                    if self.stopping.is_set():
                        # Closing the app ends this turn. Keep what the agent
                        # already said, but mark it interrupted so the board
                        # never treats it as a finished run.
                        reply = (reply + "\n\n（已中断）").strip() if reply else "已中断。"
                        interrupted = True
                    assistant = {
                        "role": "assistant",
                        "content": reply,
                        "process": process_text,
                        "model": model,
                        "usage": {
                            "tokens": int(usage.get("tokens") or 0),
                            "cost": round(float(usage.get("cost") or 0), 6),
                            "context": int(usage.get("context") or 0),
                        },
                    }
                    # A run the user paused is not a finished run: the board
                    # must not play the completion ceremony for it.
                    if interrupted:
                        assistant["interrupted"] = True
                    user_entry = {"role": "user", "content": message}
                    updated = (history + [user_entry, assistant])[-40:]
                except _AgentStopped:
                    # Paused (or closing) before OpenCode could start: the
                    # turn still gets an interrupted answer, no error and no
                    # restart of the old instruction.
                    reply, opencode_session, process_text = (
                        "已中断。" if self.stopping.is_set() else "已打断。"
                    ), "", ""
                    usage = {"tokens": 0, "cost": 0.0, "context": 0}
                    interrupted = True
                    assistant = {
                        "role": "assistant",
                        "content": reply,
                        "process": process_text,
                        "model": model,
                        "usage": dict(usage),
                        "interrupted": True,
                    }
                    user_entry = {"role": "user", "content": message}
                    updated = (history + [user_entry, assistant])[-40:]
                except Exception as error:
                    if self.stopping.is_set():
                        # Closing: never leave a streaming turn behind.
                        self._settle_stored(agent_id)
                    else:
                        self._finish_agent_error(agent_id, title, model, mode, str(error))
                    ai_log_activity(self._config(), {
                        "event": "error",
                        "agent": agent_id,
                        "title": title,
                        "model": model,
                        "mode": mode,
                        "seconds": int(time.time() - started_at),
                        "error": str(error)[:500],
                    })
                    return
                with self.lock:
                    data = self._load()
                    stored = data.setdefault("agents", {}).setdefault(agent_id, {"messages": []})
                    stored["title"] = title
                    stored["messages"] = updated
                    stored["updated_at"] = datetime.now().isoformat(timespec="seconds")
                    stored["mode"] = mode
                    stored["model"] = model
                    if opencode_session:
                        stored["opencode_session"] = opencode_session
                    previous = stored.get("usage") if isinstance(stored.get("usage"), dict) else {}
                    if usage.get("cumulative"):
                        stored["usage"] = {
                            "tokens": int(usage.get("tokens") or 0),
                            "cost": round(float(usage.get("cost") or 0), 6),
                            "context": int(usage.get("context") or 0),
                        }
                    else:
                        try:
                            total_tokens = int(previous.get("tokens") or 0) + int(usage.get("tokens") or 0)
                            total_cost = float(previous.get("cost") or 0) + float(usage.get("cost") or 0)
                        except (TypeError, ValueError):
                            total_tokens, total_cost = usage.get("tokens", 0), usage.get("cost", 0)
                        stored["usage"] = {
                            "tokens": total_tokens,
                            "cost": round(total_cost, 6),
                            "context": usage.get("context") or previous.get("context") or 0,
                        }
                    data["agents"][agent_id] = stored
                    self._save(data)
                    ai_log_activity(self._config(), {
                        "event": "interrupted" if interrupted else "finish",
                        "agent": agent_id,
                        "title": title,
                        "model": model,
                        "mode": mode,
                        "seconds": int(time.time() - started_at),
                        "tokens": int(usage.get("tokens") or 0),
                        "cost": round(float(usage.get("cost") or 0), 6),
                    })
            finally:
                # No run survives the window: no journal, no restart, and no
                # stale pause flag that could cancel the next instruction.
                with self.procs_lock:
                    self.running_agents.discard(agent_id)
                    self.interrupts.discard(agent_id)
                with self.live_lock:
                    self.live.pop(agent_id, None)

        with self.procs_lock:
            starting = not self.stopping.is_set()
            if starting:
                self.running_agents.add(agent_id)
        if not starting:
            # Shutdown won the race: settle the placeholder instead of
            # leaving a pending turn or starting a worker.
            self._settle_stored(agent_id)
            return
        threading.Thread(target=worker, daemon=True).start()

    def action(self, payload: dict) -> dict:
        name = payload.get("action")
        if name == "list":
            with self.lock:
                data = self._load()
            return {"ok": True, "agents": data.get("agents", {})}
        if name == "config":
            return self._config_payload()
        if name == "refresh_models":
            self.models_cache = None
            self.models_at = 0.0
            return self._config_payload()
        if name == "set_config":
            patch = payload.get("config") if isinstance(payload.get("config"), dict) else {}
            current = self._config()
            for key in (
                "default_agent", "default_model", "default_mode", "enabled_models",
                "notifications", "notification_sound", "auto_attach_note", "save_chats",
                "custom_instructions", "environment", "activity_log", "timeout_minutes",
                "max_parallel", "commands",
            ):
                if key in patch:
                    current[key] = patch[key]
            for key in ("agent_models", "agent_modes"):
                if isinstance(patch.get(key), dict):
                    current[key] = {**current.get(key, {}), **patch[key]}
            self._save_config(current)
            return self._config_payload()
        if name == "save_provider":
            row = payload.get("provider") if isinstance(payload.get("provider"), dict) else {}
            provider_id = str(row.get("id") or "").strip().lower()
            if not AI_PROVIDER_ID_RE.match(provider_id):
                return {"ok": False, "error": "Provider id must be lowercase letters, numbers or dashes"}
            current = self._config()
            providers = list(current.get("providers") or [])
            existing = next((item for item in providers if item.get("id") == provider_id), None)
            api_key = row.get("api_key")
            if not isinstance(api_key, str):
                api_key = ""
            if not api_key and existing and not row.get("clear_api_key"):
                api_key = str(existing.get("api_key") or "")
            candidate = {
                "id": provider_id,
                "name": row.get("name") or provider_id,
                "base_url": row.get("base_url") or "",
                "api_key": api_key,
                "models": row.get("models") if isinstance(row.get("models"), list) else [],
                "enabled": row.get("enabled") is not False,
            }
            if existing:
                providers = [candidate if item.get("id") == provider_id else item for item in providers]
            else:
                providers.append(candidate)
            current["providers"] = providers
            # New BYOK models join a curated list automatically, matching the
            # plugin's behavior. A still-empty list keeps meaning "everything".
            if current.get("enabled_models"):
                enabled = list(current["enabled_models"])
                for model_id in candidate["models"]:
                    ref = f"{provider_id}/{model_id}"
                    if ref not in enabled:
                        enabled.append(ref)
                current["enabled_models"] = enabled
            cleaned = self._save_config(current)
            added = [item for item in cleaned.get("providers", []) if item.get("id") == provider_id]
            if not added:
                return {"ok": False, "error": "Add a Base URL and at least one model id"}
            return self._config_payload()
        if name == "remove_provider":
            provider_id = str(payload.get("provider_id") or "").strip().lower()
            current = self._config()
            current["providers"] = [item for item in current.get("providers", []) if item.get("id") != provider_id]
            self._save_config(current)
            return self._config_payload()
        if name == "test_provider":
            row = payload.get("provider") if isinstance(payload.get("provider"), dict) else {}
            provider_id = str(row.get("id") or "").strip().lower()
            if provider_id:
                existing = next(
                    (item for item in self._config().get("providers", []) if item.get("id") == provider_id),
                    None,
                )
                if existing:
                    merged = dict(existing)
                    for key in ("name", "base_url", "api_key"):
                        value = row.get(key)
                        if isinstance(value, str) and value.strip():
                            merged[key] = value
                    row = merged
            result = self._test_provider(row)
            return {**result, "ok": result.get("ok", False)}
        if name == "clear_activity":
            try:
                AI_ACTIVITY_FILE.write_text("", encoding="utf-8")
            except Exception:
                pass
            return {**self._config_payload(), "ok": True}
        if name == "reset_config":
            self._save_config({})
            return self._config_payload()
        if name == "open_skill_folder":
            raw = str(payload.get("path") or "")
            try:
                candidate = Path(raw).expanduser().resolve()
            except Exception:
                return {"ok": False, "error": "Invalid skill path"}
            roots = [root.expanduser().resolve() for root, _scope, _label in self._skill_roots()]
            allowed = any(candidate == root or root in candidate.parents for root in roots)
            if not allowed:
                return {"ok": False, "error": "That skill is outside the known skill folders"}
            folder = candidate.parent if candidate.is_file() else candidate
            if candidate.name == "skills" and not folder.exists():
                try:
                    folder.mkdir(parents=True, exist_ok=True)
                except Exception:
                    pass
            try:
                if sys.platform == "win32":
                    os.startfile(str(folder))
                elif sys.platform == "darwin":
                    subprocess.Popen(["open", str(folder)], start_new_session=True)
                else:
                    subprocess.Popen(
                        ["xdg-open", str(folder)], start_new_session=True,
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                    )
            except Exception as error:
                return {"ok": False, "error": str(error)}
            return {"ok": True, "folder": str(folder)}
        if name == "open_ai_folder":
            try:
                if sys.platform == "win32":
                    os.startfile(str(DATA_DIR))
                elif sys.platform == "darwin":
                    subprocess.Popen(["open", str(DATA_DIR)], start_new_session=True)
                else:
                    subprocess.Popen(
                        ["xdg-open", str(DATA_DIR)], start_new_session=True,
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                    )
            except Exception:
                pass
            return {**self._config_payload(), "ok": True}
        if name == "models":
            return {
                "ok": True,
                "models": self._enabled_models(),
                "all_models": self._available_models(),
                "default_model": self._default_model(),
                "agent_defaults": self._agent_defaults(),
            }
        if name == "get":
            agent_id = str(payload.get("agent_id") or "")
            if not agent_id:
                return {"ok": False, "error": "Missing agent"}
            kind = "subtask" if agent_id.startswith("subtask:") else ("todo" if agent_id.startswith("todo:") else "captain")
            with self.lock:
                data = self._load()
                agent = data.get("agents", {}).get(agent_id) or {"messages": []}
            default_model = self._default_model(kind)
            model = agent.get("model") or default_model
            mode = self._normalize_mode(agent.get("mode"), kind)
            with self.live_lock:
                live = dict(self.live.get(agent_id) or {})
            if not agent.get("usage") and agent.get("opencode_session") and not live:
                exported = self._session_usage(str(agent.get("opencode_session") or ""))
                if exported:
                    agent["usage"] = {
                        "tokens": int(exported.get("tokens") or 0),
                        "cost": round(float(exported.get("cost") or 0), 6),
                        "context": int(exported.get("context") or 0),
                    }
                    with self.lock:
                        fresh = self._load()
                        stored = fresh.setdefault("agents", {}).setdefault(agent_id, {"messages": []})
                        if not stored.get("usage"):
                            stored["usage"] = agent["usage"]
                            fresh["agents"][agent_id] = stored
                            self._save(fresh)
            queued, queue_position, queue_total = self.queue_status(agent_id)
            with self.procs_lock:
                running = agent_id in self.running_agents
            return {
                "ok": True,
                "agent": agent,
                "running": running,
                "queued": queued,
                "queue_position": queue_position,
                "queue_total": queue_total,
                "provider": self._provider_for_model(model),
                "model": model,
                "mode": mode,
                "files": self._clean_files(agent_id, agent.get("files") if isinstance(agent.get("files"), list) else []),
                "models": self._enabled_models(),
                "default_model": default_model,
                "agent_defaults": self._agent_defaults(),
                "live": live,
            }
        if name == "set_model":
            agent_id = str(payload.get("agent_id") or "")
            model = str(payload.get("model") or "")
            if not agent_id or model not in self._available_models():
                return {"ok": False, "error": "Unknown model"}
            with self.lock:
                data = self._load()
                stored = data.setdefault("agents", {}).setdefault(agent_id, {"messages": []})
                stored["model"] = model
                self._save(data)
            return {
                "ok": True,
                "model": model,
                "provider": self._provider_for_model(model),
            }
        if name == "set_mode":
            agent_id = str(payload.get("agent_id") or "")
            mode = str(payload.get("mode") or "")
            if not agent_id or mode not in ("chat", "build"):
                return {"ok": False, "error": "Unknown mode"}
            with self.lock:
                data = self._load()
                stored = data.setdefault("agents", {}).setdefault(agent_id, {"messages": []})
                stored["mode"] = mode
                self._save(data)
            return {"ok": True, "mode": mode}
        if name == "add_paths":
            agent_id = str(payload.get("agent_id") or "")
            paths = payload.get("paths") if isinstance(payload.get("paths"), list) else []
            if not agent_id or not paths:
                return {"ok": False, "error": "Missing files"}
            folder = self._agent_folder(agent_id)
            try:
                folder.mkdir(parents=True, exist_ok=True)
            except Exception as error:
                return {"ok": False, "error": f"Could not create the file store: {error}"}
            with self.lock:
                data = self._load()
                stored = data.setdefault("agents", {}).setdefault(agent_id, {"messages": []})
                metas = self._clean_files(agent_id, stored.get("files") if isinstance(stored.get("files"), list) else [])
                total = sum(int(item.get("size") or 0) for item in metas)
                taken = {str(item.get("name") or "") for item in metas}
                added = []
                for index, raw_path in enumerate(paths[:20]):
                    try:
                        source = Path(str(raw_path)).expanduser()
                        if not source.is_file():
                            continue
                        raw = source.read_bytes()
                        name = source.name
                    except Exception:
                        continue
                    if not raw or len(raw) > 10_000_000:
                        continue
                    name = Path(name.replace("\\", "/")).name.strip()
                    if not name or name in (".", ".."):
                        name = f"file-{index + 1}"
                    if len(metas) >= 20:
                        continue
                    if total + len(raw) > 50_000_000:
                        continue
                    # Keep every pasted file: two screenshots copied minutes
                    # apart share the same name, and replacing by name dropped
                    # the earlier one.
                    name = self._unique_file_name(name, taken)
                    target = folder / name
                    try:
                        target.write_bytes(raw)
                    except Exception:
                        continue
                    total += len(raw)
                    taken.add(name)
                    metas.append({"name": name, "size": len(raw), "added_at": datetime.now().isoformat(timespec="seconds")})
                    added.append(name)
                stored["files"] = metas
                self._save(data)
            return {"ok": True, "files": metas, "added": added}
        if name == "add_files":
            agent_id = str(payload.get("agent_id") or "")
            attachments = payload.get("attachments") if isinstance(payload.get("attachments"), list) else []
            if not agent_id or not attachments:
                return {"ok": False, "error": "Missing files"}
            folder = self._agent_folder(agent_id)
            try:
                folder.mkdir(parents=True, exist_ok=True)
            except Exception as error:
                return {"ok": False, "error": f"Could not create the file store: {error}"}
            with self.lock:
                data = self._load()
                stored = data.setdefault("agents", {}).setdefault(agent_id, {"messages": []})
                metas = self._clean_files(agent_id, stored.get("files") if isinstance(stored.get("files"), list) else [])
                total = sum(int(item.get("size") or 0) for item in metas)
                taken = {str(item.get("name") or "") for item in metas}
                added = []
                for index, item in enumerate(attachments[:20]):
                    if not isinstance(item, dict):
                        continue
                    name = Path(str(item.get("name") or f"file-{index + 1}").replace("\\", "/")).name.strip()
                    raw_data = item.get("data")
                    if not name or name in (".", "..") or not isinstance(raw_data, str) or not raw_data:
                        continue
                    try:
                        raw = base64.b64decode(raw_data)
                    except Exception:
                        continue
                    if not raw or len(raw) > 10_000_000:
                        continue
                    if len(metas) >= 20:
                        continue
                    if total + len(raw) > 50_000_000:
                        continue
                    # Clipboard pastes reuse one generic file name, so give the
                    # new arrival its own name instead of overwriting the last
                    # attachment.
                    name = self._unique_file_name(name, taken)
                    target = folder / name
                    try:
                        target.write_bytes(raw)
                    except Exception:
                        continue
                    total += len(raw)
                    taken.add(name)
                    metas.append({"name": name, "size": len(raw), "added_at": datetime.now().isoformat(timespec="seconds")})
                    added.append(name)
                stored["files"] = metas
                self._save(data)
            return {"ok": True, "files": metas, "added": added}
        if name == "remove_file":
            agent_id = str(payload.get("agent_id") or "")
            name = Path(str(payload.get("name") or "").replace("\\", "/")).name.strip()
            if not agent_id or not name or name in (".", ".."):
                return {"ok": False, "error": "Missing file"}
            folder = self._agent_folder(agent_id)
            target = folder / name
            try:
                target.unlink(missing_ok=True)
            except Exception:
                pass
            with self.lock:
                data = self._load()
                stored = data.setdefault("agents", {}).setdefault(agent_id, {"messages": []})
                metas = self._clean_files(agent_id, stored.get("files") if isinstance(stored.get("files"), list) else [])
                stored["files"] = [m for m in metas if m["name"] != name]
                self._save(data)
            return {"ok": True, "files": stored["files"]}
        if name == "clear":
            agent_id = str(payload.get("agent_id") or "")
            if not agent_id:
                return {"ok": False, "error": "Missing agent"}
            with self.lock:
                data = self._load()
                data.get("agents", {}).pop(agent_id, None)
                self._save(data)
            return {"ok": True, "agents": data.get("agents", {})}
        if name == "running":
            # The visible fans follow the backend, not only the local stamps,
            # so a run queued in another window still shows up here.
            with self.procs_lock:
                active = sorted(self.running_agents)
            with self.build_cond:
                waiting = sorted(self.build_waiting)
            return {"ok": True, "running": active, "queued": waiting}
        if name == "interrupt":
            agent_id = str(payload.get("agent_id") or "").strip()
            if not agent_id:
                return {"ok": False, "error": "Missing agent"}
            with self.procs_lock:
                process = self.procs.get(agent_id)
                if process is not None and process.poll() is not None:
                    process = None
                running = agent_id in self.running_agents or agent_id in self.starting_agents
                # Mark before looking for the process: a worker that has not
                # published its OpenCode process yet must still see the pause.
                if process is not None or running:
                    self.interrupts.add(agent_id)
            if process is None:
                # The agent may still be waiting in the FIFO queue.
                with self.build_cond:
                    queued = self.build_waiting.pop(agent_id, None)
                    active = agent_id in self.build_active
                    if queued is not None or active or running:
                        self.interrupts.add(agent_id)
                    self.build_cond.notify_all()
                if not (running or queued is not None or active):
                    self.interrupts.discard(agent_id)
                    return {"ok": True, "interrupted": False}
                return {"ok": True, "interrupted": True, "queued": queued is not None}
            try:
                self._stop_process(process)
            except Exception:
                pass
            return {"ok": True, "interrupted": True}
        if name != "chat":
            return {"ok": False, "error": "Unknown agent action"}
        agent_id = str(payload.get("agent_id") or "").strip()
        message = str(payload.get("message") or "").strip()
        scope = payload.get("scope") if isinstance(payload.get("scope"), dict) else {}
        title = str(payload.get("title") or "Agent").strip()[:120]
        if not agent_id:
            return {"ok": False, "error": "Missing agent"}
        if not message:
            return {"ok": False, "error": "Write a message first"}
        if self.stopping.is_set():
            # The window is closing: never start a fresh agent behind it.
            return {"ok": False, "error": "NeoTodo is closing. Send the instruction again after reopening."}
        kind = str(scope.get("kind") or "")
        # Register the request before the slow model/file preparation. Esc
        # pressed while the picker is still loading must land on this request:
        # otherwise the interrupt sees no run yet, is discarded, and the agent
        # starts anyway -- the reason the hint needed a second press.
        with self.procs_lock:
            self.starting_agents.add(agent_id)
        started = False
        try:
            with self.lock:
                data = self._load()
                agent = data.get("agents", {}).get(agent_id) or {"messages": []}
                history = agent.get("messages") if isinstance(agent.get("messages"), list) else []
                history = self._settle_pending(history)
            mode = self._normalize_mode(payload.get("mode") or agent.get("mode"), kind)
            requested = str(payload.get("model") or agent.get("model") or "").strip()
            models = self._available_models()
            model = requested if requested in models else self._default_model(kind)
            file_args, persistent_files = self._agent_file_args(agent_id, agent)
            with self.lock:
                data = self._load()
                stored = data.setdefault("agents", {}).setdefault(agent_id, {"messages": []})
                messages = stored.get("messages") if isinstance(stored.get("messages"), list) else []
                messages = self._settle_pending(messages)
                messages = (messages + [{"role": "user", "content": message}])[-40:]
                messages.append({
                    "role": "assistant",
                    "content": "",
                    "process": "",
                    "model": model,
                    "pending": True,
                })
                stored["messages"] = messages[-40:]
                stored["title"] = title
                stored["mode"] = mode
                stored["model"] = model
                self._save(data)

            self._spawn_run(
                agent_id=agent_id,
                title=title,
                scope=scope,
                message=message,
                model=model,
                mode=mode,
                file_args=file_args,
                history=history,
            )
            started = True
            with self.lock:
                fresh = self._load()
                stored_now = fresh.get("agents", {}).get(agent_id) or {}
            return {
                "ok": True,
                "started": True,
                "title": title,
                "messages": stored_now.get("messages", []),
                "mode": mode,
                "provider": self._provider_for_model(model),
                "model": model,
                "usage": stored_now.get("usage", {}),
                "live": {},
                "files": persistent_files,
            }
        finally:
            with self.procs_lock:
                self.starting_agents.discard(agent_id)
                if not started:
                    # The turn never reached a worker; its cancel flag must not
                    # leak into the next instruction.
                    self.interrupts.discard(agent_id)


class ApiHandler(BaseHTTPRequestHandler):
    store: Store = None
    agent_store: AgentStore = None

    def log_message(self, format, *args):
        return

    def _send(self, status: int, body: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, status: int, payload: dict) -> None:
        self._send(
            status,
            json.dumps(payload, ensure_ascii=False).encode("utf-8"),
            "application/json; charset=utf-8",
        )

    def _send_media(self, candidate: Path, content_type: str = "") -> None:
        """Serve an audio/video file with byte ranges so seeking works in WebKit."""
        content_type = content_type or mimetypes.guess_type(str(candidate))[0] or "application/octet-stream"
        try:
            size = candidate.stat().st_size
            start, end = 0, size - 1
            partial = False
            range_header = self.headers.get("Range")
            if range_header:
                match = re.fullmatch(r"bytes=(\d*)-(\d*)", range_header.strip())
                if match:
                    first, last = match.group(1), match.group(2)
                    if first:
                        start = int(first)
                        end = int(last) if last else size - 1
                    elif last:
                        length = int(last)
                        start = max(0, size - length)
                        end = size - 1
                    if start >= size or end < start:
                        self.send_response(416)
                        self.send_header("Content-Range", f"bytes */{size}")
                        self.end_headers()
                        return
                    end = min(end, size - 1)
                    partial = True
            with candidate.open("rb") as handle:
                handle.seek(start)
                body = handle.read(end - start + 1)
            self.send_response(206 if partial else 200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Cache-Control", "no-store")
            if partial:
                self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.end_headers()
            self.wfile.write(body)
        except Exception as read_error:
            self._json(500, {"ok": False, "error": str(read_error)})

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/user-sounds/"):
            # /user-sounds/<style>/<file>, with a legacy flat /user-sounds/<file>
            # that reads classical/. A cue missing from a style falls back to
            # classical/ so a partial style pack still plays every sound.
            rest = unquote(parsed.path[len("/user-sounds/"):])
            parts = [part for part in rest.split("/") if part]
            if len(parts) == 1:
                style, name = DEFAULT_SOUND_STYLE, parts[0]
            elif len(parts) == 2:
                style, name = parts
            else:
                self._json(404, {"ok": False, "error": "Not found"})
                return
            style = sound_style_id(style)
            if not style or not name or Path(name).name != name or "\\" in name:
                self._json(404, {"ok": False, "error": "Not found"})
                return
            ensure_sounds_dir()
            candidate = SOUNDS_DIR / style / name
            if not candidate.is_file():
                candidate = SOUNDS_DIR / DEFAULT_SOUND_STYLE / name
            if not candidate.is_file():
                candidate = WEB_DIR / "sounds" / name
            try:
                body = candidate.read_bytes()
            except Exception:
                self._json(404, {"ok": False, "error": "Not found"})
                return
            content_type = mimetypes.guess_type(str(candidate))[0] or "application/octet-stream"
            self._send(200, body, content_type)
            return
        if parsed.path == "/user-wallpaper":
            # A wallpaper the reader picked: served straight from its own path,
            # and only while that path is one they chose. Nothing is copied.
            raw = parse_qs(parsed.query).get("path", [""])[0]
            state = self.store.state() if self.store is not None else {}
            candidate = wallpaper_file_allowed(raw, (state or {}).get("settings") or {})
            if candidate is None:
                self._json(404, {"ok": False, "error": "Not found"})
                return
            content_type = ""
            if candidate.suffix.lower() in (".m4v", ".mov"):
                content_type = "video/mp4"
            self._send_media(candidate, content_type)
            return
        if parsed.path.startswith("/user-pictures/"):
            name = unquote(parsed.path.rsplit("/", 1)[-1])
            if not name or Path(name).name != name:
                self._json(404, {"ok": False, "error": "Not found"})
                return
            ensure_pictures_dir()
            candidate = PICTURES_DIR / name
            if not candidate.is_file():
                self._json(404, {"ok": False, "error": "Not found"})
                return
            content_type = mimetypes.guess_type(str(candidate))[0] or "application/octet-stream"
            if candidate.suffix.lower() in (".m4v", ".mov"):
                content_type = "video/mp4"
            try:
                size = candidate.stat().st_size
                start, end = 0, size - 1
                partial = False
                range_header = self.headers.get("Range")
                if range_header:
                    match = re.fullmatch(r"bytes=(\d*)-(\d*)", range_header.strip())
                    if match:
                        first, last = match.group(1), match.group(2)
                        if first:
                            start = int(first)
                            end = int(last) if last else size - 1
                        elif last:
                            length = int(last)
                            start = max(0, size - length)
                            end = size - 1
                        if start >= size or end < start:
                            self.send_response(416)
                            self.send_header("Content-Range", f"bytes */{size}")
                            self.end_headers()
                            return
                        end = min(end, size - 1)
                        partial = True
                with candidate.open("rb") as handle:
                    handle.seek(start)
                    body = handle.read(end - start + 1)
                self.send_response(206 if partial else 200)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(body)))
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Cache-Control", "no-store")
                if partial:
                    self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                self.end_headers()
                self.wfile.write(body)
            except Exception as read_error:
                self._json(500, {"ok": False, "error": str(read_error)})
            return
        if parsed.path.startswith("/user-note-materials/"):
            name = unquote(parsed.path.rsplit("/", 1)[-1])
            if not name or Path(name).name != name or not name.lower().endswith(".css"):
                self._json(404, {"ok": False, "error": "Not found"})
                return
            ensure_note_materials_dir()
            candidate = NOTE_MATERIALS_DIR / name
            if not candidate.is_file():
                candidate = WEB_DIR / "note-materials" / name
            if not candidate.is_file():
                self._json(404, {"ok": False, "error": "Not found"})
                return
            try:
                body = candidate.read_bytes()
            except Exception as read_error:
                self._json(500, {"ok": False, "error": str(read_error)})
                return
            self._send(200, body, "text/css; charset=utf-8")
            return
        if parsed.path.startswith("/user-music/"):
            name = unquote(parsed.path.rsplit("/", 1)[-1])
            candidate = music_file(name)
            if candidate is None:
                self._json(404, {"ok": False, "error": "Not found"})
                return
            self._send_media(candidate)
            return
        if parsed.path == "/api/music":
            self._json(200, {
                "ok": True,
                "tracks": music_tracks(),
                "folder": str(MUSIC_DIR),
                "library": music_manifest().get("name") or "Music Library",
            })
            return
        if parsed.path == "/api/themes":
            self._json(200, {
                "ok": True,
                "packs": discover_theme_packs(),
                "folder": str(ensure_theme_packs_dir()),
                "exports": str(ensure_theme_exports_dir()),
                # The notebook and the console keep their own palettes in their
                # own folders. They are listed separately so an app theme can
                # never repaint either pane.
                "note_themes": discover_pane_themes("note"),
                "ai_themes": discover_pane_themes("ai"),
                "note_folder": str(ensure_pane_themes_dir("note")),
                "ai_folder": str(ensure_pane_themes_dir("ai")),
                "catalog_url": THEME_CATALOG_URL,
            })
            return
        if parsed.path == "/api/icon-themes":
            self._json(200, {
                "ok": True,
                "themes": discover_icon_themes(),
                "folder": str(ensure_icon_themes_dir()),
            })
            return
        if parsed.path == "/api/sound-styles":
            self._json(200, {
                "ok": True,
                "styles": discover_sound_styles(),
                "folder": str(ensure_sounds_dir()),
                "default": DEFAULT_SOUND_STYLE,
            })
            return
        if parsed.path == "/api/themes/community":
            refresh = parse_qs(parsed.query).get("refresh", [""])[0].lower() in ("1", "true", "yes")
            catalog = community_theme_catalog(refresh=refresh)
            installed = {
                pack["id"]: {"version": pack.get("version", ""), "source": pack.get("source", "")}
                for pack in discover_theme_packs()
            }
            self._json(200, {"ok": True, **catalog, "installed": installed})
            return
        if parsed.path.startswith("/icon-theme-assets/"):
            rest = unquote(parsed.path[len("/icon-theme-assets/"):])
            theme_id, _, relative = rest.partition("/")
            candidate = icon_theme_asset_path(theme_id, relative)
            if candidate is None:
                self._json(404, {"ok": False, "error": "Not found"})
                return
            try:
                body = candidate.read_bytes()
            except Exception as read_error:
                self._json(500, {"ok": False, "error": str(read_error)})
                return
            content_type = mimetypes.guess_type(str(candidate))[0] or "application/octet-stream"
            if content_type.startswith("text/") or content_type in ("application/javascript", "image/svg+xml"):
                content_type += "; charset=utf-8"
            self._send(200, body, content_type)
            return
        if parsed.path.startswith("/theme-assets/"):
            rest = unquote(parsed.path[len("/theme-assets/"):])
            theme_id, _, relative = rest.partition("/")
            candidate = theme_pack_asset_path(theme_id, relative)
            if candidate is None:
                self._json(404, {"ok": False, "error": "Not found"})
                return
            try:
                body = candidate.read_bytes()
            except Exception as read_error:
                self._json(500, {"ok": False, "error": str(read_error)})
                return
            content_type = mimetypes.guess_type(str(candidate))[0] or "application/octet-stream"
            if content_type.startswith("text/") or content_type in ("application/javascript", "image/svg+xml"):
                content_type += "; charset=utf-8"
            self._send(200, body, content_type)
            return
        if parsed.path == "/api/plugins":
            self._json(200, {
                "ok": True,
                "plugins": discover_plugins(),
                "folder": str(ensure_plugins_dir()),
                "catalog_url": PLUGIN_CATALOG_URL,
            })
            return
        if parsed.path == "/api/plugins/community":
            refresh = parse_qs(parsed.query).get("refresh", [""])[0].lower() in ("1", "true", "yes")
            catalog = community_catalog(refresh=refresh)
            installed = {
                plugin["id"]: {
                    "version": plugin.get("version", ""),
                    "source": plugin.get("source", ""),
                }
                for plugin in discover_plugins()
            }
            self._json(200, {"ok": True, **catalog, "installed": installed})
            return
        if parsed.path.startswith("/plugins/"):
            rest = unquote(parsed.path[len("/plugins/"):])
            candidate = None
            # Shared files such as plugin-host.css and community-catalog.json
            # live directly under web/plugins. Check them before treating the
            # first path segment as a plugin id.
            try:
                shared_root = (WEB_DIR / "plugins").resolve()
                shared = (shared_root / rest).resolve()
                if shared.is_relative_to(shared_root) and shared.is_file():
                    candidate = shared
            except Exception:
                candidate = None
            if candidate is None:
                plugin_id, _, relative = rest.partition("/")
                candidate = plugin_file_path(plugin_id, relative or "index.html")
            if candidate is None:
                self._json(404, {"ok": False, "error": "Not found"})
                return
            try:
                body = candidate.read_bytes()
            except Exception as read_error:
                self._json(500, {"ok": False, "error": str(read_error)})
                return
            content_type = mimetypes.guess_type(str(candidate))[0] or "application/octet-stream"
            if content_type.startswith("text/") or content_type in ("application/javascript",):
                content_type += "; charset=utf-8"
            self._send(200, body, content_type)
            return
        if parsed.path == "/api/state":
            self._json(200, self.store.state())
            return
        if parsed.path == "/icon.svg":
            file_path = APP_DIR / "icon.svg"
        elif parsed.path == "/":
            file_path = WEB_DIR / "index.html"
        else:
            file_path = WEB_DIR / unquote(parsed.path.lstrip("/"))
        try:
            resolved = file_path.resolve()
            if not (
                resolved.is_relative_to(WEB_DIR.resolve())
                or resolved == (APP_DIR / "icon.svg").resolve()
            ):
                raise ValueError
            if parsed.path == "/":
                # The boot document carries no colour of its own: the window is
                # transparent and stays hidden until the finished page reports
                # ready. Nothing is injected, so there is no themed first frame.
                body = resolved.read_bytes()
                self._send(200, body, "text/html; charset=utf-8")
                return
            body = resolved.read_bytes()
        except Exception:
            self._json(404, {"ok": False, "error": "Not found"})
            return
        content_type = mimetypes.guess_type(str(resolved))[0] or "application/octet-stream"
        if content_type.startswith("text/") or content_type in ("application/javascript",):
            content_type += "; charset=utf-8"
        self._send(200, body, content_type)

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        allowed = (
            "/api/action", "/api/agent",
            "/api/fork-app", "/api/fork-app/branch", "/api/fork-app/open", "/api/fork-focus",
            "/api/plugins/install", "/api/plugins/uninstall",
            "/api/themes/install", "/api/themes/uninstall", "/api/themes/export",
            "/api/themes/save",
        )
        if path not in allowed:
            self._json(404, {"ok": False, "error": "Not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 40_000_000:
                raise ValueError("The uploaded file is too large")
            payload = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
            if path == "/api/agent":
                result = self.agent_store.action(payload)
            elif path == "/api/themes/install":
                expected_id = str(payload.get("id") or "")
                expected_sha = str(payload.get("sha256") or "")
                data_url = str(payload.get("data") or "")
                url = str(payload.get("url") or "")
                if payload.get("bundled") is True:
                    manifest = install_bundled_theme(expected_id)
                elif data_url:
                    try:
                        data = base64.b64decode(data_url, validate=True)
                    except Exception as error:
                        raise ValueError("The uploaded theme data is not valid base64") from error
                    manifest = install_theme_archive(data, expected_id=expected_id, expected_sha256=expected_sha)
                elif url:
                    data = download_theme_archive(url)
                    manifest = install_theme_archive(data, expected_id=expected_id, expected_sha256=expected_sha)
                else:
                    raise ValueError("Provide a theme download URL, a bundled id or a .zip file")
                result = {
                    "ok": True,
                    "theme": manifest,
                    "packs": discover_theme_packs(),
                    "note_themes": discover_pane_themes("note"),
                    "ai_themes": discover_pane_themes("ai"),
                    "folder": str(ensure_theme_packs_dir()),
                }
            elif path == "/api/themes/uninstall":
                removed = uninstall_theme_pack(payload.get("id"))
                result = {
                    "ok": True,
                    **removed,
                    "packs": discover_theme_packs(),
                    "note_themes": discover_pane_themes("note"),
                    "ai_themes": discover_pane_themes("ai"),
                }
            elif path == "/api/themes/save":
                manifest = save_theme_pack(payload)
                result = {
                    "ok": True,
                    "theme": manifest,
                    "packs": discover_theme_packs(),
                    "note_themes": discover_pane_themes("note"),
                    "ai_themes": discover_pane_themes("ai"),
                    "folder": str(ensure_theme_packs_dir()),
                }
            elif path == "/api/themes/export":
                exported = export_theme_pack(payload)
                result = {"ok": True, **exported}
            elif path == "/api/plugins/install":
                expected_id = str(payload.get("id") or "")
                expected_sha = str(payload.get("sha256") or "")
                data_url = str(payload.get("data") or "")
                url = str(payload.get("url") or "")
                if data_url:
                    try:
                        data = base64.b64decode(data_url, validate=True)
                    except Exception as error:
                        raise ValueError("The uploaded plugin data is not valid base64") from error
                elif url:
                    data = download_plugin_archive(url)
                else:
                    raise ValueError("Provide a plugin download URL or a .zip file")
                manifest = install_plugin_archive(data, expected_id=expected_id, expected_sha256=expected_sha)
                result = {
                    "ok": True,
                    "plugin": manifest,
                    "plugins": discover_plugins(),
                    "folder": str(ensure_plugins_dir()),
                }
            elif path == "/api/plugins/uninstall":
                removed = uninstall_plugin_files(payload.get("id"))
                result = {"ok": True, **removed, "plugins": discover_plugins()}
            elif path == "/api/fork-app/branch":
                result = spawn_fork_branch(self.store, self.agent_store, payload)
            elif path == "/api/fork-app/open":
                result = open_fork_instance(self.agent_store, payload.get("fork_id"))
            elif path == "/api/fork-focus":
                callback = getattr(type(self), "focus_callback", None)
                if callback is None:
                    result = {"ok": False, "error": "No fork window"}
                else:
                    try:
                        callback()
                        result = {"ok": True, "focused": True}
                    except Exception as error:
                        result = {"ok": False, "error": str(error)}
            elif path == "/api/fork-app":
                result = spawn_fork_app(self.store, self.agent_store, payload)
            else:
                result = self.store.action(payload)
            self._json(200 if result.get("ok") else 400, result)
        except Exception as error:
            self._json(400, {"ok": False, "error": str(error)})


_FORK_WINDOW_SUPPORTED = None


def fork_window_supported() -> bool:
    """True when this platform can own a separate GTK window process."""
    global _FORK_WINDOW_SUPPORTED
    if _FORK_WINDOW_SUPPORTED is not None:
        return _FORK_WINDOW_SUPPORTED
    _FORK_WINDOW_SUPPORTED = False
    if not sys.platform.startswith("linux"):
        return False
    try:
        import gi
        gi.require_version("Gtk", "4.0")
        gi.require_version("WebKit", "6.0")
        from gi.repository import Gtk, WebKit  # noqa: F401
        _FORK_WINDOW_SUPPORTED = True
    except Exception:
        pass
    return _FORK_WINDOW_SUPPORTED


def fork_server_record_path(fork_id: str) -> Path:
    return FORK_DIR / f"{fork_id}.server.json"


def pid_is_alive(pid: int) -> bool:
    """True when the recorded process still exists (fork/parent liveness)."""
    try:
        pid = int(pid)
    except (TypeError, ValueError):
        return False
    if pid <= 0:
        return False
    if os.name != "posix":
        # Windows has no portable signal-0 probe, so a dead fork is detected
        # through its port instead.
        return True
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    except OSError:
        return False
    return True


def read_fork_server_record(fork_id: str) -> dict | None:
    try:
        data = json.loads(fork_server_record_path(fork_id).read_text(encoding="utf-8"))
        pid = int(data.get("pid") or 0)
        parent_pid = int(data.get("parent_pid") or 0)
        port = int(data.get("port") or 0)
        if port <= 0:
            return None
        if pid and not pid_is_alive(pid):
            clear_fork_server_record(fork_id)
            return None
        if parent_pid and not pid_is_alive(parent_pid):
            # The notebook that owned this fork is gone. It is not a live
            # window any more, even if its old port has been reused.
            clear_fork_server_record(fork_id)
            return None
        return {
            "pid": pid,
            "parent_pid": parent_pid,
            "port": port,
            "started_at": str(data.get("started_at") or ""),
        }
    except Exception:
        return None


def write_fork_server_record(fork_id: str, port: int) -> None:
    try:
        FORK_DIR.mkdir(parents=True, exist_ok=True)
        path = fork_server_record_path(fork_id)
        tmp = path.with_suffix(".tmp")
        tmp.write_text(json.dumps({
            "pid": os.getpid(),
            "parent_pid": os.getppid() if os.name == "posix" else 0,
            "port": int(port),
            "started_at": datetime.now().isoformat(timespec="seconds"),
        }), encoding="utf-8")
        tmp.replace(path)
    except Exception:
        pass


def clear_fork_server_record(fork_id: str) -> None:
    try:
        fork_server_record_path(fork_id).unlink(missing_ok=True)
    except Exception:
        pass


def cleanup_stale_fork_records() -> None:
    """Drop fork records whose process died with an earlier notebook."""
    try:
        paths = list(FORK_DIR.glob("*.server.json"))
    except Exception:
        return
    for path in paths:
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            data = {}
        pid = int(data.get("pid") or 0) if isinstance(data, dict) else 0
        parent_pid = int(data.get("parent_pid") or 0) if isinstance(data, dict) else 0
        if (pid and not pid_is_alive(pid)) or (parent_pid and not pid_is_alive(parent_pid)):
            try:
                path.unlink(missing_ok=True)
            except Exception:
                pass


def port_is_live(port: int) -> bool:
    try:
        with socket.create_connection(("127.0.0.1", int(port)), timeout=0.35):
            return True
    except OSError:
        return False


def focus_fork_window(port: int) -> bool:
    """Raise an already running fork window instead of opening a duplicate."""
    try:
        request = urllib.request.Request(
            f"http://127.0.0.1:{int(port)}/api/fork-focus",
            data=b"{}",
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(request, timeout=1.5) as response:
            return bool(json.load(response).get("ok"))
    except Exception:
        return False


def _register_fork_process(fork_id: str, process: subprocess.Popen) -> None:
    with FORK_PROCS_LOCK:
        FORK_PROCS[str(fork_id or "")] = process


def _unregister_fork_process(process: subprocess.Popen) -> None:
    with FORK_PROCS_LOCK:
        for key, tracked in list(FORK_PROCS.items()):
            if tracked is process:
                FORK_PROCS.pop(key, None)


def _stop_fork_process(process: subprocess.Popen, force: bool = False) -> None:
    """Stop one fork child without touching the notebook's process group."""
    try:
        if process.poll() is not None:
            return
    except Exception:
        pass
    try:
        if force:
            process.kill()
        else:
            process.terminate()
    except Exception:
        try:
            process.kill()
        except Exception:
            pass


def stop_fork_processes(timeout: float = 3.0) -> None:
    """End every forked window and the agents running inside it.

    A fork is a child of this notebook, so quitting really closes it. SIGTERM
    first gives each fork the chance to interrupt its own agents before the
    hard kill.
    """
    with FORK_PROCS_LOCK:
        entries = list(FORK_PROCS.items())
        FORK_PROCS.clear()
    if not entries:
        return
    for fork_id, _process in entries:
        if FORK_ID_RE.fullmatch(str(fork_id or "")):
            clear_fork_server_record(fork_id)
    for _fork_id, process in entries:
        _stop_fork_process(process)
    deadline = time.monotonic() + max(0.2, float(timeout))
    for _fork_id, process in entries:
        try:
            process.wait(timeout=max(0.05, deadline - time.monotonic()))
        except Exception:
            pass
    for _fork_id, process in entries:
        if process.poll() is None:
            _stop_fork_process(process, force=True)


def stop_fork_servers() -> None:
    """Stop fork servers that a fallback platform kept in this process."""
    with FORK_SERVERS_LOCK:
        entries = list(FORK_SERVERS.items())
        FORK_SERVERS.clear()
    for _key, entry in entries:
        server = entry.get("server") if isinstance(entry, dict) else None
        try:
            if server is not None:
                server.shutdown()
        except Exception:
            pass


def shutdown_forks() -> None:
    """End everything this notebook forked: child windows, servers, records."""
    stop_fork_processes()
    stop_fork_servers()


def launch_fork_process(args: list[str], fork_id: str = "") -> subprocess.Popen:
    """Start a fork window as a child of this notebook.

    It is deliberately not detached and not moved to a new session: the fork
    belongs to this process tree, so a quit closes the fork and its agents
    instead of leaving an independent NeoTodo behind.
    """
    command = [sys.executable]
    if not getattr(sys, "frozen", False):
        command.append(str(Path(__file__).resolve()))
    command.extend(args)
    kwargs = {
        "stdin": subprocess.DEVNULL,
        "stdout": subprocess.DEVNULL,
        "stderr": subprocess.DEVNULL,
        "close_fds": True,
        "cwd": str(APP_DIR),
        "env": {**os.environ, "NEOTODO_PARENT_PID": str(os.getpid())},
    }
    if os.name == "posix":
        # Keep the child in this session so the notebook owns it. The child
        # also watches its parent, so even a crash cannot orphan it.
        kwargs["start_new_session"] = False
    process = subprocess.Popen(command, **kwargs)
    if fork_id:
        _register_fork_process(fork_id, process)
    return process


def spawn_fork_app_process(path: Path) -> dict | None:
    """Launch a child process that serves the fork and opens its own window."""
    fork_id = path.stem
    port = 0
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.bind(("127.0.0.1", 0))
            port = int(sock.getsockname()[1])
    except Exception:
        port = 0
    try:
        proc = launch_fork_process(
            ["--fork-app", str(path), "--port", str(port)], fork_id=fork_id,
        )
    except Exception:
        return None
    deadline = time.monotonic() + 8
    while time.monotonic() < deadline:
        if proc.poll() is not None:
            break
        record = read_fork_server_record(fork_id)
        if record and port_is_live(record["port"]):
            record["child_pid"] = proc.pid
            return record
        time.sleep(0.08)
    _unregister_fork_process(proc)
    try:
        proc.terminate()
    except Exception:
        pass
    return None


def spawn_fork_window_process(url: str, title: str) -> bool:
    try:
        proc = launch_fork_process(
            ["--fork-window", str(url), "--title", str(title or "")],
            fork_id=f"window:{url}",
        )
        return proc.poll() is None
    except Exception:
        return False


def fork_data_title(path: Path) -> str:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        category = (data.get("categories") or [{}])[0]
        todo = (category.get("todos") or [{}])[0]
        return str(todo.get("name") or category.get("name") or "")
    except Exception:
        return ""


def start_fork_server(fork_store: Store, agent_store) -> tuple[ThreadingHTTPServer, int]:
    """Serve one fork workspace on a fresh loopback port."""
    class ForkApiHandler(ApiHandler):
        pass

    ForkApiHandler.store = fork_store
    ForkApiHandler.agent_store = agent_store
    server = ThreadingHTTPServer(("127.0.0.1", 0), ForkApiHandler)

    def quit_fork() -> None:
        try:
            server.shutdown()
        except Exception:
            pass
        with FORK_SERVERS_LOCK:
            for key, entry in list(FORK_SERVERS.items()):
                if entry.get("server") is server:
                    FORK_SERVERS.pop(key, None)

    fork_store.quit_callback = quit_fork
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, server.server_address[1]


def open_fork_instance(agent_store, fork_id: str) -> dict:
    """Open a persisted fork in its own child window/process."""
    key = str(fork_id or "").strip()
    if not re.fullmatch(r"[0-9a-f]{8,64}", key):
        return {"ok": False, "error": "Invalid fork"}
    path = FORK_DIR / f"{key}.json"
    if not path.is_file():
        return {"ok": False, "error": "Fork not found"}
    record = read_fork_server_record(key)
    if record and port_is_live(record["port"]):
        url = f"http://127.0.0.1:{record['port']}/"
        focused = focus_fork_window(record["port"])
        opened = False
        if not focused and fork_window_supported():
            opened = spawn_fork_window_process(url, fork_data_title(path))
        return {
            "ok": True,
            "url": url,
            "port": record["port"],
            "fork_id": key,
            "window_opened": focused or opened,
            "focused": focused,
        }
    with FORK_SERVERS_LOCK:
        entry = FORK_SERVERS.get(key)
    if entry:
        return {
            "ok": True,
            "url": f"http://127.0.0.1:{entry['port']}/",
            "port": entry["port"],
            "fork_id": key,
            "window_opened": False,
        }
    if fork_window_supported():
        record = spawn_fork_app_process(path)
        if record:
            return {
                "ok": True,
                "url": f"http://127.0.0.1:{record['port']}/",
                "port": record["port"],
                "fork_id": key,
                "window_opened": True,
            }
    fork_store = Store(path)
    server, port = start_fork_server(fork_store, agent_store)
    with FORK_SERVERS_LOCK:
        FORK_SERVERS[key] = {
            "server": server,
            "path": str(path),
            "port": port,
            "created_at": datetime.now().isoformat(timespec="seconds"),
            "source": {},
        }
    return {
        "ok": True,
        "url": f"http://127.0.0.1:{port}/",
        "port": port,
        "fork_id": key,
        "window_opened": False,
    }


def create_fork_instance(
    agent_store,
    *,
    title: str,
    category_name: str,
    color: str,
    note: str,
    source: dict,
    settings: dict,
    subtasks: list | None = None,
    project_folder: str = "",
    project_file_count: int = 0,
) -> dict:
    """Materialize one fake-todo app and serve it on a fresh port."""
    now = datetime.now().isoformat(timespec="seconds")
    fork_id = new_id()
    fork_category_id = new_id()
    fork_todo_id = new_id()

    fork_subtasks = []
    for item in subtasks or []:
        if not isinstance(item, dict):
            continue
        item_name = str(item.get("name") or "").strip()
        if not item_name:
            continue
        created = item.get("created_at") or item.get("createdAt") or now
        completed = item.get("completed_at") or item.get("completedAt")
        done = bool(item.get("done"))
        fork_subtasks.append({
            "id": new_id(),
            "name": item_name,
            "done": done,
            "created_at": created,
            "completed_at": completed if done else None,
            "time_cost": item.get("time_cost"),
            "note": str(item.get("note") or ""),
        })

    fork_todo = {
        "id": fork_todo_id,
        "name": str(title or "Untitled"),
        "done": False,
        "created_at": now,
        "completed_at": None,
        "time_cost": None,
        "note": str(note or ""),
        "subtasks": fork_subtasks,
        "forked_from": dict(source),
        "fork_app": True,
    }
    if project_folder:
        fork_todo["project_folder"] = project_folder
        if project_file_count:
            fork_todo["project_file_count"] = int(project_file_count)
    fork_data = {
        "categories": [{
            "id": fork_category_id,
            "name": str(category_name or "Fork"),
            "color": color or PALETTE[0],
            "todos": [fork_todo],
            "forked_from": dict(source),
            "fork_app": True,
        }],
        "selected_category": fork_category_id,
        "opened_category": fork_category_id,
        "selected_todo": None,
        "archive": [],
        "trash": [],
        "settings": json.loads(json.dumps(settings or {})),
        "fork": {
            "id": fork_id,
            "created_at": now,
            "source": dict(source),
        },
    }
    # The fork is a fresh focused session: no trophies or focus history from
    # the parent, but the same paper, fonts, wallpaper and plugins.
    fork_data["settings"]["focus_count"] = 0
    fork_data["settings"]["focus_log"] = []

    path = FORK_DIR / f"{fork_id}.json"
    save_data(fork_data, path)
    # The new todo opens its AI panel on the conversation the subtask already
    # had. Copy it before the child process starts reading the same store.
    source_subtask_id = source.get("subtask_id") or source.get("subtaskId") or ""
    if source_subtask_id:
        try:
            agent_store.copy_session(
                f"subtask:{source_subtask_id}",
                f"todo:{fork_todo_id}",
            )
        except Exception:
            pass
    if fork_window_supported():
        record = spawn_fork_app_process(path)
        if record:
            with FORK_SERVERS_LOCK:
                FORK_SERVERS.pop(fork_id, None)
            return {
                "ok": True,
                "url": f"http://127.0.0.1:{record['port']}/",
                "port": record["port"],
                "fork_id": fork_id,
                "todo_id": fork_todo_id,
                "category_id": fork_category_id,
                "name": fork_todo["name"],
                "source": dict(source),
                "window_opened": True,
                "mode": "process",
            }
    # Platform fallback (no separate GTK shell): keep the server in this
    # process and let the parent shell open the window.
    fork_store = Store(path)
    server, port = start_fork_server(fork_store, agent_store)
    with FORK_SERVERS_LOCK:
        FORK_SERVERS[fork_id] = {
            "server": server,
            "path": str(path),
            "port": port,
            "created_at": now,
            "source": dict(source),
        }
    return {
        "ok": True,
        "url": f"http://127.0.0.1:{port}/",
        "port": port,
        "fork_id": fork_id,
        "todo_id": fork_todo_id,
        "category_id": fork_category_id,
        "name": fork_todo["name"],
        "source": dict(source),
        "window_opened": False,
        "mode": "thread",
    }


def spawn_fork_app(parent_store: Store, agent_store, payload: dict) -> dict:
    """Create a fake-todo NeoTodo window from one subtask."""
    with parent_store.lock:
        category, todo = parent_store._find_todo(payload.get("todo_id"))
        subtask = parent_store._find_subtask(todo, payload.get("subtask_id"))
        if todo is None:
            return {"ok": False, "error": "Todo not found"}
        if subtask is None:
            return {"ok": False, "error": "Subtask not found"}
        now = datetime.now().isoformat(timespec="seconds")
        source = {
            "category_id": category.get("id") if category else None,
            "category_name": category.get("name", "") if category else "",
            "todo_id": todo.get("id"),
            "todo_name": todo.get("name", ""),
            "subtask_id": subtask.get("id"),
            "subtask_name": subtask.get("name", ""),
            "at": now,
        }
        settings = json.loads(json.dumps(parent_store.data.get("settings") or {}))
        return create_fork_instance(
            agent_store,
            title=str(subtask.get("name") or "Untitled"),
            category_name=str(todo.get("name") or "Untitled"),
            color=(category or {}).get("color") or PALETTE[0],
            note=str(subtask.get("note") or ""),
            source=source,
            settings=settings,
            subtasks=[],
            project_folder=str(todo.get("project_folder") or ""),
            project_file_count=int(todo.get("project_file_count") or 0),
        )


def spawn_fork_branch(parent_store: Store, agent_store, payload: dict) -> dict:
    """Open a plugin-store fork (including the first-build imports) as a port app."""
    branch = payload.get("branch")
    if not isinstance(branch, dict):
        return {"ok": False, "error": "Missing branch"}
    title = str(branch.get("name") or "").strip()
    raw_source = branch.get("source") if isinstance(branch.get("source"), dict) else {}
    source = {
        "category_id": raw_source.get("category_id") or raw_source.get("categoryId") or "",
        "category_name": raw_source.get("category_name") or raw_source.get("categoryName") or "",
        "todo_id": raw_source.get("todo_id") or raw_source.get("todoId") or "",
        "todo_name": raw_source.get("todo_name") or raw_source.get("todoName") or "",
        "subtask_id": raw_source.get("subtask_id") or raw_source.get("subtaskId") or "",
        "subtask_name": raw_source.get("subtask_name") or raw_source.get("subtaskName") or title,
        "at": datetime.now().isoformat(timespec="seconds"),
    }
    if not title or not source["todo_id"]:
        return {"ok": False, "error": "Invalid fork branch"}
    with parent_store.lock:
        settings = json.loads(json.dumps(parent_store.data.get("settings") or {}))
        category = parent_store._find_category(source.get("category_id"))
    return create_fork_instance(
        agent_store,
        title=title,
        category_name=source["todo_name"] or "Fork",
        color=(category or {}).get("color") or PALETTE[0],
        note=str(branch.get("note") or ""),
        source=source,
        settings=settings,
        subtasks=branch.get("subtasks") if isinstance(branch.get("subtasks"), list) else [],
    )


def start_server(store: Store):
    ensure_sounds_dir()
    ensure_note_materials_dir()
    ensure_music_dir()
    ensure_plugins_dir()
    ensure_theme_packs_dir()
    ensure_theme_exports_dir()
    ensure_pane_themes_dir("note")
    ensure_pane_themes_dir("ai")
    sync_all_theme_pack_pane_themes()
    # A fixed loopback port keeps the browser origin stable across launches,
    # so localStorage (volume, mute, panel geometry, caret choices) survives.
    # If another copy already owns it, fall back to an ephemeral port.
    try:
        server = ThreadingHTTPServer(("127.0.0.1", 47321), ApiHandler)
        primary = True
    except OSError:
        server = ThreadingHTTPServer(("127.0.0.1", 0), ApiHandler)
        # A second copy shares the data files with the first copy: it must
        # not settle (or interrupt) the runs that copy is working on.
        primary = False
    ApiHandler.store = store
    ApiHandler.agent_store = AgentStore(AGENT_FILE, settle_pending=primary)
    # Warm the capability check in the main thread. Fork windows are separate
    # GTK processes; the HTTP request thread only reads this cached flag.
    try:
        fork_window_supported()
    except Exception:
        pass
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, server.server_address[1]


# ============================================================================
# [linux] GTK4 / WebKitGTK shell
# Linux only. Do not copy this block into windows_app.py or Android; those
# shells are updated together in the platform-sync step.
# ============================================================================
def run_gtk() -> None:
    import gi
    gi.require_version("Gtk", "4.0")
    gi.require_version("WebKit", "6.0")
    gi.require_version("Gdk", "4.0")
    from gi.repository import Gdk, Gio, GLib, Gtk, WebKit

    # A single, steady caret in the note: no on/off blinking.
    try:
        Gtk.Settings.get_default().set_property("gtk-cursor-blink", False)
    except Exception:
        pass

    try:
        Gtk.Window.set_default_icon_name("io.github.neotodo")
    except Exception:
        pass
    store = Store(DATA_FILE)
    # A fork from an earlier run can only be alive if its window survived a
    # crash; its record must never point at a reused port.
    try:
        cleanup_stale_fork_records()
    except Exception:
        pass
    try:
        # The window never paints a colour of its own. While the live page is
        # being prepared the window is transparent, so a frame that escapes the
        # reveal gate can only show the desktop, never a theme or boot colour.
        provider = Gtk.CssProvider()
        provider.load_from_data(
            b"window, window.background { background-color: transparent; }"
        )
        Gtk.StyleContext.add_provider_for_display(
            Gdk.Display.get_default(), provider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        )
    except Exception:
        pass
    server, port = start_server(store)

    class NeoTodoApp(Gtk.Application):
        def __init__(self):
            flags = (
                Gio.ApplicationFlags.NON_UNIQUE
                if "--new-window" in sys.argv
                else Gio.ApplicationFlags.DEFAULT_FLAGS
            )
            app_id = os.environ.get("NEOTODO_APP_ID") or "io.github.neotodo"
            super().__init__(application_id=app_id, flags=flags)
            self.window = None

        def do_activate(self):
            if self.window is not None:
                self.window.present()
                return
            window = Gtk.ApplicationWindow(application=self, title="NeoTodo")
            try:
                window.set_icon_name("io.github.neotodo")
            except Exception:
                pass
            window.set_default_size(1280, 840)
            window.set_resizable(True)
            # The black titlebar is the OS window chrome, not the page. Remove it.
            window.set_decorated(False)
            window.maximize()

            def pick_project_folder():
                chosen = {"path": None}
                done = threading.Event()

                def show_dialog():
                    # Gtk.FileChooserNative uses the desktop portal and is the
                    # most reliable folder picker on Wayland.
                    chooser = Gtk.FileChooserNative(
                        title="Choose project folder",
                        transient_for=window,
                        action=Gtk.FileChooserAction.SELECT_FOLDER,
                        accept_label="Select",
                        cancel_label="Cancel",
                    )
                    window._project_folder_dialog = chooser

                    def on_response(dialog, response):
                        if response == Gtk.ResponseType.ACCEPT:
                            file = dialog.get_file()
                            chosen["path"] = file.get_path() if file else None
                        else:
                            chosen["path"] = None
                        try:
                            dialog.destroy()
                        except Exception:
                            pass
                        window._project_folder_dialog = None
                        done.set()

                    chooser.connect("response", on_response)
                    chooser.show()
                    return False

                GLib.idle_add(show_dialog)
                done.wait(timeout=600)
                return chosen["path"]

            def pick_wallpaper_file():
                # The wallpaper is the reader's own file: the picker returns its
                # path and NeoTodo never copies it. Images and films both work.
                chosen = {"path": None}
                done = threading.Event()

                def show_dialog():
                    chooser = Gtk.FileChooserNative(
                        title="Choose wallpaper",
                        transient_for=window,
                        action=Gtk.FileChooserAction.OPEN,
                        accept_label="Use",
                        cancel_label="Cancel",
                    )
                    filters = []
                    pictures = Gtk.FileFilter()
                    pictures.set_name("Pictures and films")
                    for pattern in ("*.jpg", "*.jpeg", "*.png", "*.webp", "*.gif", "*.avif",
                                    "*.mp4", "*.webm", "*.mov", "*.m4v", "*.ogv"):
                        pictures.add_pattern(pattern)
                    filters.append(pictures)
                    everything = Gtk.FileFilter()
                    everything.set_name("All files")
                    everything.add_pattern("*")
                    filters.append(everything)
                    for item in filters:
                        chooser.add_filter(item)
                    window._wallpaper_dialog = chooser

                    def on_response(dialog, response):
                        if response == Gtk.ResponseType.ACCEPT:
                            file = dialog.get_file()
                            chosen["path"] = file.get_path() if file else None
                        else:
                            chosen["path"] = None
                        try:
                            dialog.destroy()
                        except Exception:
                            pass
                        window._wallpaper_dialog = None
                        done.set()

                    chooser.connect("response", on_response)
                    chooser.show()
                    return False

                GLib.idle_add(show_dialog)
                done.wait(timeout=600)
                return chosen["path"]

            global FOLDER_PICK_CALLBACK, FILE_PICK_CALLBACK
            FOLDER_PICK_CALLBACK = pick_project_folder
            FILE_PICK_CALLBACK = pick_wallpaper_file

            background = Gdk.RGBA()
            # WebKit's own unpainted background stays transparent too: the page
            # supplies its first frame, the window never supplies a theme colour.
            background.parse("rgba(0,0,0,0)")
            view = WebKit.WebView()
            view.set_background_color(background)
            def apply_view_settings(target):
                try:
                    target_settings = target.get_settings()
                    target_settings.set_enable_developer_extras(True)
                    target_settings.set_enable_webaudio(True)
                    # Scrolling with the wheel is the first interaction in this
                    # app, and WebKit otherwise keeps WebAudio suspended until a
                    # click. This is a local desktop window, so allow audio to
                    # start without a gesture.
                    target_settings.set_media_playback_requires_user_gesture(False)
                    target_settings.set_media_playback_allows_inline(True)
                    target_settings.set_javascript_can_open_windows_automatically(True)
                except Exception:
                    pass

            apply_view_settings(view)
            def recover_after_renderer_crash(target_view, *_args):
                def reload_view():
                    try:
                        target_view.reload()
                    except Exception:
                        pass
                    return False
                GLib.idle_add(reload_view)
            try:
                view.connect("web-process-terminated", recover_after_renderer_crash)
            except Exception:
                pass
            detached_opener = [None]

            def decide_policy(_view, decision, decision_type):
                # WebKitGTK keeps WebAudio suspended until a click by default.
                # This desktop app is driven with the mouse wheel, so allow
                # autoplay (with sound) for our own navigation.
                if decision_type == WebKit.PolicyDecisionType.NAVIGATION_ACTION:
                    try:
                        uri = decision.get_navigation_action().get_request().get_uri() or ""
                    except Exception:
                        uri = ""
                    parsed_uri = urlparse(uri)
                    if parsed_uri.hostname == "neotodo.local" and parsed_uri.path == "/new-window":
                        def open_new_main_window():
                            new_view = WebKit.WebView()
                            new_view.set_background_color(background)
                            apply_view_settings(new_view)
                            try:
                                new_view.connect("web-process-terminated", recover_after_renderer_crash)
                            except Exception:
                                pass
                            new_window = Gtk.Window()
                            new_window.set_title("NeoTodo")
                            try:
                                new_window.set_icon_name("io.github.neotodo")
                            except Exception:
                                pass
                            new_window.set_default_size(1280, 840)
                            new_window.set_decorated(False)
                            new_window.maximize()
                            new_window.set_child(new_view)
                            new_view.connect("decide-policy", decide_policy)
                            def forget_new(_window, win=new_window):
                                main_windows[:] = [item for item in main_windows if item is not win]
                            new_window.connect("destroy", forget_new)
                            main_windows.append(new_window)
                            new_view.load_uri(f"http://127.0.0.1:{port}/?desktop=1")
                            new_window.present()
                            return False

                        GLib.idle_add(open_new_main_window)
                        try:
                            decision.ignore()
                        except Exception:
                            pass
                        return True
                    if parsed_uri.hostname == "neotodo.local" and parsed_uri.path == "/open":
                        try:
                            query = parse_qs(parsed_uri.query)
                            target = query.get("url", [""])[0]
                            follow = query.get("follow", ["0"])[0] == "1"
                            if target and detached_opener[0]:
                                def open_target(url=target, should_follow=follow):
                                    opener = detached_opener[0]
                                    if opener:
                                        opener(url, should_follow)
                                    return False
                                GLib.idle_add(open_target)
                        except Exception:
                            pass
                        try:
                            decision.ignore()
                        except Exception:
                            pass
                        return True
                    try:
                        policies = WebKit.WebsitePolicies(
                            autoplay=WebKit.AutoplayPolicy.ALLOW
                        )
                        decision.use_with_policies(policies)
                        return True
                    except Exception:
                        return False
                return False

            view.connect("decide-policy", decide_policy)

            detached_windows = []
            self.detached_windows = detached_windows
            main_windows = []

            def open_detached_window(target_url=None, follow=False):
                detached_view = WebKit.WebView()
                detached_view.set_background_color(background)
                apply_view_settings(detached_view)
                try:
                    detached_view.connect("web-process-terminated", recover_after_renderer_crash)
                except Exception:
                    pass
                detached_window = Gtk.Window()
                detached_window.set_title("NeoTodo")
                detached_window.set_default_size(960, 760)
                detached_overlay = Gtk.Overlay()
                detached_overlay.set_child(detached_view)
                detached_window.set_child(detached_overlay)

                def detached_policy(_view, decision, decision_type):
                    if decision_type == WebKit.PolicyDecisionType.NAVIGATION_ACTION:
                        try:
                            uri = decision.get_navigation_action().get_request().get_uri() or ""
                        except Exception:
                            uri = ""
                        parsed_uri = urlparse(uri)
                        if parsed_uri.hostname == "neotodo.local" and parsed_uri.path == "/home":
                            # The handle belongs to NeoTodo: clicking it in the
                            # detached window docks the panel back home.
                            def dock_home():
                                try:
                                    window.present()
                                except Exception:
                                    pass
                                try:
                                    detached_window.destroy()
                                except Exception:
                                    pass
                                return False
                            GLib.idle_add(dock_home)
                            try:
                                decision.ignore()
                            except Exception:
                                pass
                            return True
                        if parsed_uri.hostname == "neotodo.local":
                            try:
                                parsed = parsed_uri
                                params = parse_qs(parsed.query)
                                x = int(float(params.get("x", ["0"])[0] or 0))
                                y = int(float(params.get("y", ["0"])[0] or 0))
                                action = parsed.path.rsplit("/", 1)[-1]

                                def begin_window_drag(resize=False):
                                    surface = detached_window.get_surface()
                                    display = Gdk.Display.get_default()
                                    seat = display.get_default_seat() if display else None
                                    device = seat.get_pointer() if seat else None
                                    if not isinstance(surface, Gdk.Toplevel) or device is None:
                                        return False
                                    try:
                                        positioned, px, py, _mask = surface.get_device_position(device)
                                        if not positioned:
                                            px, py = x, y
                                    except Exception:
                                        px, py = x, y
                                    if resize:
                                        surface.begin_resize(
                                            Gdk.SurfaceEdge.NORTH,
                                            device,
                                            1,
                                            int(px),
                                            int(py),
                                            Gdk.CURRENT_TIME,
                                        )
                                    else:
                                        surface.begin_move(
                                            device, 1, int(px), int(py), Gdk.CURRENT_TIME
                                        )
                                    return False

                                if action == "move":
                                    GLib.idle_add(begin_window_drag, False)
                                elif action == "resize":
                                    GLib.idle_add(begin_window_drag, True)
                            except Exception:
                                pass
                            try:
                                decision.ignore()
                            except Exception:
                                pass
                            return True
                    return decide_policy(_view, decision, decision_type)

                detached_view.connect("decide-policy", detached_policy)
                def on_view_close(_view, win=detached_window):
                    win.destroy()
                detached_view.connect("close", on_view_close)
                def forget_window(_window, win=detached_window):
                    detached_windows[:] = [pair for pair in detached_windows if pair[0] is not win]

                detached_window.connect("destroy", forget_window)
                detached_view.connect(
                    "notify::title",
                    lambda target, _pspec, win=detached_window: win.set_title(target.get_title() or "NeoTodo"),
                )
                detached_windows.append((detached_window, detached_view))
                # Reuse a capture of the page that was on screen before the
                # click. The new window appears instantly with that content,
                # then swaps to the note/AI as soon as the page is ready.
                state = {"preview": None, "loaded": False}
                def drop_detached_preview():
                    node = state.get("preview")
                    if node is not None:
                        try:
                            detached_overlay.remove_overlay(node)
                        except Exception:
                            pass
                        state["preview"] = None
                def on_detached_load(_view, event):
                    if event == WebKit.LoadEvent.FINISHED:
                        state["loaded"] = True
                        drop_detached_preview()
                try:
                    detached_view.connect("load-changed", on_detached_load)
                except Exception:
                    pass
                def mount_detached_preview():
                    if not state.get("loaded"):
                        try:
                            picture = startup.make_preview(DETACH_PREVIEW_FILE)
                            if picture is not None:
                                detached_overlay.add_overlay(picture)
                                state["preview"] = picture
                        except Exception:
                            pass
                    try:
                        detached_window.present()
                    except Exception:
                        pass
                    return False
                try:
                    DETACH_PREVIEW_FILE.unlink(missing_ok=True)
                except Exception:
                    pass
                startup.capture_view(view, DETACH_PREVIEW_FILE, lambda: GLib.idle_add(mount_detached_preview))
                if target_url:
                    detached_view.load_uri(target_url)
                else:
                    GLib.idle_add(mount_detached_preview)
                if follow:
                    def begin_initial_move():
                        surface = detached_window.get_surface()
                        display = Gdk.Display.get_default()
                        seat = display.get_default_seat() if display else None
                        device = seat.get_pointer() if seat else None
                        if not isinstance(surface, Gdk.Toplevel) or device is None:
                            return False
                        try:
                            ok, px, py, _mask = surface.get_device_position(device)
                            if ok:
                                surface.begin_move(device, 1, int(px), int(py), Gdk.CURRENT_TIME)
                        except Exception:
                            pass
                        return False
                    GLib.timeout_add(90, begin_initial_move)
                return detached_view

            detached_opener[0] = open_detached_window
            self.view = view
            self.window = window
            window.connect("close-request", self._on_close)
            started_at = time.monotonic()
            revealed = {"done": False}
            presented = {"done": False}
            polling = {"active": False}
            # The live page is the only first frame. The window is mapped right
            # away at zero opacity, so WebKit can prepare the real page in the
            # background. The page reports `app-painted` once the finished page
            # has actually been painted; the window then turns opaque in the
            # same frame. There is no splash, snapshot or boot colour, so the
            # first pixels the user sees are the finished page itself.
            window.set_child(view)
            for stale in LEGACY_STARTUP_FILES:
                try:
                    stale.unlink(missing_ok=True)
                except Exception:
                    pass

            def present_window():
                if presented["done"]:
                    return False
                presented["done"] = True
                try:
                    window.set_opacity(0.0)
                except Exception:
                    pass
                window.present()
                return False

            def reveal_window(reason="ready"):
                if revealed["done"]:
                    return False
                revealed["done"] = True
                try:
                    window.set_opacity(1.0)
                except Exception:
                    window.present()
                try:
                    print(f"[startup] window shown after {(time.monotonic() - started_at) * 1000:.0f} ms ({reason})", flush=True)
                except Exception:
                    pass
                return False

            def poll_ready():
                if revealed["done"] or polling["active"]:
                    return False
                polling["active"] = True

                def evaluated(target, result, _data=None):
                    ready = False
                    try:
                        value = target.evaluate_javascript_finish(result)
                        ready = bool(value.to_int32()) if value is not None else False
                    except Exception:
                        ready = False
                    if ready:
                        reveal_window("painted")
                    else:
                        polling["active"] = False
                        GLib.timeout_add(16, poll_ready)
                    return False

                script = (
                    "Boolean(document.body && document.body.classList.contains('app-painted'))"
                )
                try:
                    view.evaluate_javascript(script, -1, None, None, None, evaluated, None)
                except Exception:
                    polling["active"] = False
                    GLib.timeout_add(16, poll_ready)
                return False

            def on_load_changed(_view, event):
                if event == WebKit.LoadEvent.FINISHED:
                    GLib.timeout_add(0, poll_ready)
                return False

            view.connect("load-changed", on_load_changed)
            present_window()
            GLib.timeout_add(1200, poll_ready)
            # Only a page that never becomes ready (a broken init) falls back
            # to an early reveal, so its error message is still reachable.
            GLib.timeout_add(1800, lambda: reveal_window("global-fallback"))
            view.load_uri(f"http://127.0.0.1:{port}/?desktop=1")

        def _shutdown(self):
            # Forks are child processes of this notebook. Tell them to leave
            # first, so every fork window and the agents inside it stop while
            # this notebook interrupts its own agents.
            try:
                shutdown_forks()
            except Exception:
                pass
            # Closing the notebook interrupts every agent and ends every fork
            # child; nothing continues after the window is gone.
            try:
                if ApiHandler.agent_store is not None:
                    ApiHandler.agent_store.shutdown()
            except Exception:
                pass
            for detached_window, _view in getattr(self, "detached_windows", []):
                try:
                    detached_window.destroy()
                except Exception:
                    pass
            self.quit()

        def quit_now(self):
            if getattr(self, "_closing", False):
                return
            self._closing = True
            self._shutdown()

        def _on_close(self, window):
            if getattr(self, "_closing", False):
                return False
            self._closing = True
            self._shutdown()
            return True

    app = NeoTodoApp()
    global QUIT_CALLBACK
    QUIT_CALLBACK = lambda: GLib.idle_add(app.quit_now)

    # A window-manager quit is the normal path, but a SIGTERM from the
    # launcher must also interrupt the agents and close every fork child.
    def signal_quit(*_args):
        GLib.idle_add(app.quit_now)

    for signal_name in ("SIGTERM", "SIGINT", "SIGHUP"):
        sig = getattr(signal, signal_name, None)
        if sig is None:
            continue
        try:
            signal.signal(sig, signal_quit)
        except Exception:
            pass
    app.run(None)


def _fork_arg(flag: str, default: str = "") -> str:
    try:
        return str(sys.argv[sys.argv.index(flag) + 1])
    except (ValueError, IndexError):
        return default


def _prepare_fork_assets() -> None:
    for ensure in (
        ensure_sounds_dir,
        ensure_note_materials_dir,
        ensure_music_dir,
        ensure_plugins_dir,
        ensure_theme_packs_dir,
        ensure_theme_exports_dir,
    ):
        try:
            ensure()
        except Exception:
            pass
    for kind in ("note", "ai"):
        try:
            ensure_pane_themes_dir(kind)
        except Exception:
            pass
    try:
        sync_all_theme_pack_pane_themes()
    except Exception:
        pass


def run_fork_gtk_window(url: str, title: str, on_close=None, on_ready=None) -> None:
    import gi
    gi.require_version("Gtk", "4.0")
    gi.require_version("WebKit", "6.0")
    from gi.repository import Gtk, WebKit

    try:
        Gtk.Window.set_default_icon_name("io.github.neotodo")
    except Exception:
        pass
    try:
        Gtk.Settings.get_default().set_property("gtk-cursor-blink", False)
    except Exception:
        pass

    application = Gtk.Application(application_id=f"io.github.neotodo.fork{os.getpid()}")

    def activate(app):
        window = Gtk.ApplicationWindow(application=app)
        window.set_default_size(1100, 820)
        window.set_title(title or "NeoTodo")
        view = WebKit.WebView()
        try:
            settings = view.get_settings()
            settings.set_media_playback_allows_inline(True)
            settings.set_javascript_can_open_windows_automatically(True)
        except Exception:
            pass
        view.load_uri(url)
        view.connect(
            "notify::title",
            lambda target, _pspec, win=window: win.set_title(
                target.get_title() or title or "NeoTodo"
            ),
        )
        try:
            view.connect("close", lambda *_args, win=window: win.close())
        except Exception:
            pass
        window.set_child(view)

        def close_request(*_args):
            try:
                if on_close:
                    on_close()
            except Exception:
                pass
            return False

        window.connect("close-request", close_request)
        window.present()
        if on_ready:
            try:
                on_ready(app, window)
            except Exception:
                pass

    application.connect("activate", activate)
    application.run([])


def _watch_fork_parent(on_orphan=None) -> None:
    """A fork is a child of the notebook: leave when the notebook leaves."""
    try:
        parent = int(os.environ.get("NEOTODO_PARENT_PID") or 0)
    except (TypeError, ValueError):
        parent = 0
    # A launch wrapper may sit between the notebook and the fork, so prefer
    # the pid the notebook published. Without one, the direct parent is the
    # notebook and a changed ppid means it is gone.
    watch_ppid = parent <= 0
    if watch_ppid:
        parent = os.getppid()

    def watch() -> None:
        while True:
            time.sleep(1.5)
            if watch_ppid:
                orphan = os.getppid() != parent
            else:
                orphan = not pid_is_alive(parent)
            if not orphan:
                continue
            try:
                if on_orphan is not None:
                    on_orphan()
            except Exception:
                pass
            finally:
                os._exit(0)

    threading.Thread(target=watch, daemon=True, name="fork-parent-watch").start()


def run_fork_app_process() -> None:
    """Serve one fork and own its window as a child of the notebook."""
    raw_path = _fork_arg("--fork-app")
    path = Path(raw_path).expanduser()
    if not path.is_file():
        return
    fork_id = path.stem
    requested_port = int(_fork_arg("--port", "0") or 0)
    _prepare_fork_assets()
    store = Store(path)

    class ForkApiHandler(ApiHandler):
        pass

    agent_store = AgentStore(AGENT_FILE, settle_pending=False)
    ForkApiHandler.store = store
    ForkApiHandler.agent_store = agent_store
    try:
        server = ThreadingHTTPServer(("127.0.0.1", requested_port), ForkApiHandler)
    except OSError:
        server = ThreadingHTTPServer(("127.0.0.1", 0), ForkApiHandler)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    holder = {"app": None, "window": None}

    def focus_window() -> bool:
        window = holder.get("window")
        if window is None:
            return False
        try:
            from gi.repository import GLib
            GLib.idle_add(window.present)
            return True
        except Exception:
            return False

    ForkApiHandler.focus_callback = focus_window

    def stop() -> None:
        # Closing this window ends its agents first: OpenCode runs in its own
        # session, so letting the fork process exit alone would orphan it.
        try:
            agent_store.shutdown()
        except Exception:
            pass
        clear_fork_server_record(fork_id)
        try:
            server.shutdown()
        except Exception:
            pass
        # A fork can fork its own subtasks, and those are children of this
        # fork: closing this window closes them as well.
        try:
            shutdown_forks()
        except Exception:
            pass
        app = holder.get("app")
        if app is not None:
            try:
                from gi.repository import GLib
                GLib.idle_add(app.quit)
            except Exception:
                pass

    store.quit_callback = stop

    def terminate(*_args) -> None:
        """Leave no agent behind when the notebook closes this fork."""
        try:
            agent_store.shutdown()
        except Exception:
            pass
        try:
            stop()
        except Exception:
            pass
        clear_fork_server_record(fork_id)
        try:
            server.shutdown()
        except Exception:
            pass
        os._exit(0)

    for signal_name in ("SIGTERM", "SIGINT", "SIGHUP"):
        sig = getattr(signal, signal_name, None)
        if sig is None:
            continue
        try:
            signal.signal(sig, terminate)
        except Exception:
            pass
    _watch_fork_parent(terminate)

    title = ""
    try:
        category = (store.data.get("categories") or [{}])[0]
        todo = (category.get("todos") or [{}])[0]
        title = str(todo.get("name") or category.get("name") or "")
    except Exception:
        pass

    # Used by the automated tests and by headless sessions: the port still
    # runs, but no GTK window is created.
    if os.environ.get("NEOTODO_FORK_NO_WINDOW") == "1":
        write_fork_server_record(fork_id, port)
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            pass
        finally:
            clear_fork_server_record(fork_id)
            try:
                agent_store.shutdown()
            except Exception:
                pass
            try:
                server.shutdown()
            except Exception:
                pass
        return

    def ready(app, window) -> None:
        holder["app"] = app
        holder["window"] = window
        # Publish the port only once the window really exists, so the parent
        # never records a server whose window failed to open.
        write_fork_server_record(fork_id, port)

    try:
        run_fork_gtk_window(
            f"http://127.0.0.1:{port}/",
            title,
            on_close=stop,
            on_ready=ready,
        )
    finally:
        clear_fork_server_record(fork_id)
        # The window loop returned: no agent may keep running without it.
        try:
            agent_store.shutdown()
        except Exception:
            pass
        try:
            server.shutdown()
        except Exception:
            pass


def run_fork_window_process() -> None:
    url = _fork_arg("--fork-window")
    if not url:
        return

    def terminate(*_args) -> None:
        os._exit(0)

    for signal_name in ("SIGTERM", "SIGINT", "SIGHUP"):
        sig = getattr(signal, signal_name, None)
        if sig is None:
            continue
        try:
            signal.signal(sig, terminate)
        except Exception:
            pass
    _watch_fork_parent(terminate)
    run_fork_gtk_window(url, _fork_arg("--title", "NeoTodo"))


def run_server() -> None:
    store = Store(DATA_FILE)
    agent_store = AgentStore(AGENT_FILE)
    server = ThreadingHTTPServer(("127.0.0.1", 0), ApiHandler)
    ApiHandler.store = store
    ApiHandler.agent_store = agent_store
    port = server.server_address[1]
    print(f"NeoTodo preview: http://127.0.0.1:{port}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        # A headless run still owns everything it forked.
        try:
            agent_store.shutdown()
        except Exception:
            pass
        try:
            shutdown_forks()
        except Exception:
            pass


def main() -> None:
    if "--fork-app" in sys.argv:
        run_fork_app_process()
        return
    if "--fork-window" in sys.argv:
        run_fork_window_process()
        return
    if "--serve" in sys.argv:
        run_server()
    else:
        run_gtk()


if __name__ == "__main__":
    main()
