from pydantic import BaseModel, EmailStr
from typing import Optional, List
from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


# Profile Update Schemas - Students can only update these fields
class StudentProfileUpdate(BaseModel):
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    looking_for_group: Optional[bool] = None


# Profile Update Schemas - Professors can only update these fields
class ProfessorProfileUpdate(BaseModel):
    bio: Optional[str] = None
    research_interests: Optional[List[str]] = None
    total_slots: Optional[int] = None