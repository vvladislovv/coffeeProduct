export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
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

