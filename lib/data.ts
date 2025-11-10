import { Product } from './types';

export const products: Product[] = [
  // Горячие напитки
  {
    id: '1',
    name: 'Эспрессо',
    description: 'Классический крепкий кофе',
    price: 150,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&h=600&fit=crop&auto=format',
    category: 'hot',
    available: true,
  },
  {
    id: '2',
    name: 'Капучино',
    description: 'Эспрессо с молочной пеной',
    price: 200,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=600&fit=crop&auto=format',
    category: 'hot',
    available: true,
  },
  {
    id: '3',
    name: 'Латте',
    description: 'Эспрессо с молоком и пеной',
    price: 220,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=600&fit=crop&auto=format',
    category: 'hot',
    available: true,
  },
  {
    id: '4',
    name: 'Американо',
    description: 'Эспрессо с горячей водой',
    price: 180,
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&auto=format',
    category: 'hot',
    available: true,
  },
  {
    id: '5',
    name: 'Раф кофе',
    description: 'Кофе с ванильным сахаром и сливками',
    price: 250,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format',
    category: 'hot',
    available: true,
  },
  // Холодные напитки
  {
    id: '6',
    name: 'Айс Латте',
    description: 'Латте со льдом',
    price: 240,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&auto=format',
    category: 'cold',
    available: true,
  },
  {
    id: '7',
    name: 'Фраппе',
    description: 'Холодный кофе со льдом и молоком',
    price: 260,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&auto=format',
    category: 'cold',
    available: true,
  },
  {
    id: '8',
    name: 'Мохито',
    description: 'Освежающий напиток с мятой',
    price: 200,
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800&h=600&fit=crop&auto=format',
    category: 'cold',
    available: true,
  },
  {
    id: '9',
    name: 'Лимонад',
    description: 'Свежий лимонад с мятой',
    price: 180,
    image: 'https://images.unsplash.com/photo-1523677011783-c91d1bbe2fdc?w=800&h=600&fit=crop&auto=format',
    category: 'cold',
    available: true,
  },
  // Десерты
  {
    id: '10',
    name: 'Чизкейк',
    description: 'Нежный чизкейк с ягодами',
    price: 320,
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=600&fit=crop&auto=format',
    category: 'dessert',
    available: true,
  },
  {
    id: '11',
    name: 'Тирамису',
    description: 'Классический итальянский десерт',
    price: 350,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop&auto=format',
    category: 'dessert',
    available: true,
  },
  {
    id: '12',
    name: 'Брауни',
    description: 'Шоколадный брауни с мороженым',
    price: 280,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&auto=format',
    category: 'dessert',
    available: true,
  },
  {
    id: '13',
    name: 'Круассан',
    description: 'Свежий круассан с джемом',
    price: 150,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop&auto=format',
    category: 'dessert',
    available: true,
  },
  // Еда
  {
    id: '14',
    name: 'Сэндвич с курицей',
    description: 'Свежий сэндвич с курицей и овощами',
    price: 380,
    image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=800&h=600&fit=crop&auto=format',
    category: 'food',
    available: true,
  },
  {
    id: '15',
    name: 'Салат Цезарь',
    description: 'Классический салат с курицей',
    price: 420,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&auto=format',
    category: 'food',
    available: true,
  },
  {
    id: '16',
    name: 'Паста Карбонара',
    description: 'Итальянская паста с беконом',
    price: 450,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&auto=format',
    category: 'food',
    available: true,
  },
];

export const categories = [
  { 
    id: 'hot', 
    name: 'Горячие напитки', 
    icon: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=100&h=100&fit=crop&auto=format',
    emoji: '☕'
  },
  { 
    id: 'cold', 
    name: 'Холодные напитки', 
    icon: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100&h=100&fit=crop&auto=format',
    emoji: '🧊'
  },
  { 
    id: 'dessert', 
    name: 'Десерты', 
    icon: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=100&h=100&fit=crop&auto=format',
    emoji: '🍰'
  },
  { 
    id: 'food', 
    name: 'Еда', 
    icon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop&auto=format',
    emoji: '🍽️'
  },
];

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
};

