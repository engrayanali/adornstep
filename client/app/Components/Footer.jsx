'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-900 text-cream-100 mt-24">
      {/* Main Footer */}
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 xl:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            {/* Fixed color to white/cream for visibility on dark background */}
            <h3 className="text-3xl font-display font-semibold text-gray-900 mb-4 tracking-wide">
              Adorn Steps
            </h3>
            <p className="text-gray-900 mb-6 font-light leading-relaxed max-w-sm">
              Elegantly effortless footwear designed for the modern woman. 
              Step into comfort without compromising on style.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61576604137718#" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-charcoal-800 hover:bg-terracotta-500 rounded-full transition-all duration-300 hover-lift text-white"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.instagram.com/adorn_step?utm_source=qr" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-charcoal-800 hover:bg-terracotta-500 rounded-full transition-all duration-300 hover-lift text-white"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-lg font-semibold mb-5 text-gray-900 tracking-wide">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="/category/heels" className="text-cream-300 hover:text-terracotta-500 transition-colors font-light">Heels</Link></li>
              <li><Link href="/category/flats" className="text-cream-300 hover:text-terracotta-500 transition-colors font-light">Flats</Link></li>
              <li><Link href="/category/sandals" className="text-cream-300 hover:text-terracotta-500 transition-colors font-light">Sandals</Link></li>
              <li><Link href="/category/casual" className="text-cream-300 hover:text-terracotta-500 transition-colors font-light">Casual</Link></li>
              <li><Link href="/category/new-arrivals" className="text-cream-300 hover:text-terracotta-500 transition-colors font-light">New Arrivals</Link></li>
              <li><Link href="/category/limited-edition" className="text-cream-300 hover:text-terracotta-500 transition-colors font-light">Limited Edition</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-semibold mb-5 text-gray-900 tracking-wide">Customer Care</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-cream-300 hover:text-terracotta-500 transition-colors font-light">About Us</Link></li>
              <li><Link href="/contact" className="text-cream-300 hover:text-terracotta-500 transition-colors font-light">Contact</Link></li>
              <li><Link href="/shipping" className="text-cream-300 hover:text-terracotta-500 transition-colors font-light">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-cream-300 hover:text-terracotta-500 transition-colors font-light">Returns & Exchanges</Link></li>
              <li><Link href="/size-guide" className="text-cream-300 hover:text-terracotta-500 transition-colors font-light">Size Guide</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-5 text-gray-900 tracking-wide">Connect</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-cream-300 font-light">
                <MapPin size={20} className="flex-shrink-0 mt-1 text-terracotta-500" />
                <span className="text-sm leading-relaxed">Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-cream-300 font-light">
                <Phone size={20} className="flex-shrink-0 text-terracotta-500" />
                <a href="tel:+923213880301" className="hover:text-terracotta-500 transition-colors text-sm">
                  +92 321 3880301
                </a>
              </li>
              <li className="flex items-center gap-3 text-cream-300 font-light">
                <Mail size={20} className="flex-shrink-0 text-terracotta-500" />
                <a href="mailto:info@adornsteps.com" className="hover:text-terracotta-500 transition-colors text-sm">
                  info@adornstep.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-charcoal-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream-400 text-sm font-light">
            &copy; {currentYear} Adorn Steps. All rights reserved. Made with <Heart size={14} className="inline fill-terracotta-500 text-terracotta-500" /> for comfort.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-cream-400 hover:text-terracotta-500 transition-colors font-light">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-cream-400 hover:text-terracotta-500 transition-colors font-light">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}