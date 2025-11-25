from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database import get_db
from app.schemas.professor import Professor, ProfessorCreate, ProfessorUpdate, ProfessorWithUser
from app.crud import professor as crud_professor
from app.api.deps import get_current_user, get_current_admin
from app.models.user import User, UserRole
from app.models.professor import Professor as ProfessorModel
from app.utils.security import get_password_hash

router = APIRouter()

def generate_username(name: str, faculty: str) -> str:
    """Generate username: firstname_faculty@research.edu"""
    first_name = name.split()[0].lower()
    faculty_short = faculty.lower().replace(' ', '')
    return f"{first_name}_{faculty_short}@research.edu"

def generate_password(name: str, faculty: str) -> str:
    """Generate password: firstname_faculty"""
    first_name = name.split()[0].lower()
    faculty_short = faculty.lower().replace(' ', '')
    return f"{first_name}_{faculty_short}"

@router.post("/bulk", response_model=Dict[str, Any])
def create_professors_bulk(
    professors_data: List[Dict[str, Any]],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Bulk create professor accounts from CSV data.
    Returns a dictionary with success count, failed count, created accounts, and errors.
    """
    created_accounts = []
    errors = []
    
    for idx, prof_data in enumerate(professors_data):
        try:
            # Validate required fields
            required_fields = ['name', 'professor_id', 'faculty', 'field', 'department']
            missing_fields = [f for f in required_fields if f not in prof_data or not prof_data[f]]
            
            if missing_fields:
                errors.append(f"Row {idx + 1}: Missing fields: {', '.join(missing_fields)}")
                continue
            
            # Check if professor_id already exists
            existing_prof = db.query(ProfessorModel).filter(
                ProfessorModel.professor_id == prof_data['professor_id']
            ).first()
            
            if existing_prof:
                errors.append(f"Row {idx + 1}: Professor ID {prof_data['professor_id']} already exists")
                continue
            
            # Generate credentials
            username = generate_username(prof_data['name'], prof_data['faculty'])
            password = generate_password(prof_data['name'], prof_data['faculty'])
            
            # Check if email already exists
            existing_user = db.query(User).filter(User.email == username).first()
            if existing_user:
                errors.append(f"Row {idx + 1}: Email {username} already exists")
                continue
            
            # Create user account
            hashed_password = get_password_hash(password)
            db_user = User(
                email=username,
                hashed_password=hashed_password,
                name=prof_data['name'],
                role=UserRole.PROFESSOR
            )
            db.add(db_user)
            db.flush()
            
            # Create professor profile
            total_slots = prof_data.get('total_slots', 5)
            db_professor = ProfessorModel(
                user_id=db_user.id,
                professor_id=prof_data['professor_id'],
                faculty=prof_data['faculty'],
                field=prof_data['field'],
                department=prof_data['department'],
                research_areas=prof_data.get('research_areas', []),
                research_interests=prof_data.get('research_interests', []),
                achievements=prof_data.get('achievements', ''),
                publications=int(prof_data.get('publications', 0)),
                bio=prof_data.get('bio', ''),
                available_slots=total_slots,
                total_slots=total_slots
            )
            db.add(db_professor)
            db.flush()
            
            # Store created account info
            created_accounts.append({
                'name': prof_data['name'],
                'professor_id': prof_data['professor_id'],
                'username': username,
                'password': password,
                'faculty': prof_data['faculty']
            })
            
        except Exception as e:
            errors.append(f"Row {idx + 1}: {str(e)}")
            db.rollback()
            continue
    
    # Commit all successful creations
    if created_accounts:
        try:
            db.commit()
        except Exception as e:
            db.rollback()
            return {
                'success': 0,
                'failed': len(professors_data),
                'accounts': [],
                'errors': [f"Database commit failed: {str(e)}"]
            }
    
    return {
        'success': len(created_accounts),
        'failed': len(errors),
        'accounts': created_accounts,
        'errors': errors
    }


# Add CRUD endpoints for professors
@router.get("/", response_model=List[ProfessorWithUser])
def get_professors(
    skip: int = 0,
    limit: int = 100,
    faculty: Optional[str] = Query(None),
    research_area: Optional[str] = Query(None),
    available_only: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all professors with optional filters"""
    query = db.query(ProfessorModel).join(User)
    
    if faculty:
        query = query.filter(ProfessorModel.faculty == faculty)
    if research_area:
        query = query.filter(ProfessorModel.research_areas.contains([research_area]))
    if available_only:
        query = query.filter(ProfessorModel.available_slots > 0)
    
    professors = query.offset(skip).limit(limit).all()
    
    # Manually construct response with user data
    result = []
    for professor in professors:
        result.append({
            **professor.__dict__,
            'name': professor.user.name,
            'email': professor.user.email
        })
    
    return result


@router.get("/{professor_id}", response_model=ProfessorWithUser)
def get_professor(
    professor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific professor by ID"""
    professor = db.query(ProfessorModel).filter(ProfessorModel.id == professor_id).first()
    
    if not professor:
        raise HTTPException(status_code=404, detail="Professor not found")
    
    return {
        **professor.__dict__,
        'name': professor.user.name,
        'email': professor.user.email
    }


@router.put("/{professor_id}", response_model=ProfessorWithUser)
def update_professor(
    professor_id: int,
    professor_data: ProfessorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Update a professor (admin only)"""
    professor = db.query(ProfessorModel).filter(ProfessorModel.id == professor_id).first()
    
    if not professor:
        raise HTTPException(status_code=404, detail="Professor not found")
    
    # Update fields
    update_data = professor_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(professor, field, value)
    
    db.commit()
    db.refresh(professor)
    
    return {
        **professor.__dict__,
        'name': professor.user.name,
        'email': professor.user.email
    }


@router.delete("/{professor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_professor(
    professor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete a professor (admin only)"""
    professor = db.query(ProfessorModel).filter(ProfessorModel.id == professor_id).first()
    
    if not professor:
        raise HTTPException(status_code=404, detail="Professor not found")
    
    # Delete the user (which will cascade delete the professor profile)
    user = db.query(User).filter(User.id == professor.user_id).first()
    if user:
        db.delete(user)
    
    db.commit()
    return None