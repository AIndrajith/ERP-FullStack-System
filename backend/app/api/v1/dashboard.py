from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core import deps
from app.core.database import get_db
from app.models.core import User
from app.models.hr import Employee, LeaveRequest
from app.models.inventory import Product, InventoryTransaction
from app.models.crm import Customer
from app.schemas.inventory import InventoryTransaction as TransactionSchema
from app.schemas.hr import LeaveRequest as LeaveRequestSchema

router = APIRouter()

@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["dashboard.read"]))
):
    return {
        "users_count": db.query(User).count(),
        "employees_count": db.query(Employee).count(),
        "products_count": db.query(Product).count(),
        "customers_count": db.query(Customer).count(),
    }

@router.get("/recent-activity")
def get_recent_activity(
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["dashboard.read"]))
):
    recent_transactions = db.query(InventoryTransaction).order_by(InventoryTransaction.created_at.desc()).limit(10).all()
    recent_leave_requests = db.query(LeaveRequest).order_by(LeaveRequest.created_at.desc()).limit(10).all()
    
    return {
        "recent_transactions": recent_transactions,
        "recent_leave_requests": recent_leave_requests
    }
