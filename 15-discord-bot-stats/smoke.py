import asyncio
import os
from types import SimpleNamespace
from unittest.mock import patch
from app.bot import BotRunner
from app.services.stats import get_stats

assert get_stats(SimpleNamespace(guilds=[1, 2])) == {"servers": 2}
with patch.dict(os.environ, {}, clear=True):
    try:
        BotRunner().run()
        raise AssertionError("Missing token accepted")
    except ValueError as exc:
        assert str(exc) == "DISCORD_TOKEN is required"


class FakeClient:
    def __init__(self, *, intents):
        self.guilds = [1, 2, 3]

    def event(self, callback):
        self.on_ready = callback
        return callback

    def run(self, token):
        assert token == "mock-token-not-a-credential"
        asyncio.run(self.on_ready())


with patch.dict(os.environ, {"DISCORD_TOKEN": "mock-token-not-a-credential"}), patch(
    "app.bot.discord.Client", FakeClient
):
    BotRunner().run()
print(
    "PASS discord stats: missing token, mocked client, ready event, guild count; no network"
)
