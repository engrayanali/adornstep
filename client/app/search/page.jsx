'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import ProductGrid from '../Components/ProductGrid';
import LoadingSpinner from '../Components/LoadingSpinner';
import { api } from '../lib/api';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const data = await api.searchProducts(query);
        
        // Fully formatted data to handle missing folder paths
        const formattedProducts = data.map(product => ({
          ...product,
          images: product.images.map(img => {
            let path = img.image_url || "";
            
            // Check if the path is just a filename (no slashes)
            // If it is, we force the correct directory prefix
            if (path && !path.includes('/')) {
              path = `uploads/products/${path}`;
            }

            // Clean the path (remove leading slash if exists to avoid double slash)
            const cleanPath = path.replace(/^\//, '');

            return {
              ...img,
              image_url: path.startsWith('http') 
                ? path 
                : `https://api.adornstep.com/${cleanPath}`
            };
          })
        }));

        console.log("Debug Search Data:", formattedProducts); // Check your console to see the new URLs
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-8">
        {query ? `Showing results for "${query}"` : 'Enter a search query'}
      </p>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">No products found</p>
          <p className="text-gray-400">Try different keywords</p>
        </div>
      )}
    </section>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <SearchResults />
      </Suspense>
      <Footer />
    </div>
  );
}