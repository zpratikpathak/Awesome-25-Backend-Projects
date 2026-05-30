# 06 — File Metadata Microservice

<p align="center"><img src="logo.svg" width="160" height="80" alt="Metadata document logo"></p>

Express/Multer metadata endpoint. Docker-only commands from this folder:
```sh
docker build -t backend06-check .
docker run --rm -p 3000:3000 backend06-check
docker run --rm --network none backend06-check npm test
```
Node.js 22 and dependencies stay inside image. Build requires registry access; tests use loopback only. Host installations and `.env` excluded; pass configuration with `-e`.

Optional `PORT` (3000); optional `.env` supported. No secrets or DB required.

Route: `POST /api/file/upload`, multipart form with one file named `upfile`: 200 with `name` (original filename), `type` (client MIME type), `size` (bytes).

Maximum file 5 MiB. Missing file, wrong field, extra file/text field returns 400; oversized file 413. Temporary memory storage only; no disk writes. Internal errors return generic 500.

Smoke check tests HTTP metadata, missing file, wrong field, and 5 MiB overflow.

Limitations: filename/MIME type supplied by client, not verified. No scanning, storage, authentication, rate limiting, or concurrency quota. Concurrent uploads consume memory; use ingress concurrency/body limits. CORS permits all origins. Do not trust returned MIME type for safe rendering.
