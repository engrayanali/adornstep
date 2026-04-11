'use client';

import { useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Mail, Phone, MapPin, Send, User, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-taupe-100 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-charcoal-800 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-charcoal-600 max-w-2xl mx-auto">
            Have a question or need assistance? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-display font-semibold text-charcoal-800 mb-6">
                  Contact Information
                </h2>
                <p className="text-charcoal-600 leading-relaxed mb-8">
                  Whether you have questions about our products, need styling advice, or want to know more about our brand, 
                  our team is here to help. Reach out to us and we'll respond as soon as possible.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">

                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-card hover:shadow-product transition-all duration-300">
                  <div className="p-3 bg-terracotta-100 rounded-lg">
                    <Phone className="text-terracotta-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-800 mb-2">Call Us</h3>
                    <a href="tel:+1234567890" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                      +92 123 4567890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-card hover:shadow-product transition-all duration-300">
                  <div className="p-3 bg-terracotta-100 rounded-lg">
                    <Mail className="text-terracotta-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-800 mb-2">Email Us</h3>
                    <a href="mailto:info@adornsteps.com" className="text-charcoal-600 hover:text-terracotta-600 transition-colors">
                      info@adornstep.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="p-6 bg-gradient-to-br from-taupe-50 to-cream-100 rounded-xl">
                <h3 className="font-semibold text-charcoal-800 mb-4">Business Hours</h3>
                <div className="space-y-2 text-charcoal-600">
                  <p className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium">Closed</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-product p-8 lg:p-10">
              <h2 className="text-2xl font-display font-semibold text-charcoal-800 mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 mb-2">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-400" size={20} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-taupe-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-200 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-400" size={20} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-taupe-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-200 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-charcoal-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-400" size={20} />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-taupe-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-200 transition-all"
                      placeholder="+92 123 4567890"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-charcoal-700 mb-2">
                    Your Message *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-taupe-400" size={20} />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full pl-12 pr-4 py-3 border border-taupe-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-200 transition-all resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                </div>

                {/* Status Message */}
                {status.message && (
                  <div className={`p-4 rounded-lg ${
                    status.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {status.message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-charcoal-800 text-white py-4 px-6 rounded-lg font-semibold hover:bg-charcoal-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
