from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import LifestyleImage, Admin
from app.security import get_current_admin
from app.utils import save_upload_file, delete_file

router = APIRouter()

@router.get("/")
async def get_lifestyle_images(
    section: Optional[str] = None,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db)
):
    """Get lifestyle images, optionally filtered by section"""
    query = db.query(LifestyleImage)
    
    if section:
        query = query.filter(LifestyleImage.section == section)
    if is_active is not None:
        query = query.filter(LifestyleImage.is_active == is_active)
    
    images = query.order_by(LifestyleImage.order).all()
    
    return [
        {
            "id": img.id,
            "section": img.section,
            "title": img.title,
            "description": img.description,
            "image_url": img.image_url,
            "link": img.link,
            "layout": img.layout,
            "order": img.order,
            "is_active": img.is_active
        }
        for img in images
    ]

@router.post("/")
async def create_lifestyle_image(
    section: str = Form(...),
    title: str = Form(...),
    description: str = Form(None),
    link: str = Form(None),
    layout: str = Form('small'),
    order: int = Form(0),
    is_active: bool = Form(True),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Create a new lifestyle image (Admin only)"""
    
    # Validate section
    if section not in ['shop_by_style', 'live_beautifully']:
        raise HTTPException(status_code=400, detail="Invalid section. Must be 'shop_by_style' or 'live_beautifully'")
    
    # Save image
    image_url = await save_upload_file(image, "lifestyle")
    
    # Create database entry
    lifestyle_img = LifestyleImage(
        section=section,
        title=title,
        description=description,
        image_url=image_url,
        link=link,
        layout=layout,
        order=order,
        is_active=is_active
    )
    
    db.add(lifestyle_img)
    db.commit()
    db.refresh(lifestyle_img)
    
    return {
        "id": lifestyle_img.id,
        "section": lifestyle_img.section,
        "title": lifestyle_img.title,
        "description": lifestyle_img.description,
        "image_url": lifestyle_img.image_url,
        "link": lifestyle_img.link,
        "layout": lifestyle_img.layout,
        "order": lifestyle_img.order,
        "is_active": lifestyle_img.is_active
    }

@router.put("/{image_id}")
async def update_lifestyle_image(
    image_id: int,
    section: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    link: Optional[str] = Form(None),
    layout: Optional[str] = Form(None),
    order: Optional[int] = Form(None),
    is_active: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update a lifestyle image (Admin only)"""
    
    lifestyle_img = db.query(LifestyleImage).filter(LifestyleImage.id == image_id).first()
    if not lifestyle_img:
        raise HTTPException(status_code=404, detail="Lifestyle image not found")
    
    # Update fields if provided
    if section is not None:
        if section not in ['shop_by_style', 'live_beautifully']:
            raise HTTPException(status_code=400, detail="Invalid section")
        lifestyle_img.section = section
    if title is not None:
        lifestyle_img.title = title
    if description is not None:
        lifestyle_img.description = description
    if link is not None:
        lifestyle_img.link = link
    if layout is not None:
        lifestyle_img.layout = layout
    if order is not None:
        lifestyle_img.order = order
    if is_active is not None:
        lifestyle_img.is_active = is_active
    
    # Update image if new one provided
    if image:
        # Delete old image
        delete_file(lifestyle_img.image_url)
        # Save new image
        lifestyle_img.image_url = await save_upload_file(image, "lifestyle")
    
    db.commit()
    db.refresh(lifestyle_img)
    
    return {
        "id": lifestyle_img.id,
        "section": lifestyle_img.section,
        "title": lifestyle_img.title,
        "description": lifestyle_img.description,
        "image_url": lifestyle_img.image_url,
        "link": lifestyle_img.link,
        "layout": lifestyle_img.layout,
        "order": lifestyle_img.order,
        "is_active": lifestyle_img.is_active
    }

@router.delete("/{image_id}")
async def delete_lifestyle_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Delete a lifestyle image (Admin only)"""
    
    lifestyle_img = db.query(LifestyleImage).filter(LifestyleImage.id == image_id).first()
    if not lifestyle_img:
        raise HTTPException(status_code=404, detail="Lifestyle image not found")
    
    # Delete image file
    delete_file(lifestyle_img.image_url)
    
    # Delete from database
    db.delete(lifestyle_img)
    db.commit()
    
    return {"message": "Lifestyle image deleted successfully"}
