# 03 — Weather API Wrapper

<p align="center"><img src="logo.svg" width="160" height="80" alt="Sun and cloud logo"></p>

Go/Gin OpenWeather current weather wrapper. Docker-only commands from this folder:
```sh
docker build -t backend03-check .
docker run --rm -p 8080:8080 backend03-check
docker run --rm --network none backend03-check go test -count=1 ./...
```
Go 1.26, dependency installation, build, and tests stay inside image. Build requires registry access; tests use loopback provider fixtures only. Image excludes `.env`; no credentials supplied. Start command publishes port but supplies no key, so valid-city requests return 502 without contacting provider. Startup verification uses `--network none` and container-local probes. No live provider calls used during verification.

Environment: `OPENWEATHER_API_KEY` required for successful provider requests; optional `PORT` (8080), `ENVIRONMENT=production` (Gin release mode). Optional `.env` supported. Never commit API key.

Route: `GET /api/v1/weather?city=London` returns `{"city":"London","temperature":12.5,"description":"cloudy"}`; temperature Celsius. City required, trimmed, 2–100 characters; invalid city returns 400. Missing key, network error, rejected/malformed provider response returns 502. Provider timeout 5 seconds; decoder reads at most 1 MiB. Errors omit key and provider bodies.

Regression checks use local HTTP fixtures and mocked outbound transport for API success, query encoding, mapping, invalid city, missing key, malformed/empty data, provider rejection, and network failure. Mock key is dummy data. Live OpenWeather path was not tested.

Limitations: no cache, cancellation propagation, retries, or rate limiting. Provider quotas apply. Generic 502 errors. No DB required.
