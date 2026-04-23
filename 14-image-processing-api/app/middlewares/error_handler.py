from fastapi import Request
from fastapi.responses import JSONResponse

def setup_exception_handlers(app):
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})
