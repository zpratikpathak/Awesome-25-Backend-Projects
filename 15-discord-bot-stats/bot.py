import discord
from discord.ext import commands
import os

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')

@bot.command()
async def stats(ctx):
    guild = ctx.guild
    await ctx.send(f'Server: {guild.name}\nMembers: {guild.member_count}')

if __name__ == '__main__':
    token = os.getenv('DISCORD_TOKEN', 'dummy-token')
    # bot.run(token) # Uncomment when running with real token
    print("Bot is ready to be run with a valid token.")
