/*
  # NoQ Database Schema

  1. New Tables
    - `shops`: Store information
    - `items`: Product inventory
    - `queue_tokens`: Queue management
    - `orders`: Order tracking
    - `order_items`: Order details
    - `completed_tokens`: Archive of used tokens

  2. Security
    - RLS enabled on all tables
    - Policies for public access and authenticated users
*/

-- Create shops table
CREATE TABLE shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create items table
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  category text NOT NULL,
  name text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  cost decimal(10,2) NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create completed_tokens table for archiving
CREATE TABLE completed_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_number integer NOT NULL,
  created_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create queue_tokens table
CREATE TABLE queue_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  token_number integer NOT NULL,
  slot_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'cancelled'))
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  queue_token_id uuid REFERENCES queue_tokens(id) ON DELETE SET NULL,
  total_amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'paid', 'completed'))
);

-- Create order_items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  item_id uuid REFERENCES items(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view shops"
  ON shops FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view items"
  ON items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view their own queue tokens"
  ON queue_tokens FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create queue tokens"
  ON queue_tokens FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create function to update expired tokens
CREATE OR REPLACE FUNCTION update_expired_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Move expired tokens to completed_tokens
  INSERT INTO completed_tokens (token_number, created_date)
  SELECT token_number, DATE(created_at)
  FROM queue_tokens
  WHERE status = 'pending'
  AND expires_at < NOW();

  -- Update status to cancelled
  UPDATE queue_tokens
  SET status = 'cancelled'
  WHERE status = 'pending'
  AND expires_at < NOW();
END;
$$;

-- Create function to get next token number
CREATE OR REPLACE FUNCTION get_next_token_number(p_date date)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_max_number integer;
BEGIN
  -- Get the maximum token number used today
  SELECT COALESCE(MAX(token_number), 0)
  INTO v_max_number
  FROM queue_tokens
  WHERE DATE(created_at) = p_date;

  -- Return next number, starting from 1
  RETURN v_max_number + 1;
END;
$$;