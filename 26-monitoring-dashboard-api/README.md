# Monitoring Metrics API (Bonus)
<p align="center"><img src="logo.svg" alt="Monitoring metrics pulse" width="160"></p>

`server.js` serves Express demo routes and Prometheus text metrics through `prom-client`. `src/index.js` is an unused health-only placeholder. No dashboard UI or bundled Prometheus/Grafana.

## Docker
From repository root:
```sh
docker build -t backend-p26 ./26-monitoring-dashboard-api
docker run --rm --network none backend-p26 npm test
docker run --rm -p 127.0.0.1:3026:8080 backend-p26
```
`PORT` defaults to 8080. No keys, external collector or host services required.

## Routes and metrics
- `GET /api/hello`: greeting JSON.
- `GET /api/slow`: simulated delay below two seconds, response JSON.
- `GET /api/error`: intentional 500 JSON for monitoring demonstrations.
- `GET /metrics`: Prometheus exposition, default Node process metrics prefixed `node_`, histogram `http_request_duration_seconds` with method/route/code labels. Duration is seconds, not microseconds.
- Default metrics and histogram share one registry. Unmatched paths use `unmatched`, unsupported method labels use `OTHER` to avoid unbounded cardinality from user paths/methods.
- No authentication, persistence, tracing, alerting or service aggregation. Metrics reset on restart. Request histogram records on response finish, so a scrape does not yet include itself.

**Security:** metrics expose process information. Bind locally or restrict collector access before deployment.

`smoke.js` checks real HTTP demo routes, process/histogram metrics and bounded unknown-route labels. Dependencies resolve during Docker build. Logo is original local SVG.
