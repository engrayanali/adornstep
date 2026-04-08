from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import exc, and_
from typing import List, Optional
import os
import shutil
from datetime import datetime
import json

from app.database import get_db
from app.models import Product, Admin, product_images
from app.schemas import ProductCreate, ProductUpdate, ProductResponse
from app.security import get_current_admin
from app.config import settings
from app.utils import save_upload_file, delete_file, generate_slug

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    is_featured: Optional[bool] = None,
    is_new_arrival: Optional[bool] = None,
    is_limited_edition: Optional[bool] = None,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db)
):
    """Get all products with optional filters"""
    query = db.query(Product)
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
    if is_new_arrival is not None:
        query = query.filter(Product.is_new_arrival == is_new_arrival)
    if is_limited_edition is not None:
        query = query.filter(Product.is_limited_edition == is_limited_edition)
    if is_active is not None:
        query = query.filter(Product.is_active == is_active)
    
    products = query.offset(skip).limit(limit).all()
    
    # Fetch images for each product
    result = []
    for product in products:
        images = db.execute(
            product_images.select().where(product_images.c.product_id == product.id).order_by(product_images.c.order)
        ).fetchall()
        
        product_dict = {
            **{c.name: getattr(product, c.name) for c in Product.__table__.columns},
            "images": [
                {
                    "id": img.id,
                    "product_id": img.product_id,
                    "image_url": img.image_url,
                    "is_primary": img.is_primary,
                    "order": img.order
                }
                for img in images
            ]
        }
        result.append(product_dict)
    
    return result

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a single product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Fetch images
    images = db.execute(
        product_images.select().where(product_images.c.product_id == product.id).order_by(product_images.c.order)
    ).fetchall()
    
    product_dict = {
        **{c.name: getattr(product, c.name) for c in Product.__table__.columns},
        "images": [
            {
                "id": img.id,
                "product_id": img.product_id,
                "image_url": img.image_url,
                "is_primary": img.is_primary,
                "order": img.order
            }
            for img in images
        ]
    }
    
    return product_dict

@router.get("/slug/{slug}", response_model=ProductResponse)
async def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a single product by slug"""
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Fetch images
    images = db.execute(
        product_images.select().where(product_images.c.product_id == product.id).order_by(product_images.c.order)
    ).fetchall()
    
    product_dict = {
        **{c.name: getattr(product, c.name) for c in Product.__table__.columns},
        "images": [
            {
                "id": img.id,
                "product_id": img.product_id,
                "image_url": img.image_url,
                "is_primary": img.is_primary,
                "order": img.order
            }
            for img in images
        ]
    }
    
    return product_dict

@router.get("/search", response_model=List[ProductResponse])
async def search_products(
    q: str,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Search products by name or description with images included"""
    # 1. Fetch products matching the search query
    products = db.query(Product)\
        .filter(
            and_(
                Product.is_active == True,
                (Product.name.contains(q)) | (Product.description.contains(q))
            )
        )\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    # 2. Attach images to each product (The missing piece!)
    result = []
    for product in products:
        images = db.execute(
            product_images.select().where(product_images.c.product_id == product.id).order_by(product_images.c.order)
        ).fetchall()
        
        product_dict = {
            **{c.name: getattr(product, c.name) for c in Product.__table__.columns},
            "images": [
                {
                    "id": img.id,
                    "product_id": img.product_id,
                    "image_url": img.image_url,
                    "is_primary": img.is_primary,
                    "order": img.order
                }
                for img in images
            ]
        }
        result.append(product_dict)
    
    return result

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Create a new product (Admin only)"""
    # Check if slug already exists
    existing = db.query(Product).filter(Product.slug == product.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this slug already exists"
        )
    
    new_product = Product(**product.model_dump())
    db.add(new_product)
    
    try:
        db.commit()
        db.refresh(new_product)
    except exc.IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error creating product"
        )
    
    return new_product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update a product (Admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update only provided fields
    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    
    try:
        db.commit()
        db.refresh(product)
    except exc.IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error updating product"
        )
    
    return product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Delete a product (Admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Delete associated images from storage
    images = db.execute(
        product_images.select().where(product_images.c.product_id == product_id)
    ).fetchall()
    
    for img in images:
        delete_file(img.image_url)
    
    db.delete(product)
    db.commit()
    
    return None

@router.post("/{product_id}/images")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    is_primary: bool = Form(False),
    order: int = Form(0),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Upload a product image (Admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Save file
    file_url = await save_upload_file(file, "products")
    
    # Insert image record
    stmt = product_images.insert().values(
        product_id=product_id,
        image_url=file_url,
        is_primary=is_primary,
        order=order
    )
    db.execute(stmt)
    db.commit()
    
    return {"image_url": file_url, "message": "Image uploaded successfully"}

@router.get("/{product_id}/images")
async def get_product_images(product_id: int, db: Session = Depends(get_db)):
    """Get all images for a product"""
    images = db.execute(
        product_images.select().where(product_images.c.product_id == product_id).order_by(product_images.c.order)
    ).fetchall()
    
    return [
        {
            "id": img.id,
            "product_id": img.product_id,
            "image_url": img.image_url,
            "is_primary": img.is_primary,
            "order": img.order
        }
        for img in images
    ]

@router.delete("/{product_id}/images/{image_id}")
async def delete_product_image(
    product_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Delete a product image (Admin only)"""
    image = db.execute(
        product_images.select().where(
            and_(product_images.c.id == image_id, product_images.c.product_id == product_id)
        )
    ).fetchone()
    
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Delete file from storage
    delete_file(image.image_url)
    
    # Delete from database
    db.execute(
        product_images.delete().where(product_images.c.id == image_id)
    )
    db.commit()
    
    return {"message": "Image deleted successfully"}
