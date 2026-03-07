from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
from contextlib import asynccontextmanager

from app.database import engine, Base
from app.routers import auth, products, categories, banners, orders, admin, lifestyle, reviews
from app.config import settings

# Create upload directories
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(f"{settings.UPLOAD_DIR}/products", exist_ok=True)
os.makedirs(f"{settings.UPLOAD_DIR}/banners", exist_ok=True)
os.makedirs(f"{settings.UPLOAD_DIR}/lifestyle", exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create database tables
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: cleanup if needed

app = FastAPI(
    title="Adorn Steps API",
    description="E-commerce API for ladies slippers",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for Cloudflare frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Include routers BEFORE mounting static files
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])
app.include_router(banners.router, prefix="/api/banners", tags=["Banners"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(lifestyle.router, prefix="/api/lifestyle", tags=["Lifestyle"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["Reviews"])

@app.get("/")
async def root():
    return {"message": "Adorn Steps API", "version": "1.0.0"}

# Mount static files for uploads with CORS headers
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

class CORSStaticFilesMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        if request.url.path.startswith('/uploads'):
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = '*'
        return response

app.add_middleware(CORSStaticFilesMiddleware)

# Mount static files for uploads - MUST be last to avoid conflicts
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred"}
    )
