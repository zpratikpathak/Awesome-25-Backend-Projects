# 21 - Distributed Key-Value Store

A simple distributed key-value store built in Go, demonstrating a basic replication strategy.

## Architecture
- Nodes store data in-memory using thread-safe maps.
- Writes (`/set`) received by a node are replicated asynchronously to configured peer nodes via an internal endpoint (`/internal/set`).
- Reads (`/get`) serve data directly from the local node.

## Setup & Run

Initialize the module:
```sh
go mod init distributed-kv
go mod tidy
```

Run Node 1:
```sh
go run main.go -port 8080 -peers http://localhost:8081
```

Run Node 2:
```sh
go run main.go -port 8081 -peers http://localhost:8080
```

Set a key in Node 1:
```sh
curl -X POST http://localhost:8080/set -d '{"key":"foo","value":"bar"}'
```

Get the key from Node 2 (it will be replicated):
```sh
curl http://localhost:8081/get?key=foo
```
