from sqlalchemy import Column, Integer, String, ForeignKey, ARRAY, Boolean, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

group_mentors = Table(
    'group_mentors',
    Base.metadata,
    Column('group_id', Integer, ForeignKey('groups.id', ondelete='CASCADE')),
    Column('professor_id', Integer, ForeignKey('professors.id', ondelete='CASCADE')),
    Column('assigned_at', DateTime(timezone=True), server_default=func.now())
)

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
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    mentor_count = Column(Integer, default=0)
    
    # Relationships with proper cascade
    mentors = relationship("Professor", secondary=group_mentors, backref="mentored_groups_new")
    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")
    invitations = relationship("GroupInvitation", cascade="all, delete-orphan")
    join_requests = relationship("GroupJoinRequest", cascade="all, delete-orphan")
    mentorship_requests = relationship("MentorshipRequest", back_populates="group", cascade="all, delete-orphan")
    chat_messages = relationship("GroupChatMessage", cascade="all, delete-orphan")


class GroupMember(Base):
    __tablename__ = "group_members"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"))
    student_id = Column(Integer, ForeignKey("students.id"))
    role = Column(String)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    group = relationship("Group", back_populates="members")
    student = relationship("Student", back_populates="group_memberships")


class GroupInvitation(Base):
    __tablename__ = "group_invitations"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"))
    student_id = Column(Integer, ForeignKey("students.id"))
    message = Column(String)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    student = relationship("Student")


class GroupJoinRequest(Base):
    __tablename__ = "group_join_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"))
    student_id = Column(Integer, ForeignKey("students.id"))
    message = Column(String)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    student = relationship("Student")