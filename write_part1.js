const fs = require('fs');
const path = require('path');

function write(relPath, content) {
  const full = path.resolve(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim(), 'utf8');
  console.log('✓', relPath, '(' + fs.statSync(full).size + ' bytes)');
}

// 1. pom.xml
write('backend/pom.xml', `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.3</version>
        <relativePath/>
    </parent>

    <groupId>com.waterguard</groupId>
    <artifactId>waterguard-backend</artifactId>
    <version>1.0.0</version>
    <name>WaterGuard Smart Water Monitoring API</name>
    <description>Enterprise Smart Water Usage Monitoring and Automated Tiered Billing Platform</description>

    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.6</jjwt.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-database-postgresql</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`);

// 2. application.yml
write('backend/src/main/resources/application.yml', `server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: waterguard-backend
  profiles:
    active: dev

  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration

  jackson:
    serialization:
      write-dates-as-timestamps: false
      indent-output: true

---
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:h2:mem:waterguard_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=PostgreSQL
    driverClassName: org.h2.Driver
    username: sa
    password: 
  h2:
    console:
      enabled: true
      path: /h2-console
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update
    show-sql: false

---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:postgresql://\${DB_HOST:localhost}:\${DB_PORT:5432}/\${DB_NAME:waterguard_db}
    driverClassName: org.postgresql.Driver
    username: \${DB_USERNAME:postgres}
    password: \${DB_PASSWORD:postgres}
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: validate

---
app:
  jwt:
    secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
    expiration-ms: 86400000
`);

const schemaSql = `-- ============================================================================
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
`;

