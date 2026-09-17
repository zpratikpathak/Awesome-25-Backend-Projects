# Shared Document WebSocket Demo
<p align="center"><img src="logo.svg" alt="Shared editor document and two cursors" width="160"></p>

`server.js` shares one in-memory string through WebSockets. `src/index.js` is an unused HTTP health placeholder. No browser UI, CRDT or operational transformation.

## Docker
From repository root:
```sh
docker build -t backend-p23 ./23-real-time-collaborative-editor
docker run --rm --network none backend-p23 npm test
docker run --rm -p 127.0.0.1:3023:8080 backend-p23
```
Connect to `ws://localhost:3023`; container `PORT` defaults to 8080.

## Messages and limits
- Connection receives `{ "type": "init", "content": "" }` (current document).
- Send `{ "type": "update", "content": "hello" }`; full string replaces document, broadcasts to other connected clients, not sender.
- Last arrival wins. Concurrent edits can overwrite each other. Restart loses document; all clients share same document.
- Message payload ≤64 KiB, content ≤60,000 UTF-8 bytes; invalid JSON/type closes with 1008. At most 100 clients (overflow 1013); slow clients with >1 MiB queued output terminated. No persistence or heartbeat.

**Security:** no authentication, authorization, origin policy or TLS. Any connected client can read/overwrite the shared document. Keep isolated and local; not a production collaborative editor.

`smoke.js` checks actual child-process startup, two-client initialization/broadcast and invalid update closure. Dependencies resolve during Docker build. Logo is original local SVG.
