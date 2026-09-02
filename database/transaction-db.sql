-- ==========================================================
-- FinTrack - Transaction Microservice Database Schema
-- Database: spendwise_expense (or spendwise_transaction)
-- ==========================================================

CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'EXPENSE', -- 'INCOME' or 'EXPENSE'
    payment_method VARCHAR(50) DEFAULT 'CARD',
    transaction_date DATE NOT NULL,
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);

-- Backward Compatibility Table: expenses
CREATE TABLE IF NOT EXISTS expenses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(20) DEFAULT 'EXPENSE',
    payment_method VARCHAR(50) DEFAULT 'CARD',
    expense_date DATE NOT NULL,
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
