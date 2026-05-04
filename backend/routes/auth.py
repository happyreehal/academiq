from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from models.user import UserRegister, UserLogin
from utils.jwt_handler import create_token
from dotenv import load_dotenv
from main import db
import os
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta

load_dotenv()

router = APIRouter()

users_col = db["users"]
settings_col = db["settings"]
otp_col = db["otps"]

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

SUPER_ADMIN_EMAIL = "happyreehal584@gmail.com"
GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

def send_otp_email(to_email: str, otp: str, name: str):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "AcademiQ — Email Verification OTP"
        msg["From"] = GMAIL_USER
        msg["To"] = to_email

        html = f"""
        <div style="font-family:'DM Sans',sans-serif;max-width:480px;margin:0 auto;background:#0F2A4A;border-radius:16px;overflow:hidden;">
          <div style="background:#1D9E75;padding:24px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:24px;">AcademiQ</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">SGTB Khalsa College</p>
          </div>
          <div style="padding:36px 32px;">
            <h2 style="color:white;margin:0 0 12px;">Hi {name}! 👋</h2>
            <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;margin-bottom:28px;">
              Use the OTP below to verify your email address. This OTP is valid for <strong style="color:#1D9E75;">10 minutes</strong>.
            </p>
            <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(29,158,117,0.3);border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
              <div style="font-size:42px;font-weight:800;color:#1D9E75;letter-spacing:12px;">{otp}</div>
            </div>
            <p style="color:rgba(255,255,255,0.3);font-size:12px;">If you didn't create an AcademiQ account, ignore this email.</p>
          </div>
        </div>
        """

        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_USER, to_email, msg.as_string())
        return True
    except Exception as e:
        print("EMAIL ERROR:", str(e))
        return False

def get_admin_secret():
    doc = settings_col.find_one({"_id": "main"})
    if doc and "admin_secret" in doc:
        return doc["admin_secret"]
    return os.getenv("ADMIN_SECRET", "academiq_admin_2026")

@router.post("/send-otp")
def send_otp(body: dict):
    email = body.get("email")
    name = body.get("name", "Student")
    role = body.get("role", "student")

    if not email:
        raise HTTPException(400, "Email required")

    # Check if already registered
    if users_col.find_one({"email": email, "role": role}):
        raise HTTPException(400, "Email already registered")

    # Generate 6 digit OTP
    otp = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    # Save OTP in DB (upsert)
    otp_col.update_one(
        {"email": email, "role": role},
        {"$set": {"otp": otp, "expires_at": expires_at, "verified": False}},
        upsert=True
    )

    # Send email
    sent = send_otp_email(email, otp, name)
    if not sent:
        raise HTTPException(500, "Failed to send OTP email. Please check your email address.")

    return {"message": "OTP sent successfully"}

@router.post("/verify-otp")
def verify_otp(body: dict):
    email = body.get("email")
    otp = body.get("otp")
    role = body.get("role", "student")

    record = otp_col.find_one({"email": email, "role": role})
    if not record:
        raise HTTPException(400, "OTP not found. Please request again.")

    if datetime.utcnow() > record["expires_at"]:
        raise HTTPException(400, "OTP expired. Please request again.")

    if record["otp"] != otp:
        raise HTTPException(400, "Invalid OTP. Please try again.")

    # Mark as verified
    otp_col.update_one({"email": email, "role": role}, {"$set": {"verified": True}})
    return {"message": "Email verified successfully"}

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

    # Check OTP verified (super admin skip)
    if user.email != SUPER_ADMIN_EMAIL:
        otp_record = otp_col.find_one({"email": user.email, "role": user.role})
        if not otp_record or not otp_record.get("verified"):
            raise HTTPException(status_code=400, detail="Email not verified. Please verify OTP first.")

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

    # Clean up OTP
    otp_col.delete_one({"email": user.email, "role": user.role})

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