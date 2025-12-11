from sqlalchemy.orm import Session
from app.models.research import ResearchPaper
from app.models.professor import Professor
from app.schemas.research import ResearchPaperCreate, ResearchPaperUpdate
from typing import List, Optional


def get_research_paper(db: Session, paper_id: int) -> Optional[ResearchPaper]:
    return db.query(ResearchPaper).filter(ResearchPaper.id == paper_id).first()


def get_research_paper_by_paper_id(db: Session, paper_id: str) -> Optional[ResearchPaper]:
    return db.query(ResearchPaper).filter(ResearchPaper.paper_id == paper_id).first()


def get_research_papers(db: Session, skip: int = 0, limit: int = 100) -> List[ResearchPaper]:
    return db.query(ResearchPaper).offset(skip).limit(limit).all()


def create_research_paper(db: Session, paper: ResearchPaperCreate) -> ResearchPaper:
    paper_data = paper.model_dump(exclude={'professor_ids'})
    db_paper = ResearchPaper(**paper_data)
    
    # Add professors
    if paper.professor_ids:
        professors = db.query(Professor).filter(Professor.id.in_(paper.professor_ids)).all()
        db_paper.professors = professors
    
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    return db_paper


def update_research_paper(db: Session, paper_id: int, paper: ResearchPaperUpdate) -> Optional[ResearchPaper]:
    db_paper = get_research_paper(db, paper_id)
    if db_paper:
        update_data = paper.model_dump(exclude_unset=True, exclude={'professor_ids'})
        for field, value in update_data.items():
            setattr(db_paper, field, value)
        
        # Update professors if provided
        if paper.professor_ids is not None:
            professors = db.query(Professor).filter(Professor.id.in_(paper.professor_ids)).all()
            db_paper.professors = professors
        
        db.commit()
        db.refresh(db_paper)
    return db_paper


def delete_research_paper(db: Session, paper_id: int) -> bool:
    db_paper = get_research_paper(db, paper_id)
    if db_paper:
        db.delete(db_paper)
        db.commit()
        return True
    return False


def search_research_papers(
    db: Session,
    faculty: Optional[str] = None,
    year: Optional[int] = None,
    skip: int = 0,
    limit: int = 100
) -> List[ResearchPaper]:
    query = db.query(ResearchPaper)
    
    if faculty:
        query = query.filter(ResearchPaper.faculty == faculty)
    if year:
        query = query.filter(ResearchPaper.year == year)
    
    return query.offset(skip).limit(limit).all()