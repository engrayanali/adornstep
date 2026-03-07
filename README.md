# 🛍️ Adorn Steps - Ladies Slippers E-Commerce Store

> A modern, secure, and fully-featured e-commerce platform for selling ladies slippers

## 🌟 Overview

Adorn Steps is a complete e-commerce solution with:
- **Backend**: FastAPI (Python) on Hetzner VPS
- **Frontend**: Next.js 16 (React 19) on Cloudflare Pages
- **Database**: SQLite with local file storage
- **Domain**: adorestep.com

## ✨ Key Features

### 🛒 E-Commerce Functionality
- Product catalog with categories (Heels, Flats, Sandals, Casual, Limited Edition, Seasonal, New Arrivals)
- Shopping cart with local storage
- Checkout flow with order management
- Product search functionality
- Seasonal collection with dynamic titles

### 🎨 Design & UX
- Modern white background with elegant UI
- Hover effects and shadow animations
- Fully responsive (mobile, tablet, desktop)
- Separate layouts for mobile and desktop views
- Separate hero banners for mobile and desktop screens
- Mobile-optimized and SEO-optimized

### 🔐 Security
- JWT authentication for admin
- Password hashing with bcrypt
- CORS protection
- File upload validation
- SQL injection protection
- XSS protection headers

### 📊 Admin Dashboard
- Accessible at /admin
- Upload hero banners (mobile & desktop)
- Manage products and categories
- Upload product images
- Set seasonal collection titles
- View and manage orders

### 🚀 SEO & Performance
- Dynamic metadata for all pages
- Automatic sitemap generation
- Robots.txt configuration
- Optimized images
- Fast page loads

## 📁 Project Structure

\\\
adornsteps/
├── server/              # FastAPI Backend
│   ├── app/
│   │   ├── routers/    # API endpoints
│   │   ├── models.py   # Database models
│   │   ├── schemas.py  # Data validation
│   │   └── security.py # Authentication
│   ├── main.py         # FastAPI application
│   ├── Dockerfile      # Docker configuration
│   └── requirements.txt
│
├── client/             # Next.js Frontend
│   ├── app/
│   │   ├── components/ # React components
│   │   ├── admin/      # Admin dashboard
│   │   ├── category/   # Category pages
│   │   ├── product/    # Product pages
│   │   ├── cart/       # Shopping cart
│   │   └── checkout/   # Checkout flow
│   └── package.json
│
└── Documentation/      # Complete guides
    ├── QUICKSTART.md
    ├── DEPLOYMENT.md
    ├── SECURITY.md
    └── API_DOCUMENTATION.md
\\\

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

\\\ash
cd server
pip install -r requirements.txt
python -m app.init_db
uvicorn main:app --reload
\\\

Backend runs on: http://localhost:8000

### Frontend Setup

\\\ash
cd client
npm install
npm run dev
\\\

Frontend runs on: http://localhost:3000

### Admin Access

Navigate to: http://localhost:3000/admin

**Default Credentials** (⚠️ CHANGE THESE!):
- Username: \dmin\
- Password: \dmin123\

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to production
- **[SECURITY.md](SECURITY.md)** - Security best practices
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **[FEATURES_CHECKLIST.md](FEATURES_CHECKLIST.md)** - All features
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Detailed overview

## 🌐 Production Deployment

### Backend (Hetzner VPS)
1. SSH into your Hetzner VPS
2. Clone the repository
3. Configure \.env\ file
4. Run: \docker-compose up -d\

### Frontend (Cloudflare Pages)
1. Connect repository to Cloudflare Pages
2. Build command: \
pm run build\
3. Output directory: \out\
4. Set environment variables

## 🔧 Environment Variables

### Backend (.env)
\\\
SECRET_KEY=your-secret-key
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password
FRONTEND_URL=https://adorestep.com
\\\

### Frontend (.env.local)
\\\
NEXT_PUBLIC_API_URL=https://api.adorestep.com
NEXT_PUBLIC_SITE_URL=https://adorestep.com
\\\

## 🛡️ Security Checklist

- [ ] Change default admin credentials
- [ ] Generate new SECRET_KEY for production
- [ ] Enable HTTPS on both frontend and backend
- [ ] Configure firewall on Hetzner VPS
- [ ] Set up regular database backups
- [ ] Review SECURITY.md for detailed guidelines

## 📱 Features by Page

### Homepage
- Hero banner carousel (auto-rotating)
- Featured categories
- New arrivals section
- Seasonal collection highlight

### Category Pages
- Heels
- Flats
- Sandals
- Casual
- Limited Edition
- Seasonal Collection (dynamic title)
- New Arrivals

### Product Pages
- Image gallery
- Product details
- Size selection
- Add to cart
- Related products

### Shopping Experience
- Cart management
- Checkout flow
- Order confirmation
- Order tracking

### Admin Dashboard
- Product management (CRUD)
- Category management
- Banner uploads (mobile/desktop)
- Order management
- Seasonal collection settings

## 🎯 Technology Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite (Database)
- JWT (Authentication)
- Pillow (Image processing)

**Frontend:**
- Next.js 16 (React framework)
- React 19
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Lucide React (Icons)

**Deployment:**
- Docker (Backend containerization)
- Hetzner VPS (Backend hosting)
- Cloudflare Pages (Frontend hosting)

## 📊 API Endpoints

- \POST /api/auth/login\ - Admin login
- \GET /api/products\ - List all products
- \GET /api/products/{id}\ - Get product details
- \GET /api/categories\ - List all categories
- \GET /api/banners\ - Get hero banners
- \POST /api/orders\ - Create order

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete reference.

## 🤝 Support

For issues or questions:
1. Check the documentation files
2. Review the code comments
3. Check the TEST_GUIDE.md for troubleshooting

## 📄 License

Private project for Adorn Steps.

## 🎉 Ready to Launch!

Your e-commerce store is ready to go! Follow the QUICKSTART.md to begin.

---

**Built with ❤️ for Adorn Steps**
# adornstep
