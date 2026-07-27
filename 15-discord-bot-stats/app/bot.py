from app.services.stats import get_stats
import os
import discord


class BotRunner:
    def run(self):
        token = os.getenv("DISCORD_TOKEN", "").strip()
        if not token:
            raise ValueError("DISCORD_TOKEN is required")
        client = discord.Client(intents=discord.Intents.default())

        @client.event
        async def on_ready():
            print("Bot stats:", get_stats(client))

        client.run(token)
