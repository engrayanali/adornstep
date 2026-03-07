import os
import shutil
import uuid
from fastapi import UploadFile, HTTPException
from PIL import Image
import re
from app.config import settings

async def save_upload_file(upload_file: UploadFile, folder: str) -> str:
    """
    Save an uploaded file and return its URL path
    
    Args:
        upload_file: The uploaded file
        folder: Subfolder name (e.g., 'products', 'banners')
    
    Returns:
        str: The URL path to access the file
    """
    # Validate file size
    contents = await upload_file.read()
    if len(contents) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if upload_file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only JPEG, PNG, and WebP images are allowed"
        )
    
    # Generate unique filename
    file_extension = upload_file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
    
    # Create directory if it doesn't exist
    upload_dir = os.path.join(settings.UPLOAD_DIR, folder)
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file
    file_path = os.path.join(upload_dir, unique_filename)
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Optimize image
    try:
        optimize_image(file_path)
    except Exception as e:
        print(f"Warning: Could not optimize image: {e}")
    
    # Return URL path
    return f"/uploads/{folder}/{unique_filename}"

def optimize_image(file_path: str, max_width: int = 1920, quality: int = 85):
    """
    Optimize an image by resizing and compressing
    
    Args:
        file_path: Path to the image file
        max_width: Maximum width in pixels
        quality: JPEG quality (1-100)
    """
    try:
        with Image.open(file_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Resize if too large
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save optimized
            img.save(file_path, "JPEG", quality=quality, optimize=True)
    except Exception as e:
        raise Exception(f"Error optimizing image: {e}")

def delete_file(file_url: str):
    """
    Delete a file from storage
    
    Args:
        file_url: The URL path of the file (e.g., '/uploads/products/abc123.jpg')
    """
    if not file_url or not file_url.startswith("/uploads/"):
        return
    
    # Convert URL to file path
    file_path = file_url.replace("/uploads/", f"{settings.UPLOAD_DIR}/", 1)
    
    # Delete file if it exists
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Warning: Could not delete file {file_path}: {e}")

def generate_slug(text: str) -> str:
    """
    Generate a URL-friendly slug from text
    
    Args:
        text: The text to slugify
    
    Returns:
        str: The slugified text
    """
    # Convert to lowercase
    slug = text.lower()
    
    # Replace spaces and special characters with hyphens
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    
    return slug
