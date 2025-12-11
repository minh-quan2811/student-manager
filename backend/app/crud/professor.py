from sqlalchemy.orm import Session, joinedload
from app.models.professor import Professor
from app.schemas.professor import ProfessorCreate, ProfessorUpdate
from typing import List, Optional


def get_professor(db: Session, professor_id: int) -> Optional[Professor]:
    return db.query(Professor).filter(Professor.id == professor_id).first()


def get_professor_by_professor_id(db: Session, professor_id: str) -> Optional[Professor]:
    return db.query(Professor).filter(Professor.professor_id == professor_id).first()


def get_professors(db: Session, skip: int = 0, limit: int = 100) -> List[Professor]:
    return db.query(Professor).options(joinedload(Professor.user)).offset(skip).limit(limit).all()


def create_professor(db: Session, professor: ProfessorCreate) -> Professor:
    db_professor = Professor(**professor.model_dump())
    db.add(db_professor)
    db.commit()
    db.refresh(db_professor)
    return db_professor


def update_professor(db: Session, professor_id: int, professor: ProfessorUpdate) -> Optional[Professor]:
    db_professor = get_professor(db, professor_id)
    if db_professor:
        update_data = professor.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_professor, field, value)
        db.commit()
        db.refresh(db_professor)
    return db_professor


def delete_professor(db: Session, professor_id: int) -> bool:
    db_professor = get_professor(db, professor_id)
    if db_professor:
        db.delete(db_professor)
        db.commit()
        return True
    return False


def search_professors(
    db: Session,
    faculty: Optional[str] = None,
    research_area: Optional[str] = None,
    available_only: bool = False,
    skip: int = 0,
    limit: int = 100
) -> List[Professor]:
    query = db.query(Professor).options(joinedload(Professor.user))
    
    if faculty:
        query = query.filter(Professor.faculty == faculty)
    if research_area:
        query = query.filter(Professor.research_areas.contains([research_area]))
    if available_only:
        query = query.filter(Professor.available_slots > 0)
    
    return query.offset(skip).limit(limit).all()