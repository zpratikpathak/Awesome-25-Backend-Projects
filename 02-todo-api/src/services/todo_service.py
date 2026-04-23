from typing import List, Optional
from datetime import datetime
from src.models.todo_model import TodoCreate, TodoUpdate, TodoInDB

class TodoService:
    def __init__(self):
        # In-memory database for demonstration
        self._todos = {}
        self._current_id = 1

    def get_all(self) -> List[TodoInDB]:
        return list(self._todos.values())

    def get_by_id(self, todo_id: int) -> Optional[TodoInDB]:
        return self._todos.get(todo_id)

    def create(self, todo_in: TodoCreate) -> TodoInDB:
        todo = TodoInDB(
            id=self._current_id,
            created_at=datetime.utcnow(),
            **todo_in.dict()
        )
        self._todos[self._current_id] = todo
        self._current_id += 1
        return todo

    def update(self, todo_id: int, todo_in: TodoUpdate) -> Optional[TodoInDB]:
        existing_todo = self.get_by_id(todo_id)
        if not existing_todo:
            return None
            
        update_data = todo_in.dict(exclude_unset=True)
        updated_todo = existing_todo.copy(update=update_data)
        self._todos[todo_id] = updated_todo
        return updated_todo

    def delete(self, todo_id: int) -> bool:
        if todo_id in self._todos:
            del self._todos[todo_id]
            return True
        return False

# Singleton instance
todo_service = TodoService()
