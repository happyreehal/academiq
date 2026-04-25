from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pymongo import MongoClient
from utils.dependencies import admin_only
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["academiq"]
papers_col = db["papers"]

router = APIRouter()

DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EE", "MCA", "MBA"]
CLASSES = ["B.Tech", "MCA", "MBA", "M.Tech"]
SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"]

@router.post("/upload")
def upload_paper(
    department: str = Form(...),
    class_name: str = Form(...),
    semester: str = Form(...),
    subject: str = Form(...),
    academic_year: int = Form(...),
    file: UploadFile = File(...),
    user=Depends(admin_only)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    current_year = datetime.now().year
    if academic_year < current_year - 10:
        raise HTTPException(status_code=400, detail="Paper older than 10 years not allowed")

    upload_result = cloudinary.uploader.upload(
        file.file,
        resource_type="raw",
        folder="academiq/papers",
        public_id=f"{department}_{class_name}_{semester}_{subject}_{academic_year}",
        overwrite=True,
    )

    paper_doc = {
        "department": department,
        "class_name": class_name,
        "semester": semester,
        "subject": subject,
        "academic_year": academic_year,
        "file_url": upload_result["secure_url"],
        "public_id": upload_result["public_id"],
        "uploaded_by": user["email"],
        "uploaded_at": datetime.utcnow(),
    }
    papers_col.insert_one(paper_doc)

    return {"message": "Paper uploaded successfully", "url": upload_result["secure_url"]}


@router.get("/list")
def list_papers(
    department: str = None,
    class_name: str = None,
    semester: str = None,
    subject: str = None,
):
    current_year = datetime.now().year
    cutoff_year = current_year - 10

    query = {"academic_year": {"$gt": cutoff_year}}
    if department:
        query["department"] = department
    if class_name:
        query["class_name"] = class_name
    if semester:
        query["semester"] = semester
    if subject:
        query["subject"] = subject

    papers = list(papers_col.find(query, {"_id": 0}))
    return {"papers": papers}