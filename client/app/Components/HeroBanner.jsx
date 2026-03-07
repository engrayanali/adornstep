'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import api from '../lib/api';

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  const loadBanners = async () => {
    try {
      const data = await api.getBanners(true);
      console.log('[HeroBanner] Loaded banners:', data);
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <div className="relative w-full h-[500px] md:h-[700px] bg-gradient-to-br from-cream-200 to-taupe-200 animate-pulse mt-20"></div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[500px] md:h-[700px] bg-gradient-to-br from-cream-100 via-cream-200 to-taupe-100 flex items-center justify-center mt-20">
        <div className="text-center px-6">
          <h2 className="text-5xl md:text-7xl font-display font-semibold text-charcoal-800 mb-6 tracking-tight">
            Step into Comfort
          </h2>
          <p className="text-xl md:text-2xl text-charcoal-600 font-light max-w-2xl mx-auto">
            Elegantly effortless footwear designed for the modern woman
          </p>
          <Link 
            href="/category/new-arrivals"
            className="inline-block mt-10 px-10 py-4 bg-terracotta-500 text-white font-medium tracking-wider uppercase text-sm hover:bg-charcoal-800 transition-all duration-300 hover-lift"
          >
            Discover Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden mt-20 group">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Mobile Image - URLs are already normalized by api.js */}
          <div className="md:hidden relative w-full h-full image-zoom-container">
            <img
              src={banner.mobile_image_url}
              alt={banner.title || 'Hero banner'}
              className="w-full h-full object-cover image-zoom"
              loading="eager"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('[HeroBanner] Failed to load mobile image:', banner.mobile_image_url);
                console.error('[HeroBanner] Error event:', e);
                console.error('[HeroBanner] Image element:', e.target);
                console.error('[HeroBanner] Current src:', e.target.src);
              }}
              onLoad={() => console.log('[HeroBanner] Mobile image loaded successfully:', banner.mobile_image_url)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/20 to-transparent"></div>
          </div>

          {/* Desktop Image - URLs are already normalized by api.js */}
          <div className="hidden md:block relative w-full h-full image-zoom-container">
            <img
              src={banner.desktop_image_url}
              alt={banner.title || 'Hero banner'}
              className="w-full h-full object-cover image-zoom"
              loading="eager"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('[HeroBanner] Failed to load desktop image:', banner.desktop_image_url);
                console.error('[HeroBanner] Error event:', e);
                console.error('[HeroBanner] Image element:', e.target);
                console.error('[HeroBanner] Current src:', e.target.src);
              }}
              onLoad={() => console.log('[HeroBanner] Desktop image loaded successfully:', banner.desktop_image_url)}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/60 via-charcoal-900/20 to-transparent"></div>
          </div>

          {/* Content Overlay */}
          {(banner.title || banner.subtitle || banner.button_text) && (
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  {banner.title && (
                    <h2 className="text-4xl md:text-7xl font-display font-semibold text-white mb-6 drop-shadow-2xl animate-fade-in leading-tight tracking-tight">
                      {banner.title}
                    </h2>
                  )}
                  {banner.subtitle && (
                    <p className="text-lg md:text-2xl text-cream-100 mb-10 drop-shadow-lg animate-fade-in-delay font-light leading-relaxed">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.button_text && banner.button_link && (
                    <Link
                      href={banner.button_link}
                      className="inline-block px-10 py-4 bg-white text-charcoal-800 font-medium tracking-wider uppercase text-sm hover:bg-terracotta-500 hover:text-white transition-all duration-300 hover-lift shadow-xl animate-fade-in-delay-2"
                    >
                      {banner.button_text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-terracotta-500 p-3 rounded-full shadow-card transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="text-charcoal-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-terracotta-500 p-3 rounded-full shadow-card transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="text-charcoal-800" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-10'
                  : 'bg-white/40 hover:bg-white/70 w-1.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
