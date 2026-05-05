from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from src.utils.logger import logger


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning("Input validation failed")
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Input validation failed",
            "errors": [
                {"loc": error["loc"], "msg": error["msg"], "type": error["type"]}
                for error in exc.errors()
            ],
        },
    )


async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
