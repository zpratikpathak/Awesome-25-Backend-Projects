# 26 - Monitoring Dashboard API

A Node.js backend using Express and `prom-client` to expose application metrics to Prometheus.

## Architecture
- Express application tracking HTTP request durations using a Prometheus Histogram (`http_request_duration_seconds`).
- Exposes standard Node.js metrics (CPU, memory, Event Loop lag) via `prom-client`'s `collectDefaultMetrics`.
- `/metrics` endpoint to be scraped by a Prometheus server.

## Setup

```sh
npm install
```

## Running

```sh
npm start
```

## Usage

Hit some endpoints to generate metrics:
```sh
curl http://localhost:8080/api/hello
curl http://localhost:8080/api/slow
curl http://localhost:8080/api/error
```

View the generated metrics (ready for Prometheus to scrape):
```sh
curl http://localhost:8080/metrics
```