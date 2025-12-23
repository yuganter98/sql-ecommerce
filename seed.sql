-- E-commerce Sales Analytics Database - Seed Data
-- Dialect: PostgreSQL

-- 1. Seed Categories
INSERT INTO categories (name, description, parent_id) VALUES
('Electronics', 'Gadgets and devices', NULL),
('Clothing', 'Apparel for men and women', NULL),
('Home & Garden', 'Furniture and decor', NULL);

-- Subcategories
INSERT INTO categories (name, description, parent_id) 
SELECT 'Smartphones', 'Mobile phones', category_id FROM categories WHERE name = 'Electronics';

INSERT INTO categories (name, description, parent_id) 
SELECT 'Laptops', 'Notebooks and PCs', category_id FROM categories WHERE name = 'Electronics';

INSERT INTO categories (name, description, parent_id) 
SELECT 'T-Shirts', 'Casual wear', category_id FROM categories WHERE name = 'Clothing';

-- 2. Seed Products
INSERT INTO products (category_id, name, description, price, stock_quantity, sku)
SELECT category_id, 'iPhone 15 Pro', 'Latest Apple smartphone', 999.99, 50, 'IPH15-PRO'
FROM categories WHERE name = 'Smartphones';

INSERT INTO products (category_id, name, description, price, stock_quantity, sku)
SELECT category_id, 'Samsung Galaxy S24', 'Flagship Android phone', 899.99, 75, 'SGS24-ULTRA'
FROM categories WHERE name = 'Smartphones';

INSERT INTO products (category_id, name, description, price, stock_quantity, sku)
SELECT category_id, 'MacBook Air M3', 'Lightweight laptop', 1199.00, 30, 'MBA-M3-13'
FROM categories WHERE name = 'Laptops';

INSERT INTO products (category_id, name, description, price, stock_quantity, sku)
SELECT category_id, 'Cotton Crew Neck', 'Basic white t-shirt', 19.99, 200, 'TSHIRT-WHT-L'
FROM categories WHERE name = 'T-Shirts';

-- 3. Seed Users (Dummy data)
INSERT INTO users (first_name, last_name, email, password_hash, city, country) VALUES
('John', 'Doe', 'john.doe@example.com', 'hash123', 'New York', 'USA'),
('Jane', 'Smith', 'jane.smith@example.com', 'hash456', 'London', 'UK'),
('Alice', 'Johnson', 'alice.j@example.com', 'hash789', 'Toronto', 'Canada'),
('Bob', 'Brown', 'bob.brown@example.com', 'hash000', 'Sydney', 'Australia');

-- 4. Seed Orders & Order Items
-- Order 1: John Doe buys an iPhone
INSERT INTO orders (user_id, status, total_amount, shipping_address)
SELECT user_id, 'DELIVERED', 999.99, '123 Main St, NY'
FROM users WHERE email = 'john.doe@example.com';

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT 
    (SELECT order_id FROM orders WHERE user_id = (SELECT user_id FROM users WHERE email = 'john.doe@example.com') LIMIT 1),
    (SELECT product_id FROM products WHERE sku = 'IPH15-PRO'),
    1,
    999.99;

-- Order 2: Jane Smith buys a Laptop and T-Shirt
INSERT INTO orders (user_id, status, total_amount, shipping_address)
SELECT user_id, 'SHIPPED', 1218.99, '456 High St, London'
FROM users WHERE email = 'jane.smith@example.com';

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT 
    (SELECT order_id FROM orders WHERE user_id = (SELECT user_id FROM users WHERE email = 'jane.smith@example.com') LIMIT 1),
    (SELECT product_id FROM products WHERE sku = 'MBA-M3-13'),
    1,
    1199.00;

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT 
    (SELECT order_id FROM orders WHERE user_id = (SELECT user_id FROM users WHERE email = 'jane.smith@example.com') LIMIT 1),
    (SELECT product_id FROM products WHERE sku = 'TSHIRT-WHT-L'),
    1,
    19.99;

-- 5. Seed Reviews
INSERT INTO reviews (product_id, user_id, rating, comment)
SELECT 
    (SELECT product_id FROM products WHERE sku = 'IPH15-PRO'),
    (SELECT user_id FROM users WHERE email = 'john.doe@example.com'),
    5,
    'Amazing phone, love the camera!';

INSERT INTO reviews (product_id, user_id, rating, comment)
SELECT 
    (SELECT product_id FROM products WHERE sku = 'MBA-M3-13'),
    (SELECT user_id FROM users WHERE email = 'jane.smith@example.com'),
    4,
    'Great laptop but a bit expensive.';
