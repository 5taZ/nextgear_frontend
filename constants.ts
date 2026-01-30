import { Product, User } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nike Dunk Low Retro',
    price: 14990,
    image: 'https://picsum.photos/400/400?random=1',
    description: 'Classic panda colorway, authentic verification included.',
    category: 'Sneakers',
    inStock: true,
  },
  {
    id: '2',
    name: 'Supreme Box Logo Tee',
    price: 12500,
    image: 'https://picsum.photos/400/400?random=2',
    description: 'FW23 Collection, Size L, White.',
    category: 'Clothing',
    inStock: true,
  },
  {
    id: '3',
    name: 'Yeezy Slide Pure',
    price: 8990,
    image: 'https://picsum.photos/400/400?random=3',
    description: 'Softest foam slides, Size 10 US.',
    category: 'Sneakers',
    inStock: false,
  },
  {
    id: '4',
    name: 'PS5 Digital Edition',
    price: 45000,
    image: 'https://picsum.photos/400/400?random=4',
    description: 'Brand new, sealed. Japanese version.',
    category: 'Electronics',
    inStock: true,
  },
  {
    id: '5',
    name: 'Stone Island Hoodie',
    price: 22000,
    image: 'https://picsum.photos/400/400?random=5',
    description: 'Garment dyed, black, patch on arm.',
    category: 'Clothing',
    inStock: true,
  },
];

export const MOCK_USER: User = {
  username: 'reseller_king',
  balance: 0,
  referrals: 12,
  referralLink: 'https://t.me/ResellHubBot?start=ref123',
  isAdmin: false, // Toggled via UI for demo
};