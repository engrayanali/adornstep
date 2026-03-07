from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import exc
from typing import List, Optional

from app.database import get_db
from app.models import Category, Admin
from app.schemas import CategoryCreate, CategoryUpdate, CategoryResponse
from app.security import get_current_admin
from app.utils import save_upload_file

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
async def get_categories(
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get all categories"""
    query = db.query(Category).order_by(Category.order)
    
    if is_active is not None:
        query = query.filter(Category.is_active == is_active)
    
    categories = query.all()
    return categories

@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    """Get a single category by ID"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.get("/slug/{slug}", response_model=CategoryResponse)
async def get_category_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a single category by slug"""
    category = db.query(Category).filter(Category.slug == slug).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Create a new category (Admin only)"""
    # Check if slug already exists
    existing = db.query(Category).filter(Category.slug == category.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this slug already exists"
        )
    
    new_category = Category(**category.model_dump())
    db.add(new_category)
    
    try:
        db.commit()
        db.refresh(new_category)
    except exc.IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error creating category"
        )
    
    return new_category

@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update a category (Admin only)"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)
    
    try:
        db.commit()
        db.refresh(category)
    except exc.IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error updating category"
        )
    
    return category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Delete a category (Admin only)"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(category)
    db.commit()
    
    return None
