-- PostgreSQL Schema for Reference
-- This is provided for documentation and potential production use.
-- Note: The MVP uses SQLite internally for immediate zero-setup execution.

CREATE TABLE buyers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    avg_amount DECIMAL(15, 2),
    avg_delay INT,
    delayed_count INT,
    total_count INT
);

CREATE TABLE suppliers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE invoices (
    id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50) REFERENCES suppliers(id),
    buyer_id VARCHAR(50) REFERENCES buyers(id),
    amount DECIMAL(15, 2),
    date DATE,
    due_date DATE,
    is_duplicate BOOLEAN
);

CREATE TABLE risk_results (
    id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(50) REFERENCES invoices(id),
    risk_score INT,
    risk_level VARCHAR(20),
    risk_factors JSONB,
    recommendation VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
