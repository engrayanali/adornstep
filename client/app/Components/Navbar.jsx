'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
// Updated relative paths to go up two levels from app/Components to client/lib
import { getCartCount } from '../../lib/cart';
import api from '../../lib/api';

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

  // Transparency Logic: Active ONLY on the Home page ('/') when NOT scrolled down
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
    const handleScroll = () => {
      // Trigger style change after 50px of scrolling
      setIsScrolled(window.scrollY > 50);
    };

    const updateCart = () => {
      setCartCount(getCartCount());
    };

    const loadCategories = async () => {
      try {
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
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', updateCart);
    
    // Initial checks on mount
    handleScroll();
    updateCart();
    loadCategories();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Dynamic Background and Text Classes
  const navClasses = isTransparent 
    ? "bg-transparent py-6 text-white" 
    : "bg-white/98 backdrop-blur-md shadow-md py-3 text-charcoal-800";

  const iconColorClass = isTransparent ? "text-white" : "text-charcoal-700";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${navClasses}`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between w-full gap-8">
          
          {/* Logo - Inverts to white when navbar is transparent */}
          <Link href="/" className="flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Adorn Steps" 
              className={`h-12 md:h-14 lg:h-16 w-auto transition-all duration-300 ${isTransparent ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 justify-center gap-8 xl:gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-bold uppercase tracking-widest transition-colors duration-300 relative group ${
                  isTransparent ? 'hover:text-white/80' : 'hover:text-terracotta-500'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  isTransparent ? 'bg-white' : 'bg-terracotta-500'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Right Section Icons */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Search - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isSearchOpen ? (
                <form onSubmit={handleDesktopSearch} className="flex items-center gap-2 animate-fade-in">
                  <input
                    type="text"
                    value={desktopSearchQuery}
                    onChange={(e) => setDesktopSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={`w-48 lg:w-64 px-4 py-2 rounded-full border text-sm focus:outline-none transition-all ${
                      isTransparent 
                        ? 'bg-white/10 border-white/20 text-white placeholder:text-white/70' 
                        : 'bg-cream-100 border-taupe-300 text-charcoal-800'
                    }`}
                    autoFocus
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="p-2">
                    <X size={20} className={iconColorClass} />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)} 
                  className={`p-2.5 rounded-full transition-all ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-cream-200'}`}
                >
                  <Search size={20} className={iconColorClass} />
                </button>
              )}
            </div>
            
            {/* Cart Icon */}
            <Link 
              href="/cart" 
              className={`p-2.5 rounded-full relative transition-all ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-cream-200'}`}
            >
              <ShoppingCart size={20} className={iconColorClass} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="lg:hidden p-2.5"
            >
              {isMenuOpen ? <X size={24} className={iconColorClass} /> : <Menu size={24} className={iconColorClass} />}
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-[110] bg-white text-charcoal-800 transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-end mb-8">
            <button onClick={() => setIsMenuOpen(false)}>
              <X size={32} className="text-charcoal-800" />
            </button>
          </div>
          <div className="flex flex-col space-y-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-4xl font-black uppercase tracking-tighter hover:text-terracotta-500 transition-colors"
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