"""
Phusion Passenger WSGI entry point for Bluehost Shared Hosting.

Bluehost uses Phusion Passenger to run Python web apps.
FastAPI is an ASGI app — a2wsgi is used to wrap it into a WSGI callable
that Passenger can serve.

Setup steps on Bluehost:
1. Upload all server files to your desired directory (e.g. ~/api.adorestep.com/)
2. In cPanel > Setup Python App, set:
   - Python version: 3.11 (or highest available)
   - Application root: /home/<username>/api.adorestep.com
   - Application URL: api.adorestep.com
   - Application startup file: passenger_wsgi.py
   - Application Entry point: application
3. Click 'CREATE' then install requirements via the virtualenv pip
4. Copy .env.example to .env and fill in your values
5. Run: python -m app.init_db  (via cPanel Terminal or SSH)
"""

import sys
import os

# ── Path setup ──────────────────────────────────────────────────────────────
# Add the app directory to sys.path so imports work correctly
APP_DIR = os.path.dirname(os.path.abspath(__file__))

if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

# Ensure working directory is the app root so .env and relative paths resolve
os.chdir(APP_DIR)

# ── Import the FastAPI (ASGI) app ────────────────────────────────────────────
from main import app

# ── Wrap ASGI app as WSGI using a2wsgi ──────────────────────────────────────
# Phusion Passenger expects a WSGI callable named 'application'.
# FastAPI is ASGI-native, so we use a2wsgi's ASGIMiddleware to bridge the gap.
from a2wsgi import ASGIMiddleware

application = ASGIMiddleware(app)
