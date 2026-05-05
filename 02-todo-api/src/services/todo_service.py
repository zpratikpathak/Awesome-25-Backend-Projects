from typing import List, Optional
from datetime import datetime, timezone
from threading import RLock
from src.models.todo_model import TodoCreate, TodoUpdate, TodoInDB


class TodoService:
    def __init__(self):
        # ponytail: single-process demo; use durable storage before multiple workers.
        self._todos = {}
        self._current_id = 1
        self._lock = RLock()

    def get_all(self) -> List[TodoInDB]:
        with self._lock:
            return list(self._todos.values())

    def get_by_id(self, todo_id: int) -> Optional[TodoInDB]:
        with self._lock:
            return self._todos.get(todo_id)

    def create(self, todo_in: TodoCreate) -> TodoInDB:
        with self._lock:
            todo = TodoInDB(
                id=self._current_id,
                created_at=datetime.now(timezone.utc),
                **todo_in.model_dump()
            )
            self._todos[self._current_id] = todo
            self._current_id += 1
            return todo

    def update(self, todo_id: int, todo_in: TodoUpdate) -> Optional[TodoInDB]:
        with self._lock:
            existing_todo = self.get_by_id(todo_id)
            if not existing_todo:
                return None
            updated_todo = TodoInDB.model_validate(
                {**existing_todo.model_dump(), **todo_in.model_dump(exclude_unset=True)}
            )
            self._todos[todo_id] = updated_todo
            return updated_todo

    def delete(self, todo_id: int) -> bool:
        with self._lock:
            return self._todos.pop(todo_id, None) is not None


# Singleton instance
todo_service = TodoService()
