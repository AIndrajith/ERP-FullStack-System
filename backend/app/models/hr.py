from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class LeaveStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    
    employees = relationship("Employee", back_populates="department")

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    title = Column(String(100))
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    department = relationship("Department", back_populates="employees")
    leave_requests = relationship("LeaveRequest", back_populates="employee")

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(String(255))
    status = Column(SQLEnum(LeaveStatus), default=LeaveStatus.PENDING)
    reviewed_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    employee = relationship("Employee", back_populates="leave_requests")
