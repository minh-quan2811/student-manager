from fastapi import APIRouter
from app.api.v1 import auth, students, professors, research, groups, notifications, mentorship, chat

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(professors.router, prefix="/professors", tags=["professors"])
api_router.include_router(research.router, prefix="/research", tags=["research"])
api_router.include_router(groups.router, prefix="/groups", tags=["groups"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(mentorship.router, prefix="/mentorship-requests", tags=["mentorship"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])