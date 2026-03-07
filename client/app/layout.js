import { Outfit as OutfitFont, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = OutfitFont({
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: '--font-outfit',
});

const playfair = Playfair_Display({
  subsets: ["latin"], 
  weight: ["400", "600", "700"],
  variable: '--font-playfair',
});

export const metadata = {
  title: "Adorn Steps - Premium Ladies Slippers & Footwear",
  description: "Discover elegant and comfortable ladies slippers, heels, flats, and sandals at Adorn Steps. Shop our latest collection of premium footwear.",
  keywords: "ladies slippers, women footwear, heels, flats, sandals, premium slippers",
  authors: [{ name: "Adorn Steps" }],
  openGraph: {
    title: "Adorn Steps - Premium Ladies Slippers & Footwear",
    description: "Discover elegant and comfortable ladies slippers, heels, flats, and sandals.",
    url: "https://adorestep.com",
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
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${playfair.variable} font-outfit antialiased 
        leading-relaxed overflow-x-hidden bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}