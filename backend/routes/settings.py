from fastapi import APIRouter, HTTPException, Depends
from pymongo import MongoClient
from utils.dependencies import admin_only
from dotenv import load_dotenv
from pydantic import BaseModel
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["academiq"]
settings_col = db["settings"]
users_col = db["users"]

router = APIRouter()

def get_setting(key):
    doc = settings_col.find_one({"key": key})
    return doc["values"] if doc else []

def set_setting(key, values):
    settings_col.update_one({"key": key}, {"$set": {"values": values}}, upsert=True)

class AddItem(BaseModel):
    value: str

class SubjectAdd(BaseModel):
    department: str
    subject: str

class DeptClassMap(BaseModel):
    department: str
    class_name: str

@router.get("/departments")
def get_departments():
    return {"departments": get_setting("departments")}

@router.post("/departments")
def add_department(item: AddItem, user=Depends(admin_only)):
    val = item.value.strip().upper()
    current = get_setting("departments")
    if val in current:
        raise HTTPException(400, "Already exists")
    current.append(val)
    set_setting("departments", current)
    return {"departments": current}

@router.delete("/departments/{name}")
def remove_department(name: str, user=Depends(admin_only)):
    current = get_setting("departments")
    if name not in current:
        raise HTTPException(404, "Not found")
    current.remove(name)
    set_setting("departments", current)
    doc = settings_col.find_one({"key": "subjects"})
    if doc:
        subjects = doc.get("values", {})
        subjects.pop(name, None)
        settings_col.update_one({"key": "subjects"}, {"$set": {"values": subjects}})
    mapping_doc = settings_col.find_one({"key": "dept_classes"})
    if mapping_doc:
        mapping = mapping_doc.get("values", {})
        mapping.pop(name, None)
        settings_col.update_one({"key": "dept_classes"}, {"$set": {"values": mapping}})
    return {"departments": current}

@router.get("/classes")
def get_classes():
    return {"classes": get_setting("classes")}

@router.post("/classes")
def add_class(item: AddItem, user=Depends(admin_only)):
    val = item.value.strip()
    current = get_setting("classes"  )
    if val in current:
        raise HTTPException(400, "Already exists")
    current.append(val)
    set_setting("classes", current)
    return {"classes": current}

@router.delete("/classes/{name}")
def remove_class(name: str, user=Depends(admin_only)):
    current = get_setting("classes")
    if name not in current:
        raise HTTPException(404, "Not found")
    current.remove(name)
    set_setting("classes", current)
    return {"classes": current}

@router.get("/subjects")
def get_all_subjects():
    doc = settings_col.find_one({"key": "subjects"})
    return {"subjects": doc["values"] if doc else {}}

@router.post("/subjects")
def add_subject(item: SubjectAdd, user=Depends(admin_only)):
    dept = item.department.strip().upper()
    subj = item.subject.strip()
    depts = get_setting("departments")
    if dept not in depts:
        raise HTTPException(400, f"Department '{dept}' does not exist")
    doc = settings_col.find_one({"key": "subjects"})
    subjects = doc["values"] if doc else {}
    dept_list = subjects.get(dept, [])
    if subj in dept_list:
        raise HTTPException(400, "Subject already exists")
    dept_list.append(subj)
    subjects[dept] = dept_list
    settings_col.update_one({"key": "subjects"}, {"$set": {"values": subjects}}, upsert=True)
    return {"subjects": subjects}

@router.delete("/subjects/{department}/{subject}")
def remove_subject(department: str, subject: str, user=Depends(admin_only)):
    doc = settings_col.find_one({"key": "subjects"})
    subjects = doc["values"] if doc else {}
    dept_list = subjects.get(department, [])
    if subject not in dept_list:
        raise HTTPException(404, "Subject not found")
    dept_list.remove(subject)
    subjects[department] = dept_list
    settings_col.update_one({"key": "subjects"}, {"$set": {"values": subjects}}, upsert=True)
    return {"subjects": subjects}

@router.get("/students")
def get_students(user=Depends(admin_only)):
    students = list(users_col.find({"role": "student"}, {"_id": 0, "password": 0}))
    return {"students": students}

@router.delete("/students/{email}")
def remove_student(email: str, user=Depends(admin_only)):
    result = users_col.delete_one({"email": email, "role": "student"})
    if result.deleted_count == 0:
        raise HTTPException(404, "Student not found")
    return {"message": f"Student {email} removed"}

@router.get("/dept-classes")
def get_dept_classes():
    doc = settings_col.find_one({"key": "dept_classes"})
    return {"dept_classes": doc["values"] if doc else {}}

@router.post("/dept-classes")
def add_dept_class(item: DeptClassMap, user=Depends(admin_only)):
    dept = item.department.strip().upper()
    cls = item.class_name.strip()
    depts = get_setting("departments")
    if dept not in depts:
        raise HTTPException(400, f"Department '{dept}' does not exist")
    classes = get_setting("classes")
    if cls not in classes:
        raise HTTPException(400, f"Class '{cls}' does not exist")
    doc = settings_col.find_one({"key": "dept_classes"})
    mapping = doc["values"] if doc else {}
    dept_list = mapping.get(dept, [])
    if cls in dept_list:
        raise HTTPException(400, "Already linked")
    dept_list.append(cls)
    mapping[dept] = dept_list
    settings_col.update_one({"key": "dept_classes"}, {"$set": {"values": mapping}}, upsert=True)
    return {"dept_classes": mapping}

@router.delete("/dept-classes/{department}/{class_name}")
def remove_dept_class(department: str, class_name: str, user=Depends(admin_only)):
    doc = settings_col.find_one({"key": "dept_classes"})
    mapping = doc["values"] if doc else {}
    dept_list = mapping.get(department, [])
    if class_name not in dept_list:
        raise HTTPException(404, "Not found")
    dept_list.remove(class_name)
    mapping[department] = dept_list
    settings_col.update_one({"key": "dept_classes"}, {"$set": {"values": mapping}}, upsert=True)
    return {"dept_classes": mapping}