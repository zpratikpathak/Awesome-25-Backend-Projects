from flask import Blueprint, jsonify, request
from app.controllers.quote_controller import get_random_quote, add_quote
from app.middlewares.validator import validate_quote

bp = Blueprint('quotes', __name__)

@bp.route('/quote', methods=['GET'])
def get_quote():
    return get_random_quote()

@bp.route('/quote', methods=['POST'])
@validate_quote
def create_quote():
    return add_quote(request.json)
