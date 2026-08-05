# Phase 1 Acceptance Criteria

1. **Authentication**: Users can register, log in, and receive a secure HTTP-only session cookie.
2. **Account Management**: A user can create an Account. The DB contains exactly 1 row in `accounts`, and 1 event in `outbox_events`.
3. **Transaction Management**: A user can create a Transaction. Optimistic locking prevents duplicate submissions within 50ms of each other.
4. **Performance**: All read queries return in < 200ms at the 95th percentile.
5. **Security**: A user attempting to query or mutate an Account belonging to a different user ID receives an empty array or `UNAUTHORIZED` error via RLS.
