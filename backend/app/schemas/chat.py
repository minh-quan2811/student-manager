from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class MessageSender(BaseModel):
    id: int
    name: str
    type: str  # 'student' or 'professor'


class ChatMessageCreate(BaseModel):
    message: str


class ChatMessageUpdate(BaseModel):
    message: str


class ChatMessage(BaseModel):
    id: int
    group_id: int
    sender_id: int
    sender_type: str
    message: str
    created_at: datetime
    edited_at: Optional[datetime] = None
    is_deleted: bool
    sender_name: str
    is_read: bool = False
    
    class Config:
        from_attributes = True


class ChatMessageWithDetails(ChatMessage):
    read_by: List[dict] = []  # List of {user_id, name, read_at}
    
    class Config:
        from_attributes = True


class UnreadCountResponse(BaseModel):
    group_id: int
    unread_count: int