-- E-commerce Sales Analytics Database - Advanced Analytics
-- Dialect: PostgreSQL

-- 1. Customer Lifetime Value (CLV) Analysis using CTEs
-- Categorizes users into tiers based on their spending.
WITH UserSpending AS (
    SELECT 
        u.user_id,
        u.first_name,
        u.last_name,
        COUNT(o.order_id) AS total_orders,
        COALESCE(SUM(o.total_amount), 0) AS total_spent
    FROM users u
    LEFT JOIN orders o ON u.user_id = o.user_id AND o.status = 'DELIVERED'
    GROUP BY u.user_id, u.first_name, u.last_name
)
SELECT 
    *,
    CASE 
        WHEN total_spent > 1000 THEN 'VIP'
        WHEN total_spent > 500 THEN 'Loyal'
        WHEN total_spent > 0 THEN 'Active'
        ELSE 'New/Inactive'
    END AS customer_tier
FROM UserSpending
ORDER BY total_spent DESC;

-- 2. 3-Month Moving Average of Sales using Window Functions
-- Helps identify trends by smoothing out monthly fluctuations.
WITH MonthlySales AS (
    SELECT 
        DATE_TRUNC('month', order_date) AS sales_month,
        SUM(total_amount) AS monthly_revenue
    FROM orders
    WHERE status IN ('SHIPPED', 'DELIVERED', 'COMPLETED')
    GROUP BY 1
)
SELECT 
    sales_month,
    monthly_revenue,
    AVG(monthly_revenue) OVER (
        ORDER BY sales_month 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3_months
FROM MonthlySales
ORDER BY sales_month;

-- 3. Category Sales Ranking per Month
-- Ranks categories by revenue for each month.
WITH CategoryMonthlySales AS (
    SELECT 
        DATE_TRUNC('month', o.order_date) AS sales_month,
        c.name AS category_name,
        SUM(oi.subtotal) AS category_revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN products p ON oi.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    WHERE o.status IN ('SHIPPED', 'DELIVERED', 'COMPLETED')
    GROUP BY 1, 2
)
SELECT 
    sales_month,
    category_name,
    category_revenue,
    RANK() OVER (PARTITION BY sales_month ORDER BY category_revenue DESC) AS rank_in_month
FROM CategoryMonthlySales
ORDER BY sales_month DESC, rank_in_month;

-- 4. Product Churn / Repurchase Rate
-- Finds how many unique customers bought a product more than once.
SELECT 
    p.name AS product_name,
    COUNT(DISTINCT o.user_id) AS unique_buyers,
    COUNT(o.order_id) AS total_purchases,
    CAST(COUNT(o.order_id) AS FLOAT) / NULLIF(COUNT(DISTINCT o.user_id), 0) AS avg_purchases_per_buyer
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
JOIN products p ON oi.product_id = p.product_id
GROUP BY p.name
HAVING COUNT(DISTINCT o.user_id) > 0
ORDER BY avg_purchases_per_buyer DESC;
