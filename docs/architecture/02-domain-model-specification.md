# AURA.MONEY - Domain Model Specification (DMS)

## 1. Ledger Context
- **Aggregate Roots**: `Account` (includes `version`, `updatedAt`), `Transaction` (includes `version`, `updatedAt`)
- **Entities**: `Category`
- **Domain Policies**: Optimistic locking enforced on all mutations. ConcurrencyException thrown on conflict.

## 2. Automation Context
- **Aggregate Roots**: `Rule` (includes `version`, `updatedAt`)
- **Domain Policies**: Circuit breakers applied per rule execution graph to prevent infinite loops.
