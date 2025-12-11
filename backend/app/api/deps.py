from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from app.database import get_db
from app.config import settings
from app.models.user import User, UserRole
from app.schemas.user import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/login")


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """Get current authenticated user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Verify that the current user has admin role.
    Use this as a dependency for admin-only endpoints.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Admin access required."
        )
    return current_user


def get_current_student(current_user: User = Depends(get_current_user)) -> User:
    """
    Verify that the current user has student role.
    Use this as a dependency for student-only endpoints.
    """
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Student access required."
        )
    return current_user


def get_current_professor(current_user: User = Depends(get_current_user)) -> User:
    """
    Verify that the current user has professor role.
    Use this as a dependency for professor-only endpoints.
    """
    if current_user.role != UserRole.PROFESSOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Professor access required."
        )
    return current_user