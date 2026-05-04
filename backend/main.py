from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv()

client = MongoClient(
    os.getenv("MONGO_URI"),
    maxPoolSize=10,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000,
)
db = client["academiq"]

from routes.auth import router as auth_router
from routes.papers import router as papers_router
from routes.ai import router as ai_router
from routes.settings import router as settings_router

app = FastAPI(title="AcademiQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://academiq-sigma.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(papers_router, prefix="/papers", tags=["Papers"])
app.include_router(ai_router, prefix="/ai", tags=["AI"])
app.include_router(settings_router, prefix="/settings", tags=["Settings"])

@app.get("/")
def root():
    return {"message": "AcademiQ API is running"}