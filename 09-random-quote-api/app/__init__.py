from flask import Flask
from .routes import quote_bp
from .middlewares.error_handler import register_error_handlers
import logging

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('../config.py')
    
    logging.basicConfig(level=logging.INFO)
    
    app.register_blueprint(quote_bp, url_prefix='/api')
    register_error_handlers(app)
    
    return app
