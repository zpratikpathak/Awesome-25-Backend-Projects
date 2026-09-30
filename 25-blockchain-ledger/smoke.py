from blockchain import app, blockchain, Blockchain

client = app.test_client()
assert client.get("/chain").json["length"] == 1
for values in (
    None,
    [],
    {},
    {"sender": [], "recipient": "b", "amount": 1},
    {"sender": "a", "recipient": "b", "amount": True},
    {"sender": "a", "recipient": "b", "amount": -1},
):
    assert client.post("/transactions/new", json=values).status_code == 400
assert (
    client.post(
        "/transactions/new", json={"sender": "a", "recipient": "b", "amount": 2}
    ).status_code
    == 201
)
assert client.get("/mine").status_code == 405
response = client.post("/mine")
assert response.status_code == 200
chain = client.get("/chain").json["chain"]
assert len(chain) == 2
assert chain[1]["previous_hash"] == Blockchain.hash(chain[0])
assert Blockchain.valid_proof(chain[0]["proof"], chain[1]["proof"])
assert chain[1]["transactions"][0]["amount"] == 2
assert len(blockchain.current_transactions) == 0
blockchain.chain.extend([chain[-1]] * (1000 - len(blockchain.chain)))
assert client.post("/mine").status_code == 503
print("PASS ledger validation, mining, linked hashes, proof, transaction inclusion")
