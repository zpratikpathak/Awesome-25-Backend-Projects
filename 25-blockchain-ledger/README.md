# 25-blockchain-ledger

## Description
A backend API project.

## Technologies Used
Python

## Prerequisites
- Python (3.8+ recommended)
- pip

## Setup Instructions
```bash
pip install -r requirements.txt
```

## Run Instructions
```bash
python main.py
```

## Example API Endpoints / Usage
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
