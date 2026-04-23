# 03 - Weather API Wrapper

A robust Weather API wrapper built with Go and the Gin framework.

## Features
- **Architecture:** Layered pattern (Routes, Controllers, Services, Models).
- **Validation:** Strict input validation using `go-playground/validator`.
- **Logging:** Structured logging using `logrus`.
- **Error Handling:** Centralized error handling middleware.
- **Environment Support:** Configuration via `godotenv`.

## Setup

1. Install dependencies:
   ```bash
   go mod tidy
   ```

2. Environment Setup:
   Copy `.env.example` to `.env` and add your OpenWeather API key.

3. Run the Server:
   ```bash
   go run main.go
   ```

## Endpoints
- `GET /api/v1/weather?city=London`
