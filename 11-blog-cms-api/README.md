<p align="center"><img src="logo.svg" width="120" alt="Original blog page logo"></p>

# 11 Blog CMS API

Express with validated in-memory posts. No database or credentials.

## Docker startup and test
Run from this project folder:

```sh
docker build -t backend-check-blog .
docker run --rm -p 127.0.0.1:3000:3000 backend-check-blog
docker run --rm --network none backend-check-blog npm test
```

Environment: `PORT` defaults to 3000; change mapping if overridden. No environment file required. `.env*` excluded from image.

## API
- `GET /api/posts`: array, 200.
- `POST /api/posts`: `{"title":"Title","content":"Useful content here"}`, 201 with generated UUID.
- Trimmed title: 3–200 characters; content: 10–50000. Extra fields stripped, including client ID. Invalid JSON/schema 400, body over Express default 100 KiB 413. Unknown routes/methods 404. Unexpected errors do not expose internal messages.

Smoke checks live HTTP create/list, ID spoofing, extra fields, whitespace validation and malformed/oversized bodies.

Limitations: no authentication, persistence, update/delete, quota or pagination. Content is plain JSON text, not sanitized HTML; consumers must escape it when rendering. Restart clears data.
