from pydantic import BaseModel
from typing import List, Optional


class StudentBase(BaseModel):
    student_id: str
    gpa: float
    major: str
    faculty: str
    year: str
    skills: List[str]
    bio: Optional[str] = None
    looking_for_group: bool = True


class StudentCreate(StudentBase):
    user_id: int


class StudentUpdate(BaseModel):
    gpa: Optional[float] = None
    major: Optional[str] = None
    faculty: Optional[str] = None
    year: Optional[str] = None
    skills: Optional[List[str]] = None
    bio: Optional[str] = None
    looking_for_group: Optional[bool] = None


class Student(StudentBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True


class StudentWithUser(Student):
    name: str
    email: str
    
    class Config:
        from_attributes = True