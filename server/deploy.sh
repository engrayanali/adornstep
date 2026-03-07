#!/bin/bash
# Deployment script for Hetzner VPS

echo "🚀 Starting Adorn Steps API Deployment"

# Pull latest changes
git pull origin main

# Install/update dependencies
cd server
pip install -r requirements.txt

# Initialize database if needed
python -m app.init_db

# Restart the service
sudo systemctl restart adornsteps-api

echo "✅ Deployment complete!"
echo "📊 Check logs with: sudo journalctl -u adornsteps-api -f"
