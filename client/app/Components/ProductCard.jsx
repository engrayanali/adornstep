'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { id, name, slug, price, discount_price, images, stock } = product;
  const displayPrice = discount_price || price;
  const hasDiscount = discount_price && discount_price < price;
  
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
                <span className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white text-sm font-black px-4 py-2 rounded-md shadow-lg tracking-wider uppercase">
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

            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 border border-gray-300/0 group-hover:border-terracotta-400/20 transition-all duration-500" />
          </div>
        </Link>

        {/* Product Info Section */}
        <div className="p-6 lg:p-7 bg-gradient-to-b from-white to-cream-50/30">
          <Link href={`/product/${slug}`}>
            {/* ENHANCED TITLE: Increased to text-3xl, font-black, and tighter tracking */}
            <h3 className="font-black text-gray-900 mb-4 line-clamp-2 group-hover:text-terracotta-600 transition-colors duration-300 text-2xl md:text-3xl leading-[1.1] tracking-tight min-h-[4.5rem]">
              {name}
            </h3>
            
            <div className="flex items-baseline gap-2.5 mb-1">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tighter">
                Rs{displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-base text-gray-400 line-through font-medium">
                  Rs{price.toLocaleString()}
                </span>
              )}
            </div>
            
            {hasDiscount && (
              <p className="text-sm text-green-600 font-bold">
                You save Rs{(price - discount_price).toLocaleString()}
              </p>
            )}
          </Link>

          <button 
            className="w-full mt-5 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold tracking-wider uppercase rounded-lg shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-[1.02] hover:from-terracotta-500 hover:to-terracotta-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.preventDefault();
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