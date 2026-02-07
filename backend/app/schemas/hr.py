from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from .core import User

class DepartmentBase(BaseModel):
    name: str

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase):
    id: int
    class Config:
        from_attributes = True

class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    department_id: Optional[int] = None
    title: Optional[str] = None
    status: Optional[str] = "ACTIVE"

class EmployeeCreate(EmployeeBase):
    user_id: Optional[int] = None

class EmployeeUpdate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    created_at: datetime
    department: Optional[Department] = None
    class Config:
        from_attributes = True

class LeaveRequestBase(BaseModel):
    start_date: date
    end_date: date
    reason: Optional[str] = None

class LeaveRequestCreate(LeaveRequestBase):
    employee_id: int

class LeaveRequestUpdate(BaseModel):
    status: str

class LeaveRequest(LeaveRequestBase):
    id: int
    employee_id: int
    status: str
    reviewed_by_user_id: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    employee: Employee
    class Config:
        from_attributes = True
