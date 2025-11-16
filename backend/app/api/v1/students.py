from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.student import Student, StudentCreate, StudentUpdate, StudentWithUser
from app.crud import student as crud_student
from app.api.deps import get_current_user, get_current_admin
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[StudentWithUser])
def read_students(
    skip: int = 0,
    limit: int = 100,
    faculty: Optional[str] = Query(None),
    year: Optional[str] = Query(None),
    skill: Optional[str] = Query(None),
    looking_for_group: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if faculty or year or skill or looking_for_group is not None:
        students = crud_student.search_students(
            db, faculty=faculty, year=year, skill=skill,
            looking_for_group=looking_for_group, skip=skip, limit=limit
        )
    else:
        students = crud_student.get_students(db, skip=skip, limit=limit)
    
    # Transform to include user data
    result = []
    for student in students:
        student_dict = {
            **student.__dict__,
            "name": student.user.name,
            "email": student.user.email
        }
        result.append(student_dict)
    
    return result


@router.get("/{student_id}", response_model=StudentWithUser)
def read_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_student = crud_student.get_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {
        **db_student.__dict__,
        "name": db_student.user.name,
        "email": db_student.user.email
    }


@router.post("/", response_model=Student, status_code=status.HTTP_201_CREATED)
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    # Check if student_id already exists
    db_student = crud_student.get_student_by_student_id(db, student_id=student.student_id)
    if db_student:
        raise HTTPException(
            status_code=400,
            detail="Student ID already registered"
        )
    
    return crud_student.create_student(db=db, student=student)


@router.put("/{student_id}", response_model=Student)
def update_student(
    student_id: int,
    student: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_student = crud_student.get_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check if current user is the student or admin
    if current_user.role != "admin" and db_student.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud_student.update_student(db=db, student_id=student_id, student=student)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    success = crud_student.delete_student(db, student_id=student_id)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return None