from sqlalchemy import Column, Integer, String, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from app.database import Base


class Professor(Base):
    __tablename__ = "professors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True
    )
    professor_id = Column(String, unique=True, index=True)
    faculty = Column(String)
    field = Column(String)
    department = Column(String)
    research_areas = Column(ARRAY(String))
    research_interests = Column(ARRAY(String))
    achievements = Column(String)
    publications = Column(Integer, default=0)
    bio = Column(String)
    available_slots = Column(Integer, default=5)
    total_slots = Column(Integer, default=5)
    
    # Relationships
    user = relationship("User", back_populates="professor")
    mentored_groups = relationship("Group", back_populates="mentor")
    research_papers = relationship("ResearchPaper", secondary="research_professors", back_populates="professors")