from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.database import get_db
from app.models import Review, Product

router = APIRouter()

@router.get("/product/{product_id}")
async def get_product_reviews(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Get all approved reviews for a product"""
    reviews = db.query(Review).filter(
        Review.product_id == product_id,
        Review.is_approved == True
    ).order_by(Review.created_at.desc()).all()
    
    # Calculate average rating
    avg_rating = db.query(func.avg(Review.rating)).filter(
        Review.product_id == product_id,
        Review.is_approved == True
    ).scalar() or 0
    
    return {
        "reviews": [
            {
                "id": r.id,
                "customer_name": r.customer_name,
                "rating": r.rating,
                "review_text": r.review_text,
                "is_verified": r.is_verified,
                "created_at": r.created_at.isoformat() if r.created_at else None
            }
            for r in reviews
        ],
        "average_rating": round(float(avg_rating), 1),
        "total_reviews": len(reviews)
    }

@router.post("/product/{product_id}")
async def create_review(
    product_id: int,
    customer_name: str,
    customer_email: str,
    rating: int,
    review_text: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Create a new review for a product"""
    
    # Validate product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Validate rating
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Check if user already reviewed this product
    existing_review = db.query(Review).filter(
        Review.product_id == product_id,
        Review.customer_email == customer_email
    ).first()
    
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this product")
    
    # Create review
    new_review = Review(
        product_id=product_id,
        customer_name=customer_name,
        customer_email=customer_email,
        rating=rating,
        review_text=review_text,
        is_approved=True  # Auto-approve
    )
    
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    
    return {
        "id": new_review.id,
        "customer_name": new_review.customer_name,
        "rating": new_review.rating,
        "review_text": new_review.review_text,
        "created_at": new_review.created_at.isoformat() if new_review.created_at else None
    }
