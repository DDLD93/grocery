export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
  is_available: boolean;
  is_organic?: boolean;
  unit?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export const PRODUCT_CATEGORIES: Category[] = [
  { id: 'fruits-veg', name: 'Fruits & Vegetables', color: 'green' },
  { id: 'dairy-eggs', name: 'Dairy & Eggs', color: 'yellow' },
  { id: 'meat-fish', name: 'Meat & Fish', color: 'red' },
  { id: 'bakery', name: 'Bakery', color: 'orange' },
  { id: 'beverages', name: 'Beverages', color: 'blue' },
  { id: 'snacks', name: 'Snacks', color: 'purple' },
  { id: 'household', name: 'Household', color: 'gray' },
  { id: 'frozen', name: 'Frozen Foods', color: 'cyan' }
];

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  address: string | null;
  dietary_preferences: string[];
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  review_text: string | null;
  sentiment_score: number | null;
}

export interface Recommendation {
  id: string;
  product_id: string;
  score: number;
  reason: string | null;
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone_number: string | null;
  address: string | null;
  dietary_preferences: string[];
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phone_number: string;
  address: string;
  dietary_preferences: string[];
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface UserInsights {
  overallScore: number;
  healthScore: number;
  sustainabilityScore: number;
  budgetScore: number;
  categoryDistribution: {
    category: string;
    percentage: number;
  }[];
  alerts: string[];
}