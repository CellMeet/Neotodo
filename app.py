#!/usr/bin/python3
from __future__ import annotations

import base64
import json
import mimetypes
import os
import re
import shutil
import socket
import subprocess

import startup
import sys
import threading
import time
import uuid
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
AGENT_FILES_DIR = DATA_DIR / "agent-files"
PAGE_CACHE_FILE = DATA_DIR / "last-page.html"
SOUNDS_DIR = DATA_DIR / "sounds"
NOTE_MATERIALS_DIR = DATA_DIR / "note-materials"
PICTURES_DIR = DATA_DIR / "pictures"
MUSIC_DIR = DATA_DIR / "music"
SNAPSHOT_FILE = DATA_DIR / "last-page.png"
DETACH_PREVIEW_FILE = DATA_DIR / "detach-preview.png"

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
    "violet", "tokyo", "space", "aurora", "ocean",
    "forest", "vintage", "alpine", "desert", "emerald",
    "rain", "field", "deco", "bauhaus",
]

# Paper colours used before the first CSS paint, so the window never flashes
# black, white or yellow while WebKit starts.
POSTCARD_PAPERS = {
    "violet": "#f4ecfa", "alpine": "#f7efe3", "ocean": "#eef5f6",
    "tokyo": "#17131f", "desert": "#f6e7cf", "forest": "#eef1e6",
    "aurora": "#0f1d23", "vintage": "#f4e7d7", "space": "#0d1322",
    "rain": "#e8eef4", "field": "#f6edcc", "deco": "#17141b",
    "bauhaus": "#f2efe7", "emerald": "#eef1e6",
}
QUIT_CALLBACK = None
FOLDER_PICK_CALLBACK = None

PROJECT_FILE_LIMIT = 160


def ensure_sounds_dir() -> Path:
    """Create a user-editable sounds folder and seed it with bundled files."""
    try:
        SOUNDS_DIR.mkdir(parents=True, exist_ok=True)
        bundled = WEB_DIR / "sounds"
        if bundled.is_dir():
            for src in bundled.iterdir():
                if not src.is_file():
                    continue
                dest = SOUNDS_DIR / src.name
                if not dest.exists():
                    shutil.copy2(src, dest)
    except Exception:
        pass
    return SOUNDS_DIR


def ensure_note_materials_dir() -> Path:
    """Create a user-editable note material folder seeded with bundled CSS."""
    try:
        NOTE_MATERIALS_DIR.mkdir(parents=True, exist_ok=True)
        bundled = WEB_DIR / "note-materials"
        if bundled.is_dir():
            for src in bundled.iterdir():
                if not src.is_file() or src.suffix.lower() != ".css":
                    continue
                dest = NOTE_MATERIALS_DIR / src.name
                if not dest.exists():
                    shutil.copy2(src, dest)
    except Exception:
        pass
    return NOTE_MATERIALS_DIR


def ensure_pictures_dir() -> Path:
    """Create the user's wallpaper folder and seed the bundled stills."""
    try:
        PICTURES_DIR.mkdir(parents=True, exist_ok=True)
        for name in ("notes-forest.jpg", "notes-mist.jpg", "notes-dusk.jpg"):
            src = WEB_DIR / name
            dest = PICTURES_DIR / name
            if src.is_file() and not dest.exists():
                shutil.copy2(src, dest)
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


def sanitize_wallpaper_static(value) -> str:
    """A static wallpaper is either built-in postcard art or a picture file."""
    if not isinstance(value, str):
        return ""
    name = value.strip()
    if name.startswith("art:"):
        return name if name[4:] in THEMES else ""
    return sanitize_picture_name(name, PICTURE_IMAGE_EXTS)


def sanitize_wallpaper_settings(settings: dict) -> None:
    """Keep pattern (wallpaper) and colour (theme) as independent choices."""
    ensure_pictures_dir()
    postcard = str(settings.get("resolved_postcard") or settings.get("postcard") or "violet")
    if postcard not in THEMES:
        postcard = "violet"
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


def note_material_file_names() -> list:
    ensure_note_materials_dir()
    try:
        return sorted(
            item.name for item in NOTE_MATERIALS_DIR.iterdir()
            if item.is_file() and item.suffix.lower() == ".css"
        )
    except Exception:
        return []


def sound_file_names() -> list:
    ensure_sounds_dir()
    try:
        return sorted(
            item.name for item in SOUNDS_DIR.iterdir()
            if item.is_file() and item.suffix.lower() in {".wav", ".mp3", ".ogg", ".flac", ".m4a"}
        )
    except Exception:
        return []


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
            "postcard": "violet",
            "resolved_postcard": "violet",
            "light_postcard": "violet",
            "dark_postcard": "tokyo",
            "font": "serif",
            "note_font": "pen",
            "scale": 1,
            "show_time_cost": False,
            "focus_count": 0,
            "focus_log": [],
            "title_offset": 0,
            "title_icon_size": 48,
            "caret_blink": False,
            "caret_shape": "line",
            "caret_color": "#1b1b1b",
            "note_material": "paper",
            "note_background": "",
            "note_background_image": "",
            "note_blur": 16,
            "sticker_backgrounds": {},
            "wallpaper_mode": "static",
            "wallpaper_static": "art:violet",
            "wallpaper_dynamic": "",
        },
    }


def _activity_stamp(item: dict) -> float:
    """Latest meaningful timestamp for ordering; 0 when no usable date."""
    stamp = 0.0
    for key in ("created_at", "completed_at"):
        value = item.get(key)
        if not value:
            continue
        try:
            stamp = max(stamp, datetime.fromisoformat(str(value)).timestamp())
        except Exception:
            continue
    return stamp


def load_data() -> dict:
    try:
        if not DATA_FILE.exists() and LEGACY_FILE.exists():
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            LEGACY_FILE.replace(DATA_FILE)
        if DATA_FILE.exists():
            data = json.loads(DATA_FILE.read_text())
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
                    images = todo.get("images")
                    if not isinstance(images, list):
                        images = []
                    if todo.get("image") and not images:
                        images = [todo["image"]]
                    todo["images"] = [str(image) for image in images if image]
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
                        sub_images = subtask.get("images")
                        if not isinstance(sub_images, list):
                            sub_images = []
                        subtask["images"] = [str(image) for image in sub_images if image]
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
            settings.setdefault("postcard", "violet")
            settings.setdefault("resolved_postcard", "violet")
            if settings.get("postcard") not in THEMES and settings.get("postcard") != "random":
                settings["postcard"] = "violet"
            if settings.get("resolved_postcard") not in THEMES:
                settings["resolved_postcard"] = "violet"
            light_themes = ("violet", "ocean", "forest", "vintage", "alpine", "desert", "emerald")
            dark_themes = ("tokyo", "space", "aurora")
            if settings.get("light_postcard") not in light_themes:
                settings["light_postcard"] = (
                    settings["resolved_postcard"] if settings.get("resolved_postcard") in light_themes else "violet"
                )
            if settings.get("dark_postcard") not in dark_themes:
                settings["dark_postcard"] = (
                    settings["resolved_postcard"] if settings.get("resolved_postcard") in dark_themes else "tokyo"
                )
            settings.setdefault("font", "serif")
            settings.setdefault("note_font", "pen")
            settings.setdefault("scale", 1)
            settings.setdefault("show_time_cost", False)
            try:
                settings["title_offset"] = max(-500, min(500, int(settings.get("title_offset", 0))))
            except (TypeError, ValueError):
                settings["title_offset"] = 0
            try:
                settings["title_icon_size"] = max(24, min(96, int(settings.get("title_icon_size", 48))))
            except (TypeError, ValueError):
                settings["title_icon_size"] = 48
            try:
                settings["focus_count"] = max(0, int(settings.get("focus_count", 0)))
            except (TypeError, ValueError):
                settings["focus_count"] = 0
            if not isinstance(settings.get("focus_log"), list):
                settings["focus_log"] = []
            settings["caret_blink"] = settings.get("caret_blink") is True
            settings["note_material"] = "blur" if settings.get("note_material") == "blur" else "paper"
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
            sanitize_wallpaper_settings(settings)
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


def save_data(data: dict) -> None:
    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        tmp = DATA_FILE.with_suffix(".tmp")
        tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2))
        tmp.replace(DATA_FILE)
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
        self.data = load_data()
        with self.lock:
            self._archive_finished_weeks()
            # Persist load-time migrations such as created_at/time_cost.
            save_data(self.data)

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
                                "image": todo.get("image", ""),
                                "images": todo.get("images", []),
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

    def boot_colors(self) -> dict:
        settings = self.data.get("settings") if isinstance(self.data, dict) else {}
        if not isinstance(settings, dict):
            settings = {}
        theme = settings.get("resolved_postcard") or settings.get("postcard") or "violet"
        return {"paper": POSTCARD_PAPERS.get(str(theme), "#f7efe3")}

    def state(self) -> dict:
        with self.lock:
            self._archive_finished_weeks()
            # Persist load-time migrations such as created_at/time_cost.
            save_data(self.data)
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

    def _image_owner(self, payload):
        _, todo = self._find_todo(payload.get("id"))
        subtask = self._find_subtask(todo, payload.get("subtask_id"))
        if todo is None:
            return None, None, "Todo not found"
        if payload.get("subtask_id") and subtask is None:
            return None, None, "Subtask not found"
        return todo, subtask or todo, None

    def action(self, payload: dict) -> dict:
        # The native folder picker is async on the GTK main loop; never hold
        # the store lock while the user is choosing a directory.
        if payload.get("action") == "choose_project_folder":
            if FOLDER_PICK_CALLBACK is None:
                return {"ok": False, "error": "Folder picker is not available"}
            path = FOLDER_PICK_CALLBACK()
            return {"ok": True, "path": path or "", "cancelled": not bool(path), "state": self.state()}
        with self.lock:
            name = payload.get("action")
            result = {}
            error = None
            if name == "quit":
                if QUIT_CALLBACK:
                    QUIT_CALLBACK()
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
                        "image": "",
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
                            for key in ("id", "name", "note", "image", "images", "created_at")
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
                    forked_images = subtask.get("images")
                    if not isinstance(forked_images, list):
                        forked_images = []
                    forked_images = [
                        item for item in forked_images
                        if isinstance(item, str) and item
                    ]
                    forked_todo = {
                        "id": new_id(),
                        "name": str(subtask.get("name") or "Untitled"),
                        "done": False,
                        "created_at": now,
                        "completed_at": None,
                        "time_cost": None,
                        "note": str(subtask.get("note") or ""),
                        "image": str(subtask.get("image") or ""),
                        "images": forked_images,
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
                    if subtask.get("created_at"):
                        try:
                            start = datetime.fromisoformat(subtask["created_at"])
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
                    result["files"] = list_folder_files(todo.get("project_folder") or "")
            elif name == "open_sounds_folder":
                ensure_sounds_dir()
                try:
                    if sys.platform == "win32":
                        os.startfile(str(SOUNDS_DIR))
                    elif sys.platform == "darwin":
                        subprocess.Popen(["open", str(SOUNDS_DIR)], start_new_session=True)
                    else:
                        subprocess.Popen(["xdg-open", str(SOUNDS_DIR)], start_new_session=True,
                                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                except Exception as open_error:
                    error = str(open_error)
                result["folder"] = str(SOUNDS_DIR)
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
                            ensure_pictures_dir()
                            stem = re.sub(r"[^\w-]+", "-", Path(str(name)).stem, flags=re.UNICODE).strip("-_")[:48] or "wallpaper"
                            dest = PICTURES_DIR / f"{stem}-{new_id()[:8]}{suffix}"
                            try:
                                dest.write_bytes(raw)
                                result["file"] = dest.name
                                result["kind"] = kind
                            except Exception as write_error:
                                error = str(write_error)
            elif name == "sound_files":
                result["files"] = sound_file_names()
                result["folder"] = str(SOUNDS_DIR)
            elif name == "save_page_cache":
                html = payload.get("html")
                if not isinstance(html, str) or len(html) > 4_000_000:
                    error = "Invalid page cache"
                else:
                    try:
                        PAGE_CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
                        tmp = PAGE_CACHE_FILE.with_suffix(".tmp")
                        tmp.write_text(html, encoding="utf-8")
                        tmp.replace(PAGE_CACHE_FILE)
                    except Exception as cache_error:
                        error = f"Could not save page cache: {cache_error}"
            elif name == "clear_page_cache":
                try:
                    PAGE_CACHE_FILE.unlink(missing_ok=True)
                except Exception:
                    pass
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
            elif name == "add_images":
                todo, owner, owner_error = self._image_owner(payload)
                incoming = payload.get("images")
                if owner_error:
                    error = owner_error
                elif not isinstance(incoming, list) or not all(isinstance(item, str) for item in incoming):
                    error = "Invalid images"
                elif sum(len(item) for item in incoming) > 24_000_000:
                    error = "Images are too large"
                else:
                    images = owner.setdefault("images", [])
                    images.extend(item for item in incoming if item)
                    owner["images"] = images
            elif name == "remove_image":
                todo, owner, owner_error = self._image_owner(payload)
                try:
                    index = int(payload.get("index"))
                except (TypeError, ValueError):
                    index = -1
                if owner_error:
                    error = owner_error
                else:
                    images = owner.get("images")
                    if not isinstance(images, list) or not images:
                        images = [owner["image"]] if owner.get("image") else []
                    if index < 0 or index >= len(images):
                        error = "Picture not found"
                    else:
                        images.pop(index)
                        owner["images"] = images
                        owner["image"] = images[0] if images else ""
            elif name == "save_image":
                _, todo = self._find_todo(payload.get("id"))
                image = payload.get("image")
                if todo is None:
                    error = "Todo not found"
                elif image is not None and not isinstance(image, str):
                    error = "Invalid image"
                elif image and len(image) > 8_000_000:
                    error = "Image is too large"
                elif image:
                    todo["image"] = image
                else:
                    todo.pop("image", None)
            elif name == "save_settings":
                incoming = payload.get("settings")
                if not isinstance(incoming, dict):
                    error = "Invalid settings"
                else:
                    current = self.data.setdefault("settings", {})
                    current["theme"] = "postcard"
                    if incoming.get("postcard") in THEMES or incoming.get("postcard") == "random":
                        current["postcard"] = incoming["postcard"]
                    if incoming.get("resolved_postcard") in THEMES:
                        current["resolved_postcard"] = incoming["resolved_postcard"]
                    if incoming.get("light_postcard") in ("violet", "ocean", "forest", "vintage", "alpine", "desert", "emerald"):
                        current["light_postcard"] = incoming["light_postcard"]
                    if incoming.get("dark_postcard") in ("tokyo", "space", "aurora"):
                        current["dark_postcard"] = incoming["dark_postcard"]
                    if current.get("theme") == "postcard" and current.get("postcard") in THEMES:
                        current["resolved_postcard"] = current["postcard"]
                    if current.get("resolved_postcard") not in THEMES:
                        current["resolved_postcard"] = "violet"
                    if incoming.get("font") in ("serif", "humanist", "bookman", "mono", "hand", "pen"):
                        current["font"] = incoming["font"]
                    if incoming.get("note_font") in ("serif", "humanist", "bookman", "mono", "hand", "pen"):
                        current["note_font"] = incoming["note_font"]
                    if isinstance(incoming.get("show_time_cost"), bool):
                        current["show_time_cost"] = incoming["show_time_cost"]
                    try:
                        current["focus_count"] = max(0, int(incoming.get("focus_count", 0)))
                    except (TypeError, ValueError):
                        pass
                    if isinstance(incoming.get("focus_log"), list):
                        current["focus_log"] = incoming["focus_log"][-200:]
                    try:
                        current["title_offset"] = max(-500, min(500, int(incoming.get("title_offset", 0))))
                    except (TypeError, ValueError):
                        pass
                    try:
                        current["title_icon_size"] = max(24, min(96, int(incoming.get("title_icon_size", 48))))
                    except (TypeError, ValueError):
                        pass
                    if isinstance(incoming.get("caret_blink"), bool):
                        current["caret_blink"] = incoming["caret_blink"]
                    if incoming.get("caret_shape") in ("line", "block"):
                        current["caret_shape"] = incoming["caret_shape"]
                    if incoming.get("note_material") in ("paper", "blur"):
                        current["note_material"] = incoming["note_material"]
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
                    if "sticker_backgrounds" in incoming:
                        current["sticker_backgrounds"] = sanitize_sticker_backgrounds(incoming.get("sticker_backgrounds"))
                    if incoming.get("wallpaper_mode") in (*WALLPAPER_MODES, "theme"):
                        current["wallpaper_mode"] = incoming["wallpaper_mode"]
                    if isinstance(incoming.get("wallpaper_static"), str):
                        current["wallpaper_static"] = incoming["wallpaper_static"]
                    if isinstance(incoming.get("wallpaper_dynamic"), str):
                        current["wallpaper_dynamic"] = incoming["wallpaper_dynamic"]
                    sanitize_wallpaper_settings(current)
                    try:
                        scale = float(incoming.get("scale", 1))
                        current["scale"] = max(0.85, min(1.25, scale))
                    except (TypeError, ValueError):
                        pass
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
            save_data(self.data)
            return {"ok": True, "state": self.state(), **result}


class AgentStore:
    """Per-agent OpenCode sessions for the AI terminal.

    Every todo and subtask owns an independent OpenCode session. Planning
    agents run with the read-only plan agent; subtask executors run with
    --auto behind a global lock so only one of them edits the project at a
    time. Requests wait for the lock instead of being rejected.
    """

    def __init__(self, path: Path):
        self.path = path
        self.lock = threading.Lock()
        # Build agents run in parallel. Only agents whose instructions name a
        # file that another running agent is already touching wait for it.
        self.build_cond = threading.Condition()
        self.build_active = {}
        self.build_waiting = {}
        self.build_seq = 0
        self.running_agents = set()
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

    def _load(self) -> dict:
        try:
            data = json.loads(self.path.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                data.setdefault("agents", {})
                return data
        except Exception:
            pass
        return {"agents": {}}

    def _save(self, data: dict) -> None:
        try:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            tmp = self.path.with_suffix(".tmp")
            tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            tmp.replace(self.path)
        except Exception:
            pass

    def _available_models(self) -> list:
        now = time.time()
        if self.models_cache is not None and now - self.models_at < 600:
            return self.models_cache
        opencode = shutil.which("opencode")
        models = []
        if opencode:
            try:
                process = subprocess.run(
                    [opencode, "models", "--standalone"],
                    capture_output=True,
                    text=True,
                    timeout=40,
                )
                models = [
                    line.strip()
                    for line in (process.stdout or "").splitlines()
                    if re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", line.strip())
                ]
            except Exception:
                models = []
        if not models:
            models = ["deepseek/deepseek-flash"]
        self.models_cache = models
        self.models_at = now
        return models

    @staticmethod
    def _configured_model() -> str:
        override = os.environ.get("NEOTODO_AGENT_MODEL") or ""
        if re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", override):
            return override
        config = Path(
            os.environ.get("OPENCODE_CONFIG")
            or (Path.home() / ".config" / "opencode" / "opencode.jsonc")
        )
        try:
            text = config.read_text(encoding="utf-8")
            match = re.search(r'"model"\s*:\s*"([A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+)"', text)
            if match:
                return match.group(1)
        except Exception:
            pass
        return ""

    def _default_model(self) -> str:
        models = self._available_models()
        configured = self._configured_model()
        if configured and configured in models:
            return configured
        for model in models:
            if model.startswith("deepseek/"):
                return model
        return models[0] if models else "deepseek/deepseek-flash"

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
            "other subtasks, so only touch files needed for this subtask. The user has approved automatic execution.\n\n"
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

    @staticmethod
    def _normalize_mode(value, kind: str) -> str:
        text = str(value or "")
        if text == "execute":
            text = "build"
        if text in ("chat", "build"):
            return text
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
                if agent_id in self.interrupts:
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
                      partial_cb=None) -> tuple[str, str, str, dict]:
        opencode = shutil.which("opencode")
        if not opencode:
            raise RuntimeError(
                "OpenCode CLI not found. Install opencode and make sure it is on PATH."
            )
        # A linked project folder becomes the agent's workspace, so subtasks
        # can read that project's files as their work content.
        project_folder = str(scope.get("project_folder") or "").strip()
        project_dir = Path(project_folder).expanduser() if project_folder else None
        if project_dir is not None and project_dir.is_dir():
            cwd = project_dir
        else:
            cwd = Path(os.environ.get("NEOTODO_AGENT_CWD") or APP_DIR)
        if not cwd.exists():
            raise RuntimeError(f"Agent project directory not found: {cwd}")
        project_key = str(project_dir.resolve()) if project_dir is not None and project_dir.is_dir() else ""
        shared_key = f"{str(scope.get('todo_id') or '')}|{project_key}" if project_key else ""
        if mode == "build":
            if str(scope.get("kind") or "") == "subtask":
                prompt = self._executor_prompt(scope, title, message)
            else:
                prompt = self._build_prompt(scope, title, message)
        else:
            prompt = f"{self._system_prompt(scope, title)}\n\nUser message:\n{message}"
        if project_dir is not None and project_dir.is_dir():
            files = list_folder_files(str(project_dir), limit=120)
            listing = "\n".join(f"- {name}" for name in files) if files else "(no readable files found)"
            prompt += (
                f"\n\nActive project folder: {project_dir}\n"
                "Read files from this folder as the work content for this todo/subtask. "
                "Keep outputs inside this folder when the user asks you to write files.\n"
                f"Files:\n{listing}"
            )
        if shared_key:
            prompt += self._shared_file_context(shared_key, project_dir)
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
            process = subprocess.Popen(
                command,
                cwd=str(cwd),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
            )
            with self.procs_lock:
                if agent_id in self.interrupts:
                    self.interrupts.discard(agent_id)
                    raise RuntimeError("已打断")
                self.procs[agent_id] = process
            deadline = time.time() + 900
            assert process.stdout is not None
            for line in process.stdout:
                if time.time() > deadline:
                    process.kill()
                    raise RuntimeError("The agent timed out after 15 minutes.")
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
                process.kill()
                process.wait(timeout=5)
        finally:
            with self.procs_lock:
                self.procs.pop(agent_id, None)
                interrupted = agent_id in self.interrupts
                self.interrupts.discard(agent_id)
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
        return reply[-20000:], new_session, "\n".join(process_lines)[-12000:], usage

    def action(self, payload: dict) -> dict:
        name = payload.get("action")
        if name == "list":
            with self.lock:
                data = self._load()
            return {"ok": True, "agents": data.get("agents", {})}
        if name == "models":
            return {
                "ok": True,
                "models": self._available_models(),
                "default_model": self._default_model(),
            }
        if name == "get":
            agent_id = str(payload.get("agent_id") or "")
            if not agent_id:
                return {"ok": False, "error": "Missing agent"}
            with self.lock:
                data = self._load()
                agent = data.get("agents", {}).get(agent_id) or {"messages": []}
            default_model = self._default_model()
            model = agent.get("model") or default_model
            kind = "subtask" if agent_id.startswith("subtask:") else "captain"
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
                "models": self._available_models(),
                "default_model": default_model,
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
                    existing = next((m for m in metas if m["name"] == name), None)
                    if existing is None and len(metas) >= 20:
                        continue
                    previous_size = int(existing.get("size") or 0) if existing else 0
                    if total + len(raw) - previous_size > 50_000_000:
                        continue
                    target = folder / name
                    try:
                        target.write_bytes(raw)
                    except Exception:
                        continue
                    total += len(raw) - previous_size
                    metas = [m for m in metas if m["name"] != name]
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
                    existing = next((m for m in metas if m["name"] == name), None)
                    if existing is None and len(metas) >= 20:
                        continue
                    previous_size = int(existing.get("size") or 0) if existing else 0
                    if total + len(raw) - previous_size > 50_000_000:
                        continue
                    target = folder / name
                    try:
                        target.write_bytes(raw)
                    except Exception:
                        continue
                    total += len(raw) - previous_size
                    metas = [m for m in metas if m["name"] != name]
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
        if name == "interrupt":
            agent_id = str(payload.get("agent_id") or "").strip()
            if not agent_id:
                return {"ok": False, "error": "Missing agent"}
            with self.procs_lock:
                process = self.procs.get(agent_id)
                if process is not None and process.poll() is None:
                    self.interrupts.add(agent_id)
                else:
                    process = None
            if process is None:
                # The agent may still be waiting in the FIFO queue.
                with self.build_cond:
                    queued = self.build_waiting.pop(agent_id, None)
                    if queued is not None or agent_id in self.build_active:
                        self.interrupts.add(agent_id)
                    self.build_cond.notify_all()
                if queued is None:
                    return {"ok": True, "interrupted": False}
                return {"ok": True, "interrupted": True, "queued": True}
            try:
                process.terminate()
            except Exception:
                try:
                    process.kill()
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
        kind = str(scope.get("kind") or "")
        with self.lock:
            data = self._load()
            agent = data.get("agents", {}).get(agent_id) or {"messages": []}
            history = agent.get("messages") if isinstance(agent.get("messages"), list) else []
        mode = self._normalize_mode(payload.get("mode") or agent.get("mode"), kind)
        requested = str(payload.get("model") or agent.get("model") or "").strip()
        models = self._available_models()
        model = requested if requested in models else self._default_model()
        file_args, persistent_files = self._agent_file_args(agent_id, agent)
        with self.lock:
            data = self._load()
            stored = data.setdefault("agents", {}).setdefault(agent_id, {"messages": []})
            messages = stored.get("messages") if isinstance(stored.get("messages"), list) else []
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

        def save_partial(reply_text, process_text):
            self._save_partial(agent_id, title, model, mode, reply_text, process_text)

        def worker():
            try:
                conflicts = set()
                try:
                    if mode == "build":
                        project_key = self._project_key(scope)
                        intended = self._intended_paths(f"{title}\n{message}")
                        if not self._acquire_build_slot(agent_id, project_key, intended):
                            reply, opencode_session, process_text = "已打断。", "", ""
                            usage = {"tokens": 0, "cost": 0.0, "context": 0}
                        else:
                            try:
                                reply, opencode_session, process_text, usage = self._run_opencode(
                                    agent_id, agent, title, scope, message, model, mode, file_args, save_partial
                                )
                            finally:
                                conflicts = self._release_build_slot(agent_id)
                    else:
                        reply, opencode_session, process_text, usage = self._run_opencode(
                            agent_id, agent, title, scope, message, model, mode, file_args, save_partial
                        )
                    if conflicts:
                        reply = (reply + "\n\n(注意：以下文件与并行 agent 同时修改，请检查是否冲突："
                                 + ", ".join(sorted(conflicts)) + "）").strip()
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
                    user_entry = {"role": "user", "content": message}
                    updated = (history + [user_entry, assistant])[-40:]
                except Exception as error:
                    self._finish_agent_error(agent_id, title, model, mode, str(error))
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
            finally:
                with self.procs_lock:
                    self.running_agents.discard(agent_id)
                with self.live_lock:
                    self.live.pop(agent_id, None)

        with self.procs_lock:
            self.running_agents.add(agent_id)
        threading.Thread(target=worker, daemon=True).start()
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

    def _send_media(self, candidate: Path) -> None:
        """Serve an audio file with byte ranges so seeking works in WebKit."""
        content_type = mimetypes.guess_type(str(candidate))[0] or "application/octet-stream"
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
            name = unquote(parsed.path.rsplit("/", 1)[-1])
            if not name or Path(name).name != name:
                self._json(404, {"ok": False, "error": "Not found"})
                return
            ensure_sounds_dir()
            candidate = SOUNDS_DIR / name
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
        if parsed.path == "/page-cache":
            try:
                if not PAGE_CACHE_FILE.exists() or PAGE_CACHE_FILE.stat().st_size > 4_000_000:
                    raise ValueError
                body = PAGE_CACHE_FILE.read_bytes()
            except Exception:
                self._json(404, {"ok": False, "error": "No page cache"})
                return
            self._send(200, body, "text/html; charset=utf-8")
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
                raw = resolved.read_text(encoding="utf-8")
                colors = self.store.boot_colors()
                # Keep the HTML tiny: the state is fetched after the first
                # paint instead of inlining a 1.2 MB snapshot that delayed
                # DOMContentLoaded and the window reveal.
                inject = f'<script>window.__BOOT_PAPER__={json.dumps(colors["paper"])};</script>'
                raw = raw.replace("<!-- BOOT_DATA -->", inject, 1)
                body = raw.encode("utf-8")
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
        if path not in ("/api/action", "/api/agent"):
            self._json(404, {"ok": False, "error": "Not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
            if path == "/api/agent":
                result = self.agent_store.action(payload)
            else:
                result = self.store.action(payload)
            self._json(200 if result.get("ok") else 400, result)
        except Exception as error:
            self._json(400, {"ok": False, "error": str(error)})


def start_server(store: Store):
    ensure_sounds_dir()
    ensure_note_materials_dir()
    ensure_pictures_dir()
    ensure_music_dir()
    # A fixed loopback port keeps the browser origin stable across launches,
    # so localStorage (volume, mute, panel geometry, caret choices) survives.
    # If another copy already owns it, fall back to an ephemeral port.
    try:
        server = ThreadingHTTPServer(("127.0.0.1", 47321), ApiHandler)
    except OSError:
        server = ThreadingHTTPServer(("127.0.0.1", 0), ApiHandler)
    ApiHandler.store = store
    ApiHandler.agent_store = AgentStore(AGENT_FILE)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, server.server_address[1]


def run_gtk() -> None:
    import gi
    gi.require_version("Gtk", "4.0")
    gi.require_version("WebKit", "6.0")
    gi.require_version("Gdk", "4.0")
    from gi.repository import Gdk, GLib, Gtk, WebKit

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
    boot_paper = store.boot_colors().get("paper", "#f7efe3")
    try:
        provider = Gtk.CssProvider()
        provider.load_from_data(
            f"window, window.background {{ background-color: {boot_paper}; }}".encode("utf-8")
        )
        Gtk.StyleContext.add_provider_for_display(
            Gdk.Display.get_default(), provider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        )
    except Exception:
        pass
    server, port = start_server(store)

    class NeoTodoApp(Gtk.Application):
        def __init__(self):
            super().__init__(application_id="io.github.neotodo")
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

            global FOLDER_PICK_CALLBACK
            FOLDER_PICK_CALLBACK = pick_project_folder

            background = Gdk.RGBA()
            background.parse(boot_paper)
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
            window.connect("notify::is-active", self._on_active_changed)
            started_at = time.monotonic()
            revealed = {"done": False}
            overlay = Gtk.Overlay()
            overlay.set_child(view)
            preview = startup.make_preview(SNAPSHOT_FILE)
            if preview is not None:
                overlay.add_overlay(preview)

            window.set_child(overlay)
            self._active_once = False
            if preview is not None:
                # The last screen is a local PNG, so it appears immediately.
                # The live WebView keeps loading underneath it.
                revealed["done"] = True
                window.present()
                print("[startup] last-page preview shown immediately", flush=True)

            def drop_preview():
                nonlocal preview
                if preview is None:
                    return
                try:
                    overlay.remove_overlay(preview)
                except Exception:
                    pass
                preview = None

            def reveal_window(reason="ready"):
                if revealed["done"]:
                    return False
                revealed["done"] = True
                window.present()
                try:
                    print(f"[startup] window shown after {(time.monotonic() - started_at) * 1000:.0f} ms ({reason})", flush=True)
                except Exception:
                    pass
                return False

            def poll_ready():
                if revealed["done"]:
                    return False

                def evaluated(target, result, _data=None):
                    state = 0
                    try:
                        value = target.evaluate_javascript_finish(result)
                        state = int(value.to_int32()) if value is not None else 0
                    except Exception:
                        state = 0
                    if state:
                        GLib.idle_add(drop_preview)
                        GLib.idle_add(reveal_window, "cache" if state == 1 else "app")
                    else:
                        GLib.timeout_add(16, poll_ready)
                    return False

                script = (
                    "(() => {"
                    "  const f = document.getElementById('boot-preview');"
                    "  if (f) { try {"
                    "    const d = f.contentDocument;"
                    "    if (d && d.readyState === 'complete' && d.body && d.body.scrollHeight > 0) return 1;"
                    "  } catch (e) {} }"
                    "  if (document.body && document.body.classList.contains('app-ready')) return 2;"
                    "  return 0;"
                    "})()"
                )
                try:
                    view.evaluate_javascript(script, -1, None, None, None, evaluated, None)
                except Exception:
                    GLib.timeout_add(16, poll_ready)
                return False

            def on_load_changed(_view, event):
                if event == WebKit.LoadEvent.FINISHED:
                    GLib.timeout_add(0, poll_ready)
                    GLib.timeout_add(300, lambda: (drop_preview(), reveal_window("load-fallback")))
                return False

            view.connect("load-changed", on_load_changed)
            GLib.timeout_add(1200, lambda: (drop_preview(), reveal_window("global-fallback")))
            view.load_uri(f"http://127.0.0.1:{port}/?desktop=1")

        def _shutdown(self):
            for detached_window, _view in getattr(self, "detached_windows", []):
                try:
                    detached_window.destroy()
                except Exception:
                    pass
            self.quit()

        def capture_and_quit(self):
            if getattr(self, "_closing", False):
                return
            self._closing = True
            view = getattr(self, "view", None)
            if view is None:
                self._shutdown()
                return
            startup.capture_view(view, SNAPSHOT_FILE, self._shutdown)

        def _on_close(self, window):
            if getattr(self, "_closing", False):
                return False
            self._closing = True
            view = getattr(self, "view", None)
            if view is None:
                self._shutdown()
                return False
            startup.capture_view(view, SNAPSHOT_FILE, self._shutdown)
            return True

        def _on_active_changed(self, window, _pspec):
            if window.get_property("is-active"):
                self._active_once = True
                return
            # Ignore the initial inactive notification before the app is up.
            if not getattr(self, "_active_once", False):
                return
            view = getattr(self, "view", None)
            if view is not None and not getattr(self, "_closing", False):
                startup.capture_view(view, SNAPSHOT_FILE)

    app = NeoTodoApp()
    global QUIT_CALLBACK
    QUIT_CALLBACK = lambda: GLib.idle_add(app.capture_and_quit)
    app.run(None)


def run_server() -> None:
    store = Store(DATA_FILE)
    server = ThreadingHTTPServer(("127.0.0.1", 0), ApiHandler)
    ApiHandler.store = store
    ApiHandler.agent_store = AgentStore(AGENT_FILE)
    port = server.server_address[1]
    print(f"NeoTodo preview: http://127.0.0.1:{port}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


def main() -> None:
    if "--serve" in sys.argv:
        run_server()
    else:
        run_gtk()


if __name__ == "__main__":
    main()
