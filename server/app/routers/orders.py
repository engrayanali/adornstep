from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.database import get_db
from app.models import Order, OrderItem, Admin, Product
from app.schemas import OrderCreate, OrderUpdate, OrderResponse
from app.security import get_current_admin

router = APIRouter()

def generate_order_number() -> str:
    """Generate a unique order number"""
    return f"AS-{uuid.uuid4().hex[:8].upper()}"

@router.get("/", response_model=List[OrderResponse])
async def get_orders(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all orders (Admin only)"""
    query = db.query(Order).order_by(Order.created_at.desc())
    
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.offset(skip).limit(limit).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Get a single order by ID (Admin only)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/number/{order_number}", response_model=OrderResponse)
async def get_order_by_number(order_number: str, db: Session = Depends(get_db)):
    """Get an order by order number (Public - for customer tracking)"""
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order (Public endpoint)"""
    # Calculate total amount
    total_amount = 0.0
    order_items_data = []
    
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product with ID {item.product_id} not found"
            )
        
        if not product.is_active:
            raise HTTPException(
                status_code=400,
                detail=f"Product '{product.name}' is not available"
            )
        
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for product '{product.name}'"
            )
        
        item_price = product.discount_price if product.discount_price else product.price
        total_amount += item_price * item.quantity
        
        order_items_data.append({
            "product_id": product.id,
            "product_name": product.name,
            "product_price": item_price,
            "quantity": item.quantity,
            "size": item.size,
            "color": item.color
        })
    
    # Create order
    new_order = Order(
        order_number=generate_order_number(),
        customer_name=order_data.customer_name,
        customer_email=order_data.customer_email,
        customer_phone=order_data.customer_phone,
        shipping_address=order_data.shipping_address,
        shipping_city=order_data.shipping_city,
        shipping_state=order_data.shipping_state,
        shipping_zip=order_data.shipping_zip,
        shipping_country=order_data.shipping_country,
        total_amount=total_amount,
        payment_method=order_data.payment_method,
        notes=order_data.notes
    )
    
    db.add(new_order)
    db.flush()
    
    # Create order items
    for item_data in order_items_data:
        order_item = OrderItem(order_id=new_order.id, **item_data)
        db.add(order_item)
        
        # Update product stock
        product = db.query(Product).filter(Product.id == item_data["product_id"]).first()
        product.stock -= item_data["quantity"]
    
    db.commit()
    db.refresh(new_order)
    
    return new_order

@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    order_update: OrderUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update an order (Admin only)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_data = order_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(order, key, value)
    
    db.commit()
    db.refresh(order)
    
    return order

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Delete an order (Admin only)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    
    return None
