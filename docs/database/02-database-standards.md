# Farvics Manager - Database Standards & Naming Convention

This document represents the frozen single source of truth for all database structural and naming conventions. All future schema migrations MUST adhere strictly to these rules.

## 01 Entity Naming
All entities must use `snake_case`. No abbreviations are permitted unless officially approved.
- **Tables:** Plural (e.g., `users`, `accounts`, `transactions`).
- **Columns:** Singular (e.g., `email`, `status`, `account_type`).
- **Views:** Prefix with `vw_` (e.g., `vw_active_users`).
- **Materialized Views:** Prefix with `mvw_` (e.g., `mvw_monthly_balances`).
- **Functions:** Prefix with `fn_` (e.g., `fn_calculate_interest`).
- **Triggers:** Prefix with `trg_` (e.g., `trg_update_modified_timestamp`).
- **Indexes:** Prefix with `idx_` (see section 07).
- **Constraints:** Prefix explicitly (see section 08).
- **Sequences:** Prefix with `seq_` (e.g., `seq_transaction_number`).
- **Policies (RLS):** Prefix with `pol_` (e.g., `pol_users_read_own`).
- **Enums:** Prefix with `enum_` (e.g., `enum_transaction_status`).
- **Schemas:** Standard lowercase (e.g., `public`, `auth`).

## 02 Primary Keys
- **Type:** `UUID` (UUIDv4 or UUIDv7 preferred for sortability if supported).
- **Naming:** Primary keys must be named `id`.
- **Generation:** Handled safely via database defaults (e.g., `gen_random_uuid()`).
- **Natural Keys:** Natural keys (e.g., email, tax_id) may have `UNIQUE` constraints but are NEVER permitted as the Primary Key.
- **Surrogate Keys:** Mandatory default policy.
- **Composite Keys:** Permitted strictly for associative/join tables (e.g., `user_roles`).

## 03 Foreign Keys
- **Naming:** Must map to the target table's singular name appended with `_id` (e.g., `user_id`, `account_id`).
- **Reference Policy:** Must explicitly define references to the parent `id`.
- **Deletion Rules:** `ON DELETE RESTRICT` is the default policy to prevent accidental data destruction. `ON DELETE CASCADE` is permitted ONLY for tightly coupled parent-child aggregates (e.g., Outbox Events tied to an Aggregate).
- **Nullable Policy:** `NOT NULL` by default. Optional relations must be explicitly documented.
- **Cross-module References:** Strong foreign keys are allowed only within the same module/boundary. Cross-module references should store the ID but enforce integrity via application-level contracts, or heavily guarded read-only views if DB enforcement is unavoidable.

## 04 Audit Columns
Every aggregate root and significant entity MUST include these fields:
- `created_at` (timestamptz, default: `now()`, NOT NULL)
- `updated_at` (timestamptz, default: `now()`, NOT NULL)
- `deleted_at` (timestamptz, NULL, for soft deletes)
- `created_by` (uuid, NULL, mapping to `user_id` context)
- `updated_by` (uuid, NULL, mapping to `user_id` context)
- `version` (integer, default: `1`, NOT NULL, for Optimistic Concurrency Control)
- **Timezone:** UTC only.
- **Ownership:** Maintained automatically by DB triggers (`trg_set_updated_at`, `trg_increment_version`).

## 05 Money Standard
Financial data must be completely insulated from floating-point errors.
- **Type:** `bigint` or `integer` representing the smallest currency unit. NEVER `float`, `real`, or `double precision`.
- **Naming:** Append the unit context (e.g., `amount_cents`). For multi-currency systems, `amount` combined with a `currency` code column is accepted if explicitly documented that `amount` is the minor unit.
- **Precision & Rounding:** Handled strictly in the Domain layer (Application).
- **Overflow:** Use `bigint` for aggregations/ledgers to prevent overflow.
- **Validation:** Add `CHECK` constraints if money cannot be negative (e.g., `balance_cents >= 0`).

