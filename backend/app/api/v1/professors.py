from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
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

@router.post("/bulk", response_model=List[dict])
def create_professors_bulk(
    professors_data: List[dict],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
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
        db.commit()
    
    if errors:
        return {
            'success': len(created_accounts),
            'failed': len(errors),
            'accounts': created_accounts,
            'errors': errors
        }
    
    return {
        'success': len(created_accounts),
        'failed': 0,
        'accounts': created_accounts,
        'errors': []
    }