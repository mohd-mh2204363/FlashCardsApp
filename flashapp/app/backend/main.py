from fastapi import FastAPI, File, Form, UploadFile, Depends, HTTPException, Request, Response
from clerk_backend_api import Clerk, AuthenticateRequestOptions
from fastapi.middleware.cors import CORSMiddleware
import tempfile
from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker, joinedload
from typing import List, Optional
from models import Base, User, Deck, Card
import argparse
from pdfminer.high_level import extract_text
import logging
import os
import unicodedata
import re
from app.backend.ai_generator import get_cards
from functools import lru_cache
from typing import Dict

import requests
from jose import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()



SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class CardSchema(BaseModel):
    id: int
    question: str
    answer: str

    class Config:
        orm_mode = True

class DeckSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    cards: List[CardSchema] = []

    class Config:
        orm_mode = True

class UserSchema(BaseModel):
    id: int
    clerk_id: str
    decks: List[DeckSchema] = []

    class Config:
        orm_mode = True

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

clerk_sdk  = Clerk(
    bearer_auth = os.getenv("CLERK_SECRET_AUTH")
)

def authenticate_user(request: Request):
    try:
        request_state = clerk_sdk.authenticate_request(request,AuthenticateRequestOptions(
                                                           authorized_parties=["http://localhost:3000"],
                                                           jwt_key=os.getenv("JWT_KEY"),
                                                       ))
        if not request_state.is_signed_in:
            raise HTTPException(status_code=401, detail="Unauthorized")
        return request_state.payload
    except Exception as e:
        raise HTTPException(status_code=500, detail="Custom Error")
    
def get_current_user(
    payload = Depends(authenticate_user),
    db      = Depends(get_db),
):
    clerk_id = payload["sub"]
    user = db.query(User).filter_by(clerk_id=clerk_id).first()
    if not user:
        user = User(
            clerk_id=clerk_id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/users", response_model=List[UserSchema])
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/me", response_model=UserSchema)
def get_my_profile(
    user: User      = Depends(get_current_user)
):
    return {
        "id":        user.id,
        "decks":     user.decks,
        "clerk_id":  user.clerk_id,
    }

@app.get("/decks/me", response_model=List[DeckSchema])
def read_my_decks(
    user: User      = Depends(get_current_user),
    db:   Session   = Depends(get_db),
):

    decks = (
        db.query(Deck)
          .options(joinedload(Deck.cards))
          .filter(Deck.user_id == user.id)
          .all()
    )
    return decks

@app.get("/decks/{deck_id}", response_model=DeckSchema)
def read_deck(deck_id: int, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not deck:
        raise HTTPException(404, f"Deck {deck_id} not found")
    return deck

@app.get("/cards/{card_id}", response_model=CardSchema)
def read_card(card_id: int, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(404, f"Card {card_id} not found")
    return card

@app.post("/decks", response_model=DeckSchema)
def create_deck(deck: DeckSchema, db: Session = Depends(get_db)):
    db_deck = Deck(**deck.model_dump())
    db.add(db_deck)
    db.commit()
    db.refresh(db_deck)
    return db_deck

@app.post("/generate", response_model=DeckSchema, status_code=201)
async def generate_flashcards(
    prompt: str              = Form(...),
    count: int               = Form(...),
    front_text_length: str   = Form(...),
    back_text_length: str    = Form(...),
    files: List[UploadFile]  = File([]),
    links: List[str]         = Form([]),
    db: Session              = Depends(get_db),
    user: User               = Depends(get_current_user),
):
    textfromPDF = ""
    for up in files:
        if not up.filename.lower().endswith(".pdf"):
            raise HTTPException(400, "Only PDF files are allowed.")
        textfromPDF += extract_text(up.file)

    name, description, cards_json = get_cards(
        user_input        = prompt,
        front_text_length = front_text_length,
        back_text_length  = back_text_length,
        count             = count,
        textfromPDF       = textfromPDF,
    )

    deck = Deck(name=name, description=description, user_id=user.id)
    db.add(deck)
    db.commit()
    db.refresh(deck)

    for c in cards_json:
        db.add(Card(question=c["question"], answer=c["answer"], deck_id=deck.id))
    db.commit()
    db.refresh(deck)

    return deck

