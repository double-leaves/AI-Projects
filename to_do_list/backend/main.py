from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import create_engine, Session, select
from models import Todo

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "sqlite:///backend/database.db"
engine = create_engine(DATABASE_URL, echo=True)


@app.on_event("startup")
def on_startup():
    Todo.metadata.create_all(engine)


@app.get("/todos", response_model=List[Todo])
def get_todos():
    with Session(engine) as session:
        todos = session.exec(select(Todo)).all()
        return todos


@app.post("/todos", response_model=Todo)
def create_todo(todo: Todo):
    with Session(engine) as session:
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo


@app.patch("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, todo_update: Todo):
    with Session(engine) as session:
        db_todo = session.get(Todo, todo_id)
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        todo_update_data = todo_update.model_dump(exclude_unset=True)
        for key, value in todo_update_data.items():
            setattr(db_todo, key, value)
        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)
        return db_todo


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    with Session(engine) as session:
        db_todo = session.get(Todo, todo_id)
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        session.delete(db_todo)
        session.commit()
        return {"message": "Todo deleted successfully"}
