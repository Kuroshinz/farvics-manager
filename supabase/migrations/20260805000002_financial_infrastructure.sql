-- Wave 5.4 Financial Infrastructure

-- Base Tables
CREATE TABLE financial_accounts (
    id UUID PRIMARY KEY,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID,
    updated_by UUID,
    
    currency_code VARCHAR(3) NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL
);
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;

CREATE TABLE financial_categories (
    id UUID PRIMARY KEY,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID,
    updated_by UUID,
    
    parent_id UUID REFERENCES financial_categories(id),
    name VARCHAR(255) NOT NULL
);
ALTER TABLE financial_categories ENABLE ROW LEVEL SECURITY;

CREATE TABLE financial_journals (
    id UUID PRIMARY KEY,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID,
    updated_by UUID,
    
    date DATE NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    original_journal_id UUID REFERENCES financial_journals(id)
);
ALTER TABLE financial_journals ENABLE ROW LEVEL SECURITY;

CREATE TABLE financial_journal_entries (
    id UUID PRIMARY KEY,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID,
    updated_by UUID,
    
    journal_id UUID NOT NULL REFERENCES financial_journals(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES financial_accounts(id),
    amount_minor_units BIGINT NOT NULL,
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT'))
);
ALTER TABLE financial_journal_entries ENABLE ROW LEVEL SECURITY;

CREATE TABLE financial_budgets (
    id UUID PRIMARY KEY,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID,
    updated_by UUID,
    
    name VARCHAR(255) NOT NULL,
    limit_minor_units BIGINT NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL
);
ALTER TABLE financial_budgets ENABLE ROW LEVEL SECURITY;

CREATE TABLE financial_exchange_rates (
    id UUID PRIMARY KEY,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID,
    updated_by UUID,
    
    base_currency VARCHAR(3) NOT NULL,
    quote_currency VARCHAR(3) NOT NULL,
    rate NUMERIC(19, 6) NOT NULL,
    date DATE NOT NULL
);
ALTER TABLE financial_exchange_rates ENABLE ROW LEVEL SECURITY;

CREATE TABLE financial_goals (
    id UUID PRIMARY KEY,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID,
    updated_by UUID,
    
    name VARCHAR(255) NOT NULL,
    target_minor_units BIGINT NOT NULL,
    currency_code VARCHAR(3) NOT NULL
);
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;

CREATE TABLE financial_recurring_transactions (
    id UUID PRIMARY KEY,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID,
    updated_by UUID,
    
    cron_expression VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL
);
ALTER TABLE financial_recurring_transactions ENABLE ROW LEVEL SECURITY;

CREATE TABLE financial_reconciliation_records (
    id UUID PRIMARY KEY,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID,
    updated_by UUID,
    
    state VARCHAR(50) NOT NULL,
    statement_line_id VARCHAR(255) NOT NULL,
    ledger_entry_id UUID REFERENCES financial_journal_entries(id)
);
ALTER TABLE financial_reconciliation_records ENABLE ROW LEVEL SECURITY;

CREATE TABLE projection_checkpoints (
    id UUID PRIMARY KEY,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID,
    updated_by UUID,
    
    projection_name VARCHAR(255) UNIQUE NOT NULL,
    position VARCHAR(255) NOT NULL,
    last_updated_at TIMESTAMPTZ NOT NULL
);
ALTER TABLE projection_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE TABLE projection_snapshots (
    id UUID PRIMARY KEY,
    version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID,
    updated_by UUID,
    
    projection_name VARCHAR(255) NOT NULL,
    state JSONB NOT NULL,
    snapshot_version INT NOT NULL,
    taken_at TIMESTAMPTZ NOT NULL
);
ALTER TABLE projection_snapshots ENABLE ROW LEVEL SECURITY;
