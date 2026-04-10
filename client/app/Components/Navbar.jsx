'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCartCount } from '../../lib/cart';
import api from '../../lib/api';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [desktopSearchQuery, setDesktopSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [navigation, setNavigation] = useState([{ name: 'Home', href: '/' }]);
  
  const router = useRouter();
  const pathname = usePathname();

  // Logic: Transparent ONLY on Home page AND when scroll is at the top
  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const updateCart = () => setCartCount(getCartCount());

    const loadCategories = async () => {
      try {
        const categories = await api.getCategories(true);
        if (categories && categories.length > 0) {
          setNavigation([
            { name: 'Home', href: '/' },
            ...categories.map(cat => ({ name: cat.name, href: `/category/${cat.slug}` }))
          ]);
        }
      } catch (err) {
        console.error("Navbar Categories Error:", err);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', updateCart);
    
    // Initial sync
    handleScroll();
    updateCart();
    loadCategories();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  // Close menus when navigation occurs
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e, query, setQuery) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  // Dynamic Styles
  const navBg = isTransparent ? 'bg-transparent py-6' : 'bg-white shadow-md py-3';
  const textColor = isTransparent ? 'text-white' : 'text-gray-900';
  const iconColor = isTransparent ? 'text-white' : 'text-gray-700';
  const logoStyle = isTransparent ? 'brightness-0 invert' : '';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Adorn Steps" 
              className={`h-10 md:h-12 w-auto transition-all duration-300 ${logoStyle}`} 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:text-rose-500 ${textColor}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search Toggle */}
            <div className="hidden md:block relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className={`p-2 rounded-full hover:bg-black/5 transition-colors ${iconColor}`}
              >
                <Search size={20} />
              </button>
            </div>

            {/* Shopping Cart */}
            <Link 
              href="/cart" 
              className={`p-2 rounded-full hover:bg-black/5 transition-colors relative ${iconColor}`}
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`lg:hidden p-2 rounded-full ${iconColor}`}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Desktop Search Dropdown */}
        {isSearchOpen && (
          <div className="hidden md:block absolute top-full left-0 w-full bg-white shadow-2xl p-6 animate-in slide-in-from-top duration-300">
            <form onSubmit={(e) => handleSearch(e, desktopSearchQuery, setDesktopSearchQuery)} className="max-w-3xl mx-auto flex items-center border-b-2 border-gray-100">
              <input
                autoFocus
                type="text"
                value={desktopSearchQuery}
                onChange={(e) => setDesktopSearchQuery(e.target.value)}
                placeholder="Search for footwear..."
                className="w-full py-3 text-2xl font-bold outline-none text-gray-900"
              />
              <button type="submit" className="text-gray-400 hover:text-rose-500"><Search size={24} /></button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Navigation */}
      <div className={`lg:hidden fixed inset-0 z-[90] bg-white transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-24 px-8">
          <form onSubmit={(e) => handleSearch(e, mobileSearchQuery, setMobileSearchQuery)} className="mb-10">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border-b-2 border-gray-100 py-4 text-xl font-bold outline-none text-gray-900"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
            />
          </form>
          
          <div className="space-y-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-3xl font-black text-gray-900 uppercase tracking-tighter hover:text-rose-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="mt-auto pb-10">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Adorn Steps © 2026</p>
          </div>
        </div>
      </div>
    </nav>
  );
}