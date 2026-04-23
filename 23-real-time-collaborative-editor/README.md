# 23 - Real-Time Collaborative Editor

A Node.js backend using WebSockets to synchronize document state across multiple clients.

## Architecture
- A `ws` WebSocket server keeps track of connected clients.
- Clients send `update` events with the new document state.
- The server broadcasts the state to all other connected clients.
- (Note: This uses full state replacement for simplicity. A production app would use CRDTs like Yjs or Operational Transformation like ShareDB.)

## Setup

```sh
npm install
```

## Running

```sh
npm start
```

## Testing

You can use a WebSocket client tool (like `wscat`):

Terminal 1:
```sh
wscat -c ws://localhost:8080
> {"type":"update","content":"Hello World"}
```

Terminal 2:
```sh
wscat -c ws://localhost:8080
< {"type":"init","content":"Hello World"}
```
