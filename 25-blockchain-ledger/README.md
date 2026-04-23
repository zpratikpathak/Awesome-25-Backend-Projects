# 25 - Blockchain Ledger

A simple blockchain ledger implemented in Python with Flask, featuring a basic Proof of Work system.

## Architecture
- `blockchain.py` exposes a Flask API.
- The `Blockchain` class manages the chain, validates proof of work (requires 4 leading zeroes in the SHA-256 hash), and adds transactions.
- Provides endpoints to `/mine` blocks, add `/transactions/new`, and view the `/chain`.

## Setup

```sh
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Running

```sh
python blockchain.py
```

## Usage

View the chain:
```sh
curl http://localhost:5000/chain
```

Add a transaction:
```sh
curl -X POST -H "Content-Type: application/json" -d '{"sender": "A", "recipient": "B", "amount": 5}' http://localhost:5000/transactions/new
```

Mine a block (adds pending transactions to the chain):
```sh
curl http://localhost:5000/mine
```