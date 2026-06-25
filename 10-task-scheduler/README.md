<p align="center"><img src="logo.svg" width="120" alt="Original scheduler clock logo"></p>

# 10 Task Scheduler

Express / node-cron. Each accepted task gets a recurring schedule; execution logs its name and sets status to `completed`.

## Docker startup and test
Run from this project folder:

```sh
docker build -t backend-check-scheduler .
docker run --rm -p 127.0.0.1:3000:3000 backend-check-scheduler
docker run --rm --network none backend-check-scheduler npm test
```

Environment: `PORT` defaults to 3000; change container port mapping if overridden. No credentials/database required. `.env*` excluded; pass variables with Docker `-e`. Cron uses container timezone (UTC by default).

## API
- `GET /api/tasks`: task array, 200.
- `POST /api/tasks`: `{"name":"Reminder","cron":"* * * * *"}`, 201.
- Trimmed name: 1–200 characters. Cron: valid node-cron expression, at most 100 characters; five fields or six including seconds. Extra fields stripped. Invalid bodies 400, JSON body over default Express 100 KiB limit 413. Unknown routes/methods 404.

Smoke checks real HTTP, invalid cron/JSON, body limits, server IDs and a real one-second cron execution. No mocked timer.

Limitations: in-memory, no cancellation, authentication, quota, persistence, job payloads or distributed coordination. `completed` means at least one execution, not cancellation; schedule keeps recurring. No shell commands run from user input.
