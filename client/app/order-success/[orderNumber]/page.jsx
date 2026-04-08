'use client';

import { useParams } from 'next/navigation';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import { CheckCircle, Mail } from 'lucide-react';
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

            {/* Confirmation Box - Centered since the tracking box is removed */}
            <div className="max-w-md mx-auto mb-10 text-left">
              <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
                <Mail className="text-pink-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Confirmation</h3>
                  <p className="text-sm text-gray-600">
                    We've sent an order confirmation and receipt to your email address. Please check your inbox (and spam folder) for details.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Link
                href="/"
                className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-200/50 transform hover:scale-[1.02]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}