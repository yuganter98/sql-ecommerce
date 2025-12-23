-- E-commerce Sales Analytics Database - Stored Procedures
-- Dialect: PostgreSQL

-- 1. Procedure to Place an Order (Transactional)
CREATE OR REPLACE PROCEDURE sp_PlaceOrder(
    p_user_id UUID,
    p_product_id UUID,
    p_quantity INTEGER,
    p_payment_method VARCHAR,
    p_shipping_address TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_product_price DECIMAL(10, 2);
    v_current_stock INTEGER;
    v_order_id UUID;
    v_total_amount DECIMAL(12, 2);
BEGIN
    -- Check stock and get price
    SELECT price, stock_quantity INTO v_product_price, v_current_stock
    FROM products
    WHERE product_id = p_product_id;

    IF v_current_stock < p_quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product %', p_product_id;
    END IF;

    -- Calculate total
    v_total_amount := v_product_price * p_quantity;

    -- Start Transaction (Implicit in Procedures, but we ensure logic consistency)
    
    -- 1. Create Order
    INSERT INTO orders (user_id, total_amount, shipping_address, status)
    VALUES (p_user_id, v_total_amount, p_shipping_address, 'PENDING')
    RETURNING order_id INTO v_order_id;

    -- 2. Create Order Item
    INSERT INTO order_items (order_id, product_id, quantity, unit_price)
    VALUES (v_order_id, p_product_id, p_quantity, v_product_price);

    -- 3. Record Payment
    INSERT INTO payments (order_id, amount, payment_method, status)
    VALUES (v_order_id, v_total_amount, p_payment_method, 'COMPLETED');

    -- 4. Update Stock (Trigger will handle this, but we can also do it here explicitly if no trigger)
    -- UPDATE products SET stock_quantity = stock_quantity - p_quantity WHERE product_id = p_product_id;
    
    -- Commit is automatic at end of procedure if no error
END;
$$;

-- 2. Procedure to Update Stock (Manual adjustment)
CREATE OR REPLACE PROCEDURE sp_UpdateStock(
    p_product_id UUID,
    p_quantity_change INTEGER,
    p_reason VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update product stock
    UPDATE products 
    SET stock_quantity = stock_quantity + p_quantity_change,
        updated_at = CURRENT_TIMESTAMP
    WHERE product_id = p_product_id;

    -- Log the change (Trigger might also do this, but explicit procedure is good for manual admin actions)
    INSERT INTO inventory_logs (product_id, change_amount, reason)
    VALUES (p_product_id, p_quantity_change, p_reason);
END;
$$;
