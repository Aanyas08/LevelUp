from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite file lives next to the backend app — fine for a portfolio project.
# `check_same_thread=False` is required because FastAPI can hand requests
# to different threads and SQLite connections are thread-bound by default.
SQLALCHEMY_DATABASE_URL = "sqlite:///./levelup.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency — yields a session and always closes it, even on error."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
