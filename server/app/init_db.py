"""
Initialize database with default admin user and categories
Run this script once after setting up the database
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Admin, Category, SeasonalCollection
from app.security import get_password_hash
from app.config import settings

def init_db():
    """Initialize database with default data"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Create default admin if doesn't exist
        admin = db.query(Admin).filter(Admin.username == settings.ADMIN_USERNAME).first()
        if not admin:
            admin = Admin(
                username=settings.ADMIN_USERNAME,
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD)
            )
            db.add(admin)
            print(f"✓ Created default admin user: {settings.ADMIN_USERNAME}")
        else:
            print(f"✓ Admin user already exists: {settings.ADMIN_USERNAME}")
        
        # Create default categories
        categories_data = [
            {"name": "Heels", "slug": "heels", "description": "Elegant heels for every occasion", "order": 1},
            {"name": "Flats", "slug": "flats", "description": "Comfortable and stylish flats", "order": 2},
            {"name": "Sandals", "slug": "sandals", "description": "Casual and formal sandals", "order": 3},
            {"name": "Casual", "slug": "casual", "description": "Everyday casual slippers", "order": 4},
            {"name": "Limited Edition", "slug": "limited-edition", "description": "Exclusive limited edition designs", "order": 5},
            {"name": "Seasonal Collection", "slug": "seasonal-collection", "description": "Special seasonal collections", "order": 6},
            {"name": "New Arrivals", "slug": "new-arrivals", "description": "Latest additions to our collection", "order": 7},
        ]
        
        for cat_data in categories_data:
            existing = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
            if not existing:
                category = Category(**cat_data)
                db.add(category)
                print(f"✓ Created category: {cat_data['name']}")
        
        # Create default seasonal collection setting
        seasonal = db.query(SeasonalCollection).first()
        if not seasonal:
            seasonal = SeasonalCollection(season="summer", is_active=True)
            db.add(seasonal)
            print("✓ Created default seasonal collection setting")
        
        db.commit()
        print("\n✅ Database initialization completed successfully!")
        print(f"\n📝 Admin Login Details:")
        print(f"   Username: {settings.ADMIN_USERNAME}")
        print(f"   Password: {settings.ADMIN_PASSWORD}")
        print(f"\n⚠️  IMPORTANT: Change the admin password after first login!\n")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Initializing Adorn Steps database...\n")
    init_db()
