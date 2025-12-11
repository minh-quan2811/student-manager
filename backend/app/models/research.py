from sqlalchemy import Column, Integer, String, ForeignKey, ARRAY, Table, Text
from sqlalchemy.orm import relationship
from app.database import Base

# Association table for research papers and professors
research_professors = Table(
    'research_professors',
    Base.metadata,
    Column('research_id', Integer, ForeignKey('research_papers.id')),
    Column('professor_id', Integer, ForeignKey('professors.id'))
)

# Association table for research papers and team members
research_team_members = Table(
    'research_team_members',
    Base.metadata,
    Column('research_id', Integer, ForeignKey('research_papers.id')),
    Column('student_id', Integer, ForeignKey('students.id')),
    Column('role', String)
)


class ResearchPaper(Base):
    __tablename__ = "research_papers"
    
    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(String, unique=True, index=True)
    group_name = Column(String)
    topic = Column(String)
    description = Column(Text)
    abstract = Column(Text)
    faculty = Column(String)
    year = Column(Integer)
    rank = Column(Integer)
    members = Column(Integer)
    leader = Column(String)
    paper_path = Column(String)
    
    # Relationships
    professors = relationship("Professor", secondary=research_professors, back_populates="research_papers")