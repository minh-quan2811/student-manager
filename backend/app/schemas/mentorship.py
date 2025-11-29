from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MentorshipRequestBase(BaseModel):
    group_id: int
    professor_id: int
    message: str


class MentorshipRequestCreate(MentorshipRequestBase):
    requested_by: int


class MentorshipRequestUpdate(BaseModel):
    status: str  # 'accepted' or 'rejected'
    rejection_reason: Optional[str] = None


class MentorshipRequest(MentorshipRequestBase):
    id: int
    requested_by: int
    status: str
    rejection_reason: Optional[str] = None
    created_at: datetime
    responded_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class MentorshipRequestWithDetails(MentorshipRequest):
    group_name: str
    group_description: str
    group_needed_skills: list[str]
    requester_name: str
    requester_email: str
    professor_name: str
    
    class Config:
        from_attributes = True