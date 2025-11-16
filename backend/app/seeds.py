"""Seed data for development and testing"""
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.student import Student
from app.models.professor import Professor
from app.utils.security import get_password_hash
from app.database import SessionLocal


SEED_USERS = [
    {
        "email": "student@example.com",
        "password": "password123",
        "name": "John Student",
        "role": "student"
    },
    {
        "email": "professor@example.com",
        "password": "password123",
        "name": "Dr. Jane Professor",
        "role": "professor"
    },
    {
        "email": "admin@example.com",
        "password": "password123",
        "name": "Admin User",
        "role": "admin"
    }
]

SEED_STUDENTS = [
    {
        "user_id": 1,
        "student_id": "S001",
        "major": "Computer Science",
        "gpa": "3.8"
    },
    {
        "user_id": 1,
        "student_id": "S002",
        "major": "Electrical Engineering",
        "gpa": "3.5"
    }
]

SEED_PROFESSORS = [
    {
        "user_id": 2,
        "professor_id": "P001",
        "department": "Computer Science",
        "specialization": "Machine Learning"
    },
    {
        "user_id": 2,
        "professor_id": "P002",
        "department": "Electrical Engineering",
        "specialization": "Digital Signal Processing"
    }
]


def seed_database():
    """Create seed data in the database"""
    db = SessionLocal()
    try:
        # Check if users already exist
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("Database already seeded. Skipping seed data creation.")
            return

        # Create users
        print("Creating seed users...")
        created_users = []
        for user_data in SEED_USERS:
            user = User(
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"]),
                name=user_data["name"],
                role=user_data["role"],
                is_active=True
            )
            db.add(user)
            db.flush()  # Get the ID without committing
            created_users.append(user)
            print(f"  ✓ Created user: {user_data['email']}")

        # Create students
        print("Creating seed students...")
        for student_data in SEED_STUDENTS:
            student = Student(
                user_id=student_data["user_id"],
                student_id=student_data["student_id"],
                major=student_data["major"],
                gpa=student_data["gpa"]
            )
            db.add(student)
            print(f"  ✓ Created student: {student_data['student_id']}")

        # Create professors
        print("Creating seed professors...")
        for prof_data in SEED_PROFESSORS:
            professor = Professor(
                user_id=prof_data["user_id"],
                professor_id=prof_data["professor_id"],
                department=prof_data["department"],
                specialization=prof_data["specialization"]
            )
            db.add(professor)
            print(f"  ✓ Created professor: {prof_data['professor_id']}")

        db.commit()
        print("\n✅ Seed data created successfully!\n")
        print("Test Accounts:")
        print("  Student:   student@example.com / password123")
        print("  Professor: professor@example.com / password123")
        print("  Admin:     admin@example.com / password123")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
    finally:
        db.close()
