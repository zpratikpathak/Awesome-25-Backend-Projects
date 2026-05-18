# 04 — Markdown to HTML Converter

<p align="center"><img src="logo.svg" width="160" height="80" alt="Markdown conversion logo"></p>

Rust/Axum converter using pulldown-cmark and Ammonia sanitization. Docker-only commands from this folder:
```sh
docker build -t backend04-check .
docker run --rm -p 3000:3000 backend04-check
docker run --rm --network none backend04-check cargo test --offline --locked
```
Build requires registry access; dependency installation and compilation stay inside Docker. Existing source lockfile needs reconciliation, performed inside image during build; test uses resulting image lockfile without network. No host Rust required.

Optional environment: `PORT` (3000), `RUST_LOG` (application/request debug logging). Native startup loads optional `.env`; Docker excludes it. Image retains Rust tooling for checks, not minimal production image.

Route: `POST /api/v1/convert`, JSON content type, `{"markdown":"# Hello"}` returns 200 with `{"html":"<h1>Hello</h1>\n"}`. Empty/whitespace Markdown returns 400; malformed JSON 400; wrong/missing field 422; wrong content type 415; body over 64 KiB 413. Axum extraction errors may be plain text; empty-input error JSON.

Supports tables, strikethrough, task lists. Sanitizer strips scripts, unsafe URL schemes, and unsafe HTML attributes. Smoke check tests conversion, sanitization, invalid requests, and body limit through router.

Limitations: sanitizer may remove task-list controls. No persistence, authentication, or rate limiting. Sanitized output is HTML content, not safe for interpolation into JavaScript/CSS contexts. Remote images can trigger browser requests; apply deployment-specific content policy.
