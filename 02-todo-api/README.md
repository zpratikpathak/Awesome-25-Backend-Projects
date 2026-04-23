# To-do List API

## Description
A fully functional RESTful API for managing tasks (CRUD operations) using an in-memory list.

## Technologies Used
Python, FastAPI, Pydantic

## Endpoints
- `GET /todos` - List all tasks
- `GET /todos/{id}` - Get a specific task
- `POST /todos` - Create a new task
- `PUT /todos/{id}` - Update a task
- `DELETE /todos/{id}` - Delete a task

## Setup and Run Instructions
1. Install dependencies: `pip install -r requirements.txt`
2. Run server: `uvicorn main:app --reload`
3. View auto-generated docs at `http://127.0.0.1:8000/docs`
