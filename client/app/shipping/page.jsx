'use client';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Truck, Package, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-taupe-100 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Truck className="w-16 h-16 mx-auto mb-6 text-terracotta-500" />
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-charcoal-800 mb-6">
            Shipping Information
          </h1>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            Fast, reliable delivery to your doorstep
          </p>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-12 text-center">
            Shipping Options
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* In City Shipping */}
            <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-product transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <Package className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-charcoal-800 mb-3">In City Shipping</h3>
              <p className="text-3xl font-bold text-terracotta-500 mb-4">Rs 599</p>
              <ul className="space-y-3 text-charcoal-600">
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>5-7 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>In Karachi</span>
                </li>
                </ul>
            </div>

            {/* Outside City Shipping */}
            <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-product transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-6">
                <Clock className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-charcoal-800 mb-3">Outside City Shipping</h3>
              <p className="text-3xl font-bold text-terracotta-500 mb-4">Rs 2,499</p>
              <ul className="space-y-3 text-charcoal-600">
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>5-7 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Outside Karachi</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Processing Time */}
          <div className="bg-gradient-to-r from-taupe-50 to-cream-100 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-semibold text-charcoal-800 mb-4">Order Processing Time</h3>
            <p className="text-charcoal-600 leading-relaxed mb-4">
              All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. 
              If we experience a high volume of orders, shipments may be delayed by a few days. Please allow additional days 
              in transit for delivery.
            </p>
            <p className="text-charcoal-600 leading-relaxed">
              You will receive a shipping confirmation email with tracking information once your order has shipped.
            </p>
          </div>

          {/* Shipping Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <MapPin className="w-12 h-12 text-terracotta-500 mb-4" />
              <h3 className="text-2xl font-semibold text-charcoal-800 mb-4">Domestic Shipping</h3>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                We ship to all 50 states in the United States, including Alaska and Hawaii. Please note that shipping 
                to Alaska and Hawaii may take additional time.
              </p>
              <ul className="space-y-2 text-charcoal-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-terracotta-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Continental US: 5-7 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-terracotta-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Alaska & Hawaii: 7-10 business days</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-card">
              <MapPin className="w-12 h-12 text-terracotta-500 mb-4" />
              <h3 className="text-2xl font-semibold text-charcoal-800 mb-4">International Shipping</h3>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                We currently ship to select international destinations. International shipping rates and delivery times 
                vary by location.
              </p>
              <ul className="space-y-2 text-charcoal-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-terracotta-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Canada: 7-14 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-terracotta-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>International: 10-21 business days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-8">Important Information</h2>
          
          <div className="space-y-6 text-charcoal-600 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Order Tracking</h3>
              <p>
                Once your order has shipped, you will receive an email with a tracking number. You can track your 
                package at any time through our website or the carrier's tracking page.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Shipping Damage</h3>
              <p>
                If your order arrives damaged, please contact us within 48 hours of delivery with photos of the 
                damage. We will work with you to resolve the issue promptly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Lost or Stolen Packages</h3>
              <p>
                Adorn Steps is not responsible for lost or stolen packages confirmed to be delivered to the address 
                entered for an order. Upon inquiry, we will confirm delivery to the address provided, date of delivery, 
                tracking information, and shipping carrier information for the customer to investigate.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Address Changes</h3>
              <p>
                If you need to change your shipping address, please contact us immediately. Once an order has been 
                shipped, we cannot modify the shipping address.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
