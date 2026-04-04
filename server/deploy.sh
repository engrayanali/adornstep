#!/bin/bash
# ============================================================
# Bluehost Shared Hosting Deployment Script
# Run this via cPanel Terminal or SSH after uploading files
# ============================================================

echo "🚀 Starting Adorn Steps API Deployment on Bluehost"

# ── CONFIG — update these variables ──────────────────────────
APP_DIR="$HOME/api.adorestep.com"        # Your app root directory
VENV_DIR="$HOME/virtualenv/api.adorestep.com/3.11"  # cPanel auto-creates this
PYTHON="$VENV_DIR/bin/python3"
PIP="$VENV_DIR/bin/pip3"
# ─────────────────────────────────────────────────────────────

# Step 1: Navigate to app directory
cd "$APP_DIR" || { echo "❌ App directory not found: $APP_DIR"; exit 1; }

echo "📂 Working in: $APP_DIR"

# Step 2: Install/update dependencies into the cPanel virtualenv
echo "📦 Installing dependencies..."
"$PIP" install --upgrade pip
"$PIP" install -r requirements.txt

# Step 3: Copy .env if it doesn't exist yet
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  .env created from .env.example — please update it with real values!"
else
    echo "✓ .env already exists"
fi

# Step 4: Create upload directories
echo "📁 Creating upload directories..."
mkdir -p uploads/products uploads/banners uploads/lifestyle

# Step 5: Initialize the database (safe to run multiple times)
echo "🗄️  Initializing database..."
"$PYTHON" -m app.init_db

# Step 6: Set correct file permissions
echo "🔒 Setting file permissions..."
chmod 755 "$APP_DIR"
chmod 644 passenger_wsgi.py
chmod 644 .htaccess
chmod 600 .env                   # Restrict .env access
chmod 755 uploads/
find uploads/ -type f -exec chmod 644 {} \;

# Step 7: Restart the Passenger app (touches restart.txt)
echo "🔄 Restarting Passenger app..."
mkdir -p tmp
touch tmp/restart.txt

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Edit .env with your real SECRET_KEY, DB path, and credentials"
echo "   2. In cPanel > Setup Python App, verify the app is running"
echo "   3. Visit https://api.adorestep.com/api/health to confirm it's live"
echo ""
