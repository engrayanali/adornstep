from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import exc
from typing import List, Optional

from app.database import get_db
from app.models import HeroBanner, Admin
from app.schemas import HeroBannerCreate, HeroBannerUpdate, HeroBannerResponse
from app.security import get_current_admin
from app.utils import save_upload_file, delete_file

router = APIRouter()

@router.get("/", response_model=List[HeroBannerResponse])
async def get_banners(
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get all hero banners"""
    query = db.query(HeroBanner).order_by(HeroBanner.order)
    
    if is_active is not None:
        query = query.filter(HeroBanner.is_active == is_active)
    
    banners = query.all()
    return banners

@router.get("/{banner_id}", response_model=HeroBannerResponse)
async def get_banner(banner_id: int, db: Session = Depends(get_db)):
    """Get a single banner by ID"""
    banner = db.query(HeroBanner).filter(HeroBanner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    return banner

@router.post("/", response_model=HeroBannerResponse, status_code=status.HTTP_201_CREATED)
async def create_banner(
    banner: HeroBannerCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Create a new hero banner (Admin only)"""
    new_banner = HeroBanner(**banner.model_dump())
    db.add(new_banner)
    
    try:
        db.commit()
        db.refresh(new_banner)
    except exc.IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error creating banner"
        )
    
    return new_banner

@router.post("/upload")
async def upload_banner_images(
    title: Optional[str] = Form(None),
    subtitle: Optional[str] = Form(None),
    button_text: Optional[str] = Form(None),
    button_link: Optional[str] = Form(None),
    mobile_image: UploadFile = File(...),
    desktop_image: UploadFile = File(...),
    is_active: bool = Form(True),
    order: int = Form(0),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Upload hero banner with mobile and desktop images (Admin only)"""
    # Save both images
    mobile_url = await save_upload_file(mobile_image, "banners")
    desktop_url = await save_upload_file(desktop_image, "banners")
    
    # Create banner
    new_banner = HeroBanner(
        title=title,
        subtitle=subtitle,
        button_text=button_text,
        button_link=button_link,
        mobile_image_url=mobile_url,
        desktop_image_url=desktop_url,
        is_active=is_active,
        order=order
    )
    
    db.add(new_banner)
    db.commit()
    db.refresh(new_banner)
    
    return new_banner

@router.put("/{banner_id}")
async def update_banner(
    banner_id: int,
    title: Optional[str] = Form(None),
    subtitle: Optional[str] = Form(None),
    button_text: Optional[str] = Form(None),
    button_link: Optional[str] = Form(None),
    mobile_image: Optional[UploadFile] = File(None),
    desktop_image: Optional[UploadFile] = File(None),
    is_active: Optional[bool] = Form(None),
    order: Optional[int] = Form(None),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update a hero banner with optional image uploads (Admin only)"""
    banner = db.query(HeroBanner).filter(HeroBanner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    # Update text fields if provided
    if title is not None:
        banner.title = title
    if subtitle is not None:
        banner.subtitle = subtitle
    if button_text is not None:
        banner.button_text = button_text
    if button_link is not None:
        banner.button_link = button_link
    if is_active is not None:
        banner.is_active = is_active
    if order is not None:
        banner.order = order
    
    # Update images if new ones are provided
    if mobile_image:
        # Delete old mobile image
        delete_file(banner.mobile_image_url)
        # Save new mobile image
        banner.mobile_image_url = await save_upload_file(mobile_image, "banners")
    
    if desktop_image:
        # Delete old desktop image
        delete_file(banner.desktop_image_url)
        # Save new desktop image
        banner.desktop_image_url = await save_upload_file(desktop_image, "banners")
    
    try:
        db.commit()
        db.refresh(banner)
    except exc.IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error updating banner"
        )
    
    return banner

@router.delete("/{banner_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_banner(
    banner_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Delete a hero banner (Admin only)"""
    banner = db.query(HeroBanner).filter(HeroBanner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    # Delete image files
    delete_file(banner.mobile_image_url)
    delete_file(banner.desktop_image_url)
    
    db.delete(banner)
    db.commit()
    
    return None
