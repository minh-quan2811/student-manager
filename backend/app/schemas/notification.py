from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class NotificationBase(BaseModel):
    type: str
    title: str
    message: str
    link: Optional[str] = None
    related_group_id: Optional[int] = None
    related_student_id: Optional[int] = None
    related_request_id: Optional[int] = None


class NotificationCreate(NotificationBase):
    user_id: int


class Notification(NotificationBase):
    id: int
    user_id: int
    read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class NotificationMarkRead(BaseModel):
    notification_ids: list[int]


class GroupJoinRequestAction(BaseModel):
    notification_id: int
    action: str  # "accept" or "reject"


class GroupInvitationAction(BaseModel):
    notification_id: int
    action: str  # "accept" or "reject"