from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import Token, AdminLogin, AdminResponse
from app.security import authenticate_admin, create_access_token, get_current_admin
from app.config import settings

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(login_data: AdminLogin, db: Session = Depends(get_db)):
    """Admin login endpoint"""
    admin = authenticate_admin(db, login_data.username, login_data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/verify", response_model=AdminResponse)
async def verify_token(admin = Depends(get_current_admin)):
    """Verify token and return admin info"""
    return admin
