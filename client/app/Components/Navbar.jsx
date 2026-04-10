'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Verified paths: Going up two levels to reach the lib folder in your client directory
import { getCartCount } from '../../lib/cart';
import api from '../../lib/api';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [navigation, setNavigation] = useState([{ name: 'Home', href: '/' }]);
  
  const pathname = usePathname();

  // Logic: Transparent only on Home page ('/') when at the very top of the page
  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const updateCart = () => setCartCount(getCartCount());

    const loadCategories = async () => {
      try {
        // Calling the getCategories method from your ApiClient class
        const categories = await api.getCategories(true);
        if (categories && Array.isArray(categories)) {
          setNavigation([
            { name: 'Home', href: '/' },
            ...categories.map(cat => ({ 
              name: cat.name, 
              href: `/category/${cat.slug}` 
            }))
          ]);
        }
      } catch (err) {
        console.error("Navbar API Error:", err);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', updateCart);
    
    // Initial checks
    handleScroll();
    updateCart();
    loadCategories();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, [pathname]);

  // Close mobile menu when changing pages
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Dynamic classes for the transparency effect
  const navBg = isTransparent 
    ? "bg-transparent py-6 text-white" 
    : "bg-white shadow-md py-3 text-black";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        {/* Logo - Applies brightness/invert filter to turn black logo white when transparent */}
        <Link href="/" className="flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="Adorn Steps" 
            className={`h-10 w-auto transition-all duration-300 ${isTransparent ? 'brightness-0 invert' : ''}`} 
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[11px] font-bold uppercase tracking-[0.2em] hover:text-rose-500 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Utility Icons */}
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="p-2 relative">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div className={`lg:hidden fixed inset-0 z-[110] bg-white transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8">
          <div className="flex justify-end mb-12">
            <button onClick={() => setIsMenuOpen(false)}><X size={32} className="text-black" /></button>
          </div>
          <div className="flex flex-col space-y-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-3xl font-black uppercase text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}