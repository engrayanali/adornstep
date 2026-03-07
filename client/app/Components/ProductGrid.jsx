'use client';

import ProductCard from './ProductCard';

export default function ProductGrid({ products, title, subtitle }) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {title && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-semibold text-charcoal-800 mb-4 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-charcoal-600 font-light max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
            <div className="w-20 h-0.5 bg-terracotta-500 mx-auto mt-6"></div>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-charcoal-500 text-lg font-light">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
