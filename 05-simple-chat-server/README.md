# 05 — Simple Chat Server

<p align="center"><img src="logo.svg" width="160" height="80" alt="Chat bubbles logo"></p>

Express/Socket.IO global chat. Docker-only commands from this folder:
```sh
docker build -t backend05-check .
docker run --rm -p 3000:3000 backend05-check
docker run --rm --network none backend05-check npm test
```
Node.js 22 and dependencies stay inside image. Build requires registry access; tests use loopback only. Host installations and `.env` excluded; pass configuration with `-e`.

Optional environment: `PORT` (3000), `CORS_ORIGIN` (`*` or one browser origin), `NODE_ENV` (development exposes HTTP error stacks). Optional `.env` supported.

## Routes and events
- `GET /api/health`: `{"status":"UP"}`.
- Socket.IO endpoint `/socket.io/`; Socket.IO client required, not bare WebSocket messages.
- Client `join`: trimmed username string, 1–30 characters; letters, numbers, spaces, underscore, hyphen. One join per connection.
- Client `message`: `{"text":"Hello"}`, trimmed 1–500 characters; unjoined sender `Anonymous`.
- Server `history`: last 100 messages on connect.
- Server `message`: `{sender,text,timestamp}` broadcast to everyone.
- Server `user_joined`/`user_left`: username to other clients.
- Server `error`: validation failure string.

Socket payload limit 8192 bytes. Smoke check connects two real Engine.IO polling clients carrying Socket.IO packets. Tests HTTP health, history on connect, invalid/duplicate joins, invalid messages, bidirectional broadcast to sender and peer, disconnect notification, and history retention. No fake socket handlers or live external calls.

Limitations: single-process memory history; restart loses messages. No identity verification, rooms, persistence, rate limiting, or connection quotas. Duplicate names allowed. CORS is not authentication. Clients must render messages as text, not raw HTML. Deploy behind access/abuse controls.
