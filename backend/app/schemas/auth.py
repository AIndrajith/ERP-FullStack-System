from typing import Optional, List
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "User"
    permissions: List[str]

class TokenPayload(BaseModel):
    sub: Optional[int] = None

class User(BaseModel):
    id: int
    email: EmailStr
    is_active: bool

    class Config:
        from_attributes = True

from .core import User # Circular avoidance
