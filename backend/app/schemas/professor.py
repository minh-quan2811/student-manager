from pydantic import BaseModel
from typing import List, Optional


class ProfessorBase(BaseModel):
    professor_id: str
    faculty: str
    field: str
    department: str
    research_areas: List[str]
    research_interests: Optional[List[str]] = []
    achievements: Optional[str] = None
    publications: int = 0
    bio: Optional[str] = None
    available_slots: int = 5
    total_slots: int = 5


class ProfessorCreate(ProfessorBase):
    user_id: int


class ProfessorUpdate(BaseModel):
    faculty: Optional[str] = None
    field: Optional[str] = None
    department: Optional[str] = None
    research_areas: Optional[List[str]] = None
    research_interests: Optional[List[str]] = None
    achievements: Optional[str] = None
    publications: Optional[int] = None
    bio: Optional[str] = None
    available_slots: Optional[int] = None
    total_slots: Optional[int] = None


class Professor(ProfessorBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True


class ProfessorWithUser(Professor):
    name: str
    email: str
    
    class Config:
        from_attributes = True