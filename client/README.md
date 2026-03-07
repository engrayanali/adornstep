# Adorn Steps - Frontend

Modern e-commerce frontend for Adorn Steps ladies slippers store built with Next.js 16.

## Features

- 🎨 Modern, responsive design with mobile-first approach
- 🛍️ Complete e-commerce functionality
- 🎯 SEO optimized with metadata and sitemap
- 📱 Separate mobile and desktop layouts
- 🎭 Hero banner carousel with admin management
- 🛒 Shopping cart with local storage
- 💳 Checkout flow with order management
- 📦 Product categories and filtering
- 🔍 Product detail pages with image galleries
- 🎨 Smooth animations and hover effects
- 🌐 Admin dashboard for content management

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Fonts**: Google Fonts (Outfit, Playfair Display)
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (see server/README.md)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

### For Cloudflare Pages

1. Build the project:
```bash
npm run build
```

2. The static files will be in the `out/` directory

3. Deploy to Cloudflare Pages:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `out`
   - Add environment variables

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.adorestep.com  # Production API URL
NEXT_PUBLIC_SITE_URL=https://adorestep.com      # Production site URL
```

## License

Proprietary - All rights reserved
