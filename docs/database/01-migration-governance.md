# Farvics Manager - Database Migration & Governance Strategy

This document establishes the permanent standard for every database change in Farvics Manager.

## 01 Migration Strategy
- **Lifecycle:** 
  - **Local Development:** Engineers create migrations via Supabase CLI, test locally using `supabase db reset`.
  - **Staging Workflow:** Migrations are applied sequentially to staging upon merge to `main`.
  - **Production Workflow:** Migrations are applied in a strict, automated deployment pipeline.
- **Append-only Policy:** Migrations are append-only. Once applied in any shared environment (Staging/Prod), they are immutable.
- **Verification:** Every deployment must verify migration success and application health post-migration.
- **Disaster Recovery:** Automated backups must exist before any production migration runs.

## 02 Migration Naming Convention
A strict naming format using standard Supabase timestamp rules is mandatory.
- **Format:** `YYYYMMDDHHMMSS_descriptive_name.sql`
- **Examples:** 
  - `20260805120000_create_users_table.sql`
  - `20260805120500_create_outbox_events.sql`
- **Rules:** Names must describe exactly what changes. Generic names (`update.sql`, `fix.sql`, `temp.sql`) are strictly prohibited.

## 03 Migration Governance
- **Immutability:** Never edit executed migrations.
- **Atomicity:** Every schema change requires a new migration.
- **Purpose:** Every migration must have a clear, documented purpose.
- **Reviewability:** Every migration must be code-reviewed by at least one other engineer.
- **Determinism:** Migrations must run deterministically.
- **Idempotency:** Migrations must be idempotent where appropriate (e.g., `CREATE TABLE IF NOT EXISTS`).

## 04 Rollback Policy
- **Development/Testing:** Down-migrations (rollbacks) are permitted during active local/branch development using `supabase db reset` or `supabase migration down`.
- **Staging/Production:** Production strongly prefers **forward migrations** (forward-fixes) over history rewriting. Down-migrations on Production are strictly for absolute catastrophic failure, require manual DBA intervention, and must be tested against a recent production snapshot.
- **Verification:** After any rollback, the database schema and generated types must be re-validated.

## 05 CI Migration Validation
Automated validation is mandatory on every Pull Request.
CI must verify:
- Database can be created from zero (clean reset).
- All migrations execute successfully in chronological order.
- No duplicate timestamps exist.
- No missing dependencies.
- Schema matches expected state.
- Seeds execute successfully.
- Generated database types remain valid and compile without TS errors.

## 06 Database Ownership
Modules own their tables. No table may have multiple owning modules. Cross-module access must occur through contracts or events.
- **Identity:** `users`
- **Platform:** `outbox_events`
- **Ledger:** `accounts`, `transactions`, `categories`
- **Analytics:** `projections`
- **Automation:** `automation_rules`

## 07 SQL Standards
Mandatory conventions for all schema definitions:
- **Naming:** `snake_case` for all tables and columns.
- **Primary Keys:** UUIDs.
- **Timestamps:** `timestamptz` for temporal data.
- **Audit Columns:** `created_at`, `updated_at`, `deleted_at` (for soft deletes if required).
- **Concurrency:** `version` column for Optimistic Concurrency Control on aggregate roots.
- **Constraints:** Explicit foreign keys, explicit indexes, explicit constraints.
- **Nullability:** `NOT NULL` by default. Implicit behavior is banned.

## 08 Data Safety Rules
Production data is strictly protected.
- **Prohibited without extensive migration plan:** `DROP TABLE`, destructive `ALTER` (e.g., dropping columns), unsafe type conversions, irreversible data loss migrations.
- **Requirements:** Any breaking schema change requires a documented data migration strategy, an application-level compatibility strategy (e.g., multi-phase rollout), and a production validation checklist.

## 09 Migration Documentation Standard
Every migration file must begin with a SQL comment header containing:
```sql
-- Purpose: Brief description of the migration
-- Module: The owning module (e.g., Identity, Ledger)
-- Related ADR: ADR-XX (if applicable)
-- Sprint: Sprint XX
-- Author: Name / Agent
-- Creation Date: YYYY-MM-DD
-- Dependencies: Previous migration file name (if tightly coupled)
-- Risk Level: Low / Medium / High
```

## 10 Success Criteria
The governance strategy is active and complete when:
- Engineers never need to invent migration rules.
- Database evolution is completely deterministic.
- Production deployments are predictable.
- Rollback strategies are universally understood and documented.
- CI automatically enforces and validates every migration.
- Database ownership is explicit and isolated.
- SQL conventions are permanently frozen.

