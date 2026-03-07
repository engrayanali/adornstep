from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Database
    DATABASE_URL: str = "sqlite:///./adornsteps.db"
    
    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 5242880  # 5MB
    
    # CORS
    FRONTEND_URL: str = "https://adorestep.com"
    
    # Admin defaults
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "changeme123"
    ADMIN_EMAIL: str = "admin@adorestep.com"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
