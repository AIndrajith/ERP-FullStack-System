from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core import deps
from app.core.database import get_db
from app.models.hr import Department, Employee, LeaveRequest, LeaveStatus
from app.schemas.hr import (
    Department as DepartmentSchema, DepartmentCreate,
    Employee as EmployeeSchema, EmployeeCreate,
    LeaveRequest as LeaveRequestSchema, LeaveRequestCreate, LeaveRequestUpdate
)
from app.services.audit import log_action
from datetime import datetime

router = APIRouter()

# Departments
@router.get("/departments", response_model=List[DepartmentSchema])
def read_departments(
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["hr.departments.read"]))
):
    return db.query(Department).all()

@router.post("/departments", response_model=DepartmentSchema)
def create_department(
    *,
    db: Session = Depends(get_db),
    dept_in: DepartmentCreate,
    current_user: Any = Depends(deps.PermissionChecker(["hr.departments.write"]))
):
    dept = Department(name=dept_in.name)
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept

# Employees
@router.get("/employees", response_model=List[EmployeeSchema])
def read_employees(
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["hr.employees.read"]))
):
    return db.query(Employee).all()

@router.post("/employees", response_model=EmployeeSchema)
def create_employee(
    *,
    db: Session = Depends(get_db),
    emp_in: EmployeeCreate,
    current_user: Any = Depends(deps.PermissionChecker(["hr.employees.write"]))
):
    emp = Employee(**emp_in.dict())
    db.add(emp)
    db.commit()
    db.refresh(emp)
    log_action(db, current_user.id, "CREATE", "employee", emp.id, {"name": emp.full_name})
    return emp

# Leave Requests
@router.get("/leave-requests", response_model=List[LeaveRequestSchema])
def read_leave_requests(
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.get_current_active_user)
):
    # RBAC logic: Employee sees own, Manager/Admin see all
    user_permissions = {p.code for r in current_user.roles for p in r.permissions}
    if "hr.leave.approve" in user_permissions:
        return db.query(LeaveRequest).all()
    
    # Get employee record for this user
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        return []
    return db.query(LeaveRequest).filter(LeaveRequest.employee_id == employee.id).all()

@router.post("/leave-requests", response_model=LeaveRequestSchema)
def create_leave_request(
    *,
    db: Session = Depends(get_db),
    leave_in: LeaveRequestCreate,
    current_user: Any = Depends(deps.PermissionChecker(["hr.leave.submit"]))
):
    leave = LeaveRequest(**leave_in.dict(), status=LeaveStatus.PENDING)
    db.add(leave)
    db.commit()
    db.refresh(leave)
    log_action(db, current_user.id, "SUBMIT", "leave_request", leave.id)
    return leave

@router.post("/leave-requests/{id}/approve", response_model=LeaveRequestSchema)
def approve_leave_request(
    id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["hr.leave.approve"]))
):
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    leave.status = LeaveStatus.APPROVED
    leave.reviewed_by_user_id = current_user.id
    leave.reviewed_at = datetime.now()
    db.commit()
    db.refresh(leave)
    log_action(db, current_user.id, "APPROVE", "leave_request", leave.id)
    return leave

@router.post("/leave-requests/{id}/reject", response_model=LeaveRequestSchema)
def reject_leave_request(
    id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["hr.leave.approve"]))
):
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    leave.status = LeaveStatus.REJECTED
    leave.reviewed_by_user_id = current_user.id
    leave.reviewed_at = datetime.now()
    db.commit()
    db.refresh(leave)
    log_action(db, current_user.id, "REJECT", "leave_request", leave.id)
    return leave
