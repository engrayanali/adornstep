'use client';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { FileText, AlertCircle, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-taupe-100 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-6 text-terracotta-500" />
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-charcoal-800 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            Please read these terms carefully before using our services
          </p>
          <p className="text-sm text-charcoal-500 mt-4">
            Last Updated: January 2024
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Agreement */}
            <div>
              <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Agreement to Terms</h2>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                By accessing or using the Adorn Steps website, you agree to be bound by these Terms of Service and all 
                applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from 
                using or accessing this site.
              </p>
              <div className="bg-gradient-to-r from-taupe-50 to-cream-100 rounded-xl p-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-6 h-6 text-terracotta-500 flex-shrink-0 mt-0.5" />
                  <p className="text-charcoal-600">
                    <strong>Important:</strong> These terms may be updated at any time. Continued use of the website 
                    following any changes indicates your acceptance of the new terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Use of Website */}
            <div>
              <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Use of Website</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <h3 className="text-xl font-semibold text-charcoal-800 mb-3">Permitted Use</h3>
                  <p className="text-charcoal-600 mb-3">You may use our website for:</p>
                  <ul className="space-y-2 text-charcoal-600">
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>Browsing and purchasing products</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>Creating and managing your account</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>Accessing customer support</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>Receiving promotional information (with consent)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-card">
                  <h3 className="text-xl font-semibold text-charcoal-800 mb-3">Prohibited Activities</h3>
                  <p className="text-charcoal-600 mb-3">You may NOT:</p>
                  <ul className="space-y-2 text-charcoal-600">
                    <li className="flex gap-2">
                      <span className="text-red-500">✕</span>
                      <span>Use the website for any unlawful purpose</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500">✕</span>
                      <span>Attempt to gain unauthorized access to our systems</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500">✕</span>
                      <span>Transmit viruses or malicious code</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500">✕</span>
                      <span>Copy, reproduce, or distribute our content without permission</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500">✕</span>
                      <span>Impersonate another person or entity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Account Responsibilities */}
            <div>
              <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Account Responsibilities</h2>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                When you create an account with us, you are responsible for:
              </p>
              <div className="bg-gradient-to-br from-taupe-50 to-cream-100 rounded-xl p-6">
                <ul className="space-y-3 text-charcoal-600">
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">✓</span>
                    <span>Maintaining the confidentiality of your password</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">✓</span>
                    <span>Providing accurate and up-to-date information</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">✓</span>
                    <span>All activities that occur under your account</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">✓</span>
                    <span>Notifying us immediately of any unauthorized use</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Product Information */}
            <div>
              <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Product Information & Pricing</h2>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                We strive to provide accurate product descriptions and pricing. However:
              </p>
              <ul className="space-y-3 text-charcoal-600">
                <li className="flex gap-2">
                  <span className="text-terracotta-500">•</span>
                  <span>We do not warrant that product descriptions or other content is accurate, complete, or error-free</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-terracotta-500">•</span>
                  <span>Prices are subject to change without notice</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-terracotta-500">•</span>
                  <span>We reserve the right to limit quantities or refuse orders</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-terracotta-500">•</span>
                  <span>Colors shown may vary slightly due to screen settings</span>
                </li>
              </ul>
            </div>

            {/* Orders & Payment */}
            <div>
              <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Orders & Payment</h2>
              <div className="bg-white rounded-xl p-6 shadow-card">
                <p className="text-charcoal-600 leading-relaxed mb-4">
                  By placing an order, you agree to:
                </p>
                <ul className="space-y-3 text-charcoal-600">
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">1.</span>
                    <span>Provide current, complete, and accurate purchase information</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">2.</span>
                    <span>Pay all charges at the prices in effect when your order is placed</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">3.</span>
                    <span>Accept our right to cancel orders for any reason, including stock unavailability</span>
                  </li>
                </ul>
                <p className="text-charcoal-600 leading-relaxed mt-4">
                  We reserve the right to refuse or cancel any order at our discretion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
