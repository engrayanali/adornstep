'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { CreditCard, MapPin, User, ShieldCheck } from 'lucide-react';
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
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    shipping_country: 'United States',
    payment_method: 'card',
    notes: '',
    agreeToTerms: false, // New state for policy agreement
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Secondary validation check
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms of Service and Return Policy to proceed.');
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

      const orderData = {
        ...formData,
        items,
      };

      const order = await api.createOrder(orderData);
      
      clearCart();
      router.push(`/order-success/${order.order_number}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = total >= 5000 ? 0 : 500;
  const grandTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold font-playfair text-gray-900 mb-8">
            Checkout
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-pink-500" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="+1 (234) 567-8900"
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.shipping_address}
                        onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="123 Main Street, Apt 4B"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.shipping_city}
                          onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.shipping_state}
                          onChange={(e) => setFormData({ ...formData, shipping_state: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.shipping_zip}
                          onChange={(e) => setFormData({ ...formData, shipping_zip: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="10001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.shipping_country}
                          onChange={(e) => setFormData({ ...formData, shipping_country: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="text-pink-500" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                  </div>

                  <div className="space-y-3">
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.payment_method === 'card' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={formData.payment_method === 'card'}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                        className="mr-3 accent-pink-500"
                      />
                      <span className="font-medium">Credit / Debit Card</span>
                    </label>
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.payment_method === 'cod' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={formData.payment_method === 'cod'}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                        className="mr-3 accent-pink-500"
                      />
                      <span className="font-medium">Cash on Delivery</span>
                    </label>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Any special instructions for your order..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-semibold">Rs {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>Rs {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                        {shippingCost === 0 ? 'FREE' : `Rs ${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-pink-500">
                        Rs {grandTotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Policy Agreement Checkbox */}
                    <div className="mb-6">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            required
                            checked={formData.agreeToTerms}
                            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                            className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                          />
                        </div>
                        <span className="text-xs text-gray-600 leading-normal">
                          I have read and agree to the website{' '}
                          <button type="button" className="text-pink-500 hover:underline font-medium">Terms of Service</button>
                          {' '}and{' '}
                          <button type="button" className="text-pink-500 hover:underline font-medium">Return & Exchange Policy</button> *
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !formData.agreeToTerms}
                      className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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