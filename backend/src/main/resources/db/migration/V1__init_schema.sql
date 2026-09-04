-- ============================================================================
-- JALSETU SMART WATER USAGE MONITORING & AUTOMATED BILLING PLATFORM
-- PostgreSQL DDL Database Schema (Compatible with PostgreSQL 13+)
-- ============================================================================

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

CREATE INDEX IF NOT EXISTS idx_households_apt ON households(apartment_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_meter_readings_household_date ON meter_readings(household_id, reading_date);
CREATE INDEX IF NOT EXISTS idx_invoices_household ON invoices(household_id);
CREATE INDEX IF NOT EXISTS idx_alerts_household ON alerts(household_id);