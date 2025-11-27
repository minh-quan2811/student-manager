from sqlalchemy import Column, Integer, String, ForeignKey, ARRAY, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Group(Base):
    __tablename__ = "groups"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    leader_id = Column(Integer, ForeignKey("students.id"))
    description = Column(String)
    needed_skills = Column(ARRAY(String))
    current_members = Column(Integer, default=1)
    max_members = Column(Integer)
    has_mentor = Column(Boolean, default=False)
    mentor_id = Column(Integer, ForeignKey("professors.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    mentor = relationship("Professor", back_populates="mentored_groups")
    members = relationship("GroupMember", back_populates="group")


class GroupMember(Base):
    __tablename__ = "group_members"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    role = Column(String)  # 'leader' or 'member'
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    group = relationship("Group", back_populates="members")
    student = relationship("Student", back_populates="group_memberships")


class GroupInvitation(Base):
    __tablename__ = "group_invitations"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    message = Column(String)
    status = Column(String, default="pending")  # pending, accepted, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    group = relationship("Group")
    student = relationship("Student")

class GroupJoinRequest(Base):
    __tablename__ = "group_join_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    message = Column(String)
    status = Column(String, default="pending")  # pending, accepted, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    group = relationship("Group")
    student = relationship("Student")