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
        
        const formattedProducts = data.map(product => ({
          ...product,
          images: product.images.map(img => {
            let path = img.image_url || "";
            
            if (path && !path.includes('/')) {
              path = `uploads/products/${path}`;
            }

            const cleanPath = path.replace(/^\//, '');

            return {
              ...img,
              image_url: path.startsWith('http') 
                ? path 
                : `https://api.adornstep.com/${cleanPath}`
            };
          })
        }));

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
    /* Updated px-2 on mobile (down from px-4) to increase available 
       horizontal space for the product cards. 
    */
    <section className="py-12 px-2 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-8">
        {query ? `Showing results for "${query}"` : 'Enter a search query'}
      </p>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : products.length > 0 ? (
        /* Layout Logic:
           - grid-cols-1: Single column on mobile (full width).
           - sm:grid-cols-2: Two columns for tablets.
           - lg:grid-cols-4: Four columns for desktop.
           - gap-4: Space between cards.
        */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {products.map((product) => (
            <div key={product.id} className="w-full">
              {/* We pass a single product inside an array if your 
                  ProductGrid is designed to handle an array of items. 
              */}
              <ProductGrid products={[product]} />
            </div>
          ))}
        </div>
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