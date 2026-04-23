# 22 - Microservices Communication

A basic Node.js application demonstrating microservices communication using gRPC.

## Architecture
- A gRPC server (`server.js`) that implements a `Greeter` service defined in `proto/greeting.proto`.
- A gRPC client (`client.js`) that calls the `sayHello` RPC.

## Setup

```sh
npm install
```

## Running

1. Start the gRPC server:
```sh
npm run start-server
```

2. In another terminal, run the client:
```sh
npm run start-client "Alice"
```
