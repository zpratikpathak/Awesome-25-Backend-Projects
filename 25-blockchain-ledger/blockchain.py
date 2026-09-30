import hashlib
import json
import math
from threading import RLock
from time import time
from flask import Flask, jsonify, request
from uuid import uuid4


class Blockchain:
    def __init__(self):
        self.chain = []
        self.current_transactions = []
        # Create the genesis block
        self.new_block(previous_hash="1", proof=100)

    def new_block(self, proof, previous_hash=None):
        block = {
            "index": len(self.chain) + 1,
            "timestamp": time(),
            "transactions": self.current_transactions,
            "proof": proof,
            "previous_hash": previous_hash or self.hash(self.chain[-1]),
        }
        self.current_transactions = []
        self.chain.append(block)
        return block

    def new_transaction(self, sender, recipient, amount):
        self.current_transactions.append(
            {
                "sender": sender,
                "recipient": recipient,
                "amount": amount,
            }
        )
        return self.last_block["index"] + 1

    @property
    def last_block(self):
        return self.chain[-1]

    @staticmethod
    def hash(block):
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def proof_of_work(self, last_proof):
        proof = 0
        while self.valid_proof(last_proof, proof) is False:
            proof += 1
        return proof

    @staticmethod
    def valid_proof(last_proof, proof):
        guess = f"{last_proof}{proof}".encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"


app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16384
lock = RLock()
node_identifier = str(uuid4()).replace("-", "")
blockchain = Blockchain()


@app.route("/mine", methods=["POST"])
def mine():
    with lock:
        return mine_locked()


def mine_locked():
    if len(blockchain.chain) >= 1000:
        return "Demo chain capacity reached", 503
    last_block = blockchain.last_block
    last_proof = last_block["proof"]
    proof = blockchain.proof_of_work(last_proof)

    # Reward for finding the proof
    blockchain.new_transaction(
        sender="0",
        recipient=node_identifier,
        amount=1,
    )

    previous_hash = blockchain.hash(last_block)
    block = blockchain.new_block(proof, previous_hash)

    response = {
        "message": "New Block Forged",
        "index": block["index"],
        "transactions": block["transactions"],
        "proof": block["proof"],
        "previous_hash": block["previous_hash"],
    }
    return jsonify(response), 200


@app.route("/transactions/new", methods=["POST"])
def new_transaction():
    values = request.get_json(silent=True)
    required = ["sender", "recipient", "amount"]
    if not isinstance(values, dict) or not all(k in values for k in required):
        return "Missing values", 400
    if any(
        not isinstance(values[k], str) or not values[k].strip() or len(values[k]) > 128
        for k in ("sender", "recipient")
    ):
        return "Invalid sender or recipient", 400
    amount = values["amount"]
    if (
        isinstance(amount, bool)
        or not isinstance(amount, (int, float))
        or not 0 < amount <= 1e12
        or not math.isfinite(amount)
    ):
        return "Invalid amount", 400

    with lock:
        if len(blockchain.current_transactions) >= 1000:
            return "Pending transaction capacity reached", 503
        index = blockchain.new_transaction(
            values["sender"], values["recipient"], amount
        )
    return jsonify({"message": f"Transaction will be added to Block {index}"}), 201


@app.route("/chain", methods=["GET"])
def full_chain():
    with lock:
        return chain_locked()


def chain_locked():
    response = {
        "chain": blockchain.chain,
        "length": len(blockchain.chain),
    }
    return jsonify(response), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
