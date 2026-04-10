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

  // FIX: Robust homepage detection (handles trailing slashes)
  const isHomePage = pathname === '/' || pathname === '';
  const isTransparent = isHomePage && !isScrolled;

  const handleDesktopSearch = (e) => {
    e.preventDefault();
    if (desktopSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(desktopSearchQuery.trim())}`);
      setIsSearchOpen(false);
      setDesktopSearchQuery('');
    }
  };

  useEffect(() => {
    // FIX: Check scroll position immediately on mount
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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

    // Initialize state
    handleScroll();
    updateCart();
    loadCategories();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', updateCart);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent py-5'
          : 'bg-white/98 backdrop-blur-md shadow-md py-3'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between w-full gap-8">

          {/* Logo - Inverts to white when transparent */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <img
              src="/logo.png"
              alt="Adorn Steps"
              className={`h-12 md:h-14 w-auto object-contain transition-all duration-300 ${
                isTransparent ? 'brightness-0 invert' : ''
              }`}
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center flex-1 justify-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-xs font-bold tracking-widest uppercase transition-colors duration-300 relative group ${
                  isTransparent ? 'text-white' : 'text-gray-900'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-rose-600 transition-all duration-300 ${pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
               {isSearchOpen ? (
                 <form onSubmit={handleDesktopSearch} className="flex items-center gap-2">
                   <input
                     type="text"
                     value={desktopSearchQuery}
                     onChange={(e) => setDesktopSearchQuery(e.target.value)}
                     placeholder="Search..."
                     className="px-4 py-1.5 rounded-full border text-sm focus:outline-none w-48"
                     autoFocus
                   />
                   <X size={18} className="cursor-pointer" onClick={() => setIsSearchOpen(false)} />
                 </form>
               ) : (
                 <Search size={20} className={`cursor-pointer ${isTransparent ? 'text-white' : 'text-gray-900'}`} onClick={() => setIsSearchOpen(true)} />
               )}
            </div>

            <Link href="/cart" className="relative">
              <ShoppingCart size={22} className={isTransparent ? 'text-white' : 'text-gray-900'} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
              {isMenuOpen ? <X size={26} /> : <Menu size={26} className={isTransparent ? 'text-white' : 'text-gray-900'} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}