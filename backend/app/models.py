from sqlalchemy import Column, Integer, String, Text
from pgvector.sqlalchemy import Vector
from .database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    embedding = Column(Vector(1536))  # OpenAI embeddings are 1536-dimensional

    def __repr__(self):
        return f"<Document(id={self.id})>"
