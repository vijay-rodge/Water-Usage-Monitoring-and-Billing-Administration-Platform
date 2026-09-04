-- ============================================================================
-- ADD COMMUNITY EMAIL & RESIDENT APPROVAL STATUS
-- ============================================================================

ALTER TABLE apartments 
ADD COLUMN IF NOT EXISTS society_email VARCHAR(150);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(30) DEFAULT 'APPROVED';

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Update existing users
UPDATE users SET approval_status = 'APPROVED', is_active = TRUE WHERE approval_status IS NULL;
UPDATE apartments SET society_email = 'office@greenwoods.org' WHERE society_email IS NULL AND id = 1;

