from pydantic import BaseModel
from typing import List, Optional


class ResearchPaperBase(BaseModel):
    paper_id: str
    group_name: str
    topic: str
    description: str
    abstract: Optional[str] = None
    faculty: str
    year: int
    rank: int
    members: int
    leader: str
    paper_path: Optional[str] = None


class ResearchPaperCreate(ResearchPaperBase):
    professor_ids: List[int] = []


class ResearchPaperUpdate(BaseModel):
    group_name: Optional[str] = None
    topic: Optional[str] = None
    description: Optional[str] = None
    abstract: Optional[str] = None
    faculty: Optional[str] = None
    year: Optional[int] = None
    rank: Optional[int] = None
    members: Optional[int] = None
    leader: Optional[str] = None
    paper_path: Optional[str] = None
    professor_ids: Optional[List[int]] = None


class ResearchPaper(ResearchPaperBase):
    id: int
    
    class Config:
        from_attributes = True