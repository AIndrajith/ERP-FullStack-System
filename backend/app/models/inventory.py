from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class TransactionType(str, enum.Enum):
    IN = "IN"
    OUT = "OUT"
    ADJUSTMENT = "ADJUSTMENT"

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String(500))
    unit = Column(String(20))
    current_stock = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=10)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    transactions = relationship("InventoryTransaction", back_populates="product")

class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    type = Column(SQLEnum(TransactionType), nullable=False)
    quantity = Column(Integer, nullable=False)
    note = Column(String(255))
    actor_user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="transactions")
