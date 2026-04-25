from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from passlib.context import CryptContext
from models.user import UserRegister, UserLogin
from utils.jwt_handler import create_token
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["academiq"]
users_col = db["users"]

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
def register(user: UserRegister):
    if users_col.find_one({"email": user.email, "role": user.role}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = pwd_ctx.hash(user.password)

    user_doc = {
        "name": user.name,
        "email": user.email,
        "password": hashed_pw,
        "role": user.role,
        "college_id": user.college_id,
    }
    users_col.insert_one(user_doc)
    return {"message": "Registration successful"}


@router.post("/login")
def login(user: UserLogin):
    db_user = users_col.find_one({"email": user.email, "role": user.role})

    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    if not pwd_ctx.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_token({
        "email": db_user["email"],
        "role": db_user["role"],
        "name": db_user["name"],
    })

    return {
        "token": token,
        "role": db_user["role"],
        "name": db_user["name"],
    }