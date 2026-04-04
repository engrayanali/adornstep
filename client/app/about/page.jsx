'use client';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Heart, Award, Sparkles, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-taupe-100 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-charcoal-800 mb-6">
            About Adorn Steps
          </h1>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
            Crafting elegant, comfortable footwear for the modern woman who values both style and substance.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-charcoal-800 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-charcoal-600 leading-relaxed">
                <p>
                  Founded with a passion for creating footwear that doesn't compromise between comfort and style, 
                  Adorn Steps began as a dream to revolutionize women's footwear. We believed that every woman 
                  deserves shoes that make her feel confident, comfortable, and beautiful.
                </p>
                <p>
                  Our journey started in a small studio, where we spent countless hours perfecting designs, 
                  selecting the finest materials, and ensuring every pair meets our exacting standards. Today, 
                  we're proud to serve women who appreciate quality craftsmanship and timeless elegance.
                </p>
                <p>
                  Each pair of Adorn Steps shoes is thoughtfully designed with attention to detail, combining 
                  contemporary aesthetics with traditional craftsmanship. We source premium materials and work 
                  with skilled artisans who share our commitment to excellence.
                </p>
              </div>
            </div>
            <div className="relative">
              {/* Main image */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-product">
                <img 
                  src="/about1.png" 
                  alt="Our Story" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating accent image */}
              <div className="absolute -bottom-6 -left-6 w-2/5 aspect-square rounded-xl overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src="/about2.png" 
                  alt="Adorn Steps Craftsmanship" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative dot pattern */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-terracotta-100 rounded-full opacity-60 -z-10"></div>
              <div className="absolute -bottom-10 right-8 w-16 h-16 bg-blush-200 rounded-full opacity-50 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-charcoal-800 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-charcoal-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quality */}
            <div className="text-center p-8 bg-cream-50 rounded-2xl hover:shadow-product transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-terracotta-400 to-blush-500 rounded-full flex items-center justify-center">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-3">Quality First</h3>
              <p className="text-charcoal-600 leading-relaxed">
                We never compromise on materials or craftsmanship. Every pair is made to last.
              </p>
            </div>

            {/* Comfort */}
            <div className="text-center p-8 bg-cream-50 rounded-2xl hover:shadow-product transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-terracotta-400 to-blush-500 rounded-full flex items-center justify-center">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-3">Comfort Focused</h3>
              <p className="text-charcoal-600 leading-relaxed">
                Designed with ergonomics in mind, so you can wear them all day without discomfort.
              </p>
            </div>

            {/* Style */}
            <div className="text-center p-8 bg-cream-50 rounded-2xl hover:shadow-product transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-terracotta-400 to-blush-500 rounded-full flex items-center justify-center">
                <Sparkles className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-3">Timeless Style</h3>
              <p className="text-charcoal-600 leading-relaxed">
                Classic designs that transcend trends, staying beautiful season after season.
              </p>
            </div>

            {/* Community */}
            <div className="text-center p-8 bg-cream-50 rounded-2xl hover:shadow-product transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-terracotta-400 to-blush-500 rounded-full flex items-center justify-center">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-800 mb-3">Customer Care</h3>
              <p className="text-charcoal-600 leading-relaxed">
                Your satisfaction is our priority. We're here to help every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-r from-taupe-200 to-blush-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-charcoal-800 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-charcoal-700 leading-relaxed mb-8">
            To empower women through footwear that combines exceptional comfort with sophisticated style, 
            enabling them to step confidently through every moment of their day.
          </p>
          <p className="text-lg text-charcoal-600 leading-relaxed">
            We believe that the right pair of shoes can transform not just an outfit, but your entire day. 
            That's why we're committed to creating footwear that supports you in every sense—from the first 
            step in the morning to the last step at night.
          </p>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              {/* Two stacked images layout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-product mt-8">
                  <img 
                    src="/about2.png" 
                    alt="Craftsmanship" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-product">
                  <img 
                    src="/about1.png" 
                    alt="Our Collection" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-taupe-200 rounded-full opacity-50 -z-10"></div>
              <div className="absolute -top-4 right-4 w-14 h-14 bg-terracotta-100 rounded-full opacity-60 -z-10"></div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-charcoal-800 mb-6">
                Exceptional Craftsmanship
              </h2>
              <div className="space-y-4 text-charcoal-600 leading-relaxed">
                <p>
                  Every pair of Adorn Steps shoes is the result of meticulous attention to detail and expert 
                  craftsmanship. We work with skilled artisans who bring decades of experience to every stitch, 
                  cut, and finish.
                </p>
                <p>
                  From selecting premium leathers and sustainable materials to the final quality check, each 
                  step of our process is carefully monitored to ensure you receive footwear that exceeds 
                  expectations.
                </p>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-terracotta-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Hand-selected premium materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-terracotta-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Ergonomically designed for all-day comfort</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-terracotta-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Quality tested for durability and style</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-terracotta-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Sustainable and ethical production practices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
