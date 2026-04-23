# 24-search-engine-indexer

## Description
A backend API project.

## Technologies Used
Go

## Prerequisites
- Go (1.16+ recommended)

## Setup Instructions
```bash
go mod tidy
```

## Run Instructions
```bash
go run main.go
```

## Example API Endpoints / Usage
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
