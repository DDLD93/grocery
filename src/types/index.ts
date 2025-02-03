export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  stock_quantity: number;
  is_available: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
}

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