from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    type = Column(String)
    title = Column(String)
    message = Column(String)
    link = Column(String, nullable=True)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Additional data stored as JSON for flexibility
    related_group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"), nullable=True)
    related_student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=True)
    related_request_id = Column(Integer, nullable=True)  # For storing join request ID or other request IDs
    
    # Relationships
    user = relationship("User")
    group = relationship("Group")
    student = relationship("Student")