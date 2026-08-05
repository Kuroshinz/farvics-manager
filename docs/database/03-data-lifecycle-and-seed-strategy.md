# AURA.MONEY - Data Lifecycle & Seed Strategy

This document establishes the permanent data lifecycle strategy governing how data is created, seeded, migrated, refreshed, anonymized, archived, restored, and destroyed across all environments.

## 01 Environment Strategy

| Environment | Purpose | Allowed Data | Forbidden Data | Refresh/Reset Policy | Retention | Access Rules |
|-------------|---------|--------------|----------------|----------------------|-----------|--------------|
| **Development** | Local engineering and feature building. | Synthetic data, Dev Seeds, Reference data. | Any production data, Real PII. | Reset manually via `supabase db reset`. | Ephemeral. | All Engineers. |
| **Testing** | CI/CD validation. | Deterministic Test Seeds. | Production data. | Reset automatically on every CI run. | Ephemeral. | CI/CD Service Accounts. |
| **Demo** | Stakeholder review, Sales, Pre-production UX testing. | Curated Demo Seeds (realistic but fake). | Production data. | Nightly automated refresh. | Ephemeral (rolling).| Internal staff & Demo users. |
| **Staging** | Production dress-rehearsal, final integration. | Anonymized production-like data (strict policy) or high-volume synthetic. | Unmasked PII, Real secrets. | Refreshed weekly from sanitized prod snapshots (if approved). | 30 Days. | Authorized Engineers & QA. |
| **Production** | Live customer operations. | Real user data. | Test data, Demo accounts. | NO RESET. Only forward migrations. | Infinite (subject to compliance/deletion requests). | Strictly restricted (Principle of Least Privilege). |

## 02 Seed Strategy
Production data must NEVER be used directly in lower environments.
- **Development Seed:** Lightweight, fast-loading dataset to enable immediate local UI/API testing.
- **Testing Seed:** Edge-case heavy, deterministic dataset strictly for automated test suites.
- **Demo Seed:** Rich, realistic, coherent datasets designed to showcase features perfectly.
- **Reference Data:** Immutable global settings (e.g., ISO currencies). Applied in all environments.
- **Benchmark Data:** High-volume dataset (1M+ rows) to test query planner and indices locally.
- **Performance Test Data:** Extreme-volume dataset to test system boundaries.

## 03 Seed Ownership
Data seeding is strictly modular. Modules only seed their own aggregates.
- **Identity:** Owns `users`, authentication records, profiles.
- **Platform:** Owns `outbox_events`, system logs, feature flags.
- **Ledger:** Owns `accounts`, `transactions`, `categories`, `currencies`.
- **Analytics:** Owns `projections`, pre-computed aggregates.
- **Automation:** Owns `automation_rules`, triggers.

## 04 Data Generation
All generated synthetic data MUST be deterministic (e.g., using a fixed seed in faker libraries) to ensure reproducibility.
- **Users:** Generate predictable UUIDs, stable email patterns (`user1@aura.test`).
- **Accounts:** Generate fixed balances and predictable account structures.
- **Transactions:** Generate coherent double-entry ledgers that always balance to zero globally.
- **Budgets & Categories:** Generate a standardized tree of default categories.
- **Stress-test datasets:** Scripted generation that scales linearly based on a parameter (e.g., `--users=100000`).

## 05 Data Reset Policy
- **Local Reset:** `supabase db reset` wipes the local schema and re-applies migrations and Development Seeds.
- **Test Reset:** CI framework provisions a clean database container per test suite, applying migrations and Testing Seeds.
- **Demo Refresh:** Automated CRON job wipes Demo DB nightly and restores the Demo Seed to prevent state degradation.
- **Staging Refresh:** Handled via authorized, automated CI pipelines using sanitized data scripts.
- **Production Recovery:** Triggered ONLY during disaster recovery via Point-in-Time Recovery (PITR) backups.

## 06 Backup Strategy
- **Frequency:** Continuous Archiving (WAL archiving) with daily full snapshots.
- **Retention:** 35 days for Point-in-Time Recovery (PITR); Monthly snapshots retained for 7 years (compliance).
- **Encryption:** AES-256 encryption at rest; TLS 1.3 in transit. Backups must use separate encryption keys.
- **Verification:** Automated weekly jobs must attempt to restore the latest backup to an isolated environment to verify integrity.
- **Disaster Recovery (RPO/RTO):** 
  - Recovery Point Objective (RPO): < 1 minute (via WAL).
  - Recovery Time Objective (RTO): < 4 hours.

## 07 Data Anonymization
If production data must be exported for debugging or staging, it must pass through a strict anonymization pipeline.
The following must be completely masked, hashed, or replaced:
- **Names:** Replaced with synthetic names.
- **Emails:** Replaced with `<uuid>@anonymized.aura.money`.
- **Phone Numbers:** Replaced with dummy numbers.
- **Tokens/Secrets:** Completely dropped or replaced with test keys.
- **Identifiers:** National IDs, tax numbers replaced.
- **Financially Sensitive Information:** Transaction references scrubbed of PII. Balances and amounts remain for debugging, but unlinked from real identities.

## 08 Reference Data
Immutable system data required for operation.
- **Examples:** ISO Currencies, Locales, Timezones, Country Codes, System Roles.
- **Updates:** Reference data is managed purely through schema migrations (e.g., `INSERT INTO currencies...`) or a strict configuration-as-code pipeline. Never mutated manually in Production.

## 09 Test Dataset Strategy
- **Unit Tests:** Mocked data in memory. No database dependency.
- **Integration Tests:** Database container initialized with standard Testing Seeds.
- **Contract Tests:** Minimal viable dataset to fulfill API contracts.
- **End-to-End Tests:** Demo Seed dataset loaded into an isolated ephemeral environment.
- **Load / Performance Benchmarks:** Benchmark Data injected via bulk scripts (bypassing ORM for speed).
- **Regression Tests:** Deterministic snapshots of edge-case bugs captured as isolated seeds.

## 10 Success Criteria
The Data Lifecycle Strategy is active and complete when:
- Every environment has an explicitly enforced data policy.
- Seed ownership is strictly aligned with module boundaries.
- Backup, restore, and RPO/RTO metrics are explicitly documented.
- Production data is completely insulated from lower environments.
- Test data is 100% reproducible.
- Engineers use automated scripts instead of manually inventing seeding rules.
