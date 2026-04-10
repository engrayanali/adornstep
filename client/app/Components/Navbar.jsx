'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCartCount } from '../lib/cart';
import api from '../lib/api';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [desktopSearchQuery, setDesktopSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [navigation, setNavigation] = useState([{ name: 'Home', href: '/' }]);
  const router = useRouter();
  const pathname = usePathname();

  // Dynamic Transparency Logic
  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      // Small threshold (10px) makes the transition feel more responsive
      setIsScrolled(window.scrollY > 10);
    };
    
    const updateCart = () => setCartCount(getCartCount());

    const loadCategories = async () => {
      try {
        const categories = await api.getCategories(true);
        setNavigation([
          { name: 'Home', href: '/' },
          ...categories.map(cat => ({ name: cat.name, href: `/category/${cat.slug}` }))
        ]);
      } catch {
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

  // Close menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleDesktopSearch = (e) => {
    e.preventDefault();
    if (desktopSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(desktopSearchQuery.trim())}`);
      setIsSearchOpen(false);
      setDesktopSearchQuery('');
    }
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setIsMenuOpen(false);
      setIsMobileSearchOpen(false);
      setMobileSearchQuery('');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isTransparent
          ? 'bg-transparent py-7' 
          : 'bg-white/95 backdrop-blur-md shadow-md py-3'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between w-full gap-8">
          
          {/* Logo with Dynamic Filter */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <img
              src="/logo.png"
              alt="Adorn Steps"
              className={`h-12 md:h-14 lg:h-16 w-auto object-contain transition-all duration-300 ${
                isTransparent ? 'brightness-0 invert drop-shadow-lg' : ''
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 justify-center gap-8 xl:gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-bold tracking-widest uppercase transition-all duration-300 relative group whitespace-nowrap drop-shadow-sm ${
                  isTransparent
                    ? 'text-white hover:text-white/80'
                    : 'text-gray-800 hover:text-rose-600'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isTransparent ? 'bg-white' : 'bg-rose-600'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Desktop Search Toggle */}
            <div className="hidden md:flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleDesktopSearch} className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                  <input
                    type="text"
                    value={desktopSearchQuery}
                    onChange={(e) => setDesktopSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-48 lg:w-64 px-4 py-2 rounded-full border bg-white/10 backdrop-blur-md text-white border-white/20 placeholder:text-white/70 focus:outline-none"
                    autoFocus
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)}>
                    <X size={20} className={isTransparent ? 'text-white' : 'text-gray-800'} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-3 rounded-full transition-all ${isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
                >
                  <Search size={22} className="drop-shadow-md" />
                </button>
              )}
            </div>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className={`p-3 rounded-full transition-all relative ${isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
            >
              <ShoppingCart size={22} className="drop-shadow-md" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger (Mobile) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-3 rounded-full transition-all ${isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[80px] bg-white z-40 p-6 animate-in slide-in-from-top">
          <div className="flex flex-col gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}