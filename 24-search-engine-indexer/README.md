# In-Memory Search Indexer
<p align="center"><img src="logo.svg" alt="Search index postings and magnifier" width="160"></p>

Go inverted index with lowercase whitespace tokens and AND queries. Root `main.go` serves API; `cmd/...` is an older print-only placeholder.

## Docker
From repository root:
```sh
docker build -t backend-p24 ./24-search-engine-indexer
docker build --target test -t backend-p24-test ./24-search-engine-indexer
docker run --rm --network none backend-p24-test
docker run --rm -p 127.0.0.1:8024:8024 backend-p24
```
## API and limits
- `POST /index`: `{ "id": "1", "content": "hello world" }`; replies `Indexed`. Reusing ID replaces content and removes old postings.
- `GET /search?q=hello%20world`: JSON document array containing all tokens; no matches returns `[]`.
- Nonblank ID ≤128 bytes, content ≤32 KiB; body ≤64 KiB. Unknown fields/trailing JSON rejected. Query nonblank ≤1,024 bytes. Invalid input: 400; wrong methods: 405.
- No ranking, stemming, punctuation normalization, crawling, persistence, authentication or distributed search. Restart loses index. At most 1,000 distinct documents; new IDs at capacity return 503, existing IDs remain replaceable. HTTP server has timeouts.
- `smoke_test.go` checks stale posting removal, repeated terms, AND queries, strict JSON and real HTTP startup.

Logo is original local SVG.
