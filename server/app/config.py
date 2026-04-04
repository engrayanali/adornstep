from pydantic_settings import BaseSettings
import os

# Base directory of the project (absolute path — works on shared hosting)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Settings(BaseSettings):
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Database
    # On Bluehost use absolute path e.g.:
    # sqlite:////home/<username>/api.adorestep.com/adornsteps.db
    DATABASE_URL: str = f"sqlite:///{os.path.join(BASE_DIR, 'adornsteps.db')}"

    # File Storage
    # On Bluehost use absolute path e.g.:
    # /home/<username>/api.adorestep.com/uploads
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "uploads")
    MAX_FILE_SIZE: int = 5242880  # 5MB

    # CORS — Cloudflare frontend URL
    FRONTEND_URL: str = "https://adorestep.com"

    # Admin defaults (override in .env!)
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "changeme123"
    ADMIN_EMAIL: str = "admin@adorestep.com"

    class Config:
        env_file = os.path.join(BASE_DIR, ".env")
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
