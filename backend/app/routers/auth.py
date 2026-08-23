"""
app/routers/auth.py
───────────────────
Authentication endpoints: register, login, and current user retrieval.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User, UserRole, StudentProfile, TeacherProfile
from app.core.security import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user
from app.schemas.auth import UserRegister, UserLogin, UserOut, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new Student or Teacher account.
    Returns signed JWT access token and user info upon creation.
    """
    # 1. Check if email already exists
    existing = db.query(User).filter(User.email.ilike(payload.email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    # 2. Hash password & create user
    hashed = hash_password(payload.password)
    user = User(
        email=payload.email.lower().strip(),
        full_name=payload.full_name.strip(),
        password_hash=hashed,
        role=payload.role,
        preferred_language=payload.preferred_language,
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    db.flush()

    # 3. Create role profile
    onboarding_status = False
    if payload.role == UserRole.student:
        profile = StudentProfile(
            user_id=user.id,
            grade_level=8,
            onboarding_completed=False,
        )
        db.add(profile)
    elif payload.role == UserRole.teacher:
        profile = TeacherProfile(
            user_id=user.id,
            school_name="ShikshaAI Partner School",
        )
        db.add(profile)
        onboarding_status = True  # Teachers don't need student onboarding

    db.commit()
    db.refresh(user)

    # 4. Generate JWT token
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value}
    )

    user_out = UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        preferred_language=user.preferred_language,
        avatar_url=user.avatar_url,
        is_active=user.is_active,
        onboarding_completed=onboarding_status,
        created_at=user.created_at,
    )

    return TokenResponse(access_token=access_token, token_type="bearer", user=user_out)


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """
    Log in with email and password.
    Returns signed JWT access token and user details.
    """
    user = db.query(User).filter(User.email.ilike(payload.email.strip())).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact support.",
        )

    # Determine onboarding state
    onboarding_completed = False
    if user.role == UserRole.student and user.student_profile:
        onboarding_completed = user.student_profile.onboarding_completed
    elif user.role == UserRole.teacher:
        onboarding_completed = True

    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value}
    )

    user_out = UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        preferred_language=user.preferred_language,
        avatar_url=user.avatar_url,
        is_active=user.is_active,
        onboarding_completed=onboarding_completed,
        created_at=user.created_at,
    )

    return TokenResponse(access_token=access_token, token_type="bearer", user=user_out)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get information about the currently authenticated user.
    """
    onboarding_completed = False
    if current_user.role == UserRole.student and current_user.student_profile:
        onboarding_completed = current_user.student_profile.onboarding_completed
    elif current_user.role == UserRole.teacher:
        onboarding_completed = True

    return UserOut(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        preferred_language=current_user.preferred_language,
        avatar_url=current_user.avatar_url,
        is_active=current_user.is_active,
        onboarding_completed=onboarding_completed,
        created_at=current_user.created_at,
    )
