'use client';

import { Star, Quote } from 'lucide-react';

export default function CustomerReviews() {
  const reviews = [
    {
      id: 1,
      name: 'Sarah M.',
      rating: 5,
      text: 'The most comfortable slippers I\'ve ever owned. The quality is exceptional and they look beautiful!',
      image: null,
      date: 'March 2024'
    },
    {
      id: 2,
      name: 'Emma L.',
      rating: 5,
      text: 'I love how elegant these are. Perfect for both lounging at home and casual outings.',
      image: null,
      date: 'March 2024'
    },
    {
      id: 3,
      name: 'Olivia K.',
      rating: 5,
      text: 'Amazing customer service and the products are even better than the photos. Highly recommend!',
      image: null,
      date: 'February 2024'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-charcoal-800 mb-4 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-lg text-charcoal-600 font-light max-w-2xl mx-auto">
            Join thousands of satisfied customers who've found their perfect pair
          </p>
          <div className="w-20 h-0.5 bg-terracotta-500 mx-auto mt-6"></div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-cream-50 p-8 rounded-sm shadow-card hover:shadow-product transition-all duration-300 relative"
            >
              {/* Quote Icon */}
              <Quote size={32} className="text-terracotta-500/20 absolute top-6 right-6" />
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < review.rating
                        ? 'fill-terracotta-500 text-terracotta-500'
                        : 'text-cream-300'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-charcoal-700 font-light leading-relaxed mb-6 italic">
                "{review.text}"
              </p>

              {/* Reviewer Info */}
              <div className="pt-4 border-t border-cream-300">
                <p className="font-medium text-charcoal-800">{review.name}</p>
                <p className="text-sm text-charcoal-500 font-light">{review.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-cream-300">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-display font-semibold text-terracotta-500 mb-2">
              10K+
            </h3>
            <p className="text-charcoal-600 font-light">Happy Customers</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-display font-semibold text-terracotta-500 mb-2">
              4.9
            </h3>
            <p className="text-charcoal-600 font-light">Average Rating</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-display font-semibold text-terracotta-500 mb-2">
              100%
            </h3>
            <p className="text-charcoal-600 font-light">Quality Guarantee</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-display font-semibold text-terracotta-500 mb-2">
              24/7
            </h3>
            <p className="text-charcoal-600 font-light">Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
