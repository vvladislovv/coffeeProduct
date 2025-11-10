'use client';

import { Product } from '@/lib/types';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { getCart, saveCart } from '@/lib/storage';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const cart = getCart();
    const item = cart.find(item => item.product.id === product.id);
    setQuantity(item?.quantity || 0);
  }, []);

  const handleAddToCart = () => {
    const cart = getCart();
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }

    saveCart(cart);
    setQuantity(prev => prev + 1);
    onAddToCart?.();
  };

  const handleRemoveFromCart = () => {
    const cart = getCart();
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        const index = cart.indexOf(existingItem);
        cart.splice(index, 1);
      }
      saveCart(cart);
      setQuantity(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden cursor-pointer"
      onClick={handleAddToCart}
    >
      <div 
        className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100"
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart();
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
          loading="lazy"
          onError={(e) => {
            // Fallback на placeholder если изображение не загрузилось
            const target = e.target as HTMLImageElement;
            if (target.src !== `https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&h=600&fit=crop&auto=format`) {
              target.src = `https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&h=600&fit=crop&auto=format`;
            }
          }}
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold">Нет в наличии</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            {product.price} ₽
          </span>
          
          {quantity > 0 ? (
            <div 
              className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full px-4 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromCart();
                }}
                className="text-white hover:scale-110 transition-transform"
              >
                <span className="text-xl font-bold">−</span>
              </button>
              <span className="text-white font-bold min-w-[20px] text-center">{quantity}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className="text-white hover:scale-110 transition-transform"
              >
                <span className="text-xl font-bold">+</span>
              </button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={!product.available}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-2 rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

