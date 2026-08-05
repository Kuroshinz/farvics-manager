# ADR 001: Public Users and Identity Synchronization

## Status
Accepted

## Context
Farvics Manager relies on Supabase Auth for identity management, which natively manages credentials and sessions inside the `auth.users` table. However, Supabase enforces a strict boundary: the `auth` schema cannot be easily joined, queried, or modified by application business logic via the API, nor can it hold rich domain-specific aggregate data (like budgets, profiles, etc.).

We need a way to link domain entities (like Accounts or Transactions) to authenticated users while maintaining strict domain boundaries, and we need to query user profiles securely.

## Decision
1. **Existential Separation (`public.users`)**: We will maintain a dedicated `public.users` table. This serves as the Identity module's aggregate root inside the application's domain schema.
2. **Synchronization Strategy**: We use PostgreSQL triggers directly on `auth.users` to synchronize identities immutably and idempotently. 
   - On `INSERT` to `auth.users`, the trigger pushes a record to `public.users`.
   - On `UPDATE` or `DELETE`, the trigger reflects the changes (or soft deletes) in `public.users`.
3. **No Direct Mutation**: The application backend NEVER writes to `public.users` directly to create a user. It must flow through Supabase Auth.
4. **Data Masking**: `public.users` only stores non-sensitive, queryable profile data (e.g., `first_name`, `email`, `version`) and uses Row Level Security (RLS) to protect it.

## Consequences
**Pros:**
- Complete decoupling of application domain from the underlying Auth provider's internal schema constraints.
- Allows strict RLS policies on our own terms.
- Ensures Foreign Key relationships (e.g., `account -> user`) remain robust inside the `public` schema.

**Cons:**
- Eventual consistency risks if triggers fail (mitigated by transactional guarantees within Postgres).
- Slight data duplication (e.g., `email`).

