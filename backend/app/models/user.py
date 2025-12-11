from sqlalchemy import Column, Integer, String, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STUDENT = "student"
    PROFESSOR = "professor"


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    
    # Relationships
    student = relationship(
        "Student",
        back_populates="user",
        uselist=False,
        cascade="all, delete",
        passive_deletes=True
    )
    professor = relationship(
        "Professor",
        back_populates="user",
        uselist=False,
        cascade="all, delete",
        passive_deletes=True
    )