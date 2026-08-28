-- ============================================================================
-- SMART WATER USAGE MONITORING & AUTOMATED BILLING MANAGEMENT PLATFORM
-- Complete MySQL Database Initialization Script
-- Compatible with MySQL Workbench (8.0+)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `waterguard_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `waterguard_db`;

-- 1. APARTMENTS TABLE
CREATE TABLE IF NOT EXISTS `apartments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(20) NOT NULL,
    `total_flats` INT NOT NULL DEFAULT 0,
    `common_area_sqft` DECIMAL(10,2) DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. HOUSEHOLDS TABLE
CREATE TABLE IF NOT EXISTS `households` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `apartment_id` BIGINT NOT NULL,
    `flat_no` VARCHAR(50) NOT NULL,
    `block_wing` VARCHAR(50) NOT NULL,
    `floor_no` INT NOT NULL,
    `bhk_type` VARCHAR(20) NOT NULL,
    `carpet_area_sqft` DECIMAL(10,2) NOT NULL,
    `occupancy_count` INT NOT NULL DEFAULT 2,
    `meter_serial_no` VARCHAR(100) NOT NULL UNIQUE,
    `initial_meter_reading` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `owner_name` VARCHAR(150) NOT NULL,
    `owner_email` VARCHAR(150) NOT NULL,
    `owner_phone` VARCHAR(50),
    `status` VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_households_apartment` FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `apartment_id` BIGINT,
    `household_id` BIGINT,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(50),
    `role` VARCHAR(50) NOT NULL DEFAULT 'ROLE_RESIDENT',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_apartment` FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_users_household` FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. TARIFF PLANS TABLE
CREATE TABLE IF NOT EXISTS `tariff_plans` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `apartment_id` BIGINT NOT NULL,
    `plan_name` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `base_fixed_charge` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `sewage_maintenance_pct` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `bulk_purchase_markup_pct` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `effective_from` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tariff_apartment` FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. TARIFF TIERS TABLE
CREATE TABLE IF NOT EXISTS `tariff_tiers` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `tariff_plan_id` BIGINT NOT NULL,
    `tier_level` INT NOT NULL,
    `tier_name` VARCHAR(100) NOT NULL,
    `min_liters` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `max_liters` DECIMAL(10,2),
    `rate_per_1000_liters` DECIMAL(10,2) NOT NULL,
    CONSTRAINT `fk_tiers_plan` FOREIGN KEY (`tariff_plan_id`) REFERENCES `tariff_plans`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. METER READINGS TABLE
CREATE TABLE IF NOT EXISTS `meter_readings` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `household_id` BIGINT NOT NULL,
    `reading_date` DATE NOT NULL,
    `reading_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `current_reading_liters` DECIMAL(12,2) NOT NULL,
    `daily_consumption_liters` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `source` VARCHAR(50) NOT NULL DEFAULT 'MANUAL',
    `is_anomaly` BOOLEAN NOT NULL DEFAULT FALSE,
    `anomaly_reason` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_readings_household` FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. BULK WATER PURCHASES TABLE
