'use client';

import { ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCart, getLoyaltyPoints } from '@/lib/storage';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const cart = getCart();
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
      const loyaltyPoints = getLoyaltyPoints();
      setPoints(loyaltyPoints || 100);
    };

    updateCounts();
    const interval = setInterval(updateCounts, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-md safe-area-top">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" suppressHydrationWarning>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
            <span className="text-2xl">☕</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Coffee House
          </span>
        </Link>
        
        <div className="flex items-center gap-3">
          <Link
            href="/loyalty"
            className="relative p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:scale-110 transition-transform"
          >
            <Heart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {(points || 100) > 99 ? '99+' : (points || 100)}
            </span>
          </Link>
          
          <button
            onClick={() => router.push('/cart')}
            className="relative p-2 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white hover:scale-110 transition-transform"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

