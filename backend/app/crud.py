from sqlalchemy.orm import Session
from . import models

def get_todos(db: Session):
    return db.query(models.Todo).all()

# 新增 todo 時帶入 title 與 content
def create_todo(db: Session, title: str, content: str = ''):
    todo = models.Todo(title=title, content=content)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo

# 更新完成狀態，同時可以更新內容(如果有需要)
def update_todo(db: Session, todo_id: int, completed: bool = None, content: str = None):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if todo:
        if completed is not None:
            todo.completed = completed
        if content is not None:
            todo.content = content
        db.commit()
        db.refresh(todo)
    return todo

def delete_todo(db: Session, todo_id: int):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if todo:
        db.delete(todo)
        db.commit()
    return todo