CREATE TABLE IF NOT EXISTS `bulk_water_purchases` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `apartment_id` BIGINT NOT NULL,
    `purchase_date` DATE NOT NULL,
    `supplier_name` VARCHAR(150) NOT NULL,
    `tanker_capacity_liters` DECIMAL(10,2) NOT NULL,
    `total_cost` DECIMAL(10,2) NOT NULL,
    `apportionment_method` VARCHAR(50) NOT NULL DEFAULT 'BY_FLAT_SIZE',
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_bulk_apartment` FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. BILLING CYCLES TABLE
CREATE TABLE IF NOT EXISTS `billing_cycles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `apartment_id` BIGINT NOT NULL,
    `tariff_plan_id` BIGINT,
    `cycle_name` VARCHAR(100) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `due_date` DATE NOT NULL,
    `total_metered_consumption_liters` DECIMAL(14,2) DEFAULT 0.00,
    `total_bulk_purchased_liters` DECIMAL(14,2) DEFAULT 0.00,
    `total_billed_amount` DECIMAL(12,2) DEFAULT 0.00,
    `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_cycles_apartment` FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_cycles_tariff` FOREIGN KEY (`tariff_plan_id`) REFERENCES `tariff_plans`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. INVOICES TABLE
CREATE TABLE IF NOT EXISTS `invoices` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `billing_cycle_id` BIGINT NOT NULL,
    `household_id` BIGINT NOT NULL,
    `invoice_number` VARCHAR(100) NOT NULL UNIQUE,
    `total_consumption_liters` DECIMAL(12,2) NOT NULL,
    `base_fixed_charge` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `tiered_metered_charge` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `tiered_breakdown_json` TEXT,
    `apportioned_common_area_charge` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `sewage_maintenance_charge` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `total_amount_due` DECIMAL(10,2) NOT NULL,
    `due_date` DATE NOT NULL,
    `payment_status` VARCHAR(50) NOT NULL DEFAULT 'UNPAID',
    `payment_date` TIMESTAMP NULL,
    `payment_reference` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_invoices_cycle` FOREIGN KEY (`billing_cycle_id`) REFERENCES `billing_cycles`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_invoices_household` FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. ALERTS TABLE
CREATE TABLE IF NOT EXISTS `alerts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `apartment_id` BIGINT NOT NULL,
    `household_id` BIGINT,
    `user_id` BIGINT,
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `alert_type` VARCHAR(50) NOT NULL,
    `severity` VARCHAR(30) NOT NULL DEFAULT 'MEDIUM',
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_resolved` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_alerts_apartment` FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_alerts_household` FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_alerts_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================================
-- SEED SAMPLE DATA & LOGIN CREDENTIALS
-- Admin: admin@waterguard.io | Password: Admin@123
-- Resident: resident3@gmail.com | Password: Resident@123
-- ============================================================================

INSERT INTO `apartments` (`id`, `name`, `code`, `address`, `city`, `state`, `postal_code`, `total_flats`, `common_area_sqft`)
VALUES (1, 'Greenwoods Meadows Luxury Residency', 'GWM-BLR-01', 'Plot 42, Sarjapur Outer Ring Road, Bellandur', 'Bengaluru', 'Karnataka', '560103', 48, 18500.00)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

INSERT INTO `households` (`id`, `apartment_id`, `flat_no`, `block_wing`, `floor_no`, `bhk_type`, `carpet_area_sqft`, `occupancy_count`, `meter_serial_no`, `initial_meter_reading`, `owner_name`, `owner_email`, `owner_phone`, `status`)
VALUES 
(1, 1, 'A-101', 'Wing A', 1, '3BHK', 1650.00, 4, 'WM-SN-A101-2024', 124500.00, 'Rahul Sharma', 'resident3@gmail.com', '+91 98765 43210', 'ACTIVE'),
(2, 1, 'A-102', 'Wing A', 1, '2BHK', 1200.00, 3, 'WM-SN-A102-2024', 98200.00, 'Ananya Sen', 'ananya.sen@example.com', '+91 98765 43211', 'ACTIVE'),
(3, 1, 'A-201', 'Wing A', 2, '3BHK', 1650.00, 4, 'WM-SN-A201-2024', 142000.00, 'Suresh Iyer', 'suresh.iyer@example.com', '+91 98765 43212', 'ACTIVE'),
(4, 1, 'B-101', 'Wing B', 1, '2BHK', 1150.00, 2, 'WM-SN-B101-2024', 85400.00, 'Deepak Verma', 'deepak.verma@example.com', '+91 98765 43213', 'ACTIVE'),
(5, 1, 'B-202', 'Wing B', 2, '3BHK', 1700.00, 4, 'WM-SN-B202-2024', 156300.00, 'Priya Nair', 'priya.nair@waterguard.io', '+91 98765 43214', 'ACTIVE'),
(6, 1, 'B-301', 'Wing B', 3, '4BHK', 2300.00, 5, 'WM-SN-B301-2024', 210900.00, 'Arjun Reddy', 'arjun.reddy@example.com', '+91 98765 43215', 'ACTIVE'),
(7, 1, 'C-101', 'Wing C', 1, '1BHK', 750.00, 1, 'WM-SN-C101-2024', 45200.00, 'Vikram Patel', 'vikram.patel@waterguard.io', '+91 98765 43216', 'ACTIVE'),
(8, 1, 'C-402', 'Wing C', 4, 'PENTHOUSE', 3100.00, 6, 'WM-SN-C402-2024', 320100.00, 'Meera Deshmukh', 'meera.deshmukh@example.com', '+91 98765 43217', 'ACTIVE')
ON DUPLICATE KEY UPDATE `owner_name`=VALUES(`owner_name`);

INSERT INTO `users` (`id`, `apartment_id`, `household_id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`)
VALUES
(1, 1, NULL, 'admin@waterguard.io', '$2a$10$w8c3K80r2W6aC2cqv4VqeuK9M3pXvY8F.6N9W7x9yUe9O8P0Q1.S2', 'Dr. Arvind Mehra (Society Secretary)', '+91 99001 12233', 'ROLE_ADMIN', TRUE),
(2, 1, 1, 'resident3@gmail.com', '$2a$10$w8c3K80r2W6aC2cqv4VqeuK9M3pXvY8F.6N9W7x9yUe9O8P0Q1.S2', 'Resident3 (Rahul Sharma)', '54622578356', 'ROLE_RESIDENT', TRUE),
(3, 1, 1, 'rahul.sharma@waterguard.io', '$2a$10$w8c3K80r2W6aC2cqv4VqeuK9M3pXvY8F.6N9W7x9yUe9O8P0Q1.S2', 'Rahul Sharma', '+91 98765 43210', 'ROLE_RESIDENT', TRUE)
ON DUPLICATE KEY UPDATE `email`=VALUES(`email`);

INSERT INTO `tariff_plans` (`id`, `apartment_id`, `plan_name`, `description`, `base_fixed_charge`, `sewage_maintenance_pct`, `bulk_purchase_markup_pct`, `is_active`, `effective_from`)
VALUES (1, 1, 'Urban Residential Progressive Water Tariff 2026', 'Progressive tiered tariff model', 150.00, 10.00, 5.00, TRUE, '2026-01-01')
ON DUPLICATE KEY UPDATE `plan_name`=VALUES(`plan_name`);

INSERT INTO `tariff_tiers` (`id`, `tariff_plan_id`, `tier_level`, `tier_name`, `min_liters`, `max_liters`, `rate_per_1000_liters`)
VALUES
(1, 1, 1, 'Tier 1 - Essential Base (0 - 1,000 L)', 0.00, 1000.00, 5000.00),
(2, 1, 2, 'Tier 2 - Excess Draw (> 1,000 L)', 1001.00, NULL, 8000.00)
ON DUPLICATE KEY UPDATE `tier_name`=VALUES(`tier_name`);

INSERT INTO `bulk_water_purchases` (`id`, `apartment_id`, `purchase_date`, `supplier_name`, `tanker_capacity_liters`, `total_cost`, `apportionment_method`, `notes`)
VALUES
(1, 1, '2026-08-04', 'Kavery Clean Water Tankers Ltd', 24000.00, 3600.00, 'BY_FLAT_SIZE', 'Main sump replenishment'),
(2, 1, '2026-08-12', 'AquaPure Express Tankers', 12000.00, 1950.00, 'BY_FLAT_SIZE', 'Swimming pool refill'),
(3, 1, '2026-08-21', 'Kavery Clean Water Tankers Ltd', 24000.00, 3600.00, 'BY_FLAT_SIZE', 'Buffer storage refill')
ON DUPLICATE KEY UPDATE `supplier_name`=VALUES(`supplier_name`);

