from fastapi import FastAPI
from app.routes import api_router
from app.middlewares.error_handler import setup_exception_handlers

app = FastAPI(title="Image Processing API")
setup_exception_handlers(app)
app.include_router(api_router, prefix="/api")
