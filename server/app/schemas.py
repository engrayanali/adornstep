from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True
    order: int = 0

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    discount_price: Optional[float] = Field(None, ge=0)
    category_id: int
    sizes: Optional[str] = None
    colors: Optional[str] = None
    material: Optional[str] = None
    stock: int = Field(default=0, ge=0)
    is_active: bool = True
    is_featured: bool = False
    is_new_arrival: bool = False
    is_limited_edition: bool = False
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    discount_price: Optional[float] = Field(None, ge=0)
    category_id: Optional[int] = None
    sizes: Optional[str] = None
    colors: Optional[str] = None
    material: Optional[str] = None
    stock: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_new_arrival: Optional[bool] = None
    is_limited_edition: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class ProductImageResponse(BaseModel):
    id: int
    product_id: int
    image_url: str
    is_primary: bool
    order: int

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    images: List[ProductImageResponse] = []
    
    class Config:
        from_attributes = True

# Hero Banner Schemas
class HeroBannerBase(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    button_text: Optional[str] = None
    button_link: Optional[str] = None
    mobile_image_url: str
    desktop_image_url: str
    is_active: bool = True
    order: int = 0

class HeroBannerCreate(HeroBannerBase):
    pass

class HeroBannerUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    button_text: Optional[str] = None
    button_link: Optional[str] = None
    mobile_image_url: Optional[str] = None
    desktop_image_url: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None

class HeroBannerResponse(HeroBannerBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Seasonal Collection Schemas
class SeasonalCollectionBase(BaseModel):
    season: str  # summer, winter, spring, fall
    is_active: bool = False

class SeasonalCollectionUpdate(BaseModel):
    season: str
    is_active: bool

class SeasonalCollectionResponse(SeasonalCollectionBase):
    id: int
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Order Schemas
class OrderItemBase(BaseModel):
    product_id: int
    product_name: str
    product_price: float
    quantity: int = Field(..., gt=0)
    size: Optional[str] = None
    color: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_zip: str
    shipping_country: str
    payment_method: Optional[str] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None
    notes: Optional[str] = None

class OrderResponse(OrderBase):
    id: int
    order_number: str
    total_amount: float
    status: str
    payment_status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    order_items: List[OrderItemResponse] = []
    
    class Config:
        from_attributes = True
