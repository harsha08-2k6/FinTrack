-- ==========================================================
-- SpendWise PostgreSQL Database: Auth Service
-- Database-per-service pattern for spendwise_auth
-- ==========================================================

DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Seed initial admin user (username: admin, password: admin hashed with BCrypt)
INSERT INTO users (username, email, password, full_name, role)
VALUES 
(
    'admin',
    'admin@fintrack.com',
    '$2b$10$OOGCbxpEhSb.JdSmhxYYGORxM2.aDROBLjLyj.8Oyg/.zewCxf8Bu',
    'Administrator',
    'ROLE_ADMIN'
) ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password;
