'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Shield, ChevronRight, Package, RefreshCw } from 'lucide-react';
import { getCart, updateCartItemQuantity, removeFromCart, getCartTotal } from '../lib/cart';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadCart();
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const loadCart = () => {
    const cartData = getCart();
    setCart(cartData);
    setTotal(getCartTotal());
  };

  const handleQuantityChange = (item, newQuantity) => {
    updateCartItemQuantity(item.id, newQuantity, item.size, item.color);
    loadCart();
  };

  const handleRemove = (item) => {
    if (confirm('Remove this item from cart?')) {
      removeFromCart(item.id, item.size, item.color);
      loadCart();
    }
  };

  // Helper to safely get image URL
  const getImageUrl = (item) => {
    if (!item.image || item.image === 'null' || item.image === 'undefined') return null;
    if (item.image.startsWith('http')) return item.image;
    if (item.image.startsWith('/')) return item.image;
    return null;
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <div className="pt-16 md:pt-20 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 xl:px-24">

          {/* Page Header */}
          <div className="flex items-end justify-between pt-8 pb-6 mb-2 border-b border-taupe-200">
            <div>
              <p className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-taupe-500 mb-2">My Bag</p>
              <h1 className="font-heading text-3xl md:text-5xl font-light text-charcoal-800 leading-tight">
                Shopping Cart
              </h1>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-[10px] md:text-xs font-semibold tracking-widest uppercase text-taupe-500 hover:text-charcoal-800 transition-colors"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Continue Shopping</span>
            </Link>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 py-4 mb-4 md:mb-6 text-[10px] md:text-xs tracking-wider text-taupe-400">
            <Link href="/" className="hover:text-charcoal-700 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-charcoal-600 font-medium">Cart</span>
          </div>

          {cart.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 md:py-28">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={28} className="text-taupe-400" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-light text-charcoal-800 mb-3">Your cart is empty</h2>
              <p className="text-sm text-taupe-500 mb-10">Discover our collection and find your perfect pair.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-charcoal-800 text-white text-xs font-semibold tracking-widest uppercase hover:bg-charcoal-700 transition-all rounded-sm"
              >
                <ArrowLeft size={14} />
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 md:gap-10">

              {/* Cart Items */}
              <div>
                <p className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-taupe-500 mb-5">
                  {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                </p>

                <div className="space-y-4">
                  {cart.map((item, index) => {
                    const imageUrl = getImageUrl(item);
                    return (
                      <div
                        key={`${item.id}-${item.size}-${item.color}-${index}`}
                        className="bg-white border border-taupe-100 rounded-sm hover:shadow-product transition-all duration-300 group overflow-hidden"
                      >
                        <div className="flex flex-row">

                          {/* Image — FIX: safe fallback when URL is null/broken */}
                          <div className="w-28 sm:w-32 md:w-44 flex-shrink-0 bg-cream-100 overflow-hidden relative">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            {/* Fallback icon — always rendered, hidden when image loads */}
                            <div
                              className="absolute inset-0 w-full h-full flex items-center justify-center"
                              style={{ display: imageUrl ? 'none' : 'flex' }}
                            >
                              <Package size={28} className="text-taupe-300" />
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0 p-4 md:p-6 flex flex-col justify-between">

                            {/* Top: name + remove */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/product/${item.slug}`}
                                  className="font-heading text-lg md:text-2xl font-medium text-charcoal-800 hover:text-terracotta-600 transition-colors leading-tight block mb-2 line-clamp-2"
                                >
                                  {item.name}
                                </Link>
                                <div className="flex flex-wrap gap-1.5 md:gap-2">
                                  {item.size && (
                                    <span className="text-[9px] md:text-[10px] font-semibold tracking-widest uppercase px-2 md:px-3 py-1 bg-cream-100 text-taupe-600 rounded-sm border border-taupe-200">
                                      Size {item.size}
                                    </span>
                                  )}
                                  {item.color && (
                                    <span className="text-[9px] md:text-[10px] font-semibold tracking-widest uppercase px-2 md:px-3 py-1 bg-cream-100 text-taupe-600 rounded-sm border border-taupe-200">
                                      {item.color}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemove(item)}
                                className="p-1.5 text-taupe-300 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all flex-shrink-0"
                                title="Remove item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            {/* Bottom: qty + price */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t border-taupe-100 gap-4">
                              <div className="flex items-center border border-taupe-200 rounded-sm overflow-hidden scale-90 sm:scale-100 origin-left">
                                <button
                                  onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-charcoal-600 hover:bg-cream-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-8 md:w-10 text-center text-xs md:text-sm font-semibold text-charcoal-800 border-x border-taupe-200 h-8 md:h-9 flex items-center justify-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-charcoal-600 hover:bg-cream-100 transition-colors"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <div className="text-left sm:text-right w-full sm:w-auto">
                                <div className="font-heading text-xl md:text-3xl font-medium text-charcoal-800 leading-none">
                                  Rs {(item.price * item.quantity).toLocaleString('en-PK')}
                                </div>
                                {item.quantity > 1 && (
                                  <div className="text-[10px] text-taupe-400 mt-1 tracking-wide">
                                    Rs {item.price.toLocaleString('en-PK')} each
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-4 lg:mt-0">
                <div className="bg-white border border-taupe-100 rounded-sm p-5 md:p-7 lg:sticky lg:top-24">

                  <p className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-taupe-500 mb-6">Order Summary</p>

                  {/* Trust badges — FIX: updated policy text */}
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-6">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-cream-100 rounded-sm flex items-center justify-center flex-shrink-0">
                        <Shield size={13} className="text-taupe-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] md:text-xs font-semibold text-charcoal-700 truncate">Secure Checkout</p>
                        <p className="hidden md:block text-[10px] text-taupe-400 mt-0.5">Safe &amp; encrypted</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-cream-100 rounded-sm flex items-center justify-center flex-shrink-0">
                        <RefreshCw size={13} className="text-taupe-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] md:text-xs font-semibold text-charcoal-700 truncate">Size Exchange</p>
                        <p className="hidden md:block text-[10px] text-taupe-400 mt-0.5">Within 7 days</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-taupe-100 pt-5 mb-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-taupe-600">
                        Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                      </span>
                      <span className="font-heading text-sm md:text-base text-charcoal-800">
                        Rs {total.toLocaleString('en-PK')}
                      </span>
                    </div>
                    {/* FIX: shipping not fixed — calculated at checkout based on city */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-taupe-600">Delivery Charges</span>
                      <span className="text-xs md:text-sm text-taupe-500 italic">
                        Rs 200–300 at checkout
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-taupe-200 pt-5 mb-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-heading text-base md:text-lg text-charcoal-800">Subtotal</span>
                      <span className="font-heading text-2xl md:text-3xl font-semibold text-charcoal-800">
                        Rs {total.toLocaleString('en-PK')}
                      </span>
                    </div>
                    <p className="text-[9px] md:text-[10px] text-taupe-400 tracking-wide mt-1.5 mb-7">
                      Delivery charges (Rs 200 Karachi / Rs 300 outside) added at checkout
                    </p>

                    <Link
                      href="/checkout"
                      className="block w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-[10px] md:text-xs font-semibold tracking-widest uppercase text-center transition-all mb-3 rounded-sm active:scale-95"
                    >
                      Proceed to Checkout
                    </Link>
                    <Link
                      href="/"
                      className="block w-full py-3.5 border border-taupe-300 hover:border-gray-600 text-gray-600 hover:text-gray-800 text-[10px] md:text-xs font-semibold tracking-widest uppercase text-center transition-all rounded-sm active:scale-95"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}