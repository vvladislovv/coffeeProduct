'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Truck, Store, ArrowRight } from 'lucide-react';
import CartItem from '@/components/cart/CartItem';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getCart } from '@/lib/storage';
import { CartItem as CartItemType } from '@/lib/types';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('pickup');
  const [loyaltyPointsUsed, setLoyaltyPointsUsed] = useState(0);

  useEffect(() => {
    updateCart();
  }, []);

  const updateCart = () => {
    setCart(getCart());
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      let itemPrice = item.selectedSize ? item.selectedSize.price : item.product.price;
      const addonsPrice = (item.selectedAddons || []).reduce((addonSum, addon) => addonSum + addon.price, 0);
      itemPrice += addonsPrice;
      return sum + itemPrice * item.quantity;
    }, 0);
  };

  const calculateDeliveryFee = () => {
    return deliveryType === 'delivery' ? 200 : 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const delivery = calculateDeliveryFee();
    const pointsDiscount = Math.min(loyaltyPointsUsed, subtotal);
    return Math.max(0, subtotal + delivery - pointsDiscount);
  };

  const getLoyaltyPoints = () => {
    if (typeof window === 'undefined') return 0;
    const points = localStorage.getItem('coffee_loyalty_points');
    return points ? parseInt(points, 10) : 100;
  };

  const availablePoints = getLoyaltyPoints();
  const maxPointsToUse = Math.min(availablePoints, calculateSubtotal());

  if (cart.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center"
        >
          <ShoppingBag className="w-12 h-12 text-orange-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Корзина пуста</h2>
        <p className="text-gray-600 mb-6">Добавьте товары из меню</p>
        <Button onClick={() => router.push('/menu')} fullWidth>
          Перейти в меню
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Корзина 🛒</h1>
        <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'товар' : 'товаров'}</p>
      </div>

      {/* Список товаров */}
      <div className="space-y-3">
        <AnimatePresence>
          {cart.map((item) => (
            <CartItem key={item.product.id} item={item} onUpdate={updateCart} />
          ))}
        </AnimatePresence>
      </div>

      {/* Тип доставки */}
      <Card className="p-4">
        <h3 className="font-bold text-gray-800 mb-3">Способ получения</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setDeliveryType('pickup');
              localStorage.setItem('checkout_delivery_type', 'pickup');
            }}
            className={`p-4 rounded-xl border-2 transition-all ${
              deliveryType === 'pickup'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <Store className={`w-6 h-6 mb-2 ${deliveryType === 'pickup' ? 'text-orange-500' : 'text-gray-400'}`} />
            <p className={`font-semibold ${deliveryType === 'pickup' ? 'text-orange-600' : 'text-gray-600'}`}>
              Самовывоз
            </p>
            <p className="text-xs text-gray-500 mt-1">Бесплатно</p>
          </button>
          
          <button
            onClick={() => {
              setDeliveryType('delivery');
              localStorage.setItem('checkout_delivery_type', 'delivery');
            }}
            className={`p-4 rounded-xl border-2 transition-all ${
              deliveryType === 'delivery'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <Truck className={`w-6 h-6 mb-2 ${deliveryType === 'delivery' ? 'text-orange-500' : 'text-gray-400'}`} />
            <p className={`font-semibold ${deliveryType === 'delivery' ? 'text-orange-600' : 'text-gray-600'}`}>
              Доставка
            </p>
            <p className="text-xs text-gray-500 mt-1">200 ₽</p>
          </button>
        </div>
      </Card>

      {/* Баллы лояльности */}
      {availablePoints > 0 && (
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-800">Использовать баллы</h3>
              <p className="text-sm text-gray-600">Доступно: {availablePoints} баллов</p>
            </div>
            <div className="text-2xl">🎁</div>
          </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={maxPointsToUse}
                value={loyaltyPointsUsed}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setLoyaltyPointsUsed(value);
                  localStorage.setItem('checkout_loyalty_points', value.toString());
                }}
                className="flex-1"
              />
              <span className="font-bold text-purple-600 min-w-[60px] text-right">
                {loyaltyPointsUsed} ₽
              </span>
            </div>
        </Card>
      )}

      {/* Итого */}
      <div className="p-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-2xl text-white">
        <h3 className="text-lg font-bold mb-4 text-white">Итоговая стоимость</h3>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-white">
            <span>Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)} шт.):</span>
            <span className="font-semibold text-white">{calculateSubtotal()} ₽</span>
          </div>
          {deliveryType === 'delivery' && (
            <div className="flex justify-between text-white">
              <span>Доставка:</span>
              <span className="font-semibold text-white">{calculateDeliveryFee()} ₽</span>
            </div>
          )}
          {loyaltyPointsUsed > 0 && (
            <div className="flex justify-between text-green-100">
              <span>Скидка (баллы):</span>
              <span className="font-semibold text-green-100">-{loyaltyPointsUsed} ₽</span>
            </div>
          )}
          <div className="border-t-2 border-white/40 pt-3 mt-3 flex justify-between text-2xl font-bold">
            <span className="text-white">Итого:</span>
            <span className="text-yellow-300">{calculateTotal()} ₽</span>
          </div>
        </div>
        
        <Button
          onClick={() => {
            localStorage.setItem('checkout_delivery_type', deliveryType);
            localStorage.setItem('checkout_loyalty_points', loyaltyPointsUsed.toString());
            router.push('/checkout');
          }}
          variant="secondary"
          fullWidth
          size="lg"
          className="bg-white text-orange-600 hover:bg-gray-50"
        >
          Оформить заказ <ArrowRight className="w-5 h-5 ml-2 inline" />
        </Button>
      </div>
    </div>
  );
}

