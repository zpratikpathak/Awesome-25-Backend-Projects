# 07 — Basic Auth System

<p align="center"><img src="logo.svg" width="160" height="80" alt="Authentication lock logo"></p>

Express registration/JWT login, not HTTP Basic authentication. Docker-only commands from this folder:
```sh
docker build -t backend07-check .
docker run --rm -p 3000:3000 -e JWT_SECRET backend07-check
docker run --rm --network none backend07-check npm test
```
Set `JWT_SECRET` securely in your terminal environment before startup: cryptographically random, at least 32 bytes. Docker forwards it with `-e JWT_SECRET`; no secret literal belongs in commands or source. Missing/short secret fails startup. Never commit or print secrets. Optional `PORT` (3000). Tests generate an ephemeral secret inside Docker.
Node.js 22 and dependencies stay inside image. Build requires registry access; tests use loopback only. Host installations and `.env` excluded. No host runtime/package manager required.

## Routes
- `POST /api/auth/register`, JSON `{"username":"tester","password":"Long password!1"}`: 201 with `message`, `userId`.
- `POST /api/auth/login`, same fields: 200 with `token`.

Username: alphanumeric, 3–30 characters, case-sensitive. Password: 8–72 characters, at most 72 UTF-8 bytes; spaces/punctuation allowed. Unknown fields rejected. Validation/malformed JSON 400; duplicate username 409; invalid credentials 401; internal failure generic 500.

Bcrypt cost 10. JWT HS256, one-hour expiry, UUID user ID claim. Smoke check tests invalid inputs, concurrent duplicate registration, wrong password, verified JWT claims.

Limitations: single-process memory users; restart loses accounts. No protected routes, verification middleware, token revocation, password reset, persistence, rate limiting, or lockout. Username existence inferable through registration/login timing. Length check cannot guarantee secret entropy. Keep private until HTTPS, access controls, and brute-force protection exist. CORS permits all origins.
