from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

class PermissionBase(BaseModel):
    code: str
    description: Optional[str] = None

class Permission(PermissionBase):
    id: int
    class Config:
        from_attributes = True

class RoleBase(BaseModel):
    name: str

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int
    permissions: List[Permission] = []
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class User(UserBase):
    id: int
    created_at: datetime
    roles: List[Role] = []
    class Config:
        from_attributes = True

class AuditLogBase(BaseModel):
    action: str
    entity_type: str
    entity_id: Optional[int] = None
    metadata_json: Optional[dict] = None

class AuditLog(AuditLogBase):
    id: int
    actor_user_id: Optional[int] = None
    created_at: datetime
    class Config:
        from_attributes = True
