# Farvics Manager - Database Design Review Checklist

This document is the mandatory Engineering Constitution checklist for all schema changes. No database table or migration may be merged unless it strictly satisfies every checklist item. 

## 01 Table Review Checklist
- [ ] **Purpose:** Why does this table exist? Does another table already solve this?
- [ ] **Ownership:** Which module explicitly owns this table? (Identity, Platform, Ledger, etc.)
- [ ] **Aggregate:** What Domain-Driven Design (DDD) aggregate does it belong to? Is it an Aggregate Root or a child entity?
- [ ] **Normalization:** Is the normalization level appropriate? Have we avoided premature denormalization?
- [ ] **Extensibility:** Are future extensions considered without requiring destructive changes?

## 02 Column Checklist
- [ ] **Naming:** Does it use `snake_case`? Are abbreviations avoided?
- [ ] **Data Type:** Are the types optimally sized? (e.g., `UUID` for PKs, `text` instead of arbitrary `varchar(255)` unless strictly constrained).
- [ ] **Nullable Policy:** Is `NOT NULL` used by default? Are optional fields explicitly justified?
- [ ] **Default Values:** Are defaults safe and deterministic?
- [ ] **Validation (Check Constraints):** Are database-level checks applied for state validation?
- [ ] **Money Rules:** Are financial values stored as integers (`bigint`/`int`) representing the smallest unit (e.g., `amount_cents`)? Floating points are absolutely banned.
- [ ] **Timestamp Rules:** Are all temporal fields using `timestamptz` stored in UTC?
- [ ] **Audit Columns:** Does the table include `created_at`, `updated_at`, `version` (for OCC), and optionally `deleted_at`, `created_by`, `updated_by`?

## 03 Relationship Checklist
- [ ] **Foreign Keys:** Are foreign keys explicitly defined with correct `fk_` naming?
- [ ] **Cascades:** Is `ON DELETE RESTRICT` used as the default to prevent accidental data destruction?
- [ ] **Cross-Module Dependencies:** Have we avoided hard cross-module foreign keys, preferring loose IDs or explicit contracts instead?
- [ ] **Cardinality & Cycles:** Is the relationship cardinality correct? Are circular dependencies prevented?
- [ ] **Ownership:** Do the foreign keys reflect the correct domain ownership boundaries?

## 04 Index Checklist
- [ ] **Primary Indexes:** Is the primary key a UUID named `id`?
- [ ] **Unique Indexes:** Are unique constraints enforcing data integrity with `uq_` naming?
- [ ] **Composite Indexes:** Do composite indexes align with the exact order of `WHERE` and `ORDER BY` clauses?
- [ ] **Partial Indexes:** Are partial indexes used for soft-deleted tables (e.g., `WHERE deleted_at IS NULL`)?
- [ ] **Expected Query Patterns:** Have all standard read paths been given explicit index coverage to avoid sequential scans?

## 05 Performance Checklist
- [ ] **Table Growth:** Is the table expected to grow infinitely? If so, is partitioning or archiving planned?
- [ ] **Write Volume:** Will high write concurrency cause lock contention on related parent tables?
- [ ] **Read Volume:** Will read volume necessitate an eventual CQRS read-model?
- [ ] **Pagination Strategy:** Is cursor/keyset pagination supported by the chosen indexes?
- [ ] **Query Complexity:** Are joins localized within the module boundary?

## 06 Security Checklist
- [ ] **Row Level Security (RLS):** Is RLS explicitly enabled and tested?
- [ ] **Ownership:** Are policies restricting access to the authenticated `user_id` or `tenant_id`?
- [ ] **Sensitive Columns:** Is PII identified? Is encryption required for highly sensitive data?
- [ ] **Audit Requirements:** Are mutations on this table being captured in immutable audit logs or event sourcing tables?

## 07 Migration Checklist
- [ ] **Backward Compatibility:** Does this migration break currently running application code?
- [ ] **Forward Compatibility:** Can the application be rolled back while leaving this migration in place?
- [ ] **Rollback Strategy:** Is there a defined, tested rollback plan for local development?
- [ ] **Data Migration:** Does a schema change require a multi-phase data migration strategy?
- [ ] **Lock Duration:** Will this migration cause extended locks on production tables? (e.g., adding constraints with `NOT VALID` followed by `VALIDATE`).
- [ ] **Deployment Order:** Are migrations ordered chronologically using the `YYYYMMDDHHMMSS` timestamp format?

## 08 Operational Checklist
- [ ] **Monitoring:** Will this table introduce massive volume requiring new metric alerts?
- [ ] **Logging:** Will errors on this table trigger appropriate `ERROR` level logs?
- [ ] **Backup Impact:** Does the table contain ephemeral data (e.g., cached session tokens) that should be excluded from backups or stored in Redis instead?
- [ ] **Capacity Impact:** Will this significantly accelerate WAL growth?
- [ ] **Maintenance Requirements:** Will this table require aggressive custom vacuuming?

## 09 Architecture Checklist
- [ ] **DDD Compliance:** Does this adhere strictly to the Domain-Driven Design layout?
- [ ] **Aggregate Ownership:** Is it perfectly clear which Aggregate Root governs this entity?
- [ ] **Event Generation:** Do state changes on this table emit Transactional Outbox Events?
- [ ] **CQRS Implications:** Does this write-model schema complicate querying to the point where a Projection is necessary?
- [ ] **Future Extraction Readiness:** Can this module be extracted into a microservice later without unpicking massive database spaghetti?

---

## 10 Pull Request Checklist Template
*Copy this block into every Pull Request description that modifies the database schema.*

```markdown
### Database Schema Review (Mandatory)

**1. General**
- [ ] Migration follows `YYYYMMDDHHMMSS_name.sql` naming convention.
- [ ] Module ownership is explicitly documented in the SQL comments.
- [ ] Migration is deterministic, append-only, and idempotent where possible.

**2. Structure & Standards**
- [ ] PK is UUID `id`.
- [ ] Required audit columns (`created_at`, `updated_at`, `version`) are present.
- [ ] Money fields use `integer` (`_cents`), NOT floating points.
- [ ] Timestamps use `timestamptz`.

**3. Integrity & Performance**
- [ ] `NOT NULL` constraints applied defensively.
- [ ] Foreign Keys use `ON DELETE RESTRICT` (unless Aggregate child).
- [ ] Appropriate indexes provided for all anticipated access patterns.

**4. Security & Architecture**
- [ ] RLS is enabled and policies are defined.
- [ ] Changes do not breach Cross-Module dependencies.
- [ ] Mutation triggers corresponding Outbox Events if part of an Aggregate Root.
- [ ] Migration uses safe DDL (avoids full table locks on large tables).
```

