from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from models.user import UserRegister, UserLogin
from utils.jwt_handler import create_token
from dotenv import load_dotenv
from main import db
import os

load_dotenv()

router = APIRouter()

users_col = db["users"]
settings_col = db["settings"]

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

SUPER_ADMIN_EMAIL = "happyreehal584@gmail.com"

def get_admin_secret():
    doc = settings_col.find_one({"_id": "main"})
    if doc and "admin_secret" in doc:
        return doc["admin_secret"]
    return os.getenv("ADMIN_SECRET", "academiq_admin_2026")

@router.post("/register")
def register(user: UserRegister):
    if user.role == "superadmin":
        raise HTTPException(status_code=403, detail="Cannot register as superadmin")

    if user.role == "admin":
        if not user.admin_code:
            raise HTTPException(status_code=403, detail="Admin secret code required")
        if user.admin_code != get_admin_secret():
            raise HTTPException(status_code=403, detail="Invalid admin secret code")

    if users_col.find_one({"email": user.email, "role": user.role}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = pwd_ctx.hash(user.password)

    if user.email == SUPER_ADMIN_EMAIL and user.role == "admin":
        status = "active"
    elif user.role == "admin":
        status = "pending"
    else:
        status = "pending"

    user_doc = {
        "name": user.name,
        "email": user.email,
        "password": hashed_pw,
        "role": user.role,
        "college_id": user.college_id,
        "status": status,
    }
    users_col.insert_one(user_doc)

    if status == "pending":
        return {"message": "Registration successful. Please wait for approval."}
    return {"message": "Registration successful"}


@router.post("/login")
def login(user: UserLogin):
    db_user = users_col.find_one({"email": user.email, "role": user.role})

    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    if not pwd_ctx.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    status = db_user.get("status", "active")
    if status == "pending":
        raise HTTPException(status_code=403, detail="Account pending approval. Please wait for admin to approve.")
    if status == "rejected":
        raise HTTPException(status_code=403, detail="Account rejected. Contact admin.")

    is_super = user.email == SUPER_ADMIN_EMAIL and user.role == "admin"

    token = create_token({
        "email": db_user["email"],
        "role": db_user["role"],
        "name": db_user["name"],
        "is_super": is_super,
    })

    return {
        "token": token,
        "role": db_user["role"],
        "name": db_user["name"],
        "is_super": is_super,
    }