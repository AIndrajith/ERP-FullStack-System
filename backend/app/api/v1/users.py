from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core import deps, security
from app.core.database import get_db
from app.models.core import User, Role, AuditLog
from app.schemas.core import User as UserSchema, UserCreate, UserUpdate, AuditLog as AuditLogSchema
from app.services.audit import log_action

router = APIRouter()

@router.get("/", response_model=List[UserSchema])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.PermissionChecker(["users.read"]))
) -> Any:
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.post("/", response_model=UserSchema)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
    current_user: User = Depends(deps.PermissionChecker(["users.write"]))
) -> Any:
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    db_obj = User(
        email=user_in.email,
        password_hash=security.get_password_hash(user_in.password),
        is_active=user_in.is_active
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    
    log_action(db, current_user.id, "CREATE", "user", db_obj.id, {"email": db_obj.email})
    
    return db_obj

@router.get("/audit-logs", response_model=List[AuditLogSchema])
def read_audit_logs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.PermissionChecker(["audit.read"]))
) -> Any:
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    return logs
