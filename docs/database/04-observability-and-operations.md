# AURA.MONEY - Database Observability & Operations Standards

This document establishes the operational standards for the database platform. It defines how the database is monitored, maintained, audited, and operated in production environments.

## 01 Monitoring Strategy
Database metrics must be actively monitored with alerting thresholds defined.
- **Database Availability:** Ping latency and uptime (Target: 99.99%). Alert: FATAL if down.
- **Connection Pool Usage:** Monitor active/idle connections. Alert: WARN at 75%, ERROR at 90%.
- **Query Latency:** Average and P99 response times. Alert: WARN if P99 > 250ms.
- **Slow Queries:** Queries exceeding 500ms must trigger logs for review.
- **Lock Contention:** Time spent waiting for locks. Alert: WARN if sustained wait > 5s.
- **Deadlocks:** Any occurrence. Alert: ERROR.
- **Replication Health (Future):** Replication lag (bytes/seconds). Alert: WARN if lag > 10s.
- **Storage Growth:** Disk space utilization. Alert: WARN at 75%, ERROR at 85%, FATAL at 95%.
- **WAL Growth:** Size of Write-Ahead Logs. Alert: WARN if rapidly ballooning without archiving.
- **CPU / Memory Usage:** Instance resource utilization. Alert: WARN > 80% sustained for 15m.

## 02 Logging Strategy
Structured logging is mandatory for observability.
- **DEBUG:** Connection debugging, detailed outbox processing steps.
- **INFO:** Migration successes, successful authentication events, periodic health check results.
- **WARN:** Outbox processing retries, slow queries (250ms - 500ms), lock waits.
- **ERROR:** SQL errors, migration failures, RLS policy violations, failed transactions, slow queries (> 500ms).
- **FATAL:** Connection pool exhaustion, database unreachability, unrecoverable outbox dead-letters.

## 03 Performance Standards
- **Maximum Acceptable Query Latency:** OLTP standard queries < 50ms; complex analytical queries < 500ms.
- **Index Review Policy:** Missing index scans and unused indexes must be reviewed quarterly via `pg_stat_user_indexes`.
- **N+1 Detection:** The application layer must explicitly monitor for and warn against N+1 query patterns during staging/integration tests.
- **Query Plan Review:** Any migration introducing complex joins or aggregations MUST include `EXPLAIN ANALYZE` outputs in the Pull Request.
- **Pagination Standards:** Keyset (cursor-based) pagination is mandatory for all unbounded collections. `OFFSET` pagination is strictly banned for large datasets.
- **Connection Management:** Connection pooling (e.g., PgBouncer / Supabase Supavisor) is mandatory for production. Direct connections are forbidden.

## 04 Database Health Checks
Automated health checks must periodically verify:
- **Migration Status:** Ensure the applied migrations table matches the expected deployed state.
- **Failed Migrations:** Check for interrupted or hung migration scripts.
- **Missing Indexes:** Identify sequential scans on large tables.
- **Invalid Constraints:** Ensure all foreign keys and check constraints are in a valid state.
- **Long-Running Transactions:** Flag and optionally terminate idle-in-transaction states > 5 minutes.
- **Orphan Records:** Periodic checks for unreferenced boundary entities.
- **Table Bloat:** Vacuum health; monitor dead tuple percentage (Target: < 20%).
- **Outbox Backlog:** Ensure the event outbox queue size does not exceed reasonable threshold (Alert > 500 unprocessed).

## 05 Audit Strategy
The following must always be auditable (either via `audit_logs` table, outbox events, or immutable ledgers):
- **User Actions:** Core state changes (profile updates, settings).
- **Permission Changes:** Any modification to roles, tenants, or access policies.
- **Financial Mutations:** Every account balance change MUST be tied to an immutable transaction record.
- **Automation Executions:** Rules triggered, correlation IDs, and outcomes.
- **Administrative Operations:** Manual DBA overrides, data corrections, and configuration changes.

## 06 Capacity Planning
- **Database Growth:** Plan for linear growth; heavily partition time-series or immutable ledgers by month/year.
- **Event Growth:** The `outbox_events` table will grow rapidly. Processed events must be moved to an archive storage or deleted after 30 days retention.
- **Backup Growth:** Monitor backup storage costs. Rely on PITR WAL logs for recent restores and sparse full backups for long-term compliance.
- **Scaling Guidance:** Start vertically scaling resources (CPU/RAM). Prepare for read-replica horizontal scaling when read/write ratio exceeds 80/20.

## 07 Operational Runbooks
Standardized responses to common incidents:
- **Migration Failure:** 
  1. Halt CI/CD pipeline. 
  2. Inspect the failure point. 
  3. If safe, execute manual `DOWN` migration or `DROP` of the partial table. 
  4. Write forward-fix migration.
- **Database Outage:** 
  1. Check cloud provider status. 
  2. Attempt instance restart. 
  3. If unrecoverable, initiate PITR restore to a new instance and update connection strings.
- **Restore from Backup:** 
  1. Provision a dry-run isolated instance from the backup to verify integrity. 
  2. Validate with application smoke tests. 
  3. Swap production DNS/connection strings.
- **Outbox Backlog:** 
  1. Check worker logs for deadlocks/errors. 
  2. Temporarily scale up worker instances. 
  3. Review Dead Letter Queue (DLQ).
- **Authentication Failure:** 
  1. Review Auth logs. 
  2. Check for expired JWT secrets. 
  3. Verify RLS policy validity.
- **Slow Database:** 
  1. Check active locks (`pg_stat_activity`). 
  2. Kill runaway queries if necessary. 
  3. Analyze slow query logs and issue emergency index migrations.

## 08 Success Criteria
The operational standard is complete and active when:
- Engineers possess clear thresholds for monitoring and alerting.
- Common operational failures have documented responses.
- Performance expectations (latency, pagination) are rigidly defined.
- Audit requirements are explicit and immutable.
- The platform is operationally prepared for production deployment.
