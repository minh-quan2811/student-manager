from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.professor import Professor, ProfessorCreate, ProfessorUpdate, ProfessorWithUser
from app.crud import professor as crud_professor
from app.api.deps import get_current_user, get_current_admin
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[ProfessorWithUser])
def read_professors(
    skip: int = 0,
    limit: int = 100,
    faculty: Optional[str] = Query(None),
    research_area: Optional[str] = Query(None),
    available_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if faculty or research_area or available_only:
        professors = crud_professor.search_professors(
            db, faculty=faculty, research_area=research_area,
            available_only=available_only, skip=skip, limit=limit
        )
    else:
        professors = crud_professor.get_professors(db, skip=skip, limit=limit)
    
    # Transform to include user data
    result = []
    for professor in professors:
        professor_dict = {
            **professor.__dict__,
            "name": professor.user.name,
            "email": professor.user.email
        }
        result.append(professor_dict)
    
    return result


@router.get("/{professor_id}", response_model=ProfessorWithUser)
def read_professor(
    professor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_professor = crud_professor.get_professor(db, professor_id=professor_id)
    if db_professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    
    return {
        **db_professor.__dict__,
        "name": db_professor.user.name,
        "email": db_professor.user.email
    }


@router.post("/", response_model=Professor, status_code=status.HTTP_201_CREATED)
def create_professor(
    professor: ProfessorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    # Check if professor_id already exists
    db_professor = crud_professor.get_professor_by_professor_id(db, professor_id=professor.professor_id)
    if db_professor:
        raise HTTPException(
            status_code=400,
            detail="Professor ID already registered"
        )
    
    return crud_professor.create_professor(db=db, professor=professor)


@router.put("/{professor_id}", response_model=Professor)
def update_professor(
    professor_id: int,
    professor: ProfessorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_professor = crud_professor.get_professor(db, professor_id=professor_id)
    if db_professor is None:
        raise HTTPException(status_code=404, detail="Professor not found")
    
    # Check if current user is the professor or admin
    if current_user.role != "admin" and db_professor.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud_professor.update_professor(db=db, professor_id=professor_id, professor=professor)


@router.delete("/{professor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_professor(
    professor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    success = crud_professor.delete_professor(db, professor_id=professor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Professor not found")
    return None