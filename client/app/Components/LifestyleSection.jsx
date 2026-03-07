'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import api from '../lib/api';

export default function LifestyleSection() {
  const [lifestyleItems, setLifestyleItems] = useState([
    {
      id: 1,
      title: 'Everyday Elegance',
      description: 'Discover slippers that transition seamlessly from morning coffee to evening gatherings.',
      image: '/placeholder-product.jpg',
      link: '/category/casual',
      layout: 'large'
    },
    {
      id: 2,
      title: 'Spring Collection',
      description: 'Fresh styles for the new season.',
      image: '/placeholder-product.jpg',
      link: '/category/spring-collection',
      layout: 'small'
    },
    {
      id: 3,
      title: 'Limited Edition',
      description: 'Exclusive designs, limited quantities.',
      image: '/placeholder-product.jpg',
      link: '/category/limited-edition',
      layout: 'small'
    }
  ]);

  useEffect(() => {
    loadLifestyleImages();
  }, []);

  const loadLifestyleImages = async () => {
    try {
      const data = await api.getLifestyleImages('live_beautifully', true);
      if (data && data.length > 0) {
        setLifestyleItems(data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image_url,
          link: item.link || '#',
          layout: item.layout
        })));
      }
    } catch (error) {
      console.error('Error loading lifestyle images:', error);
      // Keep default items on error
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-charcoal-800 mb-3 sm:mb-4 tracking-tight">
            Live Beautifully
          </h2>
          <p className="text-base sm:text-lg text-charcoal-600 font-light max-w-2xl mx-auto px-4">
            Designed for the moments that matter, crafted for comfort that lasts
          </p>
          <div className="w-16 sm:w-20 h-0.5 bg-terracotta-500 mx-auto mt-4 sm:mt-6"></div>
        </div>

        {/* Lifestyle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {lifestyleItems.map((item, index) => (
            <Link
              key={item.id}
              href={item.link}
              className={`group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift image-zoom-container ${
                item.layout === 'large' ? 'md:row-span-2' : ''
              }`}
            >
              <div className={`relative ${item.layout === 'large' ? 'h-96 sm:h-[32rem] md:h-[48rem]' : 'h-72 sm:h-80 md:h-96'}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover image-zoom"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-semibold mb-1 sm:mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-cream-100 font-light mb-3 sm:mb-4 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {item.description}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wider uppercase border-b-2 border-white/0 group-hover:border-white/100 pb-1 transition-all duration-300">
                    Shop the Look
                    <ArrowRight size={14} className="sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
