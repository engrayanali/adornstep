'use client';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../lib/cart';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CartButton() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ShoppingCart className="w-6 h-6 text-gray-800" />
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-rose-600 text-gray-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {itemCount > 9 ? '9+' : itemCount}
          </motion.span>
        )}
      </motion.button>
    </Link>
  );
}
