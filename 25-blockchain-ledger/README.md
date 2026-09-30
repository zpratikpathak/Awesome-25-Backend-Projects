# Hash-Linked Ledger Demo
<p align="center"><img src="logo.svg" alt="Ledger hash-linked blocks" width="160"></p>

`blockchain.py` provides Flask routes and an in-memory proof-of-work ledger. `main.py` and `app/main.py` are unused older HTTP/FastAPI placeholders; supported requirements install Flask only.

## Docker
From repository root:
```sh
docker build -t backend-p25 ./25-blockchain-ledger
docker run --rm --network none backend-p25 python smoke.py
docker run --rm -p 127.0.0.1:5025:5000 backend-p25
```
Flask development server binds container port 5000. All Python installation/execution stays inside Docker.

## API and limits
- `GET /chain`: `{ "chain": [...], "length": 1 }`; genesis proof 100, previous hash `1`.
- `POST /transactions/new`: `{ "sender": "a", "recipient": "b", "amount": 2 }`; 201 queues transaction for next block.
- `POST /mine`: computes proof, adds simulated reward, seals pending transactions; returns new block data. GET deliberately rejected (405) because mining changes state.
- Sender/recipient nonblank strings ≤128 characters; amount finite positive number ≤1e12, booleans rejected. Invalid body: 400; request ≤16 KiB; pending capacity 1,000, full: 503. Lock serializes chain mutations.
- SHA-256 hash linkage and four-leading-zero proof demo only. No signatures, account balances, transaction authorization, consensus, networking, persistence or real currency. Chain capacity 1,000 blocks, further mining returns 503; mining consumes CPU and holds lock. Restart loses state.

**Security:** unauthenticated development API. Anyone with access can enqueue transactions or mine. Keep local; no production deployment or financial use.

`smoke.py` checks invalid inputs, transaction inclusion, POST mining, linked hashes and proof. Flask version resolves during Docker build. Logo is original local SVG.
