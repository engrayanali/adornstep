export default function SEOHead({ 
  title = 'Adorn Steps - Premium Ladies Slippers & Footwear',
  description = 'Discover elegant and comfortable ladies slippers, heels, flats, and sandals. Shop premium footwear with style at Adorn Steps.',
  keywords = 'ladies slippers, women footwear, heels, flats, sandals, casual slippers, designer slippers',
  ogImage = '/og-image.jpg',
  canonical
}) {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage }],
      type: 'website',
      siteName: 'Adorn Steps',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
