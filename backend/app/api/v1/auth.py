from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from starlette.requests import Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.professor import Professor
from app.schemas.user import Token, UserCreate, User as UserSchema, StudentProfileUpdate, ProfessorProfileUpdate
from app.schemas.student import StudentWithUser
from app.schemas.professor import ProfessorWithUser
from app.utils.security import verify_password, get_password_hash, create_access_token, verify_token
from app.config import settings

router = APIRouter()


@router.post("/register", response_model=UserSchema)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account"""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        name=user.name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get access token"""
    # Authenticate user
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token in Authorization header"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth_header.split(" ")[1]
    email = verify_token(token)
    
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return current_user


@router.put("/profile/student", response_model=StudentWithUser)
def update_student_profile(
    profile_data: StudentProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Students can update their own bio, skills, and looking_for_group status.
    Only these fields can be modified by students themselves.
    """
    # Check if user is a student
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can update student profiles"
        )
    
    # Get student profile
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Only allow students to update specific fields
    if profile_data.bio is not None:
        student.bio = profile_data.bio
    
    if profile_data.skills is not None:
        student.skills = profile_data.skills
    
    if profile_data.looking_for_group is not None:
        student.looking_for_group = profile_data.looking_for_group
    
    db.commit()
    db.refresh(student)
    
    # Return student with user data
    return {
        **student.__dict__,
        "name": current_user.name,
        "email": current_user.email
    }


@router.put("/profile/professor", response_model=ProfessorWithUser)
def update_professor_profile(
    profile_data: ProfessorProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Professors can update their own bio, research_interests, and total_slots.
    Only these fields can be modified by professors themselves.
    """
    # Check if user is a professor
    if current_user.role != UserRole.PROFESSOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only professors can update professor profiles"
        )
    
    # Get professor profile
    professor = db.query(Professor).filter(Professor.user_id == current_user.id).first()
    if not professor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professor profile not found"
        )
    
    # Only allow professors to update specific fields
    if profile_data.bio is not None:
        professor.bio = profile_data.bio
    
    if profile_data.research_interests is not None:
        professor.research_interests = profile_data.research_interests
    
    if profile_data.total_slots is not None:
        if profile_data.total_slots < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Total slots must be at least 1"
            )
        
        professor.total_slots = profile_data.total_slots
        
        # Adjust available slots if needed
        # If new total_slots is less than current available_slots, reduce available_slots
        if professor.available_slots > profile_data.total_slots:
            professor.available_slots = profile_data.total_slots
    
    db.commit()
    db.refresh(professor)
    
    # Return professor with user data
    return {
        **professor.__dict__,
        "name": current_user.name,
        "email": current_user.email
    }


@router.get("/profile/student", response_model=StudentWithUser)
def get_student_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current student's profile"""
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access student profiles"
        )
    
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    return {
        **student.__dict__,
        "name": current_user.name,
        "email": current_user.email
    }


@router.get("/profile/professor", response_model=ProfessorWithUser)
def get_professor_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current professor's profile"""
    if current_user.role != UserRole.PROFESSOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only professors can access professor profiles"
        )
    
    professor = db.query(Professor).filter(Professor.user_id == current_user.id).first()
    if not professor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professor profile not found"
        )
    
    return {
        **professor.__dict__,
        "name": current_user.name,
        "email": current_user.email
    }