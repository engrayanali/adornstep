'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ProductCard from '@/Components/ProductCard'; // Ensure this matches your file structure
import api from '@/lib/api';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        if (query) {
          const data = await api.searchProducts(query);
          setProducts(data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-semibold text-gray-900">
              {query ? `Showing results for "${query}"` : 'All Products'}
            </h1>
            <p className="text-gray-500 mt-2">
              {products.length} {products.length === 1 ? 'item' : 'items'} found
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 h-80 rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                /* The Fix: Grid System */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">No matches found</h3>
                  <p className="mt-2 text-gray-500">Try checking your spelling or use more general terms.</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="mt-6 text-pink-500 font-semibold hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}