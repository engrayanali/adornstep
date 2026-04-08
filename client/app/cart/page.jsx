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

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = 500;
  const grandTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <div className="pt-20 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 xl:px-24">

          {/* ── Page Header ── */}
          <div className="flex items-end justify-between pt-8 pb-6 mb-2 border-b border-taupe-200">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-taupe-500 mb-2">My Bag</p>
              <h1 className="font-heading text-4xl md:text-5xl font-light text-charcoal-800 leading-tight">
                Shopping Cart
              </h1>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-taupe-500 hover:text-charcoal-800 transition-colors"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Continue Shopping</span>
            </Link>
          </div>

          {/* ── Breadcrumb ── */}
          <div className="flex items-center gap-2 py-4 mb-6 text-xs tracking-wider text-taupe-400">
            <Link href="/" className="hover:text-charcoal-700 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-charcoal-600 font-medium">Cart</span>
          </div>

          {cart.length === 0 ? (
            /* ── Empty State ── */
            <div className="text-center py-28">
              <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={34} className="text-taupe-400" />
              </div>
              <h2 className="font-heading text-3xl font-light text-charcoal-800 mb-3">Your cart is empty</h2>
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
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-10">

              {/* ════════════════════════════
                  CART ITEMS COLUMN
              ════════════════════════════ */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-taupe-500 mb-5">
                  {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                </p>

                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}-${index}`}
                      className="bg-white border border-taupe-100 rounded-sm hover:shadow-product transition-all duration-300 group overflow-hidden"
                    >
                      <div className="flex">

                        {/* Image */}
                        <div className="w-32 md:w-44 flex-shrink-0 bg-cream-100 overflow-hidden" style={{ minHeight: 168 }}>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              style={{ minHeight: 168 }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 168 }}>
                              <Package size={28} className="text-taupe-300" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 p-5 md:p-6 flex flex-col justify-between">

                          {/* Top: name + remove */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/product/${item.slug}`}
                                className="font-heading text-xl md:text-2xl font-medium text-charcoal-800 hover:text-terracotta-600 transition-colors leading-snug block mb-3"
                              >
                                {item.name}
                              </Link>

                              {/* Variant tags */}
                              <div className="flex flex-wrap gap-2">
                                {item.size && (
                                  <span className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 bg-cream-100 text-taupe-600 rounded-sm border border-taupe-200">
                                    Size {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 bg-cream-100 text-taupe-600 rounded-sm border border-taupe-200">
                                    {item.color}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => handleRemove(item)}
                              className="p-2 text-taupe-300 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all flex-shrink-0"
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Bottom: qty + price */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-taupe-100">

                            {/* Quantity stepper */}
                            <div className="flex items-center border border-taupe-200 rounded-sm overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-9 h-9 flex items-center justify-center text-charcoal-600 hover:bg-cream-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-10 text-center text-sm font-semibold text-charcoal-800 border-x border-taupe-200 h-9 flex items-center justify-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                className="w-9 h-9 flex items-center justify-center text-charcoal-600 hover:bg-cream-100 transition-colors"
                              >
                                <Plus size={13} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="font-heading text-2xl md:text-3xl font-medium text-charcoal-800 leading-none">
                                Rs {(item.price * item.quantity).toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                              </div>
                              {item.quantity > 1 && (
                                <div className="text-xs text-taupe-400 mt-1 tracking-wide">
                                  Rs {item.price.toLocaleString('en-PK', { minimumFractionDigits: 2 })} each
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ════════════════════════════
                  ORDER SUMMARY COLUMN
              ════════════════════════════ */}
              <div>
                <div className="bg-white border border-taupe-100 rounded-sm p-7 sticky top-24">

                  <p className="text-xs font-semibold tracking-widest uppercase text-taupe-500 mb-6">Order Summary</p>

                  {/* Trust badges */}
                  <div className="space-y-3.5 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cream-100 rounded-sm flex items-center justify-center flex-shrink-0">
                        <Shield size={14} className="text-taupe-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-charcoal-700">Secure Checkout</p>
                        <p className="text-xs text-taupe-400 mt-0.5">Safe &amp; encrypted payment</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cream-100 rounded-sm flex items-center justify-center flex-shrink-0">
                        <RefreshCw size={14} className="text-taupe-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-charcoal-700">30-Day Returns</p>
                        <p className="text-xs text-taupe-400 mt-0.5">Easy returns &amp; exchanges</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-taupe-100 pt-5 mb-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-taupe-600">
                        Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                      </span>
                      <span className="font-heading text-base text-charcoal-800">
                        Rs {total.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-taupe-600">Shipping</span>
                      <span className="font-heading text-base text-charcoal-800">
                        Rs {shippingCost.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-taupe-200 pt-5 mb-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-heading text-lg text-charcoal-800">Total</span>
                      <span className="font-heading text-3xl font-semibold text-charcoal-800">
                        Rs {grandTotal.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <p className="text-[10px] text-taupe-400 tracking-wide mt-1.5 mb-7">Tax calculated at checkout</p>

                    <Link
                      href="/checkout"
                      className="block w-full py-4 bg-charcoal-800 hover:bg-charcoal-700 text-white text-xs font-semibold tracking-widest uppercase text-center transition-all mb-3 rounded-sm"
                    >
                      Proceed to Checkout
                    </Link>
                    <Link
                      href="/"
                      className="block w-full py-3.5 border border-taupe-300 hover:border-charcoal-600 text-charcoal-600 hover:text-charcoal-800 text-xs font-semibold tracking-widest uppercase text-center transition-all rounded-sm"
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