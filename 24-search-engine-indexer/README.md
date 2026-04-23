# 24 - Search Engine Indexer

A simple search engine indexer implemented in Go using an inverted index.

## Architecture
- Exposes an HTTP API for indexing documents (`POST /index`) and searching (`GET /search`).
- Maintains an in-memory inverted index mapping tokens (words) to document IDs.
- Search performs a simple AND intersection across tokens.

## Setup & Run

```sh
go mod init search-indexer
go mod tidy
go run main.go
```

## Usage

Index documents:
```sh
curl -X POST http://localhost:8080/index -d '{"id":"1", "content":"the quick brown fox"}'
curl -X POST http://localhost:8080/index -d '{"id":"2", "content":"the lazy dog"}'
curl -X POST http://localhost:8080/index -d '{"id":"3", "content":"the brown dog"}'
```

Search:
```sh
curl "http://localhost:8080/search?q=brown"
# Returns: [{"id":"1","content":"the quick brown fox"},{"id":"3","content":"the brown dog"}]

curl "http://localhost:8080/search?q=brown+dog"
# Returns: [{"id":"3","content":"the brown dog"}]
```
