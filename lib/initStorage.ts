// Инициализация localStorage при первом запуске
export const initStorage = () => {
  if (typeof window === 'undefined') return;

  // Инициализация баллов лояльности
  const loyaltyPoints = localStorage.getItem('coffee_loyalty_points');
  if (!loyaltyPoints) {
    localStorage.setItem('coffee_loyalty_points', '100');
  }

  // Инициализация корзины
  const cart = localStorage.getItem('coffee_cart');
  if (!cart) {
    localStorage.setItem('coffee_cart', '[]');
  }

  // Инициализация заказов
  const orders = localStorage.getItem('coffee_orders');
  if (!orders) {
    localStorage.setItem('coffee_orders', '[]');
  }

  // Инициализация сообщений чата
  const chatMessages = localStorage.getItem('coffee_chat_messages');
  if (!chatMessages) {
    localStorage.setItem('coffee_chat_messages', '[]');
  }

  // Инициализация транзакций лояльности
  const loyaltyTransactions = localStorage.getItem('coffee_loyalty_transactions');
  if (!loyaltyTransactions) {
    localStorage.setItem('coffee_loyalty_transactions', '[]');
  }
};

