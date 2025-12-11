from sqlalchemy.orm import Session, joinedload
from app.models.student import Student
from app.models.user import User
from app.schemas.student import StudentCreate, StudentUpdate
from typing import List, Optional


def get_student(db: Session, student_id: int) -> Optional[Student]:
    return db.query(Student).filter(Student.id == student_id).first()


def get_student_by_student_id(db: Session, student_id: str) -> Optional[Student]:
    return db.query(Student).filter(Student.student_id == student_id).first()


def get_students(db: Session, skip: int = 0, limit: int = 100) -> List[Student]:
    return db.query(Student).options(joinedload(Student.user)).offset(skip).limit(limit).all()


def create_student(db: Session, student: StudentCreate) -> Student:
    db_student = Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


def update_student(db: Session, student_id: int, student: StudentUpdate) -> Optional[Student]:
    db_student = get_student(db, student_id)
    if db_student:
        update_data = student.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_student, field, value)
        db.commit()
        db.refresh(db_student)
    return db_student


def delete_student(db: Session, student_id: int) -> bool:
    db_student = get_student(db, student_id)
    if db_student:
        db.delete(db_student)
        db.commit()
        return True
    return False


def search_students(
    db: Session,
    faculty: Optional[str] = None,
    year: Optional[str] = None,
    skill: Optional[str] = None,
    looking_for_group: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Student]:
    query = db.query(Student).options(joinedload(Student.user))
    
    if faculty:
        query = query.filter(Student.faculty == faculty)
    if year:
        query = query.filter(Student.year == year)
    if skill:
        query = query.filter(Student.skills.contains([skill]))
    if looking_for_group is not None:
        query = query.filter(Student.looking_for_group == looking_for_group)
    
    return query.offset(skip).limit(limit).all()