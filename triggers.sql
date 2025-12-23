-- E-commerce Sales Analytics Database - Triggers
-- Dialect: PostgreSQL

-- 1. Trigger Function: Auto-update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION fn_UpdateTimestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION fn_UpdateTimestamp();

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION fn_UpdateTimestamp();

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION fn_UpdateTimestamp();

-- 2. Trigger Function: Update Stock on Order Placement
-- Note: This is an alternative to doing it in the Stored Procedure. 
-- It ensures that ANY insert into order_items deducts stock.
CREATE OR REPLACE FUNCTION fn_DeductStock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE product_id = NEW.product_id;
    
    -- Log the change
    INSERT INTO inventory_logs (product_id, change_amount, reason)
    VALUES (NEW.product_id, -NEW.quantity, 'SALE');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_DeductStock
AFTER INSERT ON order_items
FOR EACH ROW EXECUTE FUNCTION fn_DeductStock();

-- 3. Trigger Function: Prevent Negative Stock
-- This acts as a safety net even if the application logic fails checks.
CREATE OR REPLACE FUNCTION fn_PreventNegativeStock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_quantity < 0 THEN
        RAISE EXCEPTION 'Stock quantity cannot be negative for product %', NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_CheckStock
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION fn_PreventNegativeStock();
