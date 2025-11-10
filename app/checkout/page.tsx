'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, MapPin, Phone, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { getCart, getUserInfo, saveUserInfo, clearCart, saveOrder, subtractLoyaltyPoints, addLoyaltyPoints, addLoyaltyTransaction } from '@/lib/storage';
import { Order } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState(getCart());
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('cash');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('pickup');
  const [loyaltyPointsUsed, setLoyaltyPointsUsed] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
      });
    }

    // Получаем данные из корзины
    const currentCart = getCart();
    setCart(currentCart);
    
    // Определяем тип доставки из localStorage или по умолчанию
    const savedDeliveryType = localStorage.getItem('checkout_delivery_type');
    if (savedDeliveryType) {
      setDeliveryType(savedDeliveryType as 'delivery' | 'pickup');
    }

    // Получаем использованные баллы из localStorage
    const savedPoints = localStorage.getItem('checkout_loyalty_points');
    if (savedPoints) {
      setLoyaltyPointsUsed(parseInt(savedPoints, 10));
    }
  }, []);

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
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

  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
      address: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Неверный формат телефона';
    }

    if (deliveryType === 'delivery' && !formData.address.trim()) {
      newErrors.address = 'Введите адрес доставки';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      alert('Корзина пуста');
      return;
    }

    // Сохраняем данные пользователя
    saveUserInfo({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    });

    // Создаем заказ
    const order: Order = {
      id: Date.now().toString(),
      items: cart,
      total: calculateTotal(),
      deliveryType,
      paymentMethod,
      address: deliveryType === 'delivery' ? formData.address : undefined,
      phone: formData.phone,
      name: formData.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      loyaltyPointsUsed,
      loyaltyPointsEarned: Math.floor(calculateTotal() * 0.05), // 5% от суммы заказа
    };

    // Сохраняем заказ
    saveOrder(order);

    // Списываем баллы
    if (loyaltyPointsUsed > 0) {
      subtractLoyaltyPoints(loyaltyPointsUsed);
      addLoyaltyTransaction({
        id: Date.now().toString(),
        type: 'spent',
        amount: loyaltyPointsUsed,
        description: `Списание баллов за заказ #${order.id}`,
        date: new Date().toISOString(),
      });
    }

    // Начисляем баллы (начисление произойдет при открытии страницы статуса заказа)
    if (order.loyaltyPointsEarned > 0) {
      addLoyaltyTransaction({
        id: (Date.now() + 1).toString(),
        type: 'earned',
        amount: order.loyaltyPointsEarned,
        description: `Начисление баллов за заказ #${order.id}`,
        date: new Date().toISOString(),
      });
      // Добавляем баллы сразу
      addLoyaltyPoints(order.loyaltyPointsEarned);
    }

    // Очищаем корзину
    clearCart();

    // Переходим на страницу статуса заказа
    router.push(`/order-status?id=${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Корзина пуста</h2>
        <Button onClick={() => router.push('/menu')} className="mt-4">
          Перейти в меню
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Оформление заказа 📝</h1>
        <p className="text-gray-600">Заполните данные для заказа</p>
      </div>

      {/* Контактная информация */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-orange-500" />
          Контактная информация
        </h2>
        <div className="space-y-4">
          <Input
            label="Имя"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Введите ваше имя"
          />
          <Input
            label="Телефон"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            placeholder="+7 (999) 123-45-67"
          />
          {deliveryType === 'delivery' && (
            <Input
              label="Адрес доставки"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              error={errors.address}
              placeholder="Введите адрес доставки"
            />
          )}
        </div>
      </Card>

      {/* Способ получения */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-500" />
          Способ получения
        </h2>
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
            <p className={`font-semibold ${deliveryType === 'delivery' ? 'text-orange-600' : 'text-gray-600'}`}>
              Доставка
            </p>
            <p className="text-xs text-gray-500 mt-1">200 ₽</p>
          </button>
        </div>
      </Card>

      {/* Способ оплаты */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-orange-500" />
          Способ оплаты
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`p-4 rounded-xl border-2 transition-all ${
              paymentMethod === 'cash'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <Wallet className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'cash' ? 'text-orange-500' : 'text-gray-400'}`} />
            <p className={`font-semibold ${paymentMethod === 'cash' ? 'text-orange-600' : 'text-gray-600'}`}>
              Наличные
            </p>
          </button>
          
          <button
            onClick={() => setPaymentMethod('online')}
            className={`p-4 rounded-xl border-2 transition-all ${
              paymentMethod === 'online'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'online' ? 'text-orange-500' : 'text-gray-400'}`} />
            <p className={`font-semibold ${paymentMethod === 'online' ? 'text-orange-600' : 'text-gray-600'}`}>
              Онлайн
            </p>
          </button>
        </div>
      </Card>

      {/* Баллы лояльности */}
      {(() => {
        const availablePoints = typeof window !== 'undefined' ? (() => {
          const points = localStorage.getItem('coffee_loyalty_points');
          return points ? parseInt(points, 10) : 100;
        })() : 0;
        const maxPointsToUse = Math.min(availablePoints, calculateSubtotal());
        
        return availablePoints > 0 ? (
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
        ) : null;
      })()}

      {/* Итого */}
      <div className="p-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-2xl text-white">
        <h3 className="text-lg font-bold mb-4 text-white">Итоговая стоимость</h3>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-white">
            <span>Товары:</span>
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
          onClick={handleSubmit}
          variant="secondary"
          fullWidth
          size="lg"
          className="bg-white text-orange-600 hover:bg-gray-50"
        >
          Подтвердить заказ
        </Button>
      </div>
    </div>
  );
}

