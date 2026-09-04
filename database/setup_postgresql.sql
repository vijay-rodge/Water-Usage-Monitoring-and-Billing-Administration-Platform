-- ============================================================================
-- JALSETU SMART WATER MANAGEMENT PLATFORM — POSTGRESQL SETUP SCRIPT
-- Database: jalsetu (Default Port: 5432)
-- ============================================================================

-- Step 1: Create Database (Run as postgres superuser if not created yet)
-- CREATE DATABASE jalsetu;
-- \c jalsetu;

-- Step 2: Create DDL Tables
CREATE TABLE IF NOT EXISTS apartments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    total_flats INT NOT NULL DEFAULT 0,
    common_area_sqft NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS households (
    id BIGSERIAL PRIMARY KEY,
    apartment_id BIGINT NOT NULL,
    flat_no VARCHAR(50) NOT NULL,
    block_wing VARCHAR(50) NOT NULL,
    floor_no INT NOT NULL,
    bhk_type VARCHAR(20) NOT NULL,
    carpet_area_sqft NUMERIC(10, 2) NOT NULL,
    occupancy_count INT NOT NULL DEFAULT 2,
    meter_serial_no VARCHAR(100) NOT NULL UNIQUE,
    initial_meter_reading NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    owner_name VARCHAR(150) NOT NULL,
    owner_email VARCHAR(150) NOT NULL,
    owner_phone VARCHAR(50),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_household_apt FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE,
    CONSTRAINT uq_household_apt_flat UNIQUE (apartment_id, flat_no)
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    apartment_id BIGINT,
    household_id BIGINT,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(30) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_apt FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE SET NULL,
    CONSTRAINT fk_user_household FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tariff_plans (
    id BIGSERIAL PRIMARY KEY,
    apartment_id BIGINT NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    description TEXT,
    base_fixed_charge NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
    sewage_maintenance_pct NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    bulk_purchase_markup_pct NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tariff_apt FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tariff_tiers (
    id BIGSERIAL PRIMARY KEY,
    tariff_plan_id BIGINT NOT NULL,
    tier_level INT NOT NULL,
    tier_name VARCHAR(50) NOT NULL,
    min_liters NUMERIC(12, 2) NOT NULL,
    max_liters NUMERIC(12, 2),
    rate_per_1000_liters NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tier_plan FOREIGN KEY (tariff_plan_id) REFERENCES tariff_plans(id) ON DELETE CASCADE,
    CONSTRAINT uq_tariff_plan_tier UNIQUE (tariff_plan_id, tier_level)
);

CREATE TABLE IF NOT EXISTS meter_readings (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT NOT NULL,
    reading_date DATE NOT NULL,
    previous_reading_liters NUMERIC(12, 2) DEFAULT 0.00,
    current_reading_liters NUMERIC(12, 2) NOT NULL,
    daily_consumption_liters NUMERIC(12, 2) NOT NULL,
    log_source VARCHAR(30) NOT NULL DEFAULT 'MANUAL',
    is_anomaly BOOLEAN NOT NULL DEFAULT FALSE,
    anomaly_type VARCHAR(50),
    anomaly_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    remarks VARCHAR(255),
    recorded_by_user_id BIGINT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reading_household FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    CONSTRAINT fk_reading_user FOREIGN KEY (recorded_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT uq_meter_reading_date UNIQUE (household_id, reading_date)
);

CREATE TABLE IF NOT EXISTS bulk_water_purchases (
    id BIGSERIAL PRIMARY KEY,
    apartment_id BIGINT NOT NULL,
    purchase_date DATE NOT NULL,
    supplier_name VARCHAR(150) NOT NULL,
    tanker_capacity_liters NUMERIC(12, 2) NOT NULL,
    total_cost NUMERIC(10, 2) NOT NULL,
    apportionment_method VARCHAR(50) NOT NULL DEFAULT 'BY_FLAT_SIZE',
    notes VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bulk_apt FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS billing_cycles (
    id BIGSERIAL PRIMARY KEY,
    apartment_id BIGINT NOT NULL,
    tariff_plan_id BIGINT,
    cycle_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_metered_consumption_liters NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_bulk_purchased_liters NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_billed_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'FINALIZED',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cycle_apt FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE,
    CONSTRAINT fk_cycle_tariff FOREIGN KEY (tariff_plan_id) REFERENCES tariff_plans(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS invoices (
    id BIGSERIAL PRIMARY KEY,
    billing_cycle_id BIGINT NOT NULL,
    household_id BIGINT NOT NULL,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    total_consumption_liters NUMERIC(12, 2) NOT NULL,
    base_fixed_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tiered_metered_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tiered_breakdown_json TEXT,
    apportioned_common_area_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sewage_maintenance_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount_due NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'UNPAID',
    payment_date TIMESTAMP WITHOUT TIME ZONE,
    payment_reference VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_cycle FOREIGN KEY (billing_cycle_id) REFERENCES billing_cycles(id) ON DELETE CASCADE,
    CONSTRAINT fk_inv_household FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    CONSTRAINT uq_cycle_household UNIQUE (billing_cycle_id, household_id)
);

CREATE TABLE IF NOT EXISTS alerts (
    id BIGSERIAL PRIMARY KEY,
    apartment_id BIGINT NOT NULL,
    household_id BIGINT,
    user_id BIGINT,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alert_apt FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE,
    CONSTRAINT fk_alert_household FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE SET NULL,
    CONSTRAINT fk_alert_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_households_apt ON households(apartment_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_meter_readings_household_date ON meter_readings(household_id, reading_date);
CREATE INDEX IF NOT EXISTS idx_invoices_household ON invoices(household_id);
CREATE INDEX IF NOT EXISTS idx_alerts_household ON alerts(household_id);

-- Step 3: Seed Initial Data
INSERT INTO apartments (id, name, code, address, city, state, postal_code, total_flats, common_area_sqft)
VALUES (1, 'Greenwoods Meadows Luxury Residency', 'GWM-BLR-01', 'Plot 42, Sarjapur Outer Ring Road, Bellandur', 'Bengaluru', 'Karnataka', '560103', 48, 18500.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO households (id, apartment_id, flat_no, block_wing, floor_no, bhk_type, carpet_area_sqft, occupancy_count, meter_serial_no, initial_meter_reading, owner_name, owner_email, owner_phone, status)
VALUES 
(1, 1, 'A-101', 'Wing A', 1, '3BHK', 1650.00, 4, 'WM-SN-A101-2024', 124500.00, 'Rahul Sharma', 'resident3@gmail.com', '+91 98765 43210', 'ACTIVE'),
(2, 1, 'A-102', 'Wing A', 1, '2BHK', 1200.00, 3, 'WM-SN-A102-2024', 98200.00, 'Ananya Sen', 'ananya.sen@example.com', '+91 98765 43211', 'ACTIVE'),
(3, 1, 'A-201', 'Wing A', 2, '3BHK', 1650.00, 4, 'WM-SN-A201-2024', 142000.00, 'Suresh Iyer', 'suresh.iyer@example.com', '+91 98765 43212', 'ACTIVE'),
(4, 1, 'B-101', 'Wing B', 1, '2BHK', 1150.00, 2, 'WM-SN-B101-2024', 85400.00, 'Deepak Verma', 'deepak.verma@example.com', '+91 98765 43213', 'ACTIVE'),
(5, 1, 'B-202', 'Wing B', 2, '3BHK', 1700.00, 4, 'WM-SN-B202-2024', 156300.00, 'Priya Nair', 'priya.nair@waterguard.io', '+91 98765 43214', 'ACTIVE'),
(6, 1, 'B-301', 'Wing B', 3, '4BHK', 2300.00, 5, 'WM-SN-B301-2024', 210900.00, 'Arjun Reddy', 'arjun.reddy@example.com', '+91 98765 43215', 'ACTIVE'),
(7, 1, 'C-101', 'Wing C', 1, '1BHK', 750.00, 1, 'WM-SN-C101-2024', 45200.00, 'Vikram Patel', 'vikram.patel@waterguard.io', '+91 98765 43216', 'ACTIVE'),
(8, 1, 'C-402', 'Wing C', 4, 'PENTHOUSE', 3100.00, 6, 'WM-SN-C402-2024', 320100.00, 'Meera Deshmukh', 'meera.deshmukh@example.com', '+91 98765 43217', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, apartment_id, household_id, email, password_hash, full_name, phone, role, is_active)
VALUES
(1, 1, NULL, 'admin@waterguard.io', '$2a$10$w8c3K80r2W6aC2cqv4VqeuK9M3pXvY8F.6N9W7x9yUe9O8P0Q1.S2', 'Dr. Arvind Mehra (Society Secretary)', '+91 99001 12233', 'ADMIN', TRUE),
(2, 1, 1, 'resident3@gmail.com', '$2a$10$w8c3K80r2W6aC2cqv4VqeuK9M3pXvY8F.6N9W7x9yUe9O8P0Q1.S2', 'Resident3 (Rahul Sharma)', '54622578356', 'RESIDENT', TRUE),
(3, 1, 1, 'rahul.sharma@waterguard.io', '$2a$10$w8c3K80r2W6aC2cqv4VqeuK9M3pXvY8F.6N9W7x9yUe9O8P0Q1.S2', 'Rahul Sharma', '+91 98765 43210', 'RESIDENT', TRUE),
(4, 1, 5, 'priya.nair@waterguard.io', '$2a$10$w8c3K80r2W6aC2cqv4VqeuK9M3pXvY8F.6N9W7x9yUe9O8P0Q1.S2', 'Priya Nair', '+91 98765 43214', 'RESIDENT', TRUE),
(5, 1, 7, 'vikram.patel@waterguard.io', '$2a$10$w8c3K80r2W6aC2cqv4VqeuK9M3pXvY8F.6N9W7x9yUe9O8P0Q1.S2', 'Vikram Patel', '+91 98765 43216', 'RESIDENT', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tariff_plans (id, apartment_id, plan_name, description, base_fixed_charge, sewage_maintenance_pct, bulk_purchase_markup_pct, is_active, effective_from)
VALUES (1, 1, 'Urban Residential Progressive Water Tariff 2026', 'Tiered consumption tariff model', 150.00, 10.00, 5.00, TRUE, '2026-01-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tariff_tiers (id, tariff_plan_id, tier_level, tier_name, min_liters, max_liters, rate_per_1000_liters)
VALUES
(1, 1, 1, 'Tier 1 - Essential Base (0 - 1,000 L)', 0.00, 1000.00, 5000.00),
(2, 1, 2, 'Tier 2 - Excess Draw (> 1,000 L)', 1001.00, NULL, 8000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO bulk_water_purchases (id, apartment_id, purchase_date, supplier_name, tanker_capacity_liters, total_cost, apportionment_method, notes)
VALUES
(1, 1, '2026-08-04', 'Kavery Clean Water Tankers Ltd', 24000.00, 3600.00, 'BY_FLAT_SIZE', 'Main sump replenishment'),
(2, 1, '2026-08-12', 'AquaPure Express Tankers', 12000.00, 1950.00, 'BY_FLAT_SIZE', 'Swimming pool refill'),
(3, 1, '2026-08-21', 'Kavery Clean Water Tankers Ltd', 24000.00, 3600.00, 'BY_FLAT_SIZE', 'Buffer storage refill')
ON CONFLICT (id) DO NOTHING;

INSERT INTO billing_cycles (id, apartment_id, tariff_plan_id, cycle_name, start_date, end_date, due_date, total_metered_consumption_liters, total_bulk_purchased_liters, total_billed_amount, status)
VALUES
(1, 1, 1, 'July 2026 Cycle', '2026-07-01', '2026-07-31', '2026-08-10', 486000.00, 72000.00, 52480.00, 'CLOSED'),
(2, 1, 1, 'August 2026 Cycle', '2026-08-01', '2026-08-31', '2026-09-10', 512400.00, 60000.00, 56320.00, 'FINALIZED')
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoices (id, billing_cycle_id, household_id, invoice_number, total_consumption_liters, base_fixed_charge, tiered_metered_charge, tiered_breakdown_json, apportioned_common_area_charge, sewage_maintenance_charge, total_amount_due, due_date, payment_status, payment_date, payment_reference)
VALUES 
(1, 1, 1, 'INV-202607-A101', 12800.00, 150.00, 252.80, '[{"tier":"Tier 1","cost":128.0}]', 185.50, 25.28, 613.58, '2026-08-10', 'PAID', '2026-08-08 11:24:00', 'UPI-REF-98726152019'),
(2, 2, 1, 'INV-202608-A101', 13010.00, 150.00, 258.26, '[{"tier":"Tier 1","cost":128.0},{"tier":"Tier 2","cost":130.26}]', 192.40, 25.83, 626.49, '2026-09-10', 'UNPAID', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO alerts (id, apartment_id, household_id, user_id, title, message, alert_type, severity, is_read, is_resolved)
VALUES
(1, 1, 1, 2, 'Severe Water Leakage Suspected', 'Continuous night-time water flow detected on Aug 24-25 totaling 2,070 Liters.', 'LEAK_DETECTED', 'CRITICAL', FALSE, TRUE),
(2, 1, 1, 2, 'Approaching Tier 2 Threshold', 'Your monthly consumption reached 12,500 Liters.', 'USAGE_SPIKE', 'MEDIUM', TRUE, FALSE),
(3, 1, NULL, 1, 'Bulk Tanker Inflow Received', '24,000 Liters delivered from Kavery Clean Water Tankers.', 'WATER_RATIONING', 'INFO', FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Advance Serial Sequences
SELECT setval(pg_get_serial_sequence('apartments', 'id'), COALESCE((SELECT MAX(id) FROM apartments), 1));
SELECT setval(pg_get_serial_sequence('households', 'id'), COALESCE((SELECT MAX(id) FROM households), 1));
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval(pg_get_serial_sequence('tariff_plans', 'id'), COALESCE((SELECT MAX(id) FROM tariff_plans), 1));
SELECT setval(pg_get_serial_sequence('tariff_tiers', 'id'), COALESCE((SELECT MAX(id) FROM tariff_tiers), 1));
SELECT setval(pg_get_serial_sequence('bulk_water_purchases', 'id'), COALESCE((SELECT MAX(id) FROM bulk_water_purchases), 1));
SELECT setval(pg_get_serial_sequence('billing_cycles', 'id'), COALESCE((SELECT MAX(id) FROM billing_cycles), 1));
SELECT setval(pg_get_serial_sequence('invoices', 'id'), COALESCE((SELECT MAX(id) FROM invoices), 1));
SELECT setval(pg_get_serial_sequence('alerts', 'id'), COALESCE((SELECT MAX(id) FROM alerts), 1));

