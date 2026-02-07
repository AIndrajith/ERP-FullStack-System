from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime
from decimal import Decimal

class CustomerBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class LeadBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = "NEW"
    customer_id: Optional[int] = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(LeadBase):
    pass

class Lead(LeadBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class OpportunityBase(BaseModel):
    title: str
    value: Optional[Decimal] = 0
    stage: Optional[str] = "NEW"
    notes: Optional[str] = None
    customer_id: int

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityUpdate(OpportunityBase):
    pass

class Opportunity(OpportunityBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    customer: Customer
    class Config:
        from_attributes = True
