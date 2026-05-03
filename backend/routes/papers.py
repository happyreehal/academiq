from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from utils.dependencies import admin_only
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os
from datetime import datetime
import urllib.parse
from fastapi.responses import StreamingResponse
import httpx
from main import db

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

papers_col = db["papers"]

router = APIRouter()

def clean_public_id(text):
    return text.replace(" ", "_").replace("&", "and").replace(".", "").replace(",", "").replace("/", "-")

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

    safe_id = f"{clean_public_id(department)}_{clean_public_id(class_name)}_{clean_public_id(semester)}_{clean_public_id(subject)}_{academic_year}"

    upload_result = cloudinary.uploader.upload(
        file.file,
        resource_type="raw",
        folder="academiq/papers",
        public_id=safe_id,
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


@router.get("/all")
def all_papers(user=Depends(admin_only)):
    papers = list(papers_col.find({}, {"_id": 0}))
    return {"papers": papers}


@router.delete("/delete/{public_id:path}")
def delete_paper(public_id: str, user=Depends(admin_only)):
    public_id = urllib.parse.unquote(public_id)
    paper = papers_col.find_one({"public_id": public_id})
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    try:
        cloudinary.uploader.destroy(public_id, resource_type="raw")
    except Exception:
        try:
            cloudinary.uploader.destroy(public_id, resource_type="image")
        except Exception:
            pass
    papers_col.delete_one({"public_id": public_id})
    return {"message": "Paper deleted successfully"}


@router.get("/download")
async def download_paper(url: str, inline: bool = False):
    async with httpx.AsyncClient() as client:
        response = await client.get(url, follow_redirects=True)

    filename = url.split("/")[-1]
    if not filename.endswith(".pdf"):
        filename = filename + ".pdf"

    disposition = "inline" if inline else "attachment"

    return StreamingResponse(
        iter([response.content]),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"{disposition}; filename={filename}",
            "Content-Type": "application/pdf",
        }
    )