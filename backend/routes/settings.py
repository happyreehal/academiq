from fastapi import APIRouter, HTTPException, Depends
from utils.dependencies import admin_only, get_current_user
from pydantic import BaseModel
from dotenv import load_dotenv
from main import db
import os
import urllib.parse

load_dotenv()

router = APIRouter()

settings_col = db["settings"]
users_col = db["users"]

SUPER_ADMIN_EMAIL = "happyreehal584@gmail.com"

def get_settings():
    doc = settings_col.find_one({"_id": "main"})
    if not doc:
        doc = {
            "_id": "main",
            "departments": [],
            "courses": [],
            "subjects": {},
            "dept_courses": {},
            "admin_secret": os.getenv("ADMIN_SECRET", "academiq_admin_2026")
        }
        settings_col.insert_one(doc)
    return doc

def save_settings(doc):
    settings_col.update_one({"_id": "main"}, {"$set": doc}, upsert=True)

def is_super(user):
    return user.get("email") == SUPER_ADMIN_EMAIL and user.get("role") == "admin"

def super_only(user=Depends(get_current_user)):
    if not is_super(user):
        raise HTTPException(status_code=403, detail="Super admin only")
    return user

class ValueModel(BaseModel):
    value: str

class SubjectModel(BaseModel):
    department: str
    course: str
    semester: str
    subject: str

class DeptCourseModel(BaseModel):
    department: str
    course: str

class SecretModel(BaseModel):
    new_secret: str

@router.get("/departments")
def get_departments():
    return {"departments": get_settings().get("departments", [])}

@router.post("/departments")
def add_department(body: ValueModel, user=Depends(admin_only)):
    doc = get_settings()
    depts = doc.get("departments", [])
    if body.value in depts:
        raise HTTPException(400, "Already exists")
    depts.append(body.value)
    save_settings({"departments": depts})
    return {"departments": depts}

@router.delete("/departments/{name:path}")
def delete_department(name: str, user=Depends(admin_only)):
    name = urllib.parse.unquote(name)
    doc = get_settings()
    depts = [d for d in doc.get("departments", []) if d != name]
    subjects = doc.get("subjects", {})
    subjects.pop(name, None)
    dept_courses = doc.get("dept_courses", {})
    dept_courses.pop(name, None)
    save_settings({"departments": depts, "subjects": subjects, "dept_courses": dept_courses})
    return {"departments": depts}

@router.get("/courses")
def get_courses():
    return {"courses": get_settings().get("courses", [])}

@router.post("/courses")
def add_course(body: ValueModel, user=Depends(admin_only)):
    doc = get_settings()
    courses = doc.get("courses", [])
    if body.value in courses:
        raise HTTPException(400, "Already exists")
    courses.append(body.value)
    save_settings({"courses": courses})
    return {"courses": courses}

@router.delete("/courses/{name:path}")
def delete_course(name: str, user=Depends(admin_only)):
    name = urllib.parse.unquote(name)
    doc = get_settings()
    courses = [c for c in doc.get("courses", []) if c != name]
    save_settings({"courses": courses})
    return {"courses": courses}

@router.get("/subjects")
def get_subjects():
    return {"subjects": get_settings().get("subjects", {})}

@router.post("/subjects")
def add_subject(body: SubjectModel, user=Depends(admin_only)):
    doc = get_settings()
    subjects = doc.get("subjects", {})
    if body.department not in subjects:
        subjects[body.department] = {}
    if body.course not in subjects[body.department]:
        subjects[body.department][body.course] = {}
    if body.semester not in subjects[body.department][body.course]:
        subjects[body.department][body.course][body.semester] = []
    if body.subject in subjects[body.department][body.course][body.semester]:
        raise HTTPException(400, "Already exists")
    subjects[body.department][body.course][body.semester].append(body.subject)
    save_settings({"subjects": subjects})
    return {"subjects": subjects}

