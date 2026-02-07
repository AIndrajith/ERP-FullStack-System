from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core import deps, security
from app.core.config import settings
from app.core.database import get_db
from app.models.core import User
from app.schemas.auth import Token
# No more deps import here

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Get all permission codes for this user
    permissions = set()
    for role in user.roles:
        for perm in role.permissions:
            permissions.add(perm.code)
            
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "user": user,
        "permissions": list(permissions)
    }

@router.get("/me")
def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    return current_user
