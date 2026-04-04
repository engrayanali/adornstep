# Adorn Steps Backend API

FastAPI backend for the Adorn Steps e-commerce platform.
Designed to run on **Bluehost Shared Hosting** via Phusion Passenger.

---

## Local Development

### 1. Install Dependencies

```bash
cd server
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update:
- `SECRET_KEY` — generate with: `python3 -c "import secrets; print(secrets.token_hex(32))"`
- `ADMIN_PASSWORD` — set a strong password
- `FRONTEND_URL` — your Cloudflare Pages URL (e.g. `https://adorestep.com`)
- Keep `DATABASE_URL` and `UPLOAD_DIR` as relative paths for local dev (the defaults work fine)

### 3. Initialize Database

```bash
python -m app.init_db
```

### 4. Run Development Server

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

API: `http://localhost:8000`  
Docs: `http://localhost:8000/docs`

---

## Deploying on Bluehost Shared Hosting

Bluehost uses **Apache + Phusion Passenger** to run Python apps via cPanel's "Setup Python App" tool.

### Step 1 — Upload Files

Upload the entire `server/` folder contents to your domain's directory on Bluehost.  
For a subdomain like `api.adorestep.com`, upload to:
```
/home/<username>/api.adorestep.com/
```

Your directory should look like:
```
api.adorestep.com/
├── app/
├── uploads/           ← auto-created by deploy.sh
├── main.py
├── passenger_wsgi.py  ← Passenger entry point
├── .htaccess          ← Apache config
├── .env               ← your secrets (never commit this)
├── requirements.txt
└── ...
```

### Step 2 — Create the Python App in cPanel

1. Log in to **cPanel** → search for **"Setup Python App"**
2. Click **"Create Application"** and fill in:
   | Field | Value |
   |---|---|
   | Python version | `3.11` (or highest available) |
   | Application root | `/home/<username>/api.adorestep.com` |
   | Application URL | `api.adorestep.com` |
   | Application startup file | `passenger_wsgi.py` |
   | Application Entry point | `application` |
3. Click **"Create"**

> cPanel automatically creates a virtualenv at:
> `/home/<username>/virtualenv/api.adorestep.com/3.11/`

### Step 3 — Install Dependencies

In cPanel → Setup Python App → click **"Execute python script"** or use **Terminal**:

```bash
source /home/<username>/virtualenv/api.adorestep.com/3.11/bin/activate
cd /home/<username>/api.adorestep.com
pip install -r requirements.txt
```

Or just run the deploy script:
```bash
bash deploy.sh
```

### Step 4 — Configure Environment

```bash
cp .env.example .env
nano .env
```

Set these values (replace `<username>` with your cPanel username):

```env
SECRET_KEY=<generate with: python3 -c "import secrets; print(secrets.token_hex(32))">
DATABASE_URL=sqlite:////home/<username>/api.adorestep.com/adornsteps.db
UPLOAD_DIR=/home/<username>/api.adorestep.com/uploads
FRONTEND_URL=https://adorestep.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourStrongPasswordHere
ADMIN_EMAIL=admin@adorestep.com
```

### Step 5 — Initialize the Database

```bash
source /home/<username>/virtualenv/api.adorestep.com/3.11/bin/activate
cd /home/<username>/api.adorestep.com
python -m app.init_db
```

### Step 6 — Restart the App

Touch the Passenger restart file to apply changes:

```bash
mkdir -p tmp && touch tmp/restart.txt
```

Or in cPanel → Setup Python App → click **"Restart"**.

### Step 7 — Verify

Visit `https://api.adorestep.com/api/health` — you should see:
```json
{"status": "healthy"}
```

---

## Setting Up the Subdomain (api.adorestep.com)

1. In cPanel → **Subdomains** → create `api.adorestep.com`
2. Point its document root to `/home/<username>/api.adorestep.com`
3. In cPanel → **SSL/TLS** → run AutoSSL to get a free SSL certificate for the subdomain

---

## Redeploying / Updating

After uploading new files via FTP/SFTP:

```bash
bash deploy.sh
```

This will:
- Install any new dependencies
- Re-initialize the database (safe, won't overwrite data)
- Set correct file permissions
- Restart Passenger

---

## File Upload Notes

- Uploaded images are stored in `/home/<username>/api.adorestep.com/uploads/`
- Apache serves `/uploads/*` files directly (see `.htaccess`) — fast static file serving
- Max upload size: **5MB** (configurable via `MAX_FILE_SIZE` in `.env`)

---

## API Endpoints

### Authentication
- `POST /api/auth/login` — Admin login
- `POST /api/auth/verify` — Verify JWT token

### Admin
- `GET /api/admin/me` — Get current admin info
- `POST /api/admin/create-admin` — Create new admin
- `GET /api/admin/list` — List all admins

### Products
- `GET /api/products/` — List products (with filters)
- `GET /api/products/{id}` — Get product by ID
- `GET /api/products/slug/{slug}` — Get product by slug
- `POST /api/products/` — Create product (Admin)
- `PUT /api/products/{id}` — Update product (Admin)
- `DELETE /api/products/{id}` — Delete product (Admin)
- `POST /api/products/{id}/images` — Upload product image (Admin)
- `DELETE /api/products/{id}/images/{image_id}` — Delete image (Admin)

### Categories
- `GET /api/categories/` — List categories
- `POST /api/categories/` — Create category (Admin)
- `PUT /api/categories/{id}` — Update category (Admin)
- `DELETE /api/categories/{id}` — Delete category (Admin)

### Banners
- `GET /api/banners/` — List hero banners
- `POST /api/banners/upload` — Upload banner with images (Admin)
- `PUT /api/banners/{id}` — Update banner (Admin)
- `DELETE /api/banners/{id}` — Delete banner (Admin)

### Orders
- `POST /api/orders/` — Create order (Public)
- `GET /api/orders/number/{order_number}` — Get order by number (Public)
- `GET /api/orders/` — List all orders (Admin)
- `PUT /api/orders/{id}` — Update order status (Admin)

### Other
- `GET /api/health` — Health check
- `GET /api/lifestyle/` — Lifestyle images
- `GET /api/reviews/` — Product reviews

---

## Security Features

- JWT token authentication (24-hour expiry)
- Password hashing with bcrypt
- CORS protection (only allows your Cloudflare frontend)
- File upload validation (type + size limits)
- SQL injection protection via SQLAlchemy ORM
- Security headers (X-Frame-Options, XSS-Protection, HSTS)
- `.env` file protected by `.htaccess` (cannot be accessed via browser)
- SQLite database file protected by `.htaccess`
