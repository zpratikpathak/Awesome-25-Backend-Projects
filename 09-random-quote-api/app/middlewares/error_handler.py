from flask import jsonify
import logging
from werkzeug.exceptions import HTTPException


def register_error_handlers(app):
    @app.errorhandler(Exception)
    def handle_exception(e):
        if isinstance(e, HTTPException):
            return jsonify({"error": e.name}), e.code
        logging.error(f"Server Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