## 06 Timestamp Standard
- **Type:** `timestamptz` (Timestamp with Time Zone). NEVER use `timestamp` without timezone.
- **Database Storage:** Always UTC.
- **Application Handling:** The backend queries in UTC.
- **Client Conversion:** Timezone adjustments happen on the frontend presentation layer.
- **Serialization:** ISO 8601 strings (e.g., `2026-08-05T00:00:00Z`).

## 07 Index Naming
Prefix `idx_{table_name}_`.
- **Primary Indexes:** Handled automatically by the DB (`pk_...`).
- **Standard Indexes:** `idx_users_last_name`
- **Composite Indexes:** `idx_transactions_account_id_created_at`
- **Unique Indexes:** Prefix with `uq_idx_` if defined outside of a direct table constraint.
- **GIN/GiST Indexes:** `idx_outbox_metadata_gin`
- **Partial Indexes:** `idx_users_email_active` (for `WHERE deleted_at IS NULL`)

## 08 Constraint Naming
Explicit names are required for all constraints to ensure predictable error handling.
- **Primary Keys:** `pk_{table}` (e.g., `pk_users`)
- **Foreign Keys:** `fk_{table}_{target_singular}` (e.g., `fk_transactions_account`)
- **Unique Constraints:** `uq_{table}_{column}` (e.g., `uq_users_email`)
- **Check Constraints:** `chk_{table}_{rule}` (e.g., `chk_transactions_amount_positive`)
- **Exclusion Constraints:** `excl_{table}_{rule}`

## 09 Enum Strategy
- **When Allowed:** Use native Postgres `ENUM` types for highly static core state machines that rarely change (e.g., `enum_transaction_status` -> 'PENDING', 'COMPLETED', 'FAILED').
- **Lookup Tables Preferred:** Use relational lookup tables for lists that business operations might expand (e.g., `categories`, `account_types`).
- **Migration & Versioning:** Enums are additive only (`ALTER TYPE ... ADD VALUE`). Removing enum values is unsafe.

## 10 JSON Policy
- **Type:** `jsonb` only. Never `json`.
- **Permitted:** Unstructured payloads (e.g., outbox events payload, flexible integration metadata).
- **Prohibited:** Never use JSONB to avoid relational modeling for queryable business domains.
- **Validation:** Application-side JSON schema validation must guard DB writes.
- **Indexing:** Use GIN indexes for heavily queried JSONB properties.

## 11 Soft Delete Policy
- **Type:** `deleted_at` (`timestamptz`).
- **Visibility:** Application queries must globally filter `WHERE deleted_at IS NULL`.
- **Restore Policy:** Set `deleted_at = NULL`.
- **Purge Policy:** Hard deletion requires a specialized, documented background job.
- **Constraints:** Unique constraints must often account for soft deletes via partial indexing (`CREATE UNIQUE INDEX uq_users_email ON users(email) WHERE deleted_at IS NULL;`).

## 12 Multi-Tenant Readiness
- **Policy:** Include a `tenant_id` column on all tenant-specific tables.
- **Isolation:** Row Level Security (RLS) policies must explicitly filter by `tenant_id` mapping to the authenticated context.
- **Migration Impact:** `tenant_id` must be part of composite unique indexes if entities can share names across tenants.

## 13 Naming Dictionary
Canonical terms – no synonyms allowed:
- `user` (Not: customer, client, member)
- `account` (Not: ledger_account, sub_account)
- `transaction` (Not: entry, movement, transfer)
- `category` (Not: tag, classification)
- `budget` (Not: allowance, plan)
- `wallet` (Not: purse, storage)
- `currency` (Not: denom, asset_type)
- `amount` (Not: value, total)
- `balance` (Not: current_funds)
- `event` (Not: message, signal)
- `projection` (Not: read_model, view_state)
- `automation` (Not: trigger, rule)
- `notification` (Not: alert, ping)

## 14 Database Design Rules
1. Single responsibility per table.
2. No duplicated data without explicit CQRS read-model justification.
3. Explicit Constraints: Validations must live at the DB level, not just the application level.
4. Explicit Indexes: Optimize read paths based on application access patterns.
5. Explicit Ownership: Modules strictly own their schemas.
6. Predictable Relationships: Strict adherence to FK boundaries.
7. Deterministic Migrations: All migrations must execute safely from a blank state.

