from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import models, crud, database
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 允許的來源（前端地址）
origins = [
    "http://localhost:3000",
    # 可以加入更多允許的網域
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # 允許的網域清單
    allow_credentials=True,
    allow_methods=["*"],        # 允許所有方法(GET, POST, PUT, DELETE...)
    allow_headers=["*"],        # 允許所有標頭
)


@app.on_event("startup")
def on_startup():
    models.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TodoCreate(BaseModel):
    title: str
    content: Optional[str] = ""

class TodoOut(BaseModel):
    id: int
    title: str
    content: str
    completed: bool

    class Config:
        orm_mode = True

@app.get("/todos", response_model=List[TodoOut])
def read_todos(db: Session = Depends(get_db)):
    return crud.get_todos(db)

@app.post("/todos", response_model=TodoOut)
def add_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db, title=todo.title, content=todo.content)

@app.put("/todos/{todo_id}", response_model=TodoOut)
def update_todo(
    todo_id: int,
    completed: Optional[bool] = Query(None),
    content: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    updated = crud.update_todo(db, todo_id, completed=completed, content=content)
    if updated is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated

@app.delete("/todos/{todo_id}")
def remove_todo(todo_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_todo(db, todo_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"detail": "Deleted"}
