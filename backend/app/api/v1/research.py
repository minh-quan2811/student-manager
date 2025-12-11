from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.research import ResearchPaper, ResearchPaperCreate, ResearchPaperUpdate
from app.crud import research as crud_research
from app.api.deps import get_current_user, get_current_admin
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[ResearchPaper])
def read_research_papers(
    skip: int = 0,
    limit: int = 100,
    faculty: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if faculty or year:
        papers = crud_research.search_research_papers(
            db, faculty=faculty, year=year, skip=skip, limit=limit
        )
    else:
        papers = crud_research.get_research_papers(db, skip=skip, limit=limit)
    
    return papers


@router.get("/{paper_id}", response_model=ResearchPaper)
def read_research_paper(
    paper_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_paper = crud_research.get_research_paper(db, paper_id=paper_id)
    if db_paper is None:
        raise HTTPException(status_code=404, detail="Research paper not found")
    
    return db_paper


@router.post("/", response_model=ResearchPaper, status_code=status.HTTP_201_CREATED)
def create_research_paper(
    paper: ResearchPaperCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    # Check if paper_id already exists
    db_paper = crud_research.get_research_paper_by_paper_id(db, paper_id=paper.paper_id)
    if db_paper:
        raise HTTPException(
            status_code=400,
            detail="Paper ID already exists"
        )
    
    return crud_research.create_research_paper(db=db, paper=paper)


@router.put("/{paper_id}", response_model=ResearchPaper)
def update_research_paper(
    paper_id: int,
    paper: ResearchPaperUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    db_paper = crud_research.get_research_paper(db, paper_id=paper_id)
    if db_paper is None:
        raise HTTPException(status_code=404, detail="Research paper not found")
    
    return crud_research.update_research_paper(db=db, paper_id=paper_id, paper=paper)


@router.delete("/{paper_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_research_paper(
    paper_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    success = crud_research.delete_research_paper(db, paper_id=paper_id)
    if not success:
        raise HTTPException(status_code=404, detail="Research paper not found")
    return None