from pydantic import BaseModel
from typing import Optional

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str  # "admin" or "student"
    college_id: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str
    role: str