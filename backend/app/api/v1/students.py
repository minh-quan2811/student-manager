from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.student import Student, StudentCreate, StudentUpdate, StudentWithUser
from app.crud import student as crud_student
from app.api.deps import get_current_user, get_current_admin
from app.models.user import User
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
def create_students_bulk(
    students_data: List[dict],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    created_accounts = []
    errors = []
    
    for idx, student_data in enumerate(students_data):
        try:
            # Validate required fields
            required_fields = ['name', 'student_id', 'gpa', 'major', 'faculty', 'year']
            missing_fields = [f for f in required_fields if f not in student_data or not student_data[f]]
            
            if missing_fields:
                errors.append(f"Row {idx + 1}: Missing fields: {', '.join(missing_fields)}")
                continue
            
            # Check if student_id already exists
            existing_student = db.query(Student).filter(
                Student.student_id == student_data['student_id']
            ).first()
            
            if existing_student:
                errors.append(f"Row {idx + 1}: Student ID {student_data['student_id']} already exists")
                continue
            
            # Generate credentials
            username = generate_username(student_data['name'], student_data['faculty'])
            password = generate_password(student_data['name'], student_data['faculty'])
            
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
                name=student_data['name'],
                role=UserRole.STUDENT
            )
            db.add(db_user)
            db.flush()  # Get user ID without committing
            
            # Create student profile
            db_student = Student(
                user_id=db_user.id,
                student_id=student_data['student_id'],
                gpa=float(student_data['gpa']),
                major=student_data['major'],
                faculty=student_data['faculty'],
                year=student_data['year'],
                skills=student_data.get('skills', []),
                bio=student_data.get('bio', ''),
                looking_for_group=student_data.get('looking_for_group', True)
            )
            db.add(db_student)
            db.flush()
            
            # Store created account info
            created_accounts.append({
                'name': student_data['name'],
                'student_id': student_data['student_id'],
                'username': username,
                'password': password,  # Only returned once for admin to share
                'faculty': student_data['faculty']
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