import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from src.routes.todo_routes import router as todo_router
from src.utils.logger import logger
from src.middlewares.error_handler import validation_exception_handler, global_exception_handler

# Load env variables
load_dotenv()

app = FastAPI(title="Todo API", description="A robust Todo API built with FastAPI")

# Add Exception Handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Include Routers
app.include_router(todo_router)

@app.on_event("startup")
async def startup_event():
    env = os.getenv("ENVIRONMENT", "development")
    logger.info(f"Starting Todo API in {env} mode")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
