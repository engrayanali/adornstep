from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Admin
from app.schemas import AdminCreate, AdminResponse
from app.security import get_password_hash, get_current_admin

router = APIRouter()

@router.post("/create-admin", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
async def create_admin(
    admin_data: AdminCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Create a new admin user (requires existing admin authentication)"""
    # Check if username already exists
    existing_admin = db.query(Admin).filter(Admin.username == admin_data.username).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = db.query(Admin).filter(Admin.email == admin_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new admin
    new_admin = Admin(
        username=admin_data.username,
        email=admin_data.email,
        hashed_password=get_password_hash(admin_data.password)
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    return new_admin

@router.get("/me", response_model=AdminResponse)
async def get_current_admin_info(current_admin: Admin = Depends(get_current_admin)):
    """Get current admin information"""
    return current_admin

@router.get("/list", response_model=List[AdminResponse])
async def list_admins(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """List all admin users"""
    admins = db.query(Admin).all()
    return admins
