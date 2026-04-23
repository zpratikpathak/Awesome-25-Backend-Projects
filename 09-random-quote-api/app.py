from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

QUOTES = [
    {"author": "Albert Einstein", "text": "Life is like riding a bicycle. To keep your balance, you must keep moving."},
    {"author": "Isaac Newton", "text": "If I have seen further it is by standing on the shoulders of Giants."},
    {"author": "Marie Curie", "text": "Nothing in life is to be feared, it is only to be understood."},
    {"author": "Nikola Tesla", "text": "The present is theirs; the future, for which I really worked, is mine."},
    {"author": "Galileo Galilei", "text": "You cannot teach a man anything; you can only help him find it within himself."}
]

@app.route('/api/quotes/random', methods=['GET'])
def get_random_quote():
    quote = random.choice(QUOTES)
    return jsonify(quote)

@app.route('/api/quotes', methods=['GET'])
def get_all_quotes():
    return jsonify(QUOTES)

if __name__ == '__main__':
    app.run(debug=True, port=5000)