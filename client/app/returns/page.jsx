'use client';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { RefreshCw, Package, CheckCircle, XCircle, Video, AlertTriangle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-taupe-100 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RefreshCw className="w-16 h-16 mx-auto mb-6 text-terracotta-500" />
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-charcoal-800 mb-6">
            Exchange & Damaged Parcel Policy
          </h1>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            Please read our policy carefully before making a purchase. We are committed to ensuring your satisfaction.
          </p>
        </div>
      </section>

      {/* No Return / No Design Exchange Notice */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 lg:p-10 mb-10">
            <div className="flex items-start gap-5">
              <XCircle className="w-12 h-12 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-display font-semibold text-charcoal-800 mb-4">
                  No Returns & No Design Exchange
                </h2>
                <p className="text-charcoal-600 leading-relaxed text-lg">
                  We do <strong>not</strong> offer returns or design exchanges on any orders. All sales are final.
                  Please ensure you select the correct product and design before placing your order.
                </p>
              </div>
            </div>
          </div>

          {/* Size Exchange Policy */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 lg:p-10 mb-10">
            <div className="flex items-start gap-5">
              <CheckCircle className="w-12 h-12 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-display font-semibold text-charcoal-800 mb-4">
                  Size Exchange Policy
                </h2>
                <p className="text-charcoal-600 leading-relaxed text-lg mb-4">
                  We offer size exchanges only. If the size you received does not fit, you may request a size change
                  under the following conditions:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-charcoal-600">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>The product must be unworn and in its original condition with all tags attached.</span>
                  </li>
                  <li className="flex items-start gap-3 text-charcoal-600">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>You must contact us within <strong>7 days</strong> of receiving your order.</span>
                  </li>
                  <li className="flex items-start gap-3 text-charcoal-600">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>The replacement size is subject to availability.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Delivery Charges for Size Exchange */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 lg:p-10 mb-10">
            <div className="flex items-start gap-5">
              <Package className="w-12 h-12 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-display font-semibold text-charcoal-800 mb-4">
                  Delivery Charges for Size Exchange
                </h2>
                <div className="space-y-4 text-charcoal-600 leading-relaxed text-base">
                  <p>
                    <strong>Sending the item back to us:</strong> The customer is responsible for all shipping costs
                    when sending the product back to us for a size exchange.
                  </p>
                  <p>
                    <strong>Sending the replacement to you:</strong> Once we receive and verify the returned item,
                    we will cover the delivery charges when sending the replacement product back to you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Damaged Parcel Policy */}
          <div className="bg-gradient-to-br from-blush-50 to-taupe-50 border-2 border-taupe-200 rounded-2xl p-8 lg:p-10 mb-10">
            <div className="flex items-start gap-5">
              <Video className="w-12 h-12 text-terracotta-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-display font-semibold text-charcoal-800 mb-4">
                  Damaged Parcel Policy
                </h2>
                <p className="text-charcoal-600 leading-relaxed text-lg mb-5">
                  If your parcel arrives damaged, we will replace the product. However, the following conditions
                  must be met:
                </p>

                <div className="bg-white rounded-xl p-6 mb-5 border border-taupe-200">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-charcoal-800 text-lg">Video Proof Required</h3>
                  </div>
                  <p className="text-charcoal-600">
                    You must record a <strong>clear unboxing video</strong> showing the damaged product at the time
                    of opening the parcel. This video must be submitted as proof when contacting us.
                    Claims without video evidence will not be accepted.
                  </p>
                </div>

                <div className="space-y-4 text-charcoal-600 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 bg-terracotta-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <p><strong>You send the damaged product to us</strong> — shipping charges for sending the damaged
                    item back to us are the customer's responsibility.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 bg-terracotta-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <p><strong>We verify the damage</strong> — our team will inspect the returned product and video
                    evidence.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 bg-terracotta-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <p><strong>We send the replacement</strong> — once verified, we will send a replacement product
                    and cover all delivery charges for sending it to you.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What We Do Not Accept */}
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-card mb-10">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-2xl font-semibold text-charcoal-800 mb-6">We Cannot Accept Claims If:</h3>
            <ul className="space-y-3">
              {[
                'No unboxing video is provided for damaged parcel claims',
                'The item has been worn, washed, or altered',
                'Original tags are missing or removed',
                'Contact is made after 7 days of delivery',
                'The item was not purchased directly from adornstep.com',
                'A design exchange is requested (only size exchange is permitted)',
                'A return or refund is requested (we do not offer returns)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-charcoal-600">
                  <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-taupe-100 to-blush-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="w-16 h-16 mx-auto mb-6 text-terracotta-500" />
          <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Need Help?</h2>
          <p className="text-lg text-charcoal-600 mb-2">
            For size exchange or damaged parcel claims, contact our support team with your order number
            and any required video/photo evidence.
          </p>
          <p className="text-charcoal-600 mb-8">
            We aim to respond within <strong>1–2 business days</strong>.
          </p>
          <a
            href="mailto:support@adornstep.com"
            className="inline-block px-8 py-4 bg-charcoal-800 text-white font-semibold rounded-full hover:bg-charcoal-700 transition-all duration-300 shadow-lg"
          >
            support@adornstep.com
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}