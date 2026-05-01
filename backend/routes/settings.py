from fastapi import APIRouter, HTTPException, Depends
from pymongo import MongoClient
from utils.dependencies import admin_only, get_current_user
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import urllib.parse

load_dotenv()

router = APIRouter()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["academiq"]
settings_col = db["settings"]
users_col = db["users"]

SUPER_ADMIN_EMAIL = "happyreehal584@gmail.com"

def get_settings():
    doc = settings_col.find_one({"_id": "main"})
    if not doc:
        doc = {"_id": "main", "departments": [], "classes": [], "subjects": {}, "dept_classes": {}, "admin_secret": os.getenv("ADMIN_SECRET", "academiq_admin_2026")}
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
    subject: str

class DeptClassModel(BaseModel):
    department: str
    class_name: str

class SecretModel(BaseModel):
    new_secret: str

# ── DEPARTMENTS ──
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
    dept_classes = doc.get("dept_classes", {})
    dept_classes.pop(name, None)
    save_settings({"departments": depts, "subjects": subjects, "dept_classes": dept_classes})
    return {"departments": depts}

# ── CLASSES ──
@router.get("/classes")
def get_classes():
    return {"classes": get_settings().get("classes", [])}

@router.post("/classes")
def add_class(body: ValueModel, user=Depends(admin_only)):
    doc = get_settings()
    classes = doc.get("classes", [])
    if body.value in classes:
        raise HTTPException(400, "Already exists")
    classes.append(body.value)
    save_settings({"classes": classes})
    return {"classes": classes}

@router.delete("/classes/{name:path}")
def delete_class(name: str, user=Depends(admin_only)):
    name = urllib.parse.unquote(name)
    doc = get_settings()
    classes = [c for c in doc.get("classes", []) if c != name]
    save_settings({"classes": classes})
    return {"classes": classes}

# ── SUBJECTS ──
@router.get("/subjects")
def get_subjects():
    return {"subjects": get_settings().get("subjects", {})}

@router.post("/subjects")
def add_subject(body: SubjectModel, user=Depends(admin_only)):
    doc = get_settings()
    subjects = doc.get("subjects", {})
    if body.department not in subjects:
        subjects[body.department] = []
    if body.subject in subjects[body.department]:
        raise HTTPException(400, "Already exists")
    subjects[body.department].append(body.subject)
    save_settings({"subjects": subjects})
    return {"subjects": subjects}

@router.delete("/subjects/{department:path}/{subject:path}")
def delete_subject(department: str, subject: str, user=Depends(admin_only)):
    department = urllib.parse.unquote(department)
    subject = urllib.parse.unquote(subject)
    doc = get_settings()
    subjects = doc.get("subjects", {})
    if department in subjects:
        subjects[department] = [s for s in subjects[department] if s != subject]
    save_settings({"subjects": subjects})
    return {"subjects": subjects}

# ── DEPT-CLASSES ──
@router.get("/dept-classes")
def get_dept_classes():
    return {"dept_classes": get_settings().get("dept_classes", {})}

@router.post("/dept-classes")
def add_dept_class(body: DeptClassModel, user=Depends(admin_only)):
    doc = get_settings()
    dept_classes = doc.get("dept_classes", {})
    if body.department not in dept_classes:
        dept_classes[body.department] = []
    if body.class_name in dept_classes[body.department]:
        raise HTTPException(400, "Already linked")
    dept_classes[body.department].append(body.class_name)
    save_settings({"dept_classes": dept_classes})
    return {"dept_classes": dept_classes}

@router.delete("/dept-classes/{department:path}/{class_name:path}")
def delete_dept_class(department: str, class_name: str, user=Depends(admin_only)):
    department = urllib.parse.unquote(department)
    class_name = urllib.parse.unquote(class_name)
    doc = get_settings()
    dept_classes = doc.get("dept_classes", {})
    if department in dept_classes:
        dept_classes[department] = [c for c in dept_classes[department] if c != class_name]
    save_settings({"dept_classes": dept_classes})
    return {"dept_classes": dept_classes}

# ── STUDENTS ──
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

# ── ADMINS (Super Admin Only) ──
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

# ── SECRET KEY (Super Admin Only) ──
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