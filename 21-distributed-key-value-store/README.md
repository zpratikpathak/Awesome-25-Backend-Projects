# Peer-Replicated Key-Value Demo
<p align="center"><img src="logo.svg" alt="Distributed store linked key nodes" width="160"></p>

Go in-memory string store with asynchronous best-effort HTTP replication. Root `main.go` is supported; `cmd/...` is an older print-only placeholder.

## Docker
From repository root:
```sh
docker build -t backend-p21 ./21-distributed-key-value-store
docker build --target test -t backend-p21-test ./21-distributed-key-value-store
docker run --rm --network none backend-p21-test
docker run --rm -p 127.0.0.1:3021:8080 backend-p21
```
Flags: `-port 8080`, `-peers http://peer:8080,http://other:8080`. Peers are operator configuration, not request input; use a disposable Docker network for multiple nodes, never host services.

## API and limits
- `POST /set`: `{ "key": "hello", "value": "world" }`; stores locally, replies `OK`, dispatches replication.
- `GET /get?key=hello`: raw value; unknown key: 404.
- `POST /internal/set`: same payload, stores without forwarding.
- Key nonblank ≤128 bytes; value ≤32 KiB, body ≤64 KiB. Unknown fields, wrong types and trailing JSON rejected with 400. Store ≤10,000 distinct keys; overflow: 503. Empty value allowed.
- Replication has a three-second timeout, closes response bodies, logs failure. Local success does not guarantee peer success. No retries, consensus, ordering, persistence, conflict resolution or recovery; restart loses data.

**Security:** no authentication, including internal replication. Run only on trusted isolated networks; do not expose to untrusted clients. Peer URLs must be trusted operator-owned endpoints.

`smoke_test.go` uses disposable in-container HTTP peer, checks strict JSON, real set/get and replication. Logo is original local SVG.
