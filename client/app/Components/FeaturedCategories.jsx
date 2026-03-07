'use client';

import { useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';
import api from '../lib/api';

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [lifestyleImages, setLifestyleImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, lifestyleData] = await Promise.all([
        api.getCategories(true),
        api.getLifestyleImages('shop_by_style', true)
      ]);
      
      // Use lifestyle images if available, otherwise fallback to categories
      if (lifestyleData && lifestyleData.length > 0) {
        setLifestyleImages(lifestyleData.slice(0, 4));
      } else {
        setCategories(categoriesData.slice(0, 4));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Try to load categories as fallback
      try {
        const data = await api.getCategories(true);
        setCategories(data.slice(0, 4));
      } catch (err) {
        console.error('Error loading categories fallback:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-cream-200 animate-pulse rounded-sm"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-charcoal-800 mb-4 tracking-tight">
            Shop by Style
          </h2>
          <p className="text-lg text-charcoal-600 font-light max-w-2xl mx-auto">
            Explore our curated collections designed for every occasion
          </p>
          <div className="w-20 h-0.5 bg-terracotta-500 mx-auto mt-6"></div>
        </div>

        {/* Categories/Lifestyle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {lifestyleImages.length > 0 ? (
            lifestyleImages.map((item, index) => (
              <a
                key={item.id}
                href={item.link || '#'}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift"
              >
                <div className="relative h-72 sm:h-80 md:h-96">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-display font-semibold mb-1 sm:mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-cream-100 line-clamp-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </div>
              </a>
            ))
          ) : (
            categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
