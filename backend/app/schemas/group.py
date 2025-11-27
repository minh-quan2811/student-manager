from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class GroupBase(BaseModel):
    name: str
    description: str
    needed_skills: List[str]
    max_members: int


class GroupCreate(GroupBase):
    leader_id: int


class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    needed_skills: Optional[List[str]] = None
    max_members: Optional[int] = None
    has_mentor: Optional[bool] = None
    mentor_id: Optional[int] = None


class Group(GroupBase):
    id: int
    leader_id: int
    current_members: int
    has_mentor: bool
    mentor_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class GroupMemberBase(BaseModel):
    group_id: int
    student_id: int
    role: str


class GroupMember(GroupMemberBase):
    id: int
    joined_at: datetime
    
    class Config:
        from_attributes = True


class GroupInvitationBase(BaseModel):
    group_id: int
    student_id: int
    message: str


class GroupInvitationCreate(GroupInvitationBase):
    pass


class GroupInvitation(GroupInvitationBase):
    id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class GroupJoinRequestBase(BaseModel):
    group_id: int
    student_id: int
    message: str


class GroupJoinRequestCreate(GroupJoinRequestBase):
    pass


class GroupJoinRequest(GroupJoinRequestBase):
    id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True