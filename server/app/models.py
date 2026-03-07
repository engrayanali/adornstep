from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# Association table for product images
product_images = Table(
    'product_images',
    Base.metadata,
    Column('id', Integer, primary_key=True),
    Column('product_id', Integer, ForeignKey('products.id', ondelete='CASCADE')),
    Column('image_url', String, nullable=False),
    Column('is_primary', Boolean, default=False),
    Column('order', Integer, default=0)
)

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    # Product attributes
    sizes = Column(String, nullable=True)  # JSON string: ["5", "6", "7", "8", "9"]
    colors = Column(String, nullable=True)  # JSON string: ["Red", "Blue"]
    material = Column(String, nullable=True)
    
    # Stock and status
    stock = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    is_new_arrival = Column(Boolean, default=False)
    is_limited_edition = Column(Boolean, default=False)
    
    # SEO
    meta_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")

class HeroBanner(Base):
    __tablename__ = "hero_banners"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True)
    subtitle = Column(String, nullable=True)
    button_text = Column(String, nullable=True)
    button_link = Column(String, nullable=True)
    
    # Separate images for mobile and desktop
    mobile_image_url = Column(String, nullable=False)
    desktop_image_url = Column(String, nullable=False)
    
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SeasonalCollection(Base):
    __tablename__ = "seasonal_collections"
    
    id = Column(Integer, primary_key=True, index=True)
    season = Column(String, nullable=False)  # summer, winter, spring, fall
    is_active = Column(Boolean, default=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class LifestyleImage(Base):
    __tablename__ = "lifestyle_images"
    
    id = Column(Integer, primary_key=True, index=True)
    section = Column(String, nullable=False)  # 'shop_by_style' or 'live_beautifully'
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=False)
    link = Column(String, nullable=True)
    layout = Column(String, default='small')  # 'small' or 'large'
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    review_text = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=True)  # Auto-approve by default
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    product = relationship("Product", back_populates="reviews")

# Add reviews relationship to Product model

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    
    # Customer info
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    
    # Shipping address
    shipping_address = Column(Text, nullable=False)
    shipping_city = Column(String, nullable=False)
    shipping_state = Column(String, nullable=False)
    shipping_zip = Column(String, nullable=False)
    shipping_country = Column(String, nullable=False)
    
    # Order details
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, confirmed, shipped, delivered, cancelled
    payment_method = Column(String, nullable=True)
    payment_status = Column(String, default="pending")  # pending, paid, failed
    
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"))
    product_id = Column(Integer, ForeignKey("products.id"))
    
    product_name = Column(String, nullable=False)
    product_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    size = Column(String, nullable=True)
    color = Column(String, nullable=True)
    
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")
