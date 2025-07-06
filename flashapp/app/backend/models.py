from sqlalchemy import (
    DateTime,
    create_engine,
    MetaData,
    Table,
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    func,
)
from sqlalchemy.orm import (
    declarative_base,
    relationship,
    sessionmaker,
)
import json

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, echo=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id   = Column(Integer, primary_key=True)
    clerk_id = Column(String, unique=True, index=True, nullable=False)
    decks = relationship("Deck", back_populates="owner")


class Deck(Base):
    __tablename__ = "decks"
    id          = Column(Integer, primary_key=True)
    name        = Column(String, index=True, nullable=False)
    description = Column(Text)
    user_id     = Column(Integer, ForeignKey("users.id"))
    created_at  = Column(DateTime, server_default=func.now())
    updated_at  = Column(DateTime, server_default=func.now(), onupdate=func.now())
    owner       = relationship("User", back_populates="decks")
    cards       = relationship("Card", back_populates="deck")

class Card(Base):
    __tablename__ = "cards"
    id       = Column(Integer, primary_key=True)
    question = Column(Text, nullable=False)
    answer   = Column(Text, nullable=False)
    deck_id  = Column(Integer, ForeignKey("decks.id"))
    deck     = relationship("Deck", back_populates="cards")

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)