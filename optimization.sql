-- E-commerce Sales Analytics Database - Optimization & Performance
-- Dialect: PostgreSQL

-- 1. Additional Indexes for Analytics
-- Index on order_date for faster date-range filtering and grouping
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);

-- Index on product name for search performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Composite index for Order Items (order_id + product_id) is often useful for joins
CREATE INDEX IF NOT EXISTS idx_order_items_composite ON order_items(order_id, product_id);

-- 2. Partial Index for Active Products
-- Only index products that are active, saving space and speeding up user-facing queries
CREATE INDEX IF NOT EXISTS idx_products_active ON products(product_id) WHERE is_active = TRUE;

-- 3. EXPLAIN ANALYZE Examples (Comments explain what to look for)

-- Example A: Analyze the Monthly Sales Query
-- Run this to see if it uses the idx_orders_date index
/*
EXPLAIN ANALYZE
SELECT 
    DATE_TRUNC('month', order_date) AS sales_month,
    SUM(total_amount) AS monthly_revenue
FROM orders
WHERE status = 'DELIVERED'
GROUP BY 1;
*/

-- Example B: Analyze Customer Lookup by Email
-- Should use the UNIQUE constraint index on email
/*
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'john.doe@example.com';
*/

-- 4. Database Maintenance (Conceptual)
-- In a real production environment, you would schedule these:
-- VACUUM ANALYZE; -- Reclaims storage and updates statistics for the query planner
