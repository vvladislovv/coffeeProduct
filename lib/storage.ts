import { CartItem, Order, UserInfo, ChatMessage, LoyaltyTransaction } from './types';

const STORAGE_KEYS = {
  CART: 'coffee_cart',
  ORDERS: 'coffee_orders',
  USER_INFO: 'coffee_user_info',
  CHAT_MESSAGES: 'coffee_chat_messages',
  LOYALTY_POINTS: 'coffee_loyalty_points',
  LOYALTY_TRANSACTIONS: 'coffee_loyalty_transactions',
};

// Cart
export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.CART);
  return data ? JSON.parse(data) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};

export const clearCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CART);
};

// Orders
export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

export const saveOrder = (order: Order): void => {
  if (typeof window === 'undefined') return;
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

// User Info
export const getUserInfo = (): UserInfo | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.USER_INFO);
  return data ? JSON.parse(data) : null;
};

export const saveUserInfo = (info: UserInfo): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(info));
};

// Chat Messages
export const getChatMessages = (): ChatMessage[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
  return data ? JSON.parse(data) : [];
};

export const saveChatMessage = (message: ChatMessage): void => {
  if (typeof window === 'undefined') return;
  const messages = getChatMessages();
  messages.push(message);
  localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
};

// Loyalty Points
export const getLoyaltyPoints = (): number => {
  if (typeof window === 'undefined') return 0;
  const data = localStorage.getItem(STORAGE_KEYS.LOYALTY_POINTS);
  return data ? parseInt(data, 10) : 100; // Начальные баллы для демо
};

export const setLoyaltyPoints = (points: number): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LOYALTY_POINTS, points.toString());
};

export const addLoyaltyPoints = (points: number): void => {
  const current = getLoyaltyPoints();
  setLoyaltyPoints(current + points);
};

export const subtractLoyaltyPoints = (points: number): void => {
  const current = getLoyaltyPoints();
  setLoyaltyPoints(Math.max(0, current - points));
};

// Loyalty Transactions
export const getLoyaltyTransactions = (): LoyaltyTransaction[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.LOYALTY_TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveLoyaltyTransaction = (transaction: LoyaltyTransaction): void => {
  if (typeof window === 'undefined') return;
  const transactions = getLoyaltyTransactions();
  transactions.unshift(transaction);
  localStorage.setItem(STORAGE_KEYS.LOYALTY_TRANSACTIONS, JSON.stringify(transactions));
};

export const addLoyaltyTransaction = saveLoyaltyTransaction;

