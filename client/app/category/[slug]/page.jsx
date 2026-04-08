'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../Components/Navbar';
import ProductCard from '../../Components/ProductCard';
import Footer from '../../Components/Footer';
import LoadingScreen from '../../Components/LoadingScreen';
import { ChevronRight, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import api from '../../lib/api';

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedSizes, setSelectedSizes] = useState([]);


  const sizes = ['5', '6', '7', '8', '9', '10', '11'];

  useEffect(() => {
    if (params.slug) {
      loadCategoryData();
    }
  }, [params.slug]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, sortBy, priceRange, selectedSizes]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      
      // Get category details
      const categoriesData = await api.getCategories();
      const categoryData = categoriesData.find(cat => cat.slug === params.slug);
      setCategory(categoryData);

      // Get products
      let productsData = [];
      if (params.slug === 'new-arrivals') {
        productsData = await api.getProducts({ is_new_arrival: true, limit: 100 });
      } else if (params.slug === 'limited-edition') {
        productsData = await api.getProducts({ is_limited_edition: true, limit: 100 });
      } else if (params.slug === 'spring-collection') {
        productsData = await api.getProducts({ category_id: categoryData.id, limit: 100 });
      } else {
        productsData = await api.getProducts({ category_id: categoryData.id, limit: 100 });
      }
      
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...products];

    // Apply price filter
    if (priceRange.min !== '' || priceRange.max !== '') {
      result = result.filter(product => {
        const price = product.discount_price || product.price;
        const min = priceRange.min === '' ? 0 : parseFloat(priceRange.min);
        const max = priceRange.max === '' ? Infinity : parseFloat(priceRange.max);
        return price >= min && price <= max;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };


  const clearAllFilters = () => {
    setSortBy('featured');
    setPriceRange({ min: '', max: '' });
    setSelectedSizes([]);
  };

  const activeFiltersCount = 
    (priceRange.min !== '' || priceRange.max !== '' ? 1 : 0) +
    selectedSizes.length;

  if (loading) {
    return <LoadingScreen message="Loading products..." />;
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="bg-gradient-to-b from-white to-cream-50 border-b border-taupe-200">
          <div className="max-w-[1920px] mx-auto px-6 lg:px-12 xl:px-20 py-8">
            <div className="flex items-center gap-2 text-sm text-taupe-600">
              <a href="/" className="hover:text-gray-800 transition-colors">Home</a>
              <ChevronRight size={16} />
              <span className="text-gray-800 font-medium">{category?.name || 'Category'}</span>
            </div>
          </div>
        </div>

        {/* Filters & Products */}
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 xl:px-20 py-12">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-taupe-200 rounded-full hover:border-charcoal-400 transition-all shadow-sm"
              >
                <SlidersHorizontal size={18} className="text-charcoal-700" />
                <span className="font-medium text-charcoal-800">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-terracotta-500 text-white text-xs rounded-full px-2 py-0.5">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <span className="text-taupe-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-taupe-600">Sort by:</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-4 pr-9 py-2.5 bg-white border border-taupe-200 rounded-full text-charcoal-800 font-medium focus:outline-none focus:ring-2 focus:ring-terracotta-500 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                  <option value="newest">Newest First</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-4 h-4 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Sidebar (Mobile Overlay / Desktop Sidebar) */}
          {showFilters && (
            <>
              {/* Mobile Overlay */}
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
              
              {/* Filter Panel */}
              <div className={`
                fixed lg:static top-0 right-0 h-full lg:h-auto w-80 lg:w-auto
                bg-white lg:bg-transparent lg:mb-8 z-50 lg:z-auto
                overflow-y-auto lg:overflow-visible
                transition-transform lg:transition-none
                ${showFilters ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              `}>
                <div className="lg:hidden flex items-center justify-between p-6 border-b">
                  <h3 className="text-lg font-heading text-gray-900">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 lg:p-0 lg:grid lg:grid-cols-3 lg:gap-6">
                  {/* Price Range */}
                  <div className="bg-white rounded-xl border border-gray-500 p-6 mb-6 lg:mb-0">
                    <h3 className="font-heading text-lg text-gray-900 mb-4">Price Range</h3>
                    <div className="flex gap-4">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                      />
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="bg-white rounded-xl border border-gray-500 p-6 mb-6 lg:mb-0">
                    <h3 className="font-heading text-lg text-gray-900 mb-4">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            selectedSizes.includes(size)
                              ? 'border-gray-800 bg-white text-gray-700'
                              : 'border-gray-500 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <div className="p-6 lg:p-0 lg:mt-6">
                    <button
                      onClick={clearAllFilters}
                      className="w-full lg:w-auto px-6 py-2.5 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-taupe-200 p-16 text-center">
              <p className="text-xl text-taupe-600 mb-4">No products found matching your filters.</p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
