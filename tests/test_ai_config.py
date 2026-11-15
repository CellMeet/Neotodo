"""AI settings: provider masking, model curation and generated OpenCode config."""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import app


class AiConfigTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        root = Path(self.temp.name)
        self.root = root
        self._old = (
            app.AI_CONFIG_FILE, app.AI_OPENCODE_CONFIG, app.AI_ACTIVITY_FILE, app.DATA_DIR,
        )
        app.AI_CONFIG_FILE = root / "ai-config.json"
        app.AI_OPENCODE_CONFIG = root / "ai-opencode.json"
        app.AI_ACTIVITY_FILE = root / "agent-activity.log"
        app.DATA_DIR = root
        self.store = app.AgentStore(root / "agents.json")
        self.store._available_models = lambda: ["opencode/beam-free", "deepseek/test-model"]

    def tearDown(self) -> None:
        (app.AI_CONFIG_FILE, app.AI_OPENCODE_CONFIG, app.AI_ACTIVITY_FILE, app.DATA_DIR) = self._old
        self.temp.cleanup()

    def test_defaults_and_normalization(self):
        config = app.clean_ai_config({
            "default_mode": "execute",
            "notification_sound": "kazoo",
            "timeout_minutes": 999,
            "max_parallel": 0,
            "providers": [{"id": "Bad Id", "base_url": "ftp://x", "models": []}],
        })
        self.assertEqual(config["default_mode"], "chat")
        self.assertEqual(config["notification_sound"], "trainWhistle")
        self.assertEqual(config["timeout_minutes"], 120)
        self.assertEqual(config["max_parallel"], 12)
        self.assertEqual(config["providers"], [])

    def test_public_config_never_returns_api_keys(self):
        stored = app.write_ai_config({
            "providers": [{
                "id": "acme",
                "name": "Acme",
                "base_url": "https://example.test/v1",
                "api_key": "sk-secret",
                "models": ["alpha"],
            }],
        })
        self.assertEqual(stored["providers"][0]["api_key"], "sk-secret")
        public = app.ai_public_config(stored)
        self.assertNotIn("api_key", public["providers"][0])
        self.assertTrue(public["providers"][0]["api_key_set"])

    def test_generated_opencode_config_contains_provider(self):
        app.write_ai_config({
            "providers": [{
                "id": "acme",
                "name": "Acme",
                "base_url": "https://example.test/v1",
                "api_key": "sk-secret",
                "models": ["alpha", "beta"],
            }],
        })
        env = app.ai_opencode_env(app.read_ai_config())
        self.assertEqual(env["OPENCODE_CONFIG"], str(app.AI_OPENCODE_CONFIG))
        payload = json.loads(app.AI_OPENCODE_CONFIG.read_text(encoding="utf-8"))
        provider = payload["provider"]["acme"]
        self.assertEqual(provider["options"]["baseURL"], "https://example.test/v1")
        self.assertEqual(provider["options"]["apiKey"], "sk-secret")
        self.assertEqual(set(provider["models"]), {"alpha", "beta"})

    def test_model_curation_and_activity(self):
        app.write_ai_config({
            "enabled_models": ["opencode/beam-free"],
            "commands": [{"id": "summarize", "name": "Summarize", "prompt": "Do it."}],
        })
        payload = self.store.action({"action": "config"})
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["config"]["commands"][0]["id"], "summarize")
        self.assertIn("opencode/beam-free", payload["enabled_models"])

    def test_save_provider_preserves_unset_key(self):
        self.store.action({
            "action": "save_provider",
            "provider": {
                "id": "acme",
                "name": "Acme",
                "base_url": "https://example.test/v1",
                "api_key": "sk-first",
                "models": ["alpha"],
            },
        })
        payload = self.store.action({
            "action": "save_provider",
            "provider": {
                "id": "acme",
                "name": "Acme two",
                "base_url": "https://example.test/v1",
                "api_key": "",
                "models": ["alpha", "beta"],
            },
        })
        self.assertTrue(payload["ok"])
        stored = app.read_ai_config()
        provider = stored["providers"][0]
        self.assertEqual(provider["api_key"], "sk-first")
        self.assertEqual(provider["name"], "Acme two")
        self.assertEqual(provider["models"], ["alpha", "beta"])

    def test_test_provider_reuses_saved_key(self):
        self.store.action({
            "action": "save_provider",
            "provider": {
                "id": "acme",
                "name": "Acme",
                "base_url": "https://example.test/v1",
                "api_key": "sk-keep",
                "models": ["alpha"],
            },
        })
        seen = {}
        self.store._test_provider = lambda row: seen.update(row) or {"ok": True, "count": 0}
        result = self.store.action({
            "action": "test_provider",
            "provider": {"id": "acme", "base_url": "https://example.test/v1", "api_key": ""},
        })
        self.assertTrue(result["ok"])
        self.assertEqual(seen["api_key"], "sk-keep")

    def test_local_provider_needs_no_key(self):
        payload = self.store.action({
            "action": "save_provider",
            "provider": {
                "id": "ollama",
                "name": "Ollama",
                "base_url": "http://127.0.0.1:11434/v1",
                "models": ["qwen3:8b"],
            },
        })
        row = next(item for item in payload["providers"] if item["id"] == "ollama")
        self.assertEqual(row["status"], "local")
        self.assertFalse(row["api_key_set"])

    def test_agent_defaults_follow_per_kind_model(self):
        models = self.store.action({"action": "models"})["models"]
        self.assertTrue(models)
        chosen = models[-1]
        self.store.action({
            "action": "set_config",
            "config": {"agent_models": {"subtask": chosen}},
        })
        self.assertEqual(self.store._default_model("subtask"), chosen)

    def test_skill_discovery_reads_frontmatter(self):
        skill_dir = self.root / ".opencode" / "skills" / "git-release"
        skill_dir.mkdir(parents=True)
        (skill_dir / "SKILL.md").write_text(
            "---\nname: Git Release\ndescription: Prepare release notes\n---\n\nDo the work.\n",
            encoding="utf-8",
        )
        self.store._skill_roots = lambda: [(skill_dir.parent, "project", "Project · Test")]
        rows = self.store._skill_list()
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["id"], "git-release")
        self.assertEqual(rows[0]["name"], "Git Release")
        self.assertEqual(rows[0]["description"], "Prepare release notes")

    def test_activity_log_is_written_and_cleared(self):
        config = app.read_ai_config()
        app.ai_log_activity(config, {"event": "finish", "title": "Example"})
        rows = self.store._activity_tail()
        self.assertEqual(rows[-1]["title"], "Example")
        self.store.action({"action": "clear_activity"})
        self.assertEqual(self.store._activity_tail(), [])


if __name__ == "__main__":
    unittest.main()
