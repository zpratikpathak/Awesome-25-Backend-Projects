# 01 — URL Shortener

<p align="center"><img src="logo.svg" width="160" height="80" alt="URL chain logo"></p>

Docker-only commands from this folder:
```sh
docker build -t backend01-check .
docker run --rm -p 3000:3000 backend01-check
docker run --rm --network none backend01-check npm test
```
Node.js 22 and dependencies stay inside image. Build requires registry access; tests use loopback only. Image excludes host installations and `.env` files; pass configuration with `-e`. No host install/start/test commands required.

Environment: optional `PORT` (3000), `BASE_URL` (defaults to `http://localhost:PORT`; set public HTTP(S) origin), `NODE_ENV` (development exposes error stacks). Optional `.env` supported; no file required.

Routes:
- `POST /shorten`, JSON `{"url":"https://example.com/path"}`: 201 with `originalUrl`, `shortUrl`, `id`.
- `GET /:id`: 302 redirect; missing ID returns 404.
- Invalid input returns 400. HTTP(S) only, no embedded credentials, maximum 2048 characters.

Smoke check starts temporary local HTTP server; tests invalid input, creation, redirect, and missing IDs.

Limitations: single-process memory store; restart loses links. No persistence, expiration, authentication, rate limiting, or malicious-site screening. CORS permits all origins. Public shortening can enable phishing; use abuse controls. Service never fetches target URLs.
