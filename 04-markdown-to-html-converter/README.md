# 04 - Markdown to HTML Converter

A highly concurrent Markdown to HTML converter built with Rust and Axum.

## Features
- **Architecture:** Organized with separation of concerns (Routes, Controllers, Services, Models).
- **Processing:** Efficient Markdown parsing using `pulldown-cmark`.
- **Logging:** Request tracing using `tracing` and `tower-http`.
- **Environment:** Configurable via `.env` file using `dotenvy`.
- **Error Handling:** Graceful rejection of invalid requests.

## Setup

1. Install dependencies and build:
   ```bash
   cargo build
   ```

2. Environment Setup:
   Copy `.env.example` to `.env`.

3. Run the Server:
   ```bash
   cargo run
   ```

## Endpoints
- `POST /api/v1/convert`
  - Body: `{"markdown": "# Hello World"}`
