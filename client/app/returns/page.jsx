'use client';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { RefreshCw, Package, CheckCircle, XCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-taupe-100 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RefreshCw className="w-16 h-16 mx-auto mb-6 text-terracotta-500" />
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-charcoal-800 mb-6">
            Returns & Exchanges
          </h1>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            We want you to love your purchase. If you're not completely satisfied, we're here to help.
          </p>
        </div>
      </section>

      {/* Return Policy */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-product mb-12">
            <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-6">30-Day Return Policy</h2>
            <p className="text-lg text-charcoal-600 leading-relaxed mb-6">
              We offer a 30-day return policy from the date of delivery. Items must be unworn, unwashed, and in 
              their original packaging with all tags attached. We'll gladly accept returns that meet these conditions.
            </p>
            <div className="bg-gradient-to-r from-taupe-50 to-cream-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-charcoal-800 mb-3">Return Window</h3>
              <p className="text-charcoal-600">
                You have <span className="font-bold text-terracotta-500">30 days</span> from the date of delivery 
                to initiate a return or exchange.
              </p>
            </div>
          </div>

          {/* How to Return */}
          <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-8">How to Return an Item</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-card text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold text-charcoal-800 mb-2">Contact Us</h3>
              <p className="text-sm text-charcoal-600">
                Email us at returns@adornsteps.com with your order number
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-card text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold text-charcoal-800 mb-2">Get Label</h3>
              <p className="text-sm text-charcoal-600">
                Receive a prepaid return shipping label via email
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-card text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold text-charcoal-800 mb-2">Pack & Ship</h3>
              <p className="text-sm text-charcoal-600">
                Securely pack your item and attach the label
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-card text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h3 className="font-semibold text-charcoal-800 mb-2">Get Refund</h3>
              <p className="text-sm text-charcoal-600">
                Receive your refund within 5-7 business days
              </p>
            </div>
          </div>

          {/* Exchanges */}
          <div className="bg-gradient-to-br from-blush-50 to-taupe-50 rounded-2xl p-8 lg:p-12 mb-12">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCw className="text-terracotta-500" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-semibold text-charcoal-800 mb-4">Exchanges</h2>
                <p className="text-charcoal-600 leading-relaxed mb-4">
                  Need a different size or color? We're happy to help! Contact us to arrange an exchange. 
                  We'll send you the new item and provide a prepaid return label for the original.
                </p>
                <p className="text-charcoal-600 leading-relaxed">
                  <strong>Note:</strong> Exchanges are subject to availability. If your desired item is out of stock, 
                  we'll process a full refund instead.
                </p>
              </div>
            </div>
          </div>

          {/* Return Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What We Accept */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-2xl font-semibold text-charcoal-800 mb-6">We Accept Returns If:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-charcoal-600">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Item is unworn and unwashed</span>
                </li>
                <li className="flex items-start gap-3 text-charcoal-600">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>All original tags are attached</span>
                </li>
                <li className="flex items-start gap-3 text-charcoal-600">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Item is in original packaging</span>
                </li>
                <li className="flex items-start gap-3 text-charcoal-600">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Returned within 30 days of delivery</span>
                </li>
                <li className="flex items-start gap-3 text-charcoal-600">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Proof of purchase is provided</span>
                </li>
              </ul>
            </div>

            {/* What We Don't Accept */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <XCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-2xl font-semibold text-charcoal-800 mb-6">We Cannot Accept:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-charcoal-600">
                  <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Worn or damaged items</span>
                </li>
                <li className="flex items-start gap-3 text-charcoal-600">
                  <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Items without original tags</span>
                </li>
                <li className="flex items-start gap-3 text-charcoal-600">
                  <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Final sale or clearance items</span>
                </li>
                <li className="flex items-start gap-3 text-charcoal-600">
                  <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Returns after 30 days</span>
                </li>
                <li className="flex items-start gap-3 text-charcoal-600">
                  <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Items purchased from third parties</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-8">Refund Information</h2>
          
          <div className="space-y-6 text-charcoal-600 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Processing Time</h3>
              <p>
                Once we receive your return, please allow 3-5 business days for processing. You will receive an 
                email confirmation once your return has been processed.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Refund Method</h3>
              <p>
                Refunds will be issued to the original payment method used at checkout. Please allow 5-7 business 
                days for the refund to appear in your account.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Shipping Costs</h3>
              <p>
                Original shipping costs are non-refundable. If you received free shipping on your order, the actual 
                shipping cost will be deducted from your refund.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Return Shipping</h3>
              <p>
                We provide prepaid return labels for domestic returns. A $6.99 return shipping fee will be deducted 
                from your refund. International return shipping costs are the responsibility of the customer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Help */}
      <section className="py-16 bg-gradient-to-r from-taupe-100 to-blush-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="w-16 h-16 mx-auto mb-6 text-terracotta-500" />
          <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Need Help?</h2>
          <p className="text-lg text-charcoal-600 mb-6">
            Our customer service team is here to assist you with any questions about returns or exchanges.
          </p>
          <a 
            href="mailto:returns@adornsteps.com"
            className="inline-block px-8 py-4 bg-charcoal-800 text-white font-semibold rounded-full hover:bg-charcoal-700 transition-all duration-300 shadow-lg"
          >
            Contact Support
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
