-- E-commerce Sales Analytics Database - Views
-- Dialect: PostgreSQL

-- 1. View: Monthly Sales Report
CREATE OR REPLACE VIEW v_MonthlySales AS
SELECT 
    DATE_TRUNC('month', order_date) AS sales_month,
    COUNT(order_id) AS total_orders,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS average_order_value
FROM orders
WHERE status IN ('SHIPPED', 'DELIVERED', 'COMPLETED')
GROUP BY 1
ORDER BY 1 DESC;

-- 2. View: Product Performance
CREATE OR REPLACE VIEW v_ProductPerformance AS
SELECT 
    p.product_id,
    p.name AS product_name,
    c.name AS category_name,
    SUM(oi.quantity) AS total_units_sold,
    SUM(oi.subtotal) AS total_revenue,
    p.stock_quantity AS current_stock
FROM products p
JOIN categories c ON p.category_id = c.category_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.order_id
WHERE o.status IN ('SHIPPED', 'DELIVERED', 'COMPLETED') OR o.status IS NULL
GROUP BY p.product_id, p.name, c.name, p.stock_quantity
ORDER BY total_revenue DESC;

-- 3. View: Customer Activity Summary
CREATE OR REPLACE VIEW v_CustomerActivity AS
SELECT 
    u.user_id,
    u.first_name || ' ' || u.last_name AS full_name,
    u.email,
    COUNT(o.order_id) AS total_orders,
    SUM(o.total_amount) AS lifetime_value,
    MAX(o.order_date) AS last_order_date
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id, full_name, u.email
ORDER BY lifetime_value DESC;
