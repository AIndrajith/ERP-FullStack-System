from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class ProductBase(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    unit: Optional[str] = "pcs"
    low_stock_threshold: Optional[int] = 10

class ProductCreate(ProductBase):
    current_stock: Optional[int] = 0

class ProductUpdate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    current_stock: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    product_id: int
    type: str # IN, OUT, ADJUSTMENT
    quantity: int
    note: Optional[str] = None

class InventoryTransaction(BaseModel):
    id: int
    product_id: int
    type: str
    quantity: int
    note: Optional[str] = None
    actor_user_id: Optional[int] = None
    created_at: datetime
    product: Product
    class Config:
        from_attributes = True
