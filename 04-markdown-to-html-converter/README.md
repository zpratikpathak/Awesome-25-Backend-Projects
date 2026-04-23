# Markdown to HTML Converter

## Description
A functional REST API that accepts raw Markdown and converts it to HTML using the `pulldown-cmark` library in Rust.

## Technologies Used
Rust, Axum, Pulldown-cmark

## Endpoints
- `POST /api/convert` 
  - Request body (JSON): `{"markdown": "# Hello World"}`
  - Response (JSON): `{"html": "<h1>Hello World</h1>\n"}`

## Setup and Run Instructions
1. Make sure Rust and Cargo are installed.
2. Run the server: `cargo run`
3. The server will start on port 3000.
