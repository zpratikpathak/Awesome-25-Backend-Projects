# Rate Limiter Middleware
<p align="center"><img src="logo.svg" alt="Rate limiter controlled flow gate" width="160"></p>

Go HTTP token-bucket middleware using `golang.org/x/time/rate`. Root `main.go` serves requests; `cmd/...` is only an old startup placeholder.

## Docker
From repository root:
```sh
docker build -t backend-p18 ./18-rate-limiter-middleware
docker build --target test -t backend-p18-test ./18-rate-limiter-middleware
docker run --rm --network none backend-p18-test
docker run --rm -p 127.0.0.1:8018:8018 backend-p18
```
## Behavior and limits
`GET /` returns `Hello, welcome to the API!`. Same fallback handler serves other paths. Each remote IP receives one token per second, burst three; excess requests return 429 with `Retry-After: 1`.

Client key strips TCP source port. Forwarded headers are ignored: behind a proxy, its IP shares one bucket. State is process-local, lost on restart; no distributed quota. Clients idle over five minutes are removed during lookup. Capacity 10,000 IPs; new IPs at capacity receive 503. HTTP server has header/read/write/idle timeouts.

`smoke_test.go` checks changing source ports cannot evade quota, different IPs remain independent, expiry and real HTTP startup. Logo is original local SVG.
