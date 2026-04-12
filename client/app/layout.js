import "./globals.css";
import CookieConsent from "./Components/CookieConsent"; // Ensure the path matches your file structure

export const metadata = {
  title: "Adorn Steps - Premium Ladies Slippers & Footwear",
  description: "Discover elegant and comfortable ladies slippers, heels, flats, and sandals at Adorn Steps. Shop our latest collection of premium footwear.",
  keywords: "ladies slippers, women footwear, heels, flats, sandals, premium slippers",
  authors: [{ name: "Adorn Steps" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  openGraph: {
    title: "Adorn Steps - Premium Ladies Slippers & Footwear",
    description: "Discover elegant and comfortable ladies slippers, heels, flats, and sandals.",
    url: "https://adornstep.com", // Fixed a tiny typo from your previous code (adorestep -> adornstep)
    siteName: "Adorn Steps",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adorn Steps - Premium Ladies Slippers & Footwear",
    description: "Discover elegant and comfortable ladies slippers, heels, flats, and sandals.",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  const googleFontsUrl =
    'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap';

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={googleFontsUrl} rel="stylesheet" />
      </head>
      <body
        className="font-sans antialiased leading-relaxed overflow-x-hidden bg-white text-gray-900"
      >
        {children}
        
        {/* Added the Cookie Consent Component here */}
        <CookieConsent />
      </body>
    </html>
  );
}