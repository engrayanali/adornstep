'use client';

import { X, ShoppingCart, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { addToCart } from '../lib/cart';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedSize);
    onClose();
  };

  // Image URLs are already normalized by api.js to include full API URL
  const imageUrls = product.images?.map(img => img.image_url).filter(url => url) || [];
  const images = imageUrls.length > 0 ? imageUrls : ['/placeholder-product.jpg'];
  const sizes = JSON.parse(product.sizes || '["6", "7", "8", "9", "10"]');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X size={24} className="text-charcoal-800" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-cream-100">
              <img
                src={images[currentImage] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImage === index ? 'border-blush-400' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-heading text-charcoal-800 mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-charcoal-600">(124 reviews)</span>
              </div>
              <p className="text-3xl font-bold text-charcoal-800">${product.price}</p>
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold text-charcoal-800 mb-2">Description</h3>
                <p className="text-charcoal-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold text-charcoal-800 mb-3">Select Size</h3>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-lg border-2 font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-blush-400 bg-blush-50 text-blush-600'
                        : 'border-gray-200 hover:border-taupe-300 text-charcoal-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-charcoal-800 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-taupe-300 transition-colors text-charcoal-800"
                >
                  -
                </button>
                <span className="text-xl font-semibold text-charcoal-800 w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-taupe-300 transition-colors text-charcoal-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-charcoal-800 text-white py-4 rounded-full font-semibold hover:bg-charcoal-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button className="p-4 rounded-full border-2 border-gray-200 hover:border-blush-400 hover:bg-blush-50 transition-all">
                <Heart size={20} className="text-charcoal-600" />
              </button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6 space-y-2 text-sm text-charcoal-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Premium quality materials</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
