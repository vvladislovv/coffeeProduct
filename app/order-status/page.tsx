'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Package, Truck, Home, ArrowLeft } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getOrders } from '@/lib/storage';
import { Order } from '@/lib/types';

const statusSteps = [
  { key: 'pending', label: 'Ожидает подтверждения', icon: Clock, color: 'yellow' },
  { key: 'preparing', label: 'Готовится', icon: Package, color: 'blue' },
  { key: 'ready', label: 'Готов к выдаче', icon: CheckCircle, color: 'green' },
  { key: 'delivering', label: 'В доставке', icon: Truck, color: 'purple' },
  { key: 'completed', label: 'Завершен', icon: Home, color: 'green' },
];

function OrderStatusPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<Order | null>(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const orders = getOrders();
    const foundOrder = orders.find((o) => o.id === orderId);

    if (!foundOrder) {
      router.push('/');
      return;
    }

    setOrder(foundOrder);
    const statusIndex = statusSteps.findIndex((s) => s.key === foundOrder.status);
    setCurrentStatusIndex(statusIndex >= 0 ? statusIndex : 0);

    // Имитация обновления статуса заказа
    if (foundOrder.status !== 'completed') {
      const interval = setInterval(() => {
        setCurrentStatusIndex((prev) => {
          if (prev < statusSteps.length - 1) {
            const newIndex = prev + 1;
            // Обновляем статус в localStorage
            const updatedOrders = getOrders();
            const orderIndex = updatedOrders.findIndex((o) => o.id === orderId);
            if (orderIndex >= 0) {
              updatedOrders[orderIndex].status = statusSteps[newIndex].key as Order['status'];
              localStorage.setItem('coffee_orders', JSON.stringify(updatedOrders));
              setOrder(updatedOrders[orderIndex]);
            }
            return newIndex;
          }
          return prev;
        });
      }, 5000); // Меняем статус каждые 5 секунд для демо

      return () => clearInterval(interval);
    }

    // Баллы уже начислены при создании заказа в checkout
  }, [orderId, router]);

  if (!order) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  const currentStep = statusSteps[currentStatusIndex];

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Заказ #{order.id.slice(-6)}</h1>
          <p className="text-gray-600">Отслеживание статуса</p>
        </div>
      </div>

      {/* Статус заказа */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${
            currentStep.color === 'yellow' ? 'bg-yellow-500' :
            currentStep.color === 'blue' ? 'bg-blue-500' :
            currentStep.color === 'green' ? 'bg-green-500' :
            currentStep.color === 'purple' ? 'bg-purple-500' : 'bg-gray-500'
          }`}>
            <currentStep.icon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{currentStep.label}</h2>
            <p className="text-sm text-gray-600">
              {order.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}
            </p>
          </div>
        </div>

        {/* Прогресс */}
        <div className="space-y-4 relative">
          {statusSteps.map((step, index) => {
            const isActive = index <= currentStatusIndex;
            const StepIcon = step.icon;
            const colorClass = step.color === 'yellow' ? 'bg-yellow-500' :
              step.color === 'blue' ? 'bg-blue-500' :
              step.color === 'green' ? 'bg-green-500' :
              step.color === 'purple' ? 'bg-purple-500' : 'bg-gray-500';

            return (
              <div key={step.key} className="flex items-center gap-4 relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isActive ? `${colorClass} text-white` : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      isActive ? 'text-gray-800' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`absolute left-5 top-10 w-0.5 h-8 ${
                      isActive ? colorClass : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Детали заказа */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Детали заказа</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{item.product.name}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} × {item.product.price} ₽
                </p>
              </div>
              <p className="font-bold text-gray-800">
                {item.product.price * item.quantity} ₽
              </p>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg text-gray-800">Итого:</p>
              <p className="font-bold text-lg bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                {order.total} ₽
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Баллы лояльности */}
      {order.loyaltyPointsEarned > 0 && (
        <motion.div
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card 
            className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white cursor-pointer"
            onClick={() => router.push('/loyalty')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Начислено баллов</p>
                <p className="text-3xl font-bold">+{order.loyaltyPointsEarned}</p>
                <p className="text-white/80 text-xs mt-1">Нажмите, чтобы посмотреть баланс</p>
              </div>
              <motion.div 
                className="text-4xl cursor-pointer"
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                🎁
              </motion.div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Кнопки действий */}
      <div className="space-y-3">
        <Button
          onClick={() => router.push('/menu')}
          fullWidth
          variant="secondary"
        >
          Сделать новый заказ
        </Button>
        <Button
          onClick={() => router.push('/chat')}
          fullWidth
          variant="outline"
        >
          Написать в кафе
        </Button>
      </div>
    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={<div className="px-4 py-6">Загрузка...</div>}>
      <OrderStatusPageContent />
    </Suspense>
  );
}

