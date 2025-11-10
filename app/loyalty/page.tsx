'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, TrendingUp, TrendingDown, Star } from 'lucide-react';
import Card from '@/components/ui/Card';
import { getLoyaltyPoints, getLoyaltyTransactions, addLoyaltyPoints } from '@/lib/storage';
import { LoyaltyTransaction } from '@/lib/types';

export default function LoyaltyPage() {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);

  useEffect(() => {
    updateData();
  }, []);

  const updateData = () => {
    setPoints(getLoyaltyPoints());
    setTransactions(getLoyaltyTransactions());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Программа лояльности 🎁</h1>
        <p className="text-gray-600">Копите баллы и получайте скидки</p>
      </div>

      {/* Карточка с баллами */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-8 text-white shadow-2xl"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Ваш баланс</p>
              <h2 className="text-5xl font-bold">{points}</h2>
              <p className="text-white/80 text-sm mt-1">баллов</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Gift className="w-10 h-10" />
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-4">
            <p className="text-sm text-white/90">
              <Star className="w-4 h-4 inline mr-1" />
              1 балл = 1 рубль скидки
            </p>
            <p className="text-sm text-white/90 mt-1">
              <Star className="w-4 h-4 inline mr-1" />
              Начисляем 5% от суммы заказа
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
      </motion.div>

      {/* Правила программы */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-pink-50">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-orange-500" />
          Как это работает?
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold text-gray-800">Делайте заказы</p>
              <p className="text-sm text-gray-600">За каждый заказ начисляются баллы</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold text-gray-800">Копите баллы</p>
              <p className="text-sm text-gray-600">5% от суммы каждого заказа</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-semibold text-gray-800">Используйте баллы</p>
              <p className="text-sm text-gray-600">Оплачивайте до 100% стоимости заказа</p>
            </div>
          </div>
        </div>
      </Card>

      {/* История транзакций */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">История операций</h3>
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'earned'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {transaction.type === 'earned' ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <TrendingDown className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div
                      className={`font-bold ${
                        transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'earned' ? '+' : '-'}
                      {transaction.amount}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Пока нет операций</p>
            <p className="text-sm text-gray-400 mt-1">Сделайте первый заказ, чтобы начать копить баллы!</p>
          </Card>
        )}
      </div>
    </div>
  );
}

