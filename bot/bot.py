import os
import discord

client = discord.Client()

print("Hello, world!")
token = os.getenv('DISCORD_TOKEN')
print(token)
