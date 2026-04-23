from fastapi import APIRouter
from typing import List
from src.models.todo_model import TodoCreate, TodoUpdate, TodoInDB
from src.controllers.todo_controller import TodoController

router = APIRouter(prefix="/todos", tags=["todos"])

@router.get("/", response_model=List[TodoInDB])
def get_todos():
    return TodoController.get_all()

@router.get("/{todo_id}", response_model=TodoInDB)
def get_todo(todo_id: int):
    return TodoController.get_by_id(todo_id)

@router.post("/", response_model=TodoInDB, status_code=201)
def create_todo(todo: TodoCreate):
    return TodoController.create(todo)

@router.put("/{todo_id}", response_model=TodoInDB)
def update_todo(todo_id: int, todo: TodoUpdate):
    return TodoController.update(todo_id, todo)

@router.delete("/{todo_id}")
def delete_todo(todo_id: int):
    return TodoController.delete(todo_id)
