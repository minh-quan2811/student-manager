from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database import get_db
from app.schemas.student import Student, StudentCreate, StudentUpdate, StudentWithUser
from app.crud import student as crud_student
from app.api.deps import get_current_user, get_current_admin
from app.models.user import User, UserRole
from app.models.student import Student as StudentModel
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
def create_students_bulk(
    students_data: List[Dict[str, Any]],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Bulk create student accounts from CSV data.
    Returns a dictionary with success count, failed count, created accounts, and errors.
    """
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
            existing_student = db.query(StudentModel).filter(
                StudentModel.student_id == student_data['student_id']
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
            db_student = StudentModel(
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
                'password': password,
                'faculty': student_data['faculty']
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
                'failed': len(students_data),
                'accounts': [],
                'errors': [f"Database commit failed: {str(e)}"]
            }
    
    return {
        'success': len(created_accounts),
        'failed': len(errors),
        'accounts': created_accounts,
        'errors': errors
    }


# Add CRUD endpoints for students
@router.get("/", response_model=List[StudentWithUser])
def get_students(
    skip: int = 0,
    limit: int = 100,
    faculty: Optional[str] = Query(None),
    year: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all students with optional filters"""
    query = db.query(StudentModel).join(User)
    
    if faculty:
        query = query.filter(StudentModel.faculty == faculty)
    if year:
        query = query.filter(StudentModel.year == year)
    
    students = query.offset(skip).limit(limit).all()
    
    # Manually construct response with user data
    result = []
    for student in students:
        result.append({
            **student.__dict__,
            'name': student.user.name,
            'email': student.user.email
        })
    
    return result


@router.get("/{student_id}", response_model=StudentWithUser)
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific student by ID"""
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {
        **student.__dict__,
        'name': student.user.name,
        'email': student.user.email
    }


@router.put("/{student_id}", response_model=StudentWithUser)
def update_student(
    student_id: int,
    student_data: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Update a student (admin only)"""
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Update fields
    update_data = student_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)
    
    db.commit()
    db.refresh(student)
    
    return {
        **student.__dict__,
        'name': student.user.name,
        'email': student.user.email
    }


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete a student (admin only)"""
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Delete the user (which will cascade delete the student profile)
    user = db.query(User).filter(User.id == student.user_id).first()
    if user:
        db.delete(user)
    
    db.commit()
    return None