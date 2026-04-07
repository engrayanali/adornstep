'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Shield, ChevronRight, Package } from 'lucide-react';
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
    <div className="min-h-screen" style={{ background: '#F7F4F0', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <Navbar />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

        .cart-item-card {
          background: #ffffff;
          border: 1px solid rgba(180, 160, 140, 0.18);
          border-radius: 4px;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }
        .cart-item-card:hover {
          box-shadow: 0 8px 32px rgba(80, 60, 40, 0.08);
          transform: translateY(-1px);
        }
        .qty-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #3d3530;
          transition: background 0.2s;
          border-radius: 2px;
        }
        .qty-btn:hover:not(:disabled) {
          background: #f0ebe4;
        }
        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .checkout-btn {
          background: #2c2420;
          color: #f7f4f0;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 16px 32px;
          border-radius: 2px;
          border: none;
          width: 100%;
          cursor: pointer;
          transition: background 0.25s ease, letter-spacing 0.25s ease;
          display: block;
          text-align: center;
          text-decoration: none;
        }
        .checkout-btn:hover {
          background: #4a3f38;
          letter-spacing: 0.18em;
        }
        .continue-btn {
          background: transparent;
          color: #6b5d54;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 13px 32px;
          border-radius: 2px;
          border: 1px solid rgba(107, 93, 84, 0.35);
          width: 100%;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          display: block;
          text-align: center;
          text-decoration: none;
        }
        .continue-btn:hover {
          border-color: #2c2420;
          color: #2c2420;
        }
        .remove-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #b8a89a;
          border-radius: 2px;
          transition: color 0.2s, background 0.2s;
        }
        .remove-btn:hover {
          color: #c0392b;
          background: #fdf0ef;
        }
        .summary-card {
          background: #ffffff;
          border: 1px solid rgba(180, 160, 140, 0.18);
          border-radius: 4px;
        }
        .divider {
          border: none;
          border-top: 1px solid rgba(180, 160, 140, 0.22);
          margin: 0;
        }
        .tag-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .price-tag {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
        }
        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .item-image:hover {
          transform: scale(1.04);
        }
      `}</style>

      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">

          {/* Header */}
          <div className="flex items-end justify-between mb-10 pb-6" style={{ borderBottom: '1px solid rgba(180,160,140,0.25)' }}>
            <div>
              <p className="tag-label mb-2" style={{ color: '#9e8a7e' }}>My Bag</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 300, color: '#2c2420', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                Shopping Cart
              </h1>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2"
              style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9e8a7e', textDecoration: 'none', transition: 'color 0.2s' }}
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Continue Shopping</span>
            </Link>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8" style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.1em', color: '#b8a89a' }}>
            <Link href="/" style={{ color: '#b8a89a', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={13} />
            <span style={{ color: '#6b5d54' }}>Cart</span>
          </div>

          {cart.length === 0 ? (
            /* Empty State */
            <div className="text-center py-24">
              <div className="mx-auto mb-8 flex items-center justify-center" style={{ width: 80, height: 80, background: 'rgba(180,160,140,0.1)', borderRadius: '50%' }}>
                <ShoppingBag size={36} style={{ color: '#b8a89a' }} />
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', fontWeight: 400, color: '#2c2420', marginBottom: 12 }}>
                Your cart is empty
              </h2>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '14px', color: '#9e8a7e', marginBottom: 36 }}>
                Discover our collection and find your perfect pair.
              </p>
              <Link href="/" className="checkout-btn" style={{ display: 'inline-block', width: 'auto', padding: '14px 40px' }}>
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── Cart Items ── */}
              <div className="lg:col-span-2">
                <p className="mb-5 tag-label" style={{ color: '#9e8a7e' }}>
                  {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="cart-item-card" style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

                        {/* Image */}
                        <div style={{ width: 110, height: 130, flexShrink: 0, background: '#f0ebe4', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="item-image" />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Package size={28} style={{ color: '#c4b3a8' }} />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                            <Link
                              href={`/product/${item.slug}`}
                              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.25rem', fontWeight: 500, color: '#2c2420', textDecoration: 'none', lineHeight: 1.3, display: 'block', marginBottom: 8 }}
                            >
                              {item.name}
                            </Link>
                            <button className="remove-btn" onClick={() => handleRemove(item)} title="Remove">
                              <Trash2 size={15} />
                            </button>
                          </div>

                          {/* Variant Pills */}
                          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                            {item.size && (
                              <span className="tag-label" style={{ padding: '4px 12px', background: '#f5f0ea', color: '#7a6b62', borderRadius: '2px', fontSize: '10px' }}>
                                Size {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="tag-label" style={{ padding: '4px 12px', background: '#f5f0ea', color: '#7a6b62', borderRadius: '2px', fontSize: '10px' }}>
                                {item.color}
                              </span>
                            )}
                          </div>

                          {/* Bottom row: qty + price */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                            {/* Quantity */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid rgba(180,160,140,0.35)', borderRadius: '3px', overflow: 'hidden' }}>
                              <button
                                className="qty-btn"
                                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={13} />
                              </button>
                              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '14px', fontWeight: 500, minWidth: 36, textAlign: 'center', color: '#2c2420', borderLeft: '1px solid rgba(180,160,140,0.25)', borderRight: '1px solid rgba(180,160,140,0.25)', padding: '0 4px', lineHeight: '32px' }}>
                                {item.quantity}
                              </span>
                              <button className="qty-btn" onClick={() => handleQuantityChange(item, item.quantity + 1)}>
                                <Plus size={13} />
                              </button>
                            </div>

                            {/* Price */}
                            <div style={{ textAlign: 'right' }}>
                              <div className="price-tag" style={{ fontSize: '1.5rem', color: '#2c2420', lineHeight: 1 }}>
                                Rs {(item.price * item.quantity).toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                              </div>
                              {item.quantity > 1 && (
                                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', color: '#b8a89a', marginTop: 3, letterSpacing: '0.04em' }}>
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

              {/* ── Order Summary ── */}
              <div className="lg:col-span-1">
                <div className="summary-card sticky top-24" style={{ padding: '32px 28px' }}>

                  <p className="tag-label mb-6" style={{ color: '#9e8a7e', display: 'block' }}>Order Summary</p>

                  {/* Benefits */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Shield size={15} style={{ color: '#9e8a7e', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 500, color: '#3d3530', marginBottom: 1 }}>Secure Checkout</p>
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', color: '#b8a89a' }}>Safe &amp; encrypted payment</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Package size={15} style={{ color: '#9e8a7e', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 500, color: '#3d3530', marginBottom: 1 }}>30-Day Returns</p>
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', color: '#b8a89a' }}>Easy returns &amp; exchanges</p>
                      </div>
                    </div>
                  </div>

                  <hr className="divider" style={{ marginBottom: 24 }} />

                  {/* Line items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '13px', color: '#7a6b62' }}>
                        Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                      </span>
                      <span className="price-tag" style={{ fontSize: '1.05rem', color: '#2c2420' }}>
                        Rs {total.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '13px', color: '#7a6b62' }}>Shipping</span>
                      <span className="price-tag" style={{ fontSize: '1.05rem', color: '#2c2420' }}>
                        Rs {shippingCost.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <hr className="divider" style={{ marginBottom: 20 }} />

                  {/* Total */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.15rem', color: '#2c2420', fontWeight: 500 }}>Total</span>
                    <span className="price-tag" style={{ fontSize: '1.9rem', color: '#2c2420', fontWeight: 600 }}>
                      Rs {grandTotal.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', color: '#b8a89a', letterSpacing: '0.08em', marginBottom: 28 }}>
                    Tax calculated at checkout
                  </p>

                  <Link href="/checkout" className="checkout-btn" style={{ marginBottom: 10 }}>
                    Proceed to Checkout
                  </Link>
                  <Link href="/" className="continue-btn">
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