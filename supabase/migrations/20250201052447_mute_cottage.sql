/*
  # Initial Schema for Grocery Recommendation System

  1. New Tables
    - `users`
      - Extended user profile data
      - Preferences and dietary restrictions
    - `products`
      - Grocery items with categories and attributes
      - Regional pricing and availability
    - `categories`
      - Product categorization
    - `orders`
      - Order tracking and history
    - `order_items`
      - Individual items in orders
    - `reviews`
      - Product reviews with sentiment data
    - `recommendations`
      - User-specific product recommendations
    - `search_history`
      - User search patterns for better recommendations

  2. Security
    - RLS policies for all tables
    - Secure access patterns
    - Data isolation

  3. Indexes
    - Optimized for search and filtering
    - Performance-focused composite indexes
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS categories_name_trgm_idx ON categories USING gin (name gin_trgm_ops);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  -- category_id uuid REFERENCES categories(id),
  stock_quantity integer NOT NULL DEFAULT 0,
  image_url text,
  is_available boolean DEFAULT true,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_search_idx ON products USING gin(search_vector);
CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON products USING gin (name gin_trgm_ops);

-- Extended User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  phone_number text,
  address text,
  dietary_preferences jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'pending',
  total_amount decimal(10,2) NOT NULL,
  shipping_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id uuid REFERENCES products(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  sentiment_score decimal(3,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Search History
CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  search_query text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id uuid REFERENCES products(id),
  score decimal(5,4) NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public categories access" ON categories
  FOR SELECT TO public USING (true);

CREATE POLICY "Public products access" ON products
  FOR SELECT TO public USING (true);

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public review access" ON reviews
  FOR SELECT TO public USING (true);

CREATE POLICY "Users can view own search history" ON search_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recommendations" ON recommendations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);