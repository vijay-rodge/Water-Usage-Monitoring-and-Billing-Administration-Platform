-- ============================================================================
-- SMART WATER USAGE MONITORING & AUTOMATED BILLING MANAGEMENT PLATFORM
-- PostgreSQL DDL Database Schema
-- ============================================================================
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS billing_cycles CASCADE;
DROP TABLE IF EXISTS bulk_water_purchases CASCADE;
DROP TABLE IF EXISTS meter_readings CASCADE;
DROP TABLE IF EXISTS tariff_tiers CASCADE;
DROP TABLE IF EXISTS tariff_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS households CASCADE;
DROP TABLE IF EXISTS apartments CASCADE;

CREATE TABLE apartments (
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

CREATE TABLE households (
    id BIGSERIAL PRIMARY KEY,
    apartment_id BIGINT NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
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
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_household_apt_flat UNIQUE (apartment_id, flat_no)
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    apartment_id BIGINT REFERENCES apartments(id) ON DELETE SET NULL,
    household_id BIGINT REFERENCES households(id) ON DELETE SET NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(30) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tariff_plans (
    id BIGSERIAL PRIMARY KEY,
    apartment_id BIGINT NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL,
    description TEXT,
    base_fixed_charge NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
    sewage_maintenance_pct NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    bulk_purchase_markup_pct NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tariff_tiers (
    id BIGSERIAL PRIMARY KEY,
    tariff_plan_id BIGINT NOT NULL REFERENCES tariff_plans(id) ON DELETE CASCADE,
    tier_level INT NOT NULL,
    tier_name VARCHAR(50) NOT NULL,
    min_liters NUMERIC(12, 2) NOT NULL,
    max_liters NUMERIC(12, 2),
    rate_per_1000_liters NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tariff_plan_tier UNIQUE (tariff_plan_id, tier_level)
);

CREATE TABLE meter_readings (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    reading_date DATE NOT NULL,
    previous_reading_liters NUMERIC(12, 2) NOT NULL,
    current_reading_liters NUMERIC(12, 2) NOT NULL,
    daily_consumption_liters NUMERIC(12, 2) NOT NULL,
    log_source VARCHAR(30) NOT NULL DEFAULT 'MANUAL',
    is_anomaly BOOLEAN NOT NULL DEFAULT FALSE,
    anomaly_type VARCHAR(50),
    anomaly_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    remarks VARCHAR(255),
    recorded_by_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_meter_reading_date UNIQUE (household_id, reading_date)
);

CREATE TABLE bulk_water_purchases (
    id BIGSERIAL PRIMARY KEY,
    apartment_id BIGINT NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    purchase_date DATE NOT NULL,
    supplier_name VARCHAR(150) NOT NULL,
    tanker_capacity_liters NUMERIC(12, 2) NOT NULL,
    total_cost NUMERIC(10, 2) NOT NULL,
    apportionment_method VARCHAR(50) NOT NULL DEFAULT 'BY_FLAT_SIZE',
    notes VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE billing_cycles (
    id BIGSERIAL PRIMARY KEY,
    apartment_id BIGINT NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    tariff_plan_id BIGINT NOT NULL REFERENCES tariff_plans(id),
    cycle_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_metered_consumption_liters NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_bulk_purchased_liters NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_billed_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'FINALIZED',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    billing_cycle_id BIGINT NOT NULL REFERENCES billing_cycles(id) ON DELETE CASCADE,
    household_id BIGINT NOT NULL REFERENCES households(id) ON DELETE CASCADE,
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
    CONSTRAINT uq_cycle_household UNIQUE (billing_cycle_id, household_id)
);

CREATE TABLE alerts (
    id BIGSERIAL PRIMARY KEY,
    apartment_id BIGINT NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    household_id BIGINT REFERENCES households(id) ON DELETE SET NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_households_apt ON households(apartment_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_meter_readings_household_date ON meter_readings(household_id, reading_date);
CREATE INDEX idx_invoices_household ON invoices(household_id);
CREATE INDEX idx_alerts_household ON alerts(household_id);