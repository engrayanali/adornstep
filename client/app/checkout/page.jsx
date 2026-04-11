'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { MapPin, User, ShieldCheck, Banknote, Phone } from 'lucide-react';
import { getCart, getCartTotal, clearCart } from '../lib/cart';
import api from '../lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: 'karachi',
    shipping_state: 'Sindh',
    shipping_zip: '',
    shipping_country: 'Pakistan',
    payment_method: 'cod',
    notes: '',
    agreeToTerms: false,
  });

  useEffect(() => {
    const cartData = getCart();
    if (cartData.length === 0) {
      router.push('/cart');
      return;
    }
    setCart(cartData);
    setTotal(getCartTotal());
  }, [router]);

  const shippingCost = formData.shipping_city === 'karachi' ? 200 : 300;
  const grandTotal = total + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms of Service and Exchange Policy to proceed.');
      return;
    }

    setLoading(true);

    try {
      const items = cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const cityLabel = formData.shipping_city === 'karachi' ? 'Karachi' : formData.shipping_city_custom || 'Outside Karachi';

      const orderData = {
        ...formData,
        shipping_city: cityLabel,
        shipping_price: shippingCost, // Add this line
        order_note: formData.notes,   // Map 'notes' to 'order_note'
        items,
      };

      const order = await api.createOrder(orderData);
      clearCart();
      router.push(`/order-success/${order.order_number}?payment=${formData.payment_method}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold font-playfair text-gray-900 mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left: Form */}
              <div className="lg:col-span-2 space-y-6">

                {/* Customer Information */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-pink-500" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text" required
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="e.g. Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email" required
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="your-gmail@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel" required
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="+92 123 4567890"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="text-pink-500" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                  </div>

                  <div className="space-y-4">
                    {/* City Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Location *</label>
                      <div className="grid grid-cols-2 gap-3">
                        <label
                          className={`flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.shipping_city === 'karachi'
                              ? 'border-pink-500 bg-pink-50 text-pink-700 font-semibold'
                              : 'border-gray-200 hover:border-pink-200 text-gray-700'
                          }`}
                        >
                          <input
                            type="radio" name="city" value="karachi"
                            checked={formData.shipping_city === 'karachi'}
                            onChange={() => setFormData({ ...formData, shipping_city: 'karachi', shipping_city_custom: '' })}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <p className="font-semibold text-base">📍 Karachi</p>
                            <p className="text-xs mt-1 text-gray-500">Delivery: Rs 200</p>
                          </div>
                        </label>
                        <label
                          className={`flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.shipping_city === 'outside'
                              ? 'border-pink-500 bg-pink-50 text-pink-700 font-semibold'
                              : 'border-gray-200 hover:border-pink-200 text-gray-700'
                          }`}
                        >
                          <input
                            type="radio" name="city" value="outside"
                            checked={formData.shipping_city === 'outside'}
                            onChange={() => setFormData({ ...formData, shipping_city: 'outside' })}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <p className="font-semibold text-base">🚚 Outside Karachi</p>
                            <p className="text-xs mt-1 text-gray-500">Delivery: Rs 300</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* City name input for outside Karachi */}
                    {formData.shipping_city === 'outside' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City Name *</label>
                        <input
                          type="text" required
                          value={formData.shipping_city_custom || ''}
                          onChange={(e) => setFormData({ ...formData, shipping_city_custom: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="e.g. Lahore, Islamabad, Faisalabad..."
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                      <input
                        type="text" required
                        value={formData.shipping_address}
                        onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="House/Flat No., Street, Area"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Province *</label>
                        <input
                          type="text" required
                          value={formData.shipping_state}
                          onChange={(e) => setFormData({ ...formData, shipping_state: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="e.g. Sindh, Punjab"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP / Postal Code</label>
                        <input
                          type="text"
                          value={formData.shipping_zip}
                          onChange={(e) => setFormData({ ...formData, shipping_zip: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="75500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Banknote className="text-pink-500" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                  </div>

                  <div className="space-y-3">
                    {/* Cash on Delivery */}
                    <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all gap-3 ${formData.payment_method === 'cod' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}>
                      <input
                        type="radio" name="payment" value="cod"
                        checked={formData.payment_method === 'cod'}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                        className="mt-1 accent-pink-500"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-500 mt-1">Pay in cash when your order arrives at your door.</p>
                      </div>
                    </label>

                    {/* Bank Transfer */}
                    <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all gap-3 ${formData.payment_method === 'bank_transfer' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}>
                      <input
                        type="radio" name="payment" value="bank_transfer"
                        checked={formData.payment_method === 'bank_transfer'}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                        className="mt-1 accent-pink-500"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Bank Transfer</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Our team will contact you shortly with bank account details to complete your payment.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Bank Transfer Info Box */}
                  {formData.payment_method === 'bank_transfer' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                      <Phone className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                      <p className="text-sm text-blue-700">
                        After placing your order, a member of our team will reach out to you via phone or WhatsApp
                        with our bank account details. Please complete the transfer within <strong>24 hours</strong> to confirm your order.
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Any special instructions for your order..."
                    />
                  </div>
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex justify-between text-sm gap-2">
                        <span className="text-gray-600 truncate">{item.name} x {item.quantity}</span>
                        <span className="font-semibold flex-shrink-0">Rs {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>Rs {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Charges</span>
                      <span className="font-semibold text-gray-800">
                        Rs {shippingCost} {formData.shipping_city === 'karachi' ? '(Karachi)' : '(Outside Karachi)'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-pink-500">Rs {grandTotal.toFixed(2)}</span>
                    </div>

                    {/* Policy Agreement */}
                    <div className="mb-6">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="flex items-center h-5 mt-0.5">
                          <input
                            type="checkbox" required
                            checked={formData.agreeToTerms}
                            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                            className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                          />
                        </div>
                        <span className="text-xs text-gray-600 leading-normal">
                          I have read and agree to the{' '}
                          <a href="/returns" target="_blank" className="text-pink-500 hover:underline font-medium">Exchange & Damaged Parcel Policy</a>
                          {' '}and{' '}
                          <a href="/terms" target="_blank" className="text-pink-500 hover:underline font-medium">Terms of Service</a> *
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !formData.agreeToTerms}
                      style={{ background: 'linear-gradient(to right, #ec4899, #9333ea)', color: '#fff' }}
                      className="w-full px-6 py-4 font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:opacity-90"
                    >
                      {loading ? 'Processing...' : (
                        <>
                          <ShieldCheck size={20} />
                          Place Order
                        </>
                      )}
                    </button>

                    {!formData.agreeToTerms && !loading && (
                      <p className="text-[10px] text-center text-gray-400 mt-2 italic">
                        Please check the box above to enable checkout
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}