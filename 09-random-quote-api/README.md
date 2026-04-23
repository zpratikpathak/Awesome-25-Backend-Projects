# 09 Random Quote API

A Python Flask application featuring multi-file architecture, Pydantic validation, and service layers.

## Architecture
- **app/routes**: Endpoints definition
- **app/controllers**: Request processing
- **app/services**: Business logic
- **app/middlewares**: Pydantic validation and error handlers

## Setup
1. `pip install -r requirements.txt`
2. `cp .env.example .env`
3. `python run.py`
