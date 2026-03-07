'use client';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-taupe-100 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-terracotta-500" />
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-charcoal-800 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-charcoal-500 mt-4">
            Last Updated: January 2024
          </p>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-8 text-center">
            Privacy at a Glance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-cream-50 rounded-2xl">
              <Lock className="w-12 h-12 mx-auto mb-4 text-terracotta-500" />
              <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Secure Data</h3>
              <p className="text-charcoal-600">
                We use industry-standard encryption to protect your personal information.
              </p>
            </div>
            
            <div className="text-center p-6 bg-cream-50 rounded-2xl">
              <Eye className="w-12 h-12 mx-auto mb-4 text-terracotta-500" />
              <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Transparency</h3>
              <p className="text-charcoal-600">
                We're clear about what data we collect and how we use it.
              </p>
            </div>
            
            <div className="text-center p-6 bg-cream-50 rounded-2xl">
              <UserCheck className="w-12 h-12 mx-auto mb-4 text-terracotta-500" />
              <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Your Control</h3>
              <p className="text-charcoal-600">
                You have the right to access, modify, or delete your personal data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Introduction */}
            <div>
              <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Introduction</h2>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                At Adorn Steps, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
                website or make a purchase from us.
              </p>
              <p className="text-charcoal-600 leading-relaxed">
                By using our website, you agree to the collection and use of information in accordance with this policy. If you 
                do not agree with our policies and practices, please do not use our website.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-terracotta-500" />
                <h2 className="text-3xl font-display font-semibold text-charcoal-800">Information We Collect</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <h3 className="text-xl font-semibold text-charcoal-800 mb-3">Personal Information</h3>
                  <p className="text-charcoal-600 mb-3">
                    We collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="space-y-2 text-charcoal-600">
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>Create an account</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>Make a purchase</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>Subscribe to our newsletter</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>Contact our customer service</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>Participate in surveys or promotions</span>
                    </li>
                  </ul>
                  <p className="text-charcoal-600 mt-3">
                    This may include: name, email address, phone number, billing address, shipping address, and payment information.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-card">
                  <h3 className="text-xl font-semibold text-charcoal-800 mb-3">Automatically Collected Information</h3>
                  <p className="text-charcoal-600 mb-3">
                    When you visit our website, we automatically collect certain information about your device, including:
                  </p>
                  <ul className="space-y-2 text-charcoal-600">
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>IP address and browser type</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>Device information and operating system</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>Pages visited and time spent on pages</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-terracotta-500">•</span>
                      <span>Referring website and search terms</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">How We Use Your Information</h2>
              <div className="bg-gradient-to-br from-taupe-50 to-cream-100 rounded-xl p-6">
                <p className="text-charcoal-600 mb-4">We use the information we collect to:</p>
                <ul className="space-y-3 text-charcoal-600">
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">✓</span>
                    <span>Process and fulfill your orders</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">✓</span>
                    <span>Send order confirmations and shipping updates</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">✓</span>
                    <span>Provide customer support</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">✓</span>
                    <span>Send marketing communications (with your consent)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">✓</span>
                    <span>Improve our website and products</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">✓</span>
                    <span>Prevent fraud and enhance security</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-terracotta-500">✓</span>
                    <span>Comply with legal obligations</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Information Sharing */}
            <div>
              <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Information Sharing</h2>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the 
                following circumstances:
              </p>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 shadow-card">
                  <h3 className="font-semibold text-charcoal-800 mb-2">Service Providers</h3>
                  <p className="text-charcoal-600">
                    We share information with trusted third-party service providers who help us operate our business (e.g., payment 
                    processors, shipping companies, email service providers).
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-card">
                  <h3 className="font-semibold text-charcoal-800 mb-2">Legal Requirements</h3>
                  <p className="text-charcoal-600">
                    We may disclose information if required by law or to protect our rights, property, or safety.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-card">
                  <h3 className="font-semibold text-charcoal-800 mb-2">Business Transfers</h3>
                  <p className="text-charcoal-600">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.
                  </p>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and 
                understand user preferences. You can control cookie settings through your browser, but disabling cookies may limit 
                certain features of our website.
              </p>
            </div>

            {/* Data Security */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-8 h-8 text-terracotta-500" />
                <h2 className="text-3xl font-display font-semibold text-charcoal-800">Data Security</h2>
              </div>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information from 
                unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet 
                or electronic storage is 100% secure.
              </p>
              <div className="bg-gradient-to-r from-taupe-50 to-cream-100 rounded-xl p-6">
                <p className="text-charcoal-600">
                  <strong>Security measures include:</strong> SSL encryption, secure payment processing, regular security audits, 
                  and restricted access to personal information.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Your Rights</h2>
              <p className="text-charcoal-600 leading-relaxed mb-4">You have the following rights regarding your personal information:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-card">
                  <h3 className="font-semibold text-charcoal-800 mb-2">Access</h3>
                  <p className="text-charcoal-600 text-sm">
                    Request a copy of the personal information we hold about you
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-card">
                  <h3 className="font-semibold text-charcoal-800 mb-2">Correction</h3>
                  <p className="text-charcoal-600 text-sm">
                    Request correction of inaccurate or incomplete information
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-card">
                  <h3 className="font-semibold text-charcoal-800 mb-2">Deletion</h3>
                  <p className="text-charcoal-600 text-sm">
                    Request deletion of your personal information
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-card">
                  <h3 className="font-semibold text-charcoal-800 mb-2">Opt-Out</h3>
                  <p className="text-charcoal-600 text-sm">
                    Unsubscribe from marketing communications at any time
                  </p>
                </div>
              </div>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Children's Privacy</h2>
              <p className="text-charcoal-600 leading-relaxed">
                Our website is not intended for children under the age of 13. We do not knowingly collect personal information 
                from children under 13. If you believe we have collected information from a child under 13, please contact us 
                immediately.
              </p>
            </div>

            {/* Changes to Policy */}
            <div>
              <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-4">Changes to This Policy</h2>
              <p className="text-charcoal-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy 
                on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-taupe-100 to-blush-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-8 h-8 text-terracotta-500" />
                <h2 className="text-2xl font-display font-semibold text-charcoal-800">Contact Us</h2>
              </div>
              <p className="text-charcoal-600 leading-relaxed mb-6">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="space-y-2 text-charcoal-700">
                <p><strong>Email:</strong> privacy@adornsteps.com</p>
                <p><strong>Phone:</strong> +1 (234) 567-890</p>
                <p><strong>Address:</strong> 123 Fashion Street, Style City, SC 12345</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
