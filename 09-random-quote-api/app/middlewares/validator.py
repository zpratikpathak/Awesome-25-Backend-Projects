from functools import wraps
from flask import request, jsonify
from pydantic import BaseModel, ValidationError, constr


class QuoteModel(BaseModel):
    text: constr(strip_whitespace=True, min_length=1, max_length=2000)
    author: constr(strip_whitespace=True, min_length=1, max_length=200)


def validate_quote(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            data = request.get_json()
            if not isinstance(data, dict):
                return jsonify({"error": "JSON object required"}), 400
            quote = QuoteModel(**data)
        except ValidationError as e:
            return jsonify({"error": e.errors(include_context=False)}), 400
        return f(quote.model_dump(), *args, **kwargs)

    return decorated_function
