"""
app/dependencies.py
────────────────────
FastAPI dependency injection for authentication and authorization.

Usage in any route:
  current_user: User = Depends(get_current_user)     # any authenticated user
  student: User = Depends(require_student)             # students only
  teacher: User = Depends(require_teacher)             # teachers only

How it works:
  1. Browser sends: Authorization: Bearer <jwt_token>
  2. get_current_user() extracts and decodes the token
  3. Looks up the user from the DB to ensure they still exist and are active
  4. require_student / require_teacher check the user.role field
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User, UserRole
from app.core.security import decode_token

# HTTPBearer extracts the JWT from: Authorization: Bearer <token>
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency that returns the authenticated User from the JWT token.
    Raises 401 if token is missing, invalid, or expired.
    Raises 401 if the user no longer exists or is inactive.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise credentials_exception

    payload = decode_token(credentials.credentials)
    if payload is None:
        raise credentials_exception

    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id), User.is_active == True).first()
    if user is None:
        raise credentials_exception

    return user


def require_student(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency that ensures the caller is a Student.
    Teachers calling student-only routes get a 403 Forbidden.
    """
    if current_user.role != UserRole.student:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for students only.",
        )
    return current_user


def require_teacher(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency that ensures the caller is a Teacher.
    Students calling teacher-only routes get a 403 Forbidden.
    """
    if current_user.role != UserRole.teacher:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for teachers only.",
        )
    return current_user