const seedSql = `-- ============================================================================
-- SMART WATER PLATFORM SEED DATA
-- ============================================================================
INSERT INTO apartments (id, name, code, address, city, state, postal_code, total_flats, common_area_sqft)
VALUES (1, 'Greenwoods Meadows Luxury Residency', 'GWM-BLR-01', 'Plot 42, Sarjapur Outer Ring Road, Bellandur', 'Bengaluru', 'Karnataka', '560103', 48, 18500.00);

INSERT INTO households (id, apartment_id, flat_no, block_wing, floor_no, bhk_type, carpet_area_sqft, occupancy_count, meter_serial_no, initial_meter_reading, owner_name, owner_email, owner_phone, status)
VALUES 
(1, 1, 'A-101', 'Wing A', 1, '3BHK', 1650.00, 4, 'WM-SN-A101-2024', 124500.00, 'Rahul Sharma', 'rahul.sharma@waterguard.io', '+91 98765 43210', 'ACTIVE'),
(2, 1, 'A-102', 'Wing A', 1, '2BHK', 1200.00, 3, 'WM-SN-A102-2024', 98200.00, 'Ananya Sen', 'ananya.sen@example.com', '+91 98765 43211', 'ACTIVE'),
(3, 1, 'A-201', 'Wing A', 2, '3BHK', 1650.00, 4, 'WM-SN-A201-2024', 142000.00, 'Suresh Iyer', 'suresh.iyer@example.com', '+91 98765 43212', 'ACTIVE'),
(4, 1, 'B-101', 'Wing B', 1, '2BHK', 1150.00, 2, 'WM-SN-B101-2024', 85400.00, 'Deepak Verma', 'deepak.verma@example.com', '+91 98765 43213', 'ACTIVE'),
(5, 1, 'B-202', 'Wing B', 2, '3BHK', 1700.00, 4, 'WM-SN-B202-2024', 156300.00, 'Priya Nair', 'priya.nair@waterguard.io', '+91 98765 43214', 'ACTIVE'),
(6, 1, 'B-301', 'Wing B', 3, '4BHK', 2300.00, 5, 'WM-SN-B301-2024', 210900.00, 'Arjun Reddy', 'arjun.reddy@example.com', '+91 98765 43215', 'ACTIVE'),
(7, 1, 'C-101', 'Wing C', 1, '1BHK', 750.00, 1, 'WM-SN-C101-2024', 45200.00, 'Vikram Patel', 'vikram.patel@waterguard.io', '+91 98765 43216', 'ACTIVE'),
(8, 1, 'C-402', 'Wing C', 4, 'PENTHOUSE', 3100.00, 6, 'WM-SN-C402-2024', 320100.00, 'Meera Deshmukh', 'meera.deshmukh@example.com', '+91 98765 43217', 'ACTIVE');

INSERT INTO users (id, apartment_id, household_id, email, password_hash, full_name, phone, role, is_active)
VALUES
(1, 1, NULL, 'admin@waterguard.io', '$2a$10$w8c3K80r2W6aC2cqv4VqeuK9M3pXvY8F.6N9W7x9yUe9O8P0Q1.S2', 'Dr. Arvind Mehra (Society Secretary)', '+91 99001 12233', 'ROLE_ADMIN', TRUE),
(2, 1, 1, 'rahul.sharma@waterguard.io', '$2a$10$w8c3K80r2W6aC2cqv4VqeuK9M3pXvY8F.6N9W7x9yUe9O8P0Q1.S2', 'Rahul Sharma', '+91 98765 43210', 'ROLE_RESIDENT', TRUE),
(3, 1, 5, 'priya.nair@waterguard.io', '$2a$10$w8c3K80r2W6aC2cqv4VqeuK9M3pXvY8F.6N9W7x9yUe9O8P0Q1.S2', 'Priya Nair', '+91 98765 43214', 'ROLE_RESIDENT', TRUE),
(4, 1, 7, 'vikram.patel@waterguard.io', '$2a$10$w8c3K80r2W6aC2cqv4VqeuK9M3pXvY8F.6N9W7x9yUe9O8P0Q1.S2', 'Vikram Patel', '+91 98765 43216', 'ROLE_RESIDENT', TRUE);

INSERT INTO tariff_plans (id, apartment_id, plan_name, description, base_fixed_charge, sewage_maintenance_pct, bulk_purchase_markup_pct, is_active, effective_from)
VALUES (1, 1, 'Urban Residential Progressive Water Tariff 2026', 'Tiered consumption tariff model', 150.00, 10.00, 5.00, TRUE, '2026-01-01');

INSERT INTO tariff_tiers (id, tariff_plan_id, tier_level, tier_name, min_liters, max_liters, rate_per_1000_liters)
VALUES
(1, 1, 1, 'Tier 1 - Essential Base (0 - 8,000 L)', 0.00, 8000.00, 16.00),
(2, 1, 2, 'Tier 2 - Standard Living (8,001 - 15,000 L)', 8001.00, 15000.00, 26.00),
(3, 1, 3, 'Tier 3 - Elevated Use (15,001 - 25,000 L)', 15001.00, 25000.00, 42.00),
(4, 1, 4, 'Tier 4 - Penalty Rate (> 25,000 L)', 25001.00, NULL, 75.00);

INSERT INTO bulk_water_purchases (id, apartment_id, purchase_date, supplier_name, tanker_capacity_liters, total_cost, apportionment_method, notes)
VALUES
(1, 1, '2026-08-04', 'Kavery Clean Water Tankers Ltd', 24000.00, 3600.00, 'BY_FLAT_SIZE', 'Main sump replenishment'),
(2, 1, '2026-08-12', 'AquaPure Express Tankers', 12000.00, 1950.00, 'BY_FLAT_SIZE', 'Swimming pool refill'),
(3, 1, '2026-08-21', 'Kavery Clean Water Tankers Ltd', 24000.00, 3600.00, 'BY_FLAT_SIZE', 'Buffer storage refill');

INSERT INTO billing_cycles (id, apartment_id, tariff_plan_id, cycle_name, start_date, end_date, due_date, total_metered_consumption_liters, total_bulk_purchased_liters, total_billed_amount, status)
VALUES
(1, 1, 1, 'July 2026 Cycle', '2026-07-01', '2026-07-31', '2026-08-10', 486000.00, 72000.00, 52480.00, 'CLOSED'),
(2, 1, 1, 'August 2026 Cycle', '2026-08-01', '2026-08-31', '2026-09-10', 512400.00, 60000.00, 56320.00, 'FINALIZED');

INSERT INTO invoices (id, billing_cycle_id, household_id, invoice_number, total_consumption_liters, base_fixed_charge, tiered_metered_charge, tiered_breakdown_json, apportioned_common_area_charge, sewage_maintenance_charge, total_amount_due, due_date, payment_status, payment_date, payment_reference)
VALUES 
(1, 1, 1, 'INV-202607-A101', 12800.00, 150.00, 252.80, '[{"tier":"Tier 1","cost":128.0}]', 185.50, 25.28, 613.58, '2026-08-10', 'PAID', '2026-08-08 11:24:00', 'UPI-REF-98726152019'),
(2, 2, 1, 'INV-202608-A101', 13010.00, 150.00, 258.26, '[{"tier":"Tier 1","cost":128.0},{"tier":"Tier 2","cost":130.26}]', 192.40, 25.83, 626.49, '2026-09-10', 'UNPAID', NULL, NULL);

INSERT INTO alerts (id, apartment_id, household_id, user_id, title, message, alert_type, severity, is_read, is_resolved)
VALUES
(1, 1, 1, 2, 'Severe Water Leakage Suspected', 'Continuous night-time water flow detected on Aug 24-25 totaling 2,070 Liters.', 'LEAK_DETECTED', 'CRITICAL', FALSE, TRUE),
(2, 1, 1, 2, 'Approaching Tier 2 Threshold', 'Your monthly consumption reached 12,500 Liters.', 'USAGE_SPIKE', 'MEDIUM', TRUE, FALSE),
(3, 1, NULL, 1, 'Bulk Tanker Inflow Received', '24,000 Liters delivered from Kavery Clean Water Tankers.', 'WATER_RATIONING', 'INFO', FALSE, FALSE);
`;

write('database/schema.sql', schemaSql);
write('database/seed_data.sql', seedSql);
write('database/flyway/V1__init_schema.sql', schemaSql);
write('database/flyway/V2__seed_sample_data.sql', seedSql);
write('backend/src/main/resources/db/migration/V1__init_schema.sql', schemaSql);
write('backend/src/main/resources/db/migration/V2__seed_sample_data.sql', seedSql);
