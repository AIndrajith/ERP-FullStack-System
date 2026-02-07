from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core import deps
from app.core.database import get_db
from app.models.crm import Customer, Lead, Opportunity, OpportunityStage
from app.schemas.crm import (
    Customer as CustomerSchema, CustomerCreate,
    Lead as LeadSchema, LeadCreate,
    Opportunity as OpportunitySchema, OpportunityCreate
)
from app.services.audit import log_action

router = APIRouter()

# Customers
@router.get("/customers", response_model=List[CustomerSchema])
def read_customers(
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["crm.customers.read"]))
):
    return db.query(Customer).all()

@router.post("/customers", response_model=CustomerSchema)
def create_customer(
    *,
    db: Session = Depends(get_db),
    cust_in: CustomerCreate,
    current_user: Any = Depends(deps.PermissionChecker(["crm.customers.write"]))
):
    cust = Customer(**cust_in.dict())
    db.add(cust)
    db.commit()
    db.refresh(cust)
    log_action(db, current_user.id, "CREATE", "customer", cust.id, {"name": cust.name})
    return cust

# Leads
@router.get("/leads", response_model=List[LeadSchema])
def read_leads(
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["crm.leads.read"]))
):
    return db.query(Lead).all()

@router.post("/leads", response_model=LeadSchema)
def create_lead(
    *,
    db: Session = Depends(get_db),
    lead_in: LeadCreate,
    current_user: Any = Depends(deps.PermissionChecker(["crm.leads.write"]))
):
    lead = Lead(**lead_in.dict())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    log_action(db, current_user.id, "CREATE", "lead", lead.id, {"name": lead.name})
    return lead

# Opportunities
@router.get("/opportunities", response_model=List[OpportunitySchema])
def read_opportunities(
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["crm.opportunities.read"]))
):
    return db.query(Opportunity).all()

@router.post("/opportunities", response_model=OpportunitySchema)
def create_opportunity(
    *,
    db: Session = Depends(get_db),
    opp_in: OpportunityCreate,
    current_user: Any = Depends(deps.PermissionChecker(["crm.opportunities.write"]))
):
    opp = Opportunity(**opp_in.dict())
    db.add(opp)
    db.commit()
    db.refresh(opp)
    log_action(db, current_user.id, "CREATE", "opportunity", opp.id, {"title": opp.title})
    return opp

@router.post("/opportunities/{id}/stage")
def update_opportunity_stage(
    id: int,
    stage: OpportunityStage,
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["crm.opportunities.write"]))
):
    opp = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    old_stage = opp.stage
    opp.stage = stage
    db.commit()
    db.refresh(opp)
    
    log_action(db, current_user.id, "UPDATE_STAGE", "opportunity", opp.id, {"from": old_stage, "to": stage})
    return opp
