-- ==========================================================
-- SpendWise PostgreSQL Database: Category Service
-- Database-per-service pattern for spendwise_category
-- ==========================================================

DROP TABLE IF EXISTS categories CASCADE;

-- Categories table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    icon VARCHAR(50) DEFAULT 'tag',
    color_code VARCHAR(20) DEFAULT '#6366f1',
    budget_limit NUMERIC(12, 2) DEFAULT 0.00,
    user_id BIGINT DEFAULT NULL, -- NULL indicates global system default category
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default categories with clean 0.00 budget limits (users configure their own limits)
INSERT INTO categories (name, description, icon, color_code, budget_limit, user_id) VALUES
('Food & Dining', 'Groceries, restaurants, cafes, food delivery', 'utensils', '#ef4444', 0.00, NULL),
('Transportation', 'Fuel, public transit, rideshare, parking, repairs', 'car', '#f59e0b', 0.00, NULL),
('Shopping', 'Clothing, electronics, personal purchases', 'shopping-bag', '#8b5cf6', 0.00, NULL),
('Housing & Bills', 'Rent, electricity, water, internet, phone bill', 'home', '#3b82f6', 0.00, NULL),
('Entertainment', 'Movies, concerts, streaming services, hobbies', 'film', '#ec4899', 0.00, NULL),
('Healthcare', 'Doctor visits, medications, health insurance', 'heart-pulse', '#10b981', 0.00, NULL),
('Education', 'Tuition, courses, books, learning resources', 'graduation-cap', '#06b6d4', 0.00, NULL),
('Other & Miscellaneous', 'Emergency or miscellaneous expenses', 'layers', '#64748b', 0.00, NULL);
