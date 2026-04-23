from functools import wraps
from flask import request, jsonify
from pydantic import BaseModel, ValidationError

class QuoteModel(BaseModel):
    text: str
    author: str

def validate_quote(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            QuoteModel(**request.json)
        except ValidationError as e:
            return jsonify({"error": e.errors()}), 400
        return f(*args, **kwargs)
    return decorated_function
