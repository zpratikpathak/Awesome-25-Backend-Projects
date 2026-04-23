from flask import jsonify
import logging

def register_error_handlers(app):
    @app.errorhandler(Exception)
    def handle_exception(e):
        logging.error(f"Server Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
