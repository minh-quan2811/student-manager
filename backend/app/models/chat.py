from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class GroupChatMessage(Base):
    __tablename__ = "group_chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(Integer, nullable=False)  # ID of student or professor
    sender_type = Column(String, nullable=False)  # 'student' or 'professor'
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    edited_at = Column(DateTime(timezone=True), nullable=True)
    is_deleted = Column(Boolean, default=False)
    
    # Relationships
    group = relationship("Group")
    read_status = relationship("MessageReadStatus", back_populates="message", cascade="all, delete-orphan")


class MessageReadStatus(Base):
    __tablename__ = "message_read_status"
    
    id = Column(Integer, primary_key=True)
    message_id = Column(Integer, ForeignKey("group_chat_messages.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    read_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    message = relationship("GroupChatMessage", back_populates="read_status")
    user = relationship("User")