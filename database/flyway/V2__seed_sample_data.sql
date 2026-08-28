-- ============================================================================
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