@router.delete("/subjects/{department}/{course}/{semester}/{subject}")
def delete_subject(department: str, course: str, semester: str, subject: str, user=Depends(admin_only)):
    department = urllib.parse.unquote(department)
    course = urllib.parse.unquote(course)
    semester = urllib.parse.unquote(semester)
    subject = urllib.parse.unquote(subject)
    doc = get_settings()
    subjects = doc.get("subjects", {})
    try:
        subjects[department][course][semester] = [
            s for s in subjects[department][course][semester] if s != subject
        ]
    except KeyError:
        pass
    save_settings({"subjects": subjects})
    return {"subjects": subjects}

@router.get("/dept-courses")
def get_dept_courses():
    return {"dept_courses": get_settings().get("dept_courses", {})}

@router.post("/dept-courses")
def add_dept_course(body: DeptCourseModel, user=Depends(admin_only)):
    doc = get_settings()
    dept_courses = doc.get("dept_courses", {})
    if body.department not in dept_courses:
        dept_courses[body.department] = []
    if body.course in dept_courses[body.department]:
        raise HTTPException(400, "Already linked")
    dept_courses[body.department].append(body.course)
    save_settings({"dept_courses": dept_courses})
    return {"dept_courses": dept_courses}

@router.delete("/dept-courses/{department}/{course}")
def delete_dept_course(department: str, course: str, user=Depends(admin_only)):
    department = urllib.parse.unquote(department)
    course = urllib.parse.unquote(course)
    doc = get_settings()
    dept_courses = doc.get("dept_courses", {})
    if department in dept_courses:
        dept_courses[department] = [c for c in dept_courses[department] if c != course]
    save_settings({"dept_courses": dept_courses})
    return {"dept_courses": dept_courses}

@router.get("/students")
def get_students(user=Depends(admin_only)):
    students = list(users_col.find({"role": "student"}, {"_id": 0, "password": 0}))
    return {"students": students}

@router.post("/students/{email}/approve")
def approve_student(email: str, user=Depends(admin_only)):
    email = urllib.parse.unquote(email)
    users_col.update_one({"email": email, "role": "student"}, {"$set": {"status": "active"}})
    return {"message": "Student approved"}

@router.post("/students/{email}/reject")
def reject_student(email: str, user=Depends(admin_only)):
    email = urllib.parse.unquote(email)
    users_col.update_one({"email": email, "role": "student"}, {"$set": {"status": "rejected"}})
    return {"message": "Student rejected"}

@router.delete("/students/{email:path}")
def delete_student(email: str, user=Depends(admin_only)):
    email = urllib.parse.unquote(email)
    users_col.delete_one({"email": email, "role": "student"})
    return {"message": "Student removed"}

@router.get("/admins")
def get_admins(user=Depends(super_only)):
    admins = list(users_col.find({"role": "admin"}, {"_id": 0, "password": 0}))
    return {"admins": admins}

@router.post("/admins/{email}/approve")
def approve_admin(email: str, user=Depends(super_only)):
    email = urllib.parse.unquote(email)
    users_col.update_one({"email": email, "role": "admin"}, {"$set": {"status": "active"}})
    return {"message": "Admin approved"}

@router.post("/admins/{email}/reject")
def reject_admin(email: str, user=Depends(super_only)):
    email = urllib.parse.unquote(email)
    users_col.update_one({"email": email, "role": "admin"}, {"$set": {"status": "rejected"}})
    return {"message": "Admin rejected"}

@router.delete("/admins/{email:path}")
def delete_admin(email: str, user=Depends(super_only)):
    email = urllib.parse.unquote(email)
    if email == SUPER_ADMIN_EMAIL:
        raise HTTPException(400, "Cannot remove super admin")
    users_col.delete_one({"email": email, "role": "admin"})
    return {"message": "Admin removed"}

@router.get("/admin-secret")
def get_admin_secret(user=Depends(super_only)):
    doc = get_settings()
    return {"secret": doc.get("admin_secret", os.getenv("ADMIN_SECRET", "academiq_admin_2026"))}

@router.post("/admin-secret")
def update_admin_secret(body: SecretModel, user=Depends(super_only)):
    if len(body.new_secret) < 8:
        raise HTTPException(400, "Secret must be at least 8 characters")
    save_settings({"admin_secret": body.new_secret})
    return {"message": "Admin secret updated successfully"}