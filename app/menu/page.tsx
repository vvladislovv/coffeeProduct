'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import Image from 'next/image';
import ProductCard from '@/components/menu/ProductCard';
import { products, categories, getProductsByCategory } from '@/lib/data';
import { Product } from '@/lib/types';
import { getCart } from '@/lib/storage';
import { useRouter } from 'next/navigation';

function MenuPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };
    updateCartCount();
    const interval = setInterval(updateCartCount, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = getProductsByCategory(selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = () => {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Меню 🍽️</h1>
        <p className="text-gray-600">Выберите любимые блюда</p>
      </div>

      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Поиск блюд..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {/* Категории */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
              : 'bg-white text-gray-700'
          }`}
        >
          Все
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-700'
            }`}
          >
            <Image
              src={category.icon}
              alt={category.name}
              width={20}
              height={20}
              className="object-cover rounded"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.emoji-fallback')) {
                  const span = document.createElement('span');
                  span.className = 'emoji-fallback';
                  span.textContent = category.emoji;
                  parent.insertBefore(span, target);
                }
              }}
            />
            {category.name}
          </button>
        ))}
      </div>

      {/* Список товаров */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Ничего не найдено 😔</p>
          <p className="text-gray-400 text-sm mt-2">Попробуйте другой запрос</p>
        </div>
      )}

      {/* Кнопка корзины */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20"
        >
          <button
            onClick={() => router.push('/cart')}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-4 rounded-full shadow-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <span>Корзина ({cartCount})</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              →
            </span>
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="px-4 py-6">Загрузка...</div>}>
      <MenuPageContent />
    </Suspense>
  );
}

