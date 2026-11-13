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
import sys
import threading
import time
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
AGENT_FILES_DIR = DATA_DIR / "agent-files"

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
    """Per-agent OpenCode sessions for the AI terminal.

    Every todo and subtask owns an independent OpenCode session. Planning
    agents run with the read-only plan agent; subtask executors run with
    --auto behind a global lock so only one of them edits the project at a
    time. Requests wait for the lock instead of being rejected.
    """

    def __init__(self, path: Path):
        self.path = path
        self.lock = threading.Lock()
        self.exec_lock = threading.Lock()
        self.live_lock = threading.Lock()
        self.live = {}
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

    def _run_opencode(self, agent_id: str, agent: dict, title: str, scope: dict,
                      message: str, model: str, mode: str,
                      file_args: list | None = None) -> tuple[str, str, str, dict]:
        opencode = shutil.which("opencode")
        if not opencode:
            raise RuntimeError(
                "OpenCode CLI not found. Install opencode and make sure it is on PATH."
            )
        cwd = Path(os.environ.get("NEOTODO_AGENT_CWD") or APP_DIR)
        if not cwd.exists():
            raise RuntimeError(f"Agent project directory not found: {cwd}")
        if mode == "build":
            if str(scope.get("kind") or "") == "subtask":
                prompt = self._executor_prompt(scope, title, message)
            else:
                prompt = self._build_prompt(scope, title, message)
        else:
            prompt = f"{self._system_prompt(scope, title)}\n\nUser message:\n{message}"
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
        try:
            process = subprocess.Popen(
                command,
                cwd=str(cwd),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
            )
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
                        self._update_live(agent_id, text="\n\n".join(texts[-6:]))
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
                    if output:
                        clean = re.sub(r"\x1b\[[0-9;]*m", "", str(output)).strip()
                        if clean:
                            process_lines.append("  " + "\n  ".join(clean.splitlines()[:8])[:700])
                    self._update_live(agent_id, process="\n".join(process_lines)[-12000:])
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
            reply = "\n\n".join(texts[-6:]).strip()
            if not reply:
                fallback = "\n".join(raw_lines).strip()
                fallback = re.sub(r"\x1b\[[0-9;]*m", "", fallback)
                code = process.returncode if process else "?"
                reply = fallback[-4000:] or f"The agent exited with code {code}."
            if process is not None and process.returncode not in (0, None) and not texts:
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
            return {
                "ok": True,
                "agent": agent,
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
        try:
            if mode == "build":
                self.exec_lock.acquire()
                try:
                    reply, opencode_session, process_text, usage = self._run_opencode(
                        agent_id, agent, title, scope, message, model, mode, file_args
                    )
                finally:
                    self.exec_lock.release()
            else:
                reply, opencode_session, process_text, usage = self._run_opencode(
                    agent_id, agent, title, scope, message, model, mode, file_args
                )
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
            updated = (history + [
                user_entry,
                assistant,
            ])[-40:]
        except Exception as error:
            return {"ok": False, "error": str(error)}
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
            session_usage = dict(stored["usage"])
        return {
            "ok": True,
            "title": title,
            "reply": reply,
            "messages": updated,
            "mode": mode,
            "provider": self._provider_for_model(model),
            "model": model,
            "usage": session_usage,
            "live": {},
            "files": persistent_files,
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
