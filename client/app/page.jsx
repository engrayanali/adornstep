'use client';

import { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import HeroBanner from './Components/HeroBanner';
import ProductGrid from './Components/ProductGrid';
import FeaturedCategories from './Components/FeaturedCategories';
import LifestyleSection from './Components/LifestyleSection';
import CustomerReviews from './Components/CustomerReviews';
import Footer from './Components/Footer';
import api from './lib/api';
import Link from 'next/link';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [featured, arrivals, categoriesData] = await Promise.all([
        api.getProducts({ is_featured: true, limit: 8 }),
        api.getProducts({ is_new_arrival: true, limit: 8 }),
        api.getCategories(true), // Only get active categories
      ]);
      
      setFeaturedProducts(featured);
      setNewArrivals(arrivals);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <HeroBanner />

      {/* Featured Categories Section */}
      <FeaturedCategories categories={categories} loading={loading} />

      {/* Featured Products */}
      {!loading && featuredProducts.length > 0 && (
        <ProductGrid products={featuredProducts} title="Featured Collection" />
      )}

      {/* Lifestyle Section */}
      <LifestyleSection />

      {/* New Arrivals */}
      {!loading && newArrivals.length > 0 && (
        <ProductGrid products={newArrivals} title="New Arrivals" />
      )}

      {/* Customer Reviews */}
      <CustomerReviews />

      <Footer />
    </div>
  );
}
