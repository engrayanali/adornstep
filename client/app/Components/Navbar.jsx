'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import Link from 'next/link';
import { getCartCount } from '../lib/cart';
import api from '../lib/api';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [navigation, setNavigation] = useState([{ name: 'Home', href: '/' }]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const updateCart = () => {
      setCartCount(getCartCount());
    };

    const loadCategories = async () => {
      try {
        const categories = await api.getCategories(true);
        const navItems = [
          { name: 'Home', href: '/' },
          ...categories.map(cat => ({
            name: cat.name,
            href: `/category/${cat.slug}`
          }))
        ];
        setNavigation(navItems);
      } catch (error) {
        console.error('Error loading categories:', error);
        setNavigation([{ name: 'Home', href: '/' }]);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', updateCart);
    updateCart();
    loadCategories();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isScrolled 
          ? 'bg-white/98 backdrop-blur-md shadow-soft py-3' 
          : 'bg-white/95 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between w-full gap-8">
          {/* Logo - Left Corner */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Adorn Steps" 
              className="h-12 md:h-14 lg:h-16 w-auto object-contain hover:opacity-90 transition-opacity duration-300"
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center flex-1 justify-center gap-8 xl:gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium tracking-wider uppercase text-charcoal-700 hover:text-terracotta-500 transition-colors duration-300 relative group whitespace-nowrap"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Right Icons - Right Corner with larger gaps */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Search - Desktop & Tablet with responsive input */}
            <div className="hidden md:flex items-center gap-2">
              {isSearchOpen ? (
                <div className="flex items-center gap-2 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-48 lg:w-64 xl:w-80 px-4 py-2 rounded-full border border-taupe-300 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-200 transition-all duration-300 text-sm"
                    autoFocus
                  />
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2.5 hover:bg-cream-200 rounded-full transition-all duration-300 group"
                    aria-label="Close search"
                  >
                    <X size={20} className="text-charcoal-700 group-hover:text-terracotta-500 transition-colors" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 hover:bg-cream-200 rounded-full transition-all duration-300 group"
                  aria-label="Search"
                >
                  <Search size={20} className="text-charcoal-700 group-hover:text-terracotta-500 transition-colors" />
                </button>
              )}
            </div>
            
            {/* Cart */}
            <Link 
              href="/cart" 
              className="p-2.5 hover:bg-cream-200 rounded-full transition-all duration-300 relative group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} className="text-charcoal-700 group-hover:text-terracotta-500 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 hover:bg-cream-200 rounded-full transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} className="text-charcoal-800" /> : <Menu size={24} className="text-charcoal-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pt-6 pb-4 border-t border-cream-300 mt-4 animate-fade-in">
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-charcoal-700 hover:text-terracotta-500 hover:bg-cream-200 px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm tracking-wide"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile-only additional links */}
              <div className="pt-4 mt-4 border-t border-cream-300 space-y-1">
                <button className="w-full text-left text-charcoal-700 hover:text-terracotta-500 hover:bg-cream-200 px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm tracking-wide flex items-center gap-2">
                  <Search size={18} /> Search
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}