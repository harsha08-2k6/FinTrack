-- ==========================================================
-- SpendWise PostgreSQL Database: Report Service
-- Database-per-service pattern for spendwise_report
-- ==========================================================

DROP TABLE IF EXISTS monthly_summaries CASCADE;
DROP TABLE IF EXISTS budget_alerts CASCADE;

-- Monthly summaries table
CREATE TABLE monthly_summaries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    year_month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    total_spent NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_transactions INT NOT NULL DEFAULT 0,
    top_category_name VARCHAR(100),
    top_category_amount NUMERIC(14, 2) DEFAULT 0.00,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_month UNIQUE (user_id, year_month)
);

-- Budget alerts table
CREATE TABLE budget_alerts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for analytics query optimization
CREATE INDEX IF NOT EXISTS idx_summaries_user_month ON monthly_summaries(user_id, year_month);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON budget_alerts(user_id);

