'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { id, name, slug, price, discount_price, images, stock } = product;
  const displayPrice = discount_price || price;
  const hasDiscount = discount_price && discount_price < price;
  
  // Image URLs normalized by api.js
  const primaryImageUrl = images?.[0]?.image_url;
  const secondaryImageUrl = images?.[1]?.image_url;
  const primaryImage = primaryImageUrl || '/placeholder-product.jpg';
  const secondaryImage = secondaryImageUrl || primaryImage;
  
  const [currentImage, setCurrentImage] = useState(primaryImage);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative"
    >
      <div className="bg-white rounded-lg border border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-all duration-500 overflow-hidden hover:border-terracotta-300">
        {/* Product Image Section */}
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
            
            {/* Badges Logic */}
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

            {/* Visual Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 border border-gray-300/0 group-hover:border-terracotta-400/20 transition-all duration-500" />
          </div>
        </Link>

        {/* Product Info Section */}
        <div className="p-6 bg-gradient-to-b from-white to-cream-50/30">
          <Link href={`/product/${slug}`}>
            {/* The title now starts directly at the top of the info box */}
            <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-terracotta-600 transition-colors duration-300 text-base leading-snug min-h-[3rem]">
              {name}
            </h3>
            
            <div className="flex items-baseline gap-2.5 mb-1">
              <span className="text-2xl font-bold text-gray-800 tracking-tight">
                ₹{displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through font-medium">
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

          {/* Add to Cart Button */}
          <button 
            className="w-full mt-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-bold tracking-wider uppercase rounded-lg shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-[1.02] hover:from-terracotta-500 hover:to-terracotta-600 transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.preventDefault();
              // Your existing cart logic goes here
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