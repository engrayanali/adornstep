# Adorn Steps Backend API

FastAPI backend for the Adorn Steps e-commerce platform.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

**Important:** Change the following in your `.env` file:
- `SECRET_KEY` - Generate a secure key using: `openssl rand -hex 32`
- `ADMIN_PASSWORD` - Set a strong admin password
- `FRONTEND_URL` - Set to your Cloudflare Pages URL

### 3. Initialize Database

```bash
python -m app.init_db
```

This will:
- Create all database tables
- Create default admin user
- Setup default categories (Heels, Flats, Sandals, etc.)
- Initialize seasonal collection settings

### 4. Run Development Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token

### Admin
- `GET /api/admin/me` - Get current admin info
- `POST /api/admin/create-admin` - Create new admin
- `GET /api/admin/list` - List all admins

### Products
- `GET /api/products/` - List products (with filters)
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/slug/{slug}` - Get product by slug
- `POST /api/products/` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)
- `POST /api/products/{id}/images` - Upload product image (Admin)
- `GET /api/products/{id}/images` - Get product images
- `DELETE /api/products/{id}/images/{image_id}` - Delete product image (Admin)

### Categories
- `GET /api/categories/` - List categories
- `GET /api/categories/{id}` - Get category by ID
- `GET /api/categories/slug/{slug}` - Get category by slug
- `POST /api/categories/` - Create category (Admin)
- `PUT /api/categories/{id}` - Update category (Admin)
- `DELETE /api/categories/{id}` - Delete category (Admin)

### Hero Banners
- `GET /api/banners/` - List hero banners
- `GET /api/banners/{id}` - Get banner by ID
- `POST /api/banners/` - Create banner (Admin)
- `POST /api/banners/upload` - Upload banner with images (Admin)
- `PUT /api/banners/{id}` - Update banner (Admin)
- `DELETE /api/banners/{id}` - Delete banner (Admin)

### Orders
- `GET /api/orders/` - List orders (Admin)
- `GET /api/orders/{id}` - Get order by ID (Admin)
- `GET /api/orders/number/{order_number}` - Get order by number (Public)
- `POST /api/orders/` - Create order (Public)
- `PUT /api/orders/{id}` - Update order (Admin)
- `DELETE /api/orders/{id}` - Delete order (Admin)

## Deployment on Hetzner VPS

### 1. Install Requirements

```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx
```

### 2. Setup Application

```bash
cd /var/www
git clone <your-repo>
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
nano .env  # Edit with production values
```

### 4. Initialize Database

```bash
python -m app.init_db
```

### 5. Setup Systemd Service

Create `/etc/systemd/system/adornsteps.service`:

```ini
[Unit]
Description=Adorn Steps API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/server
Environment="PATH=/var/www/server/venv/bin"
ExecStart=/var/www/server/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable adornsteps
sudo systemctl start adornsteps
```

### 6. Configure Nginx

Create `/etc/nginx/sites-available/adornsteps`:

```nginx
server {
    listen 80;
    server_name api.adorestep.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        alias /var/www/server/uploads/;
    }
}
```

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/adornsteps /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.adorestep.com
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- File upload validation
- File size limits
- SQL injection protection (SQLAlchemy ORM)
- Security headers (X-Frame-Options, XSS-Protection, etc.)
- HTTPS enforcement in production

## File Storage

Uploaded files are stored in:
- Products: `/uploads/products/`
- Banners: `/uploads/banners/`

Files are automatically optimized and resized for performance.
