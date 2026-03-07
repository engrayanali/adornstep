'use client';

export const runtime = 'edge';

import { useParams } from 'next/navigation';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import { CheckCircle, Package, Mail } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const params = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 text-center">
            <div className="mb-6">
              <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold font-playfair text-gray-900 mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-gray-600">
                Thank you for your purchase. Your order has been received.
              </p>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <p className="text-2xl font-bold text-gray-900">{params.orderNumber}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Mail className="text-pink-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Confirmation</h3>
                  <p className="text-sm text-gray-600">
                    We've sent an order confirmation to your email address.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Package className="text-pink-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Order Tracking</h3>
                  <p className="text-sm text-gray-600">
                    You can track your order status using your order number.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                Continue Shopping
              </Link>
              <Link
                href={`/order-track/${params.orderNumber}`}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all"
              >
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
