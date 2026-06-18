<p align="center"><img src="logo.svg" width="120" alt="Original quote bubble logo"></p>

# 09 Random Quote API

Flask with in-memory quotes. No external API, database, or credentials.

## Docker startup and test
Run from this project folder:

```sh
docker build -t backend-check-quotes .
docker run --rm -p 127.0.0.1:5000:5000 backend-check-quotes
docker run --rm --network none backend-check-quotes python smoke.py
```

Environment: `FLASK_DEBUG=True` enables development debugging; leave unset. Port is fixed at 5000. No environment file required; `.env*` excluded from image.

## API
- `GET /api/quote`: random stored quote, 200.
- `POST /api/quote`: `{"text":"Hello","author":"Ada"}`, 201.
- JSON object required. Trimmed text: 1–2000 characters; author: 1–200. Extra fields ignored. Invalid JSON/schema returns 400, wrong content type 415, body over 16 KiB 413. Unknown route 404; unsupported method 405.

Smoke starts a real local HTTP server and checks create/random, normalization, invalid JSON/types, size limits and preserved HTTP errors.

Limitations: development server, no authentication or collection quota, no persistence; restart clears additions. Existing dependency versions retained; no production security certification.
