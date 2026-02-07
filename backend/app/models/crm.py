from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class LeadStatus(str, enum.Enum):
    NEW = "NEW"
    CONTACTED = "CONTACTED"
    QUALIFIED = "QUALIFIED"
    DISQUALIFIED = "DISQUALIFIED"

class OpportunityStage(str, enum.Enum):
    NEW = "NEW"
    IN_PROGRESS = "IN_PROGRESS"
    WON = "WON"
    LOST = "LOST"

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    company = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    leads = relationship("Lead", back_populates="customer")
    opportunities = relationship("Opportunity", back_populates="customer")

class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    source = Column(String(100))
    status = Column(SQLEnum(LeadStatus), default=LeadStatus.NEW)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    customer = relationship("Customer", back_populates="leads")

class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    title = Column(String(255), nullable=False)
    value = Column(Numeric(12, 2), default=0)
    stage = Column(SQLEnum(OpportunityStage), default=OpportunityStage.NEW)
    notes = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    customer = relationship("Customer", back_populates="opportunities")
