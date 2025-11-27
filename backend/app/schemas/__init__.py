from app.schemas.user import User, UserCreate, UserLogin, Token, TokenData
from app.schemas.student import Student, StudentCreate, StudentUpdate, StudentWithUser
from app.schemas.professor import Professor, ProfessorCreate, ProfessorUpdate, ProfessorWithUser
from app.schemas.research import ResearchPaper, ResearchPaperCreate, ResearchPaperUpdate
from app.schemas.notification import Notification, NotificationCreate, NotificationMarkRead
from app.schemas.group import (
    Group,
    GroupCreate,
    GroupUpdate,
    GroupMember,
    GroupInvitation,
    GroupInvitationCreate,
    GroupJoinRequest,
    GroupJoinRequestCreate,
)

__all__ = [
    "User",
    "UserCreate",
    "UserLogin",
    "Token",
    "TokenData",
    "Student",
    "StudentCreate",
    "StudentUpdate",
    "StudentWithUser",
    "Professor",
    "ProfessorCreate",
    "ProfessorUpdate",
    "ProfessorWithUser",
    "ResearchPaper",
    "ResearchPaperCreate",
    "ResearchPaperUpdate",
    "Group",
    "GroupCreate",
    "GroupUpdate",
    "GroupMember",
    "GroupInvitation",
    "GroupInvitationCreate",
    "GroupJoinRequest",
    "GroupJoinRequestCreate",
    "Notification", 
    "NotificationCreate", 
    "NotificationMarkRead"
]