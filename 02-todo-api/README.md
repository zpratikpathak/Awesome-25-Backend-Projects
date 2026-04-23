# 02-todo-api

## Description
A fully functional RESTful API for managing tasks (CRUD operations) using an in-memory list.

## Technologies Used
Python, FastAPI, Pydantic

## Prerequisites
- Python (3.8+ recommended)
- pip

## Setup Instructions
```bash
pip install -r requirements.txt
```

## Run Instructions
```bash
uvicorn main:app --reload
```

## Example API Endpoints / Usage
- `GET /todos` - List all tasks
- `GET /todos/{id}` - Get a specific task
- `POST /todos` - Create a new task
- `PUT /todos/{id}` - Update a task
- `DELETE /todos/{id}` - Delete a task
