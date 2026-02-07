from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core import deps
from app.core.database import get_db
from app.models.inventory import Product, InventoryTransaction, TransactionType
from app.schemas.inventory import (
    Product as ProductSchema, ProductCreate,
    InventoryTransaction as TransactionSchema, TransactionCreate
)
from app.services.audit import log_action

router = APIRouter()

@router.get("/products", response_model=List[ProductSchema])
def read_products(
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["inv.products.read"]))
):
    return db.query(Product).all()

@router.post("/products", response_model=ProductSchema)
def create_product(
    *,
    db: Session = Depends(get_db),
    prod_in: ProductCreate,
    current_user: Any = Depends(deps.PermissionChecker(["inv.products.write"]))
):
    prod = Product(**prod_in.dict())
    db.add(prod)
    db.commit()
    db.refresh(prod)
    log_action(db, current_user.id, "CREATE", "product", prod.id, {"sku": prod.sku})
    return prod

@router.post("/transactions", response_model=TransactionSchema)
def create_transaction(
    *,
    db: Session = Depends(get_db),
    trans_in: TransactionCreate,
    current_user: Any = Depends(deps.PermissionChecker(["inv.stock.transact"]))
):
    product = db.query(Product).filter(Product.id == trans_in.product_id).with_for_update().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Calculate new stock
    new_stock = product.current_stock
    if trans_in.type == TransactionType.IN:
        new_stock += trans_in.quantity
    elif trans_in.type == TransactionType.OUT:
        new_stock -= trans_in.quantity
    elif trans_in.type == TransactionType.ADJUSTMENT:
        new_stock = trans_in.quantity # For simplicity, adjustment sets the absolute value or we could do relative. 
        # Requirement says "ADJUSTMENT can increase/decrease but must not go negative". 
        # Let's treat it as relative if quantity is positive/negative, or absolute. 
        # Actually most ERPs treat adjustment as "set to this value" or "add this much". 
        # Let's assume relative (add quantity).
        new_stock = product.current_stock + trans_in.quantity
    
    if new_stock < 0:
        raise HTTPException(status_code=400, detail="Transaction would result in negative stock")
    
    product.current_stock = new_stock
    
    trans = InventoryTransaction(
        **trans_in.dict(),
        actor_user_id=current_user.id
    )
    db.add(trans)
    db.commit()
    db.refresh(trans)
    
    log_action(db, current_user.id, "TRANSACT", "product", product.id, {"type": trans_in.type, "qty": trans_in.quantity})
    
    return trans

@router.get("/transactions", response_model=List[TransactionSchema])
def read_transactions(
    product_id: Optional[int] = None,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["inv.products.read"]))
):
    query = db.query(InventoryTransaction)
    if product_id:
        query = query.filter(InventoryTransaction.product_id == product_id)
    return query.order_by(InventoryTransaction.created_at.desc()).limit(limit).all()

@router.get("/low-stock", response_model=List[ProductSchema])
def read_low_stock(
    db: Session = Depends(get_db),
    current_user: Any = Depends(deps.PermissionChecker(["inv.products.read"]))
):
    return db.query(Product).filter(Product.current_stock <= Product.low_stock_threshold).all()
