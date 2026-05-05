# 02 — Todo API

<p align="center"><img src="logo.svg" width="160" height="80" alt="Todo checklist logo"></p>

FastAPI CRUD API. Python 3.12 stays inside Docker. Commands from this folder.

## Start and check

```sh
docker build -t backend02-check .
docker run --rm -p 8000:8000 backend02-check
docker run --rm --network none backend02-check python smoke.py
```
Build requires registry access; tests use loopback only. No host runtime or package manager required.

Optional environment: `PORT` (8000), `ENVIRONMENT` (development; logging only). Native startup loads optional `.env`; Docker image excludes it. No secrets required.

## Routes
- `GET /todos/`: list.
- `POST /todos/`: create, 201. JSON `{"title":"Buy milk","description":"Optional","completed":false}`.
- `GET /todos/{todo_id}`: fetch.
- `PUT /todos/{todo_id}`: partial update; omitted fields unchanged. Description may be null; explicit null title/completed rejected.
- `DELETE /todos/{todo_id}`: delete, 200.
- `/docs`: interactive documentation.

Missing IDs return 404; validation returns 422. Titles trim whitespace, 1–100 characters; description at most 500 characters. Unknown fields rejected.

Smoke check launches Uvicorn on loopback port 8765, tests HTTP CRUD and invalid updates, then stops server.

Limitations: thread-safe single-process memory store; restart loses todos. Run one worker. No authentication, persistence, pagination, or rate limiting. Dependencies unpinned. Production ingress must bound request sizes and access.
