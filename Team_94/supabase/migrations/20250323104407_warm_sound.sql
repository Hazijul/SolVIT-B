/*
  # Insert Sample Data

  1. Data Population
    - Insert shop data for Safal and Mayuri
    - Insert inventory items for both shops
    
  2. Notes
    - Using provided sample data
    - Maintaining referential integrity
*/

-- Insert shops
INSERT INTO shops (id, name, location) VALUES
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Safal', 'VIT Bhopal'),
  ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Mayuri', 'VIT Bhopal');

-- Insert items for Safal
INSERT INTO items (shop_id, category, name, stock, cost) VALUES
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Food', 'Bread', 45, 30.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Food', 'Pasta', 28, 50.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Food', 'Milk (1L)', 40, 60.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Food', 'Cheese', 32, 80.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Food', 'Salt (1kg)', 42, 20.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Toiletries', 'Toothpaste', 38, 55.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Toiletries', 'Deodorant', 28, 150.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Toiletries', 'Lotion', 30, 120.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Toiletries', 'Shaving Cream', 18, 95.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Toiletries', 'Face Wash', 32, 130.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Household Items', 'Floor Cleaner', 38, 110.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Household Items', 'Air Freshener', 30, 180.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Household Items', 'Sponges (Pack)', 35, 50.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Household Items', 'Broom', 22, 140.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Food', 'Honey (500g)', 25, 200.00);

-- Insert items for Mayuri
INSERT INTO items (shop_id, category, name, stock, cost) VALUES
  ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Food', 'Bread', 50, 30.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Food', 'Rice (5kg)', 40, 250.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Food', 'Pasta', 30, 50.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Food', 'Canned Tuna', 25, 150.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Food', 'Peanut Butter', 20, 180.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Food', 'Milk (1L)', 35, 60.00),
  ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Food', 'Cheese', 28, 80.00);