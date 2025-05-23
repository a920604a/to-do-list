from sqlalchemy import Column, Integer, String, Boolean, Text
from .database import Base

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    completed = Column(Boolean, default=False)
