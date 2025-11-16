from sqlalchemy import Column, Integer, String, Float, ForeignKey, ARRAY, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    student_id = Column(String, unique=True, index=True)
    gpa = Column(Float)
    major = Column(String)
    faculty = Column(String)
    year = Column(String)
    skills = Column(ARRAY(String))
    bio = Column(String)
    looking_for_group = Column(Boolean, default=True)
    
    # Relationships
    user = relationship("User", back_populates="student")
    group_memberships = relationship("GroupMember", back_populates="student")