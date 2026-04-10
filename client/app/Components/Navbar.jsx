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

  const isHomePage = pathname === '/';
  // Navbar is transparent only on home page when not scrolled
  const isTransparent = isHomePage && !isScrolled;

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent py-5'
          : 'bg-white/98 backdrop-blur-md shadow-soft py-3'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between w-full gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <img
              src="/logo.png"
              alt="Adorn Steps"
              className={`h-12 md:h-14 lg:h-16 w-auto object-contain transition-all duration-300 ${
                isTransparent ? 'brightness-0 invert' : ''
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 justify-center gap-8 xl:gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 relative group whitespace-nowrap ${
                  isTransparent
                    ? 'text-white hover:text-white/70'
                    : 'text-charcoal-700 hover:text-terracotta-500'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isTransparent ? 'bg-white' : 'bg-terracotta-500'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Search - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isSearchOpen ? (
                <form onSubmit={handleDesktopSearch} className="flex items-center gap-2 animate-fade-in">
                  <input
                    type="text"
                    value={desktopSearchQuery}
                    onChange={(e) => setDesktopSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-48 lg:w-64 xl:w-80 px-4 py-2 rounded-full border border-taupe-300 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-200 transition-all duration-300 text-sm bg-white text-charcoal-800"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className={`p-2.5 rounded-full transition-all duration-300 ${
                      isTransparent ? 'hover:bg-white/20' : 'hover:bg-cream-200'
                    }`}
                    aria-label="Close search"
                  >
                    <X size={20} className={isTransparent ? 'text-white' : 'text-charcoal-700'} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-2.5 rounded-full transition-all duration-300 ${
                    isTransparent ? 'hover:bg-white/20' : 'hover:bg-cream-200'
                  }`}
                  aria-label="Search"
                >
                  <Search size={20} className={isTransparent ? 'text-white' : 'text-charcoal-700'} />
                </button>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className={`p-2.5 rounded-full transition-all duration-300 relative ${
                isTransparent ? 'hover:bg-white/20' : 'hover:bg-cream-200'
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} className={isTransparent ? 'text-white' : 'text-charcoal-700'} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2.5 rounded-full transition-all duration-300 ${
                isTransparent ? 'hover:bg-white/20' : 'hover:bg-cream-200'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen
                ? <X size={24} className={isTransparent ? 'text-white' : 'text-charcoal-800'} />
                : <Menu size={24} className={isTransparent ? 'text-white' : 'text-charcoal-800'} />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden pt-6 pb-4 border-t mt-4 animate-fade-in ${
            isTransparent ? 'border-white/30 bg-black/40 backdrop-blur-sm rounded-xl px-2' : 'border-cream-300'
          }`}>
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm tracking-wide ${
                    isTransparent
                      ? 'text-white hover:bg-white/20'
                      : 'text-charcoal-700 hover:text-terracotta-500 hover:bg-cream-200'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Search */}
              <div className={`pt-4 mt-4 border-t space-y-2 ${isTransparent ? 'border-white/30' : 'border-cream-300'}`}>
                {isMobileSearchOpen ? (
                  <form onSubmit={handleMobileSearch} className="flex items-center gap-2 px-4 py-2">
                    <input
                      type="text"
                      value={mobileSearchQuery}
                      onChange={(e) => setMobileSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      autoFocus
                      className="flex-1 px-4 py-2 border border-taupe-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-200 bg-white text-charcoal-800"
                    />
                    <button type="submit" className="p-2 bg-terracotta-500 text-white rounded-full hover:bg-terracotta-600 transition-all">
                      <Search size={16} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsMobileSearchOpen(true)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm tracking-wide flex items-center gap-2 ${
                      isTransparent ? 'text-white hover:bg-white/20' : 'text-charcoal-700 hover:bg-cream-200'
                    }`}
                  >
                    <Search size={18} /> Search
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}