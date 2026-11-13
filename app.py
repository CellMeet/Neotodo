#!/usr/bin/python3
from __future__ import annotations

import json
import mimetypes
import os
import re
import shutil
import socket
import subprocess
import sys
import threading
import urllib.error
import urllib.request
import uuid
from datetime import date, datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

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

PALETTE = [
    "#89b4fa", "#a6e3a1", "#f9e2af", "#fab387", "#cba6f7", "#94e2d5",
    "#f38ba8", "#f5c2e7", "#74c7ec", "#b4befe", "#eba0ac", "#f2cdcd",
    "#a3be8c", "#81a1c1", "#b48ead", "#8fbcbb", "#ff6b6b", "#ffd93d",
    "#6bcb77", "#4d96ff", "#9b5de5", "#f15bb5", "#00bbf9", "#00f5d4",
]

THEMES = [
    "violet", "tokyo", "space", "aurora", "ocean",
    "forest", "vintage", "alpine", "desert", "emerald",
]
QUIT_CALLBACK = None


def new_id() -> str:
    return uuid.uuid4().hex


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
        },
    }


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
                    category.setdefault("todos", []).append(todo)
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
                            todo.setdefault("subtasks", []).append(restored)
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
                    todo.setdefault("subtasks", []).append(subtask)
                    result["created"] = subtask["id"]
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
    """Per-agent chat sessions for the AI terminal.

    Agents are independent: the project agent is the Captain, each todo/subtask
    gets its own crew thread. Histories live beside NeoTodo.json.
    """

    def __init__(self, path: Path):
        self.path = path
        self.lock = threading.Lock()
        self.exec_lock = threading.Lock()

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

    @staticmethod
    def _config() -> tuple[str, str, str]:
        key = os.environ.get("DEEPSEEK_API_KEY") or os.environ.get("OPENAI_API_KEY") or ""
        base = (
            os.environ.get("NEOTODO_AGENT_BASE_URL")
            or os.environ.get("DEEPSEEK_BASE_URL")
            or os.environ.get("OPENAI_BASE_URL")
            or "https://api.deepseek.com/v1"
        ).rstrip("/")
        model = (
            os.environ.get("NEOTODO_AGENT_MODEL")
            or os.environ.get("DEEPSEEK_MODEL")
            or "deepseek-chat"
        )
        return key, base, model

    @staticmethod
    def _provider_name(base: str) -> str:
        text = (base or "").lower()
        if "deepseek" in text:
            return "DeepSeek"
        if "openai" in text:
            return "OpenAI"
        if "anthropic" in text or "claude" in text:
            return "Anthropic"
        return "AI"

    @staticmethod
    def _system_prompt(scope: dict, title: str) -> str:
        kind = str(scope.get("kind") or "captain")
        category = str(scope.get("category") or "")
        todo = str(scope.get("todo") or "")
        subtask = str(scope.get("subtask") or "")
        done = bool(scope.get("done"))
        context = str(scope.get("context") or "")
        base = (
            "You are an AI agent inside NeoTodo, a local GTK4/WebKit desktop todo app. "
            f"The project source is at {APP_DIR} on the user's current machine. "
            "The interface is HTML/CSS/JS; the backend is Python; the Linux shell is GTK4 + WebKitGTK; "
            "a Windows shell uses PySide6/Qt WebEngine. "
            "Be practical and concise. Use Markdown, complete code snippets, and exact file paths. "
            "You are part of a pirate crew: the project agent is the Captain; task and subtask agents are crew. "
            "Each crew agent owns one task thread. Do not pretend you can edit files unless the user asks you to describe the edit."
        )
        if kind == "captain":
            role = "You are the Captain, responsible for the whole NeoTodo project and for coordinating the crew's work."
        elif kind == "subtask":
            role = (
                f"You are the crew agent for the subtask '{subtask}' under todo '{todo}'"
                f"{f' in category {category}' if category else ''}. This subtask is {'done' if done else 'pending'}. "
                "Focus on this subtask and the smallest useful steps around it."
            )
        else:
            role = (
                f"You are the crew agent for the todo '{todo}'"
                f"{f' in category {category}' if category else ''}. "
                "Focus on this todo and its subtasks."
            )
        return f"{base}\n\n{role}\n\nCurrent workspace: {context}"

    def _chat(self, agent_id: str, title: str, scope: dict, history: list, message: str, key: str, base: str, model: str) -> tuple[str, list]:
        messages = [{"role": "system", "content": self._system_prompt(scope, title)}]
        messages.extend(history[-24:])
        messages.append({"role": "user", "content": message})
        payload = json.dumps({
            "model": model,
            "messages": messages,
            "temperature": 0.4,
            "max_tokens": 1800,
        }).encode("utf-8")
        request = urllib.request.Request(
            f"{base}/chat/completions",
            data=payload,
            headers={
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                data = json.loads(response.read().decode("utf-8"))
            reply = (data.get("choices") or [{}])[0].get("message", {}).get("content", "")
            reply = str(reply or "").strip()
            if not reply:
                raise ValueError("The agent returned an empty reply")
            updated = (history + [
                {"role": "user", "content": message},
                {"role": "assistant", "content": reply},
            ])[-40:]
            return reply, updated
        except urllib.error.HTTPError as error:
            try:
                detail = error.read().decode("utf-8", "replace")[:500]
            except Exception:
                detail = ""
            raise RuntimeError(f"Agent API error {error.code}: {detail or error.reason}") from error
        except urllib.error.URLError as error:
            raise RuntimeError(f"Could not reach the agent API: {error.reason}") from error
        except Exception as error:
            if isinstance(error, RuntimeError):
                raise
            raise RuntimeError(f"Agent request failed: {error}") from error

    def _execute_opencode(self, agent: dict, title: str, scope: dict, message: str) -> tuple[str, str]:
        opencode = shutil.which("opencode")
        if not opencode:
            raise RuntimeError(
                "OpenCode CLI not found. Install opencode and make sure it is on PATH, or set NEOTODO_AGENT_CWD."
            )
        cwd = Path(os.environ.get("NEOTODO_AGENT_CWD") or APP_DIR)
        if not cwd.exists():
            raise RuntimeError(f"Agent project directory not found: {cwd}")
        subtask = str(scope.get("subtask") or title)
        todo = str(scope.get("todo") or "")
        category = str(scope.get("category") or "")
        context = str(scope.get("context") or "")
        prompt = (
            "[NeoTodo crew executor]\n"
            f"You are the crew agent for the subtask '{subtask}'"
            f"{f' under todo {todo}' if todo else ''}"
            f"{f' in category {category}' if category else ''}.\n"
            f"Project root: {cwd}\n"
            "Complete the user's instruction for this subtask. Keep edits scoped to this subtask; "
            "do not refactor unrelated modules or overlap other agents' work. Other agents may be handling "
            "other subtasks, so only touch files needed for this subtask. The user has approved automatic execution.\n\n"
            f"Current workspace: {context}\n\n"
            f"User instruction:\n{message}"
        )
        session_id = str(agent.get("opencode_session") or "")
        command = [opencode, "run", "--standalone", "--auto", "--format", "json", "--title", f"NeoTodo · {title}"]
        if session_id:
            command += ["--session", session_id]
        command.append(prompt)
        try:
            process = subprocess.run(
                command,
                cwd=str(cwd),
                capture_output=True,
                text=True,
                timeout=900,
            )
        except subprocess.TimeoutExpired as error:
            raise RuntimeError("The crew agent timed out after 15 minutes.") from error
        texts = []
        new_session = session_id
        for line in (process.stdout or "").splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                event = json.loads(line)
            except Exception:
                continue
            event_session = event.get("sessionID") or event.get("sessionId")
            if event_session:
                new_session = str(event_session)
            if event.get("type") == "text":
                part = event.get("part") if isinstance(event.get("part"), dict) else {}
                text = part.get("text")
                if isinstance(text, str) and text.strip():
                    texts.append(text.strip())
        reply = "\n\n".join(texts[-6:]).strip()
        if not reply:
            fallback = (process.stderr or process.stdout or "").strip()
            fallback = re.sub(r"\x1b\[[0-9;]*m", "", fallback)
            reply = fallback[-4000:] or f"The crew agent exited with code {process.returncode}."
        if process.returncode != 0 and not texts:
            reply = f"{reply}\n\n(OpenCode exit code {process.returncode})"
        return reply[-20000:], new_session

    def action(self, payload: dict) -> dict:
        name = payload.get("action")
        if name == "list":
            with self.lock:
                data = self._load()
            return {"ok": True, "agents": data.get("agents", {})}
        if name == "get":
            agent_id = str(payload.get("agent_id") or "")
            if not agent_id:
                return {"ok": False, "error": "Missing agent"}
            with self.lock:
                data = self._load()
                agent = data.get("agents", {}).get(agent_id) or {"messages": []}
            _, base, _ = self._config()
            provider = os.environ.get("NEOTODO_AGENT_PROVIDER") or self._provider_name(base)
            return {"ok": True, "agent": agent, "provider": provider}
        if name == "clear":
            agent_id = str(payload.get("agent_id") or "")
            if not agent_id:
                return {"ok": False, "error": "Missing agent"}
            with self.lock:
                data = self._load()
                data.get("agents", {}).pop(agent_id, None)
                self._save(data)
            return {"ok": True, "agents": data.get("agents", {})}
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
        with self.lock:
            data = self._load()
            agent = data.get("agents", {}).get(agent_id) or {"messages": []}
            history = agent.get("messages") if isinstance(agent.get("messages"), list) else []
        mode = "execute" if str(scope.get("kind") or "") == "subtask" else "chat"
        try:
            if mode == "execute":
                self.exec_lock.acquire()
                try:
                    reply, opencode_session = self._execute_opencode(agent, title, scope, message)
                finally:
                    self.exec_lock.release()
                updated = (history + [
                    {"role": "user", "content": message},
                    {"role": "assistant", "content": reply},
                ])[-40:]
            else:
                key, base, model = self._config()
                if not key:
                    return {
                        "ok": False,
                        "error": "No AI key configured. Set DEEPSEEK_API_KEY (or OPENAI_API_KEY) in the environment before launching NeoTodo.",
                    }
                reply, updated = self._chat(agent_id, title, scope, history, message, key, base, model)
                opencode_session = ""
        except Exception as error:
            return {"ok": False, "error": str(error)}
        with self.lock:
            data = self._load()
            stored = data.setdefault("agents", {}).setdefault(agent_id, {"messages": []})
            stored["title"] = title
            stored["messages"] = updated
            stored["updated_at"] = datetime.now().isoformat(timespec="seconds")
            stored["mode"] = mode
            if opencode_session:
                stored["opencode_session"] = opencode_session
            data["agents"][agent_id] = stored
            self._save(data)
        _, base, _ = self._config()
        provider = os.environ.get("NEOTODO_AGENT_PROVIDER") or self._provider_name(base)
        return {
            "ok": True,
            "title": title,
            "reply": reply,
            "messages": updated,
            "mode": mode,
            "provider": provider,
            "agents": data["agents"],
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

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
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
            background = Gdk.RGBA()
            background.parse("#120b06")
            view = WebKit.WebView()
            view.set_background_color(background)
            try:
                settings = view.get_settings()
                settings.set_enable_developer_extras(True)
                settings.set_enable_webaudio(True)
                # Scrolling with the wheel is the first interaction in this
                # app, and WebKit otherwise keeps WebAudio suspended until a
                # click. This is a local desktop window, so allow audio to
                # start without a gesture.
                settings.set_media_playback_requires_user_gesture(False)
                settings.set_media_playback_allows_inline(True)
            except Exception:
                pass
            def decide_policy(_view, decision, decision_type):
                # WebKitGTK keeps WebAudio suspended until a click by default.
                # This desktop app is driven with the mouse wheel, so allow
                # autoplay (with sound) for our own navigation.
                if decision_type == WebKit.PolicyDecisionType.NAVIGATION_ACTION:
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
            view.load_uri(f"http://127.0.0.1:{port}/")
            window.set_child(view)
            window.connect("close-request", self._on_close)
            self.window = window
            window.present()

        def _on_close(self, window):
            return False

    app = NeoTodoApp()
    global QUIT_CALLBACK
    QUIT_CALLBACK = lambda: GLib.idle_add(app.quit)
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
