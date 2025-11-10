'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Coffee, ShoppingBag, Gift, MessageCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { categories } from '@/lib/data';
import { getLoyaltyPoints } from '@/lib/storage';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // Убеждаемся, что данные инициализированы
    const points = getLoyaltyPoints();
    setPoints(points || 100); // Показываем минимум 100 баллов для демо
  }, []);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Приветственный баннер */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 p-6 shadow-2xl"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">Добро пожаловать! 👋</h1>
          <p className="text-white drop-shadow-md mb-4">Заказывайте любимый кофе за 2 клика</p>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 w-fit">
            <Gift className="w-5 h-5 text-white" />
            <span className="font-semibold text-white drop-shadow-md">{points || 100} баллов</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
      </motion.div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            onClick={() => router.push('/menu')}
            className="bg-gradient-to-br from-orange-400 to-red-500 p-6 text-center h-full flex flex-col items-center justify-center rounded-2xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <Coffee className="w-8 h-8 mb-2 text-white drop-shadow-lg" />
            <h3 className="font-bold text-lg text-white drop-shadow-md">Меню</h3>
            <p className="text-sm text-white drop-shadow-sm mt-1">Выбрать блюда</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            onClick={() => router.push('/loyalty')}
            className="bg-gradient-to-br from-purple-400 to-pink-500 p-6 text-center h-full flex flex-col items-center justify-center rounded-2xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <Gift className="w-8 h-8 mb-2 text-white drop-shadow-lg" />
            <h3 className="font-bold text-lg text-white drop-shadow-md">Бонусы</h3>
            <p className="text-sm text-white drop-shadow-sm mt-1">Программа лояльности</p>
          </div>
        </motion.div>
      </div>

      {/* Категории */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-orange-500" />
          Категории
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card
                onClick={() => router.push(`/menu?category=${category.id}`)}
                hover
                className="p-4 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                  <span className="text-4xl">
                    {category.emoji}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mt-2">{category.name}</h3>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Акция */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-gray-100 to-gray-50 p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1 text-gray-800">🎉 Акция дня!</h3>
              <p className="text-gray-700">Скидка 20% на все напитки до конца недели</p>
            </div>
            <div className="text-4xl">🎁</div>
          </div>
        </Card>
      </motion.div>

      {/* Кнопка перехода в меню */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => router.push('/menu')}
          fullWidth
          size="lg"
          className="shadow-2xl"
        >
          Открыть меню →
        </Button>
      </motion.div>

      {/* Чат */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card
          onClick={() => router.push('/chat')}
          hover
          className="flex items-center gap-4 p-4"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">Написать в кафе</h3>
            <p className="text-sm text-gray-600">Задать вопрос или оставить отзыв</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

