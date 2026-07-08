<p align="center"><img src="logo.svg" width="120" alt="Original polling bars logo"></p>

# 12 Polling API

Go standard-library HTTP API with mutex-protected in-memory polls.

## Docker startup and test
Run from this project folder:

```sh
docker build -t backend-check-polling .
docker run --rm -p 127.0.0.1:8080:8080 backend-check-polling
docker run --rm --network none backend-check-polling go test -race -v ./...
```

No environment variables, database or credentials. Port fixed at 8080. Docker image includes Go compiler for runnable regression; host artifacts and `.env*` excluded.

## API
- `GET /api/polls`: JSON array (empty array initially), 200.
- `POST /api/polls`: `{"question":"Pick","options":["A","B"]}`, 201 with generated integer ID.
- Trimmed question: 1–500 bytes. 2–20 unique trimmed options, each 1–200 bytes. Unknown fields, malformed/trailing JSON, oversized bodies (16 KiB) and invalid polls return 400. Client ID overwritten. Unsupported methods return 405 with `Allow: GET, POST`.

Smoke uses a real HTTP listener; tests valid creation, invalid question/options, trailing JSON and method handling. Race detector enabled.

Limitations: no voting endpoint, WebSocket/SSE updates, authentication, persistence, collection quota or pagination. Despite folder name, this is polling CRUD subset, not real-time voting. Restart clears data.
