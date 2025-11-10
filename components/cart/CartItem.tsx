'use client';

import { CartItem as CartItemType } from '@/lib/types';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { getCart, saveCart } from '@/lib/storage';

interface CartItemProps {
  item: CartItemType;
  onUpdate: () => void;
}

export default function CartItem({ item, onUpdate }: CartItemProps) {
  const handleIncrease = () => {
    const cart = getCart();
    const cartItem = cart.find(ci => ci.product.id === item.product.id);
    if (cartItem) {
      cartItem.quantity += 1;
      saveCart(cart);
      onUpdate();
    }
  };

  const handleDecrease = () => {
    const cart = getCart();
    const cartItem = cart.find(ci => ci.product.id === item.product.id);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else {
        const index = cart.indexOf(cartItem);
        cart.splice(index, 1);
      }
      saveCart(cart);
      onUpdate();
    }
  };

  const handleRemove = () => {
    const cart = getCart();
    const index = cart.findIndex(ci => ci.product.id === item.product.id);
    if (index > -1) {
      cart.splice(index, 1);
      saveCart(cart);
      onUpdate();
    }
  };

  const total = item.product.price * item.quantity;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass-card p-4 flex gap-4"
    >
      <div 
        className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100 flex-shrink-0 cursor-pointer"
        onClick={() => {
          // Клик по изображению также добавляет товар
          const cart = getCart();
          const cartItem = cart.find(ci => ci.product.id === item.product.id);
          if (cartItem) {
            cartItem.quantity += 1;
            saveCart(cart);
            onUpdate();
          }
        }}
      >
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-cover"
          unoptimized
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== `https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&h=600&fit=crop&auto=format`) {
              target.src = `https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&h=600&fit=crop&auto=format`;
            }
          }}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 mb-1">{item.product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{item.product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            {total} ₽
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-700" />
            </button>
            <span className="font-bold text-gray-800 min-w-[30px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={handleRemove}
              className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

