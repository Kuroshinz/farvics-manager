# Sprint Plan - Phase 1

## Sprint 1: Foundation & Identity (Weeks 1-2)
- **Goal**: Scaffold monorepo, database, and auth.
- **Tasks**:
  - `TSK-101`: Scaffold Next.js + Tailwind + shadcn/ui.
  - `TSK-102`: Initialize Supabase project & environment vars.
  - `TSK-103`: Implement `users` and `outbox_events` SQL migrations.
  - `TSK-104`: Implement Supabase Auth UI (Login/Register).
- **Exit Criteria**: Users can register, log in, and view a blank protected dashboard.

## Sprint 2: Core Ledger (Weeks 3-4)
- **Goal**: Accounts, Transactions, and Outbox dispatcher.
- **Tasks**:
  - `TSK-201`: Implement `accounts` and `transactions` SQL migrations (with RLS).
  - `TSK-202`: Implement Zod Validation Library.
  - `TSK-203`: Implement Account/Transaction Repositories and Server Actions.
  - `TSK-204`: Build `CreateAccountForm` and `TransactionTable`.
  - `TSK-205`: Deploy Outbox Dispatcher Edge Function.
- **Exit Criteria**: Users can create accounts and log transactions. Events are persisted to outbox.
