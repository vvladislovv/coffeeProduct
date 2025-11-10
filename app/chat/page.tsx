'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle } from 'lucide-react';
import ChatBubble from '@/components/chat/ChatBubble';
import { getChatMessages, saveChatMessage } from '@/lib/storage';
import { ChatMessage } from '@/lib/types';
import Button from '@/components/ui/Button';

const quickMessages = [
  'Здравствуйте! 👋',
  'Какое время работы?',
  'Есть ли доставка?',
  'Спасибо за отличный сервис!',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = getChatMessages();
    if (savedMessages.length === 0) {
      // Добавляем приветственное сообщение от кафе
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: 'Добро пожаловать! 👋 Чем могу помочь?',
        sender: 'cafe',
        timestamp: new Date().toISOString(),
      };
      saveChatMessage(welcomeMessage);
      setMessages([welcomeMessage]);
    } else {
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Сообщение пользователя
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    saveChatMessage(userMessage);
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Автоматический ответ от кафе (имитация)
    setTimeout(() => {
      const responses = [
        'Спасибо за ваше сообщение! Мы обязательно ответим в ближайшее время.',
        'Понял! Передаю информацию нашим сотрудникам.',
        'Отлично! Мы работаем с 9:00 до 22:00. Доставка доступна с 10:00 до 21:00.',
        'Благодарим за отзыв! Мы рады, что вам понравилось! 😊',
        'Конечно! Можем помочь с выбором блюд или ответить на вопросы.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const cafeMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'cafe',
        timestamp: new Date().toISOString(),
      };

      saveChatMessage(cafeMessage);
      setMessages((prev) => [...prev, cafeMessage]);
    }, 1000);
  };

  const handleQuickMessage = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] px-4 py-6">
      {/* Заголовок */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Чат с кафе 💬</h1>
        <p className="text-gray-600">Задайте вопрос или оставьте отзыв</p>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.length > 0 ? (
          messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Начните общение</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Быстрые сообщения */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Быстрые сообщения:</p>
          <div className="flex flex-wrap gap-2">
            {quickMessages.map((msg, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickMessage(msg)}
                className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {msg}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Поле ввода */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Напишите сообщение..."
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim()}
          className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

