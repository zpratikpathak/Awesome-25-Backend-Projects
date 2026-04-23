from fastapi import HTTPException
from src.models.todo_model import TodoCreate, TodoUpdate, TodoInDB
from src.services.todo_service import todo_service
from src.utils.logger import logger

class TodoController:
    @staticmethod
    def get_all():
        logger.info("Fetching all todos")
        return todo_service.get_all()

    @staticmethod
    def get_by_id(todo_id: int):
        logger.info(f"Fetching todo with ID: {todo_id}")
        todo = todo_service.get_by_id(todo_id)
        if not todo:
            logger.error(f"Todo not found: {todo_id}")
            raise HTTPException(status_code=404, detail="Todo not found")
        return todo

    @staticmethod
    def create(todo: TodoCreate):
        logger.info(f"Creating new todo: {todo.title}")
        return todo_service.create(todo)

    @staticmethod
    def update(todo_id: int, todo: TodoUpdate):
        logger.info(f"Updating todo ID: {todo_id}")
        updated = todo_service.update(todo_id, todo)
        if not updated:
            logger.error(f"Todo not found for update: {todo_id}")
            raise HTTPException(status_code=404, detail="Todo not found")
        return updated

    @staticmethod
    def delete(todo_id: int):
        logger.info(f"Deleting todo ID: {todo_id}")
        success = todo_service.delete(todo_id)
        if not success:
            logger.error(f"Todo not found for deletion: {todo_id}")
            raise HTTPException(status_code=404, detail="Todo not found")
        return {"message": "Todo deleted successfully"}
