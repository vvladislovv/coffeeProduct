export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  emoji?: string;
  category: string;
  available: boolean;
  addons?: Addon[];
  sizes?: { id: string; name: string; price: number }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedAddons?: Addon[];
  selectedSize?: { id: string; name: string; price: number };
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: 'online' | 'cash';
  address?: string;
  phone: string;
  name: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'completed';
  createdAt: string;
  loyaltyPointsUsed: number;
  loyaltyPointsEarned: number;
}

export interface UserInfo {
  name: string;
  phone: string;
  address?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'cafe';
  timestamp: string;
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  date: string;
}

