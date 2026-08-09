# Memory Cache Layer (Redis-shaped demo)
<p align="center"><img src="logo.svg" alt="Memory cache stacked data and fast access" width="160"></p>

This project uses an in-process `Map`, **not Redis**. `index.js` is supported; `server.js` and `src/index.js` are older placeholders.

## Docker
From repository root:
```sh
docker build -t backend-p17 ./17-redis-cache-layer
docker run --rm --network none backend-p17 npm test
docker run --rm -p 127.0.0.1:3017:3000 backend-p17
```
`PORT` defaults to 3000. No Redis container or host service needed.

## API and limits
- `GET /api/health`: health JSON.
- `GET /data/:id`: `{ "source": "db" | "cache", "data": { "id": "demo", "data": "Expensive data for demo", "timestamp": 123 } }`.
- Miss simulates a one-second data fetch; hit returns stored result. `db` is a label, not a real database.
- ID accepts 1–64 ASCII letters, digits, underscores or hyphens; invalid ID: 400.
- At most 1,000 cache entries, oldest insertion evicted. No TTL, persistence, cross-process sharing or concurrent miss coalescing. Restart loses data.
- `smoke.js` tests real HTTP health, miss/hit identity and invalid ID.

Dependencies resolve during Docker build. Logo is original local SVG.
