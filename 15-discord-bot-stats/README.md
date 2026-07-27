<p align="center"><img src="logo.svg" width="120" alt="Original bot statistics logo"></p>

# 15 Discord Bot Stats

discord.py client prints connected guild count on ready. No HTTP API or database.

## Docker startup and mocked test
Run from this project folder:

```sh
docker build -t backend-check-discord .
docker run --rm --network none backend-check-discord python smoke.py
docker run --rm -e DISCORD_TOKEN backend-check-discord
```

Real startup requires `DISCORD_TOKEN` already set securely in the invoking environment. Do not put tokens in command arguments, logs or source. Missing/blank token fails before client connection. Image excludes `.env*`; no environment file is loaded. No port exposed. Invite the bot to guilds with default nonprivileged intents.

## Behavior and test
On `on_ready`, logs `Bot stats: {'servers': N}` using actual `client.guilds`, not a hard-coded count. No commands or REST endpoints.

Smoke verifies missing-token rejection, guild counting and complete runner/ready-event wiring using a fake Discord client and a noncredential placeholder. Runs with `--network none`; no real Discord calls or credentials used.

Limitations: live Discord authentication/connectivity not tested. No persistent metrics, dashboard, HTTP API or command handler. Discord token permissions and deployment connectivity remain operator responsibilities.