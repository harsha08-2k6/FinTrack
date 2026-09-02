-- ==========================================================
-- SpendWise PostgreSQL Database: Expense Service
-- Database-per-service pattern for spendwise_expense
-- ==========================================================

DROP TABLE IF EXISTS expenses CASCADE;

-- Expenses table
CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    category_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    expense_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'CARD',
    receipt_url TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);

