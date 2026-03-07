export default function manifest() {
  return {
    name: 'Adorn Steps - Premium Ladies Footwear',
    short_name: 'Adorn Steps',
    description: 'Discover elegant and comfortable ladies slippers, heels, flats, and sandals.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#e11d48',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
