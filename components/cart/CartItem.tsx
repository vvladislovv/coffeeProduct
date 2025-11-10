'use client';

import { CartItem as CartItemType } from '@/lib/types';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { getCart, saveCart } from '@/lib/storage';

interface CartItemProps {
  item: CartItemType;
  onUpdate: () => void;
}

export default function CartItem({ item, onUpdate }: CartItemProps) {
  const handleIncrease = () => {
    const cart = getCart();
    const cartItemIndex = cart.findIndex(ci => 
      ci.product.id === item.product.id &&
      JSON.stringify(ci.selectedAddons || []) === JSON.stringify(item.selectedAddons || []) &&
      ci.selectedSize?.id === item.selectedSize?.id
    );
    
    if (cartItemIndex >= 0) {
      cart[cartItemIndex].quantity += 1;
      saveCart(cart);
      onUpdate();
    }
  };

  const handleDecrease = () => {
    const cart = getCart();
    const cartItemIndex = cart.findIndex(ci => 
      ci.product.id === item.product.id &&
      JSON.stringify(ci.selectedAddons || []) === JSON.stringify(item.selectedAddons || []) &&
      ci.selectedSize?.id === item.selectedSize?.id
    );
    
    if (cartItemIndex >= 0) {
      const cartItem = cart[cartItemIndex];
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else {
        cart.splice(cartItemIndex, 1);
      }
      saveCart(cart);
      onUpdate();
    }
  };

  const handleRemove = () => {
    const cart = getCart();
    const cartItemIndex = cart.findIndex(ci => 
      ci.product.id === item.product.id &&
      JSON.stringify(ci.selectedAddons || []) === JSON.stringify(item.selectedAddons || []) &&
      ci.selectedSize?.id === item.selectedSize?.id
    );
    
    if (cartItemIndex > -1) {
      cart.splice(cartItemIndex, 1);
      saveCart(cart);
      onUpdate();
    }
  };

  const calculateItemPrice = () => {
    let basePrice = item.selectedSize ? item.selectedSize.price : item.product.price;
    const addonsPrice = (item.selectedAddons || []).reduce((sum, addon) => sum + addon.price, 0);
    return (basePrice + addonsPrice) * item.quantity;
  };

  const total = calculateItemPrice();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass-card p-4 flex gap-4"
    >
      <div 
        className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100 flex-shrink-0 flex items-center justify-center"
      >
        <span className="text-4xl">{item.product.emoji || '☕'}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 mb-1">{item.product.name}</h3>
        
        {/* Размер */}
        {item.selectedSize && (
          <p className="text-xs text-gray-600 mb-1 font-medium">
            Размер: <span className="text-gray-700">{item.selectedSize.name}</span>
          </p>
        )}
        
        {/* Допы */}
        {item.selectedAddons && item.selectedAddons.length > 0 && (
          <div className="text-xs mb-2 space-y-1">
            <div className="font-semibold text-gray-700 mb-1">Дополнения:</div>
            <div className="space-y-0.5">
              {item.selectedAddons.map((addon) => (
                <div key={addon.id} className="text-gray-600 flex items-center justify-between">
                  <span>• {addon.name}</span>
                  {addon.price > 0 && (
                    <span className="text-orange-600 font-medium ml-2">+{addon.price} ₽</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2">
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
