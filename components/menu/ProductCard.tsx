'use client';

import { Product, Addon, CartItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart, X, Check } from 'lucide-react';
import { getCart, saveCart } from '@/lib/storage';
import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [selectedSize, setSelectedSize] = useState<{ id: string; name: string; price: number } | null>(null);

  useEffect(() => {
    const cart = getCart();
    const item = cart.find(item => item.product.id === product.id);
    setQuantity(item?.quantity || 0);
  }, []);

  useEffect(() => {
    if (showModal && product.sizes && product.sizes.length > 0 && !selectedSize) {
      // Выбираем первый размер по умолчанию
      setSelectedSize(product.sizes[0]);
    }
  }, [showModal, product.sizes, selectedSize]);

  const calculateTotalPrice = () => {
    let total = product.price;
    if (selectedSize) {
      total += selectedSize.price;
    }
    total += selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return total;
  };

  const handleAddToCartFromModal = () => {
    const cart = getCart();
    const cartItem: CartItem = {
      product,
      quantity: 1,
      selectedAddons: selectedAddons.length > 0 ? selectedAddons : undefined,
      selectedSize: selectedSize || undefined,
    };

    const existingItemIndex = cart.findIndex(item => 
      item.product.id === product.id &&
      JSON.stringify(item.selectedAddons || []) === JSON.stringify(selectedAddons) &&
      item.selectedSize?.id === selectedSize?.id
    );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    saveCart(cart);
    setQuantity(prev => prev + 1);
    setShowModal(false);
    setSelectedAddons([]);
    setSelectedSize(null);
    onAddToCart?.();
  };

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

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons(prev => {
      const isSelected = prev.some(a => a.id === addon.id);
      if (isSelected) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
          <span className="text-8xl">{product.emoji || '☕'}</span>
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
                  setShowModal(true);
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
      
      <Modal isOpen={showModal} onClose={() => {
        setShowModal(false);
        setSelectedAddons([]);
        setSelectedSize(null);
      }} title={product.name}>
        <div className="space-y-6">
          {/* Изображение */}
          <div className="relative w-full h-64 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl overflow-hidden flex items-center justify-center">
            <span className="text-9xl">{product.emoji || '☕'}</span>
          </div>

          {/* Описание */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{product.name}</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
          </div>

          {/* Размеры */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Размер</h4>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                      selectedSize?.id === size.id
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300 text-gray-700'
                    }`}
                  >
                    <div className="font-semibold">{size.name}</div>
                    <div className="text-sm text-gray-500">+{size.price} ₽</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Допы */}
          {product.addons && product.addons.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Дополнения</h4>
              <div className="space-y-2">
                {product.addons.map((addon) => {
                  const isSelected = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`font-medium ${isSelected ? 'text-orange-700' : 'text-gray-700'}`}>
                          {addon.name}
                        </span>
                      </div>
                      <span className={`font-semibold ${isSelected ? 'text-orange-700' : 'text-gray-600'}`}>
                        +{addon.price} ₽
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Итоговая цена и кнопка */}
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2 mb-4">
              {/* Базовая цена */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{product.name}</span>
                <span className="text-base font-semibold text-gray-700">
                  {product.price} ₽
                </span>
              </div>
              
              {/* Размер (если выбран и есть доплата) */}
              {selectedSize && selectedSize.price > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Размер: {selectedSize.name}</span>
                  <span className="text-sm font-medium text-orange-600">
                    +{selectedSize.price} ₽
                  </span>
                </div>
              )}
              
              {/* Допы */}
              {selectedAddons.length > 0 && (
                <>
                  {selectedAddons.map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{addon.name}</span>
                      {addon.price > 0 && (
                        <span className="text-sm font-medium text-orange-600">
                          +{addon.price} ₽
                        </span>
                      )}
                      {addon.price === 0 && (
                        <span className="text-sm text-gray-400">Бесплатно</span>
                      )}
                    </div>
                  ))}
                </>
              )}
              
              {/* Итого */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-800">Итого:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  {calculateTotalPrice()} ₽
                </span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCartFromModal}
              disabled={!product.available}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Добавить в корзину
            </motion.button>
          </div>
        </div>
      </Modal>
    </>
  );
}
