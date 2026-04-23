# 02 - Todo API

A production-ready Todo API built with Python and FastAPI.

## Features
- **Architecture:** Layered architectural pattern (Routes, Controllers, Services, Models).
- **Validation:** Robust data validation and serialization using Pydantic.
- **Logging:** Advanced logging using Loguru.
- **Error Handling:** Global exception handling for internal and validation errors.
- **Environment Support:** Managed configuration with `python-dotenv`.

## Setup

1. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. Environment Setup:
   Copy `.env.example` to `.env`.

3. Run the Server:
   ```bash
   python main.py
   # Or using uvicorn:
   uvicorn main:app --reload
   ```

Swagger docs are automatically available at `http://127.0.0.1:8000/docs`.
