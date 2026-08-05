# Database Specification

## Table: `users`
- **Purpose**: Core identity and tenant root.
- **Columns**: 
  - `id` (UUID, PK, Default: gen_random_uuid())
  - `email` (VARCHAR(255), Unique, Not Null)
  - `created_at` (TIMESTAMPTZ, Not Null, Default: now())
  - `updated_at` (TIMESTAMPTZ, Not Null, Default: now())
  - `version` (INT, Not Null, Default: 1)
- **Indexes**: `idx_users_email`
- **RLS Policy**: `auth.uid() = id`

## Table: `accounts`
- **Purpose**: Financial ledger accounts (checking, savings, etc).
- **Columns**:
  - `id` (UUID, PK, Default: gen_random_uuid())
  - `user_id` (UUID, FK -> users.id, Not Null)
  - `name` (VARCHAR(100), Not Null)
  - `type` (VARCHAR(50), Not Null) - Check: `CHECKING`, `SAVINGS`, `CREDIT`
  - `currency_code` (VARCHAR(3), Not Null) - Check: length = 3
  - `balance_cents` (BIGINT, Not Null, Default: 0)
  - `created_at` (TIMESTAMPTZ, Not Null, Default: now())
  - `updated_at` (TIMESTAMPTZ, Not Null, Default: now())
  - `version` (INT, Not Null, Default: 1)
- **Indexes**: `idx_accounts_user_id`
- **RLS Policy**: `auth.uid() = user_id`

## Table: `transactions`
- **Purpose**: Immutable financial ledger entries.
- **Columns**:
  - `id` (UUID, PK)
  - `account_id` (UUID, FK -> accounts.id, Not Null)
  - `user_id` (UUID, FK -> users.id, Not Null)
  - `amount_cents` (BIGINT, Not Null)
  - `type` (VARCHAR(20), Not Null) - Check: `CREDIT`, `DEBIT`
  - `status` (VARCHAR(20), Not Null) - Check: `PENDING`, `CLEARED`
  - `date` (DATE, Not Null)
  - `created_at` (TIMESTAMPTZ, Not Null)
  - `updated_at` (TIMESTAMPTZ, Not Null)
  - `version` (INT, Not Null, Default: 1)
- **Indexes**: `idx_transactions_account_id`, `idx_transactions_date`
- **RLS Policy**: `auth.uid() = user_id`

## Table: `outbox_events`
- **Purpose**: Transactional outbox for EDA.
- **Columns**:
  - `id` (UUID, PK)
  - `aggregate_type` (VARCHAR(50), Not Null)
  - `aggregate_id` (UUID, Not Null)
  - `event_type` (VARCHAR(100), Not Null)
  - `payload` (JSONB, Not Null)
  - `metadata` (JSONB, Not Null)
  - `created_at` (TIMESTAMPTZ, Not Null)
  - `processed_at` (TIMESTAMPTZ, Null)
