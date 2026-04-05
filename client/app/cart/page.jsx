'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, Truck, Shield, ChevronRight } from 'lucide-react';
import { getCart, updateCartItemQuantity, removeFromCart, getCartTotal } from '../lib/cart';
import LoadingScreen from '../Components/LoadingScreen';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadCart();

    // Listen for cart updates
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

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 xl:px-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-taupe-600 mb-6">
            <Link href="/" className="hover:text-charcoal-800 transition-colors">Home</Link>
            <ChevronRight size={16} />
            <span className="text-charcoal-800 font-medium">Shopping Cart</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-5xl font-heading text-charcoal-800">
              Shopping Cart
            </h1>
            <Link 
              href="/"
              className="flex items-center gap-2 text-taupe-600 hover:text-charcoal-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Continue Shopping</span>
            </Link>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 mx-auto mb-6 bg-cream-100 rounded-full flex items-center justify-center">
                  <ShoppingBag size={64} className="text-taupe-400" />
                </div>
                <h2 className="text-2xl font-heading text-charcoal-800 mb-3">Your cart is empty</h2>
                <p className="text-taupe-600 mb-8">Discover our beautiful collection of footwear and add your favorites to get started!</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-charcoal-800 text-white font-semibold rounded-full hover:bg-charcoal-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft size={20} />
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Items Count */}
                <div className="flex items-center justify-between">
                  <p className="text-taupe-600">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'} in your cart
                  </p>
                </div>

                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="bg-white rounded-2xl shadow-card p-6 hover:shadow-product transition-shadow duration-300">
                    <div className="flex gap-6">
                      {/* Product Image - URLs are already normalized by cart.js */}
                      <div className="w-28 h-28 md:w-36 md:h-36 bg-cream-50 rounded-xl overflow-hidden flex-shrink-0 image-zoom-container">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover image-zoom"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream-100 to-taupe-100">
                            <span className="text-taupe-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <Link href={`/product/${item.slug}`} className="font-heading text-lg text-charcoal-800 hover:text-terracotta-600 transition-colors line-clamp-2 mb-2 block">
                              {item.name}
                            </Link>
                            <div className="flex flex-wrap gap-3 text-sm text-taupe-600">
                              {item.size && (
                                <span className="px-3 py-1 bg-cream-100 rounded-full">
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="px-3 py-1 bg-cream-100 rounded-full">
                                  {item.color}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemove(item)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all ml-2 hover:scale-110"
                            title="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 border-2 border-taupe-200 rounded-full overflow-hidden">
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-3 hover:bg-cream-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-semibold min-w-[40px] text-center text-charcoal-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              className="p-3 hover:bg-cream-100 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-charcoal-800">
                              Rs {(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-taupe-500">
                              Rs {item.price.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-card p-8 sticky top-24">
                  <h2 className="text-2xl font-heading text-charcoal-800 mb-8">Order Summary</h2>
                  
                  {/* Benefits */}
                  <div className="space-y-4 mb-8 pb-8 border-b border-taupe-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-cream-100 rounded-lg">
                        <Truck size={20} className="text-terracotta-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-charcoal-800 text-sm">Free Shipping</p>
                        <p className="text-xs text-taupe-600">On orders over Rs 5,000</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-cream-100 rounded-lg">
                        <Shield size={20} className="text-terracotta-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-charcoal-800 text-sm">Secure Checkout</p>
                        <p className="text-xs text-taupe-600">Safe & encrypted payment</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-cream-100 rounded-lg">
                        <Tag size={20} className="text-terracotta-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-charcoal-800 text-sm">30-Day Returns</p>
                        <p className="text-xs text-taupe-600">Easy returns & exchanges</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-taupe-700">
                      <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span className="font-semibold">Rs {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-taupe-700">
                      <span>Shipping</span>
                      <span className={`font-semibold ${total >= 5000 ? 'text-green-600' : 'text-charcoal-800'}`}>
                        {total >= 5000 ? 'FREE' : 'Rs 500'}
                      </span>
                    </div>
                    {total < 5000 && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-3 rounded-lg">
                        <p className="text-xs text-amber-800 font-medium">
                          Add <span className="font-bold">Rs {(5000 - total).toFixed(2)}</span> more for free shipping! 🎉
                        </p>
                        <div className="mt-2 h-2 bg-amber-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                            style={{ width: `${Math.min((total / 5000) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t-2 border-taupe-200 pt-6 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-heading text-charcoal-800">Total</span>
                      <span className="text-3xl font-bold text-charcoal-800">
                        Rs {(total + (total >= 5000 ? 0 : 500)).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-taupe-500 mt-2">Tax calculated at checkout</p>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full px-6 py-4 bg-charcoal-800 text-white bg-gray-700 font-semibold rounded-full text-center hover:bg-charcoal-700 transition-all shadow-lg hover:shadow-xl mb-4 hover:scale-105 transform duration-300"
                  >
                    Proceed to Checkout
                  </Link>

                  <Link
                    href="/"
                    className="block w-full px-6 py-3 border-2 border-taupe-300 text-charcoal-700 font-semibold rounded-full text-center hover:border-charcoal-800 hover:bg-cream-50 transition-all"
                  >
                    Continue Shopping
                  </Link>
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
