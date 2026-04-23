from flask import jsonify
from app.services.quote_service import QuoteService

service = QuoteService()

def get_random_quote():
    quote = service.get_random()
    return jsonify(quote)

def add_quote(data):
    quote = service.add_quote(data['text'], data['author'])
    return jsonify(quote), 201
