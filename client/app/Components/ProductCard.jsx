'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { id, name, slug, price, discount_price, images, stock } = product;
  const displayPrice = discount_price || price;
  const hasDiscount = discount_price && discount_price < price;
  
  // Image URLs are already normalized by api.js to include full API URL
  const primaryImageUrl = images?.[0]?.image_url;
  const secondaryImageUrl = images?.[1]?.image_url;
  const primaryImage = primaryImageUrl || '/placeholder-product.jpg';
  const secondaryImage = secondaryImageUrl || primaryImage;
  
  const [currentImage, setCurrentImage] = useState(primaryImage);

  // Mock rating (in real app, this would come from product data)
  const rating = 4.5;
  const reviewCount = 128;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative"
    >
      <div className="bg-white rounded-lg border border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-all duration-500 overflow-hidden hover:border-terracotta-300">
        {/* Product Image */}
        <Link href={`/product/${slug}`}>
          <div 
            className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100"
            onMouseEnter={() => setCurrentImage(secondaryImage)}
            onMouseLeave={() => setCurrentImage(primaryImage)}
          >
            <img
              src={currentImage}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {hasDiscount && (
                <span className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg tracking-wide uppercase">
                  {Math.round(((price - discount_price) / price) * 100)}% OFF
                </span>
              )}
              {stock < 5 && stock > 0 && (
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg tracking-wide uppercase animate-pulse">
                  Only {stock} left
                </span>
              )}
              {stock === 0 && (
                <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg tracking-wide uppercase">
                  Out of Stock
                </span>
              )}
            </div>


            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Border glow effect */}
            <div className="absolute inset-0 border border-gray-300/0 group-hover:border-terracotta-400/20 transition-all duration-500" />
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-6 bg-gradient-to-b from-white to-cream-50/30">
          <Link href={`/product/${slug}`}>
            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < Math.floor(rating)
                        ? 'fill-terracotta-500 text-terracotta-500 drop-shadow-sm'
                        : 'text-cream-300'
                    } transition-all duration-300`}
                  />
                ))}
              </div>
              <span className="text-xs text-charcoal-600 font-medium ml-1">({reviewCount})</span>
            </div>

            <h3 className="font-semibold text-charcoal-900 mb-3 line-clamp-2 group-hover:text-terracotta-600 transition-colors duration-300 text-base leading-snug min-h-[3rem]">
              {name}
            </h3>
            
            <div className="flex items-baseline gap-2.5 mb-1">
              <span className="text-2xl font-bold text-charcoal-900 tracking-tight">
                ₹{displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-sm text-charcoal-400 line-through font-medium">
                  ₹{price.toLocaleString()}
                </span>
              )}
            </div>
            
            {hasDiscount && (
              <p className="text-xs text-green-600 font-semibold">
                You save ₹{(price - discount_price).toLocaleString()}
              </p>
            )}
          </Link>

          {/* Add to Cart Button - Shows on hover */}
          <button 
            className="w-full mt-4 py-3 bg-gradient-to-r from-charcoal-800 to-charcoal-900 text-white text-sm font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 hover:from-terracotta-500 hover:to-terracotta-600 transform translate-y-2 group-hover:translate-y-0 rounded-lg shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic here
            }}
            disabled={stock === 0}
          >
            {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

    </motion.div>
  );
}
