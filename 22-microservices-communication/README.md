# gRPC Greeting Demo
<p align="center"><img src="logo.svg" alt="gRPC request and reply" width="160"></p>

`server.js` loads `proto/greeting.proto`, serves `greeting.Greeter/SayHello`; `client.js` calls it. `src/index.js` is an unused health-only placeholder.

## Docker
From repository root:
```sh
docker build -t backend-p22 ./22-microservices-communication
docker run --rm --network none backend-p22 npm test
docker run --rm --name greeting-demo -p 127.0.0.1:50051:50051 backend-p22
```
In another terminal, while server container runs:
```sh
docker exec greeting-demo node client.js World
```
Server `PORT` defaults to 50051; client `GRPC_TARGET` defaults to `localhost:50051`. Client deadline five seconds; errors produce nonzero exit. Bind errors produce nonzero server exit.

## Contract and limits
`SayHello({ name: "World" })` replies `{ message: "Hello World" }`. Nonblank name ≤100 characters; invalid input returns `INVALID_ARGUMENT`. Server receive-message limit 4 KiB. No HTTP health API, service discovery, retry policy or database.

**Security:** transport is plaintext with no authentication. Use only isolated local demos; TLS and authentication are required before deployment.

`smoke.js` starts an in-container gRPC server and checks real roundtrip and invalid names. Dependencies resolve during Docker build. Logo is original local SVG.
