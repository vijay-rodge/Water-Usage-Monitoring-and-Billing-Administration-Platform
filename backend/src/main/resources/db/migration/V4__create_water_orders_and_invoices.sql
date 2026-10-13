-- ============================================================================
-- V4: WATER ORDERS AND INVOICES FOR BULK WATER PURCHASES
-- ============================================================================

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS billing_address VARCHAR(255),
ADD COLUMN IF NOT EXISTS organization_name VARCHAR(150);

CREATE TABLE IF NOT EXISTS water_orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    apartment_id BIGINT,
    order_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    water_type VARCHAR(100) NOT NULL,
    quantity_liters NUMERIC(12, 2) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PAID',
    payment_reference VARCHAR(100),
    payment_method VARCHAR(50) DEFAULT 'UPI',
    delivery_address VARCHAR(255),
    customer_notes VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_apt FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    invoice_date DATE NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    pdf_reference VARCHAR(255),
    email_sent BOOLEAN NOT NULL DEFAULT FALSE,
    email_sent_at TIMESTAMP WITHOUT TIME ZONE,
    email_error TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_invoice_order FOREIGN KEY (order_id) REFERENCES water_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_invoice_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_invoice_order UNIQUE (order_id)
);

CREATE INDEX IF NOT EXISTS idx_water_orders_user ON water_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_water_orders_apt ON water_orders(apartment_id);
CREATE INDEX IF NOT EXISTS idx_order_invoices_order ON order_invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_order_invoices_user ON order_invoices(user_id);
