'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category, index = 0 }) {
  const { name, slug, image_url, description } = category;
  // Image URL is already normalized by api.js to include full API URL
  const categoryImage = image_url || '/placeholder-category.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer"
    >
      <Link href={`/category/${slug}`}>
        <div className="relative overflow-hidden rounded-sm shadow-card hover:shadow-product-hover transition-all duration-500 hover-lift">
          {/* Category Image */}
          <div className="relative w-full h-72 md:h-96 overflow-hidden image-zoom-container">
            <img
              src={categoryImage}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover image-zoom"
            />
            
            {/* Sophisticated Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/30 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl md:text-4xl font-display font-semibold mb-3 transform group-hover:translate-x-2 transition-transform duration-400 tracking-tight">
                {name}
              </h3>
              {description && (
                <p className="text-sm text-cream-100 font-light mb-4 opacity-90 leading-relaxed max-w-md">
                  {description}
                </p>
              )}
              
              <div className="inline-flex items-center gap-2 text-sm font-medium tracking-wider uppercase border-b-2 border-white/0 group-hover:border-white/100 pb-1 transition-all duration-300">
                Explore Collection
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
