-- Run this once against your PostgreSQL database if the app crashes with:
-- "column users.approved does not exist"
--
-- Connect first:
--   psql -U postgres -d whisperboxplatform -p 5433
-- Then paste these lines:

ALTER TABLE users ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS anonymous_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS registered_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

-- Make the hardcoded admin always approved
UPDATE users SET approved = TRUE, role = 'ADMIN' WHERE email = 'akayezualiane01@gmail.com';

-- Verify
SELECT id, email, role, approved, anonymous_name FROM users;
