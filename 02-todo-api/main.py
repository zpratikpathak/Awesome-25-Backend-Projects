from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Todo API")

class TodoItem(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TodoItemResponse(TodoItem):
    id: int

todo_db = []
current_id = 1

@app.get("/todos", response_model=List[TodoItemResponse])
def get_todos():
    return todo_db

@app.get("/todos/{todo_id}", response_model=TodoItemResponse)
def get_todo(todo_id: int):
    for item in todo_db:
        if item["id"] == todo_id:
            return item
    raise HTTPException(status_code=404, detail="Todo not found")

@app.post("/todos", response_model=TodoItemResponse, status_code=201)
def create_todo(todo: TodoItem):
    global current_id
    new_todo = todo.model_dump()
    new_todo["id"] = current_id
    current_id += 1
    todo_db.append(new_todo)
    return new_todo

@app.put("/todos/{todo_id}", response_model=TodoItemResponse)
def update_todo(todo_id: int, updated_todo: TodoItem):
    for index, item in enumerate(todo_db):
        if item["id"] == todo_id:
            updated_data = updated_todo.model_dump()
            updated_data["id"] = todo_id
            todo_db[index] = updated_data
            return updated_data
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    for index, item in enumerate(todo_db):
        if item["id"] == todo_id:
            del todo_db[index]
            return
    raise HTTPException(status_code=404, detail="Todo not found")

@app.get("/")
def read_root():
    return {"message": "Welcome to Todo API"}
