/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.adorestep.com',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: true,
  },
  // Cloudflare Pages configuration
  // Using @cloudflare/next-on-pages for full Next.js features on Cloudflare
  experimental: {
    runtime: 'experimental-edge',
  },
};

export default nextConfig;
