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

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background-color 0.5s ease, box-shadow 0.5s ease',
        // KEY FIX: truly transparent when on home at top, white when scrolled or other pages
        backgroundColor: isTransparent ? 'transparent' : 'rgba(255,255,255,0.98)',
        backdropFilter: isTransparent ? 'none' : 'blur(12px)',
        boxShadow: isTransparent ? 'none' : '0 1px 10px rgba(0,0,0,0.08)',
        padding: isTransparent ? '20px 0' : '12px 0',
      }}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between w-full gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="Adorn Steps"
              style={{
                height: '52px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'filter 0.5s ease',
                // Invert logo to white when transparent over banner
                filter: isTransparent ? 'brightness(0) invert(1)' : 'none',
              }}
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center flex-1 justify-center gap-8 xl:gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s ease',
                  color: isTransparent ? '#ffffff' : '#3a3a3a',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                }}
                className="group"
              >
                {item.name}
                <span style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  height: '1px',
                  width: 0,
                  backgroundColor: isTransparent ? '#ffffff' : '#c0856a',
                  transition: 'width 0.3s ease',
                }}
                className="group-hover:!w-full"
                ></span>
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Search Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isSearchOpen ? (
                <form onSubmit={handleDesktopSearch} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={desktopSearchQuery}
                    onChange={(e) => setDesktopSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    autoFocus
                    className="w-48 lg:w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-terracotta-200 text-sm bg-white text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={20} style={{ color: isTransparent ? '#ffffff' : '#3a3a3a' }} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Search size={20} style={{ color: isTransparent ? '#ffffff' : '#3a3a3a' }} />
                </button>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="p-2.5 rounded-full hover:bg-white/20 transition-colors relative">
              <ShoppingCart size={20} style={{ color: isTransparent ? '#ffffff' : '#3a3a3a' }} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-full hover:bg-white/20 transition-colors"
            >
              {isMenuOpen
                ? <X size={24} style={{ color: isTransparent ? '#ffffff' : '#3a3a3a' }} />
                : <Menu size={24} style={{ color: isTransparent ? '#ffffff' : '#3a3a3a' }} />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            paddingBottom: '16px',
            borderTop: isTransparent ? '1px solid rgba(255,255,255,0.3)' : '1px solid #e8e0d8',
            backgroundColor: isTransparent ? 'rgba(0,0,0,0.5)' : 'transparent',
            backdropFilter: isTransparent ? 'blur(8px)' : 'none',
            borderRadius: isTransparent ? '12px' : 0,
          }}>
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontWeight: 500,
                    fontSize: '14px',
                    letterSpacing: '0.05em',
                    color: isTransparent ? '#ffffff' : '#3a3a3a',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Search */}
              <div style={{ paddingTop: '12px', marginTop: '12px', borderTop: isTransparent ? '1px solid rgba(255,255,255,0.2)' : '1px solid #e8e0d8' }}>
                {isMobileSearchOpen ? (
                  <form onSubmit={handleMobileSearch} className="flex items-center gap-2 px-4">
                    <input
                      type="text"
                      value={mobileSearchQuery}
                      onChange={(e) => setMobileSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      autoFocus
                      className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-sm bg-white text-gray-800 focus:outline-none"
                    />
                    <button type="submit" className="p-2 bg-terracotta-500 text-white rounded-full">
                      <Search size={16} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsMobileSearchOpen(true)}
                    style={{ padding: '12px 16px', color: isTransparent ? '#ffffff' : '#3a3a3a', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
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