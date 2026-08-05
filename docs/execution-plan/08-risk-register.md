# Risk Register

| Risk | Probability | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| RLS Misconfiguration exposing data | Low | Critical | Mandatory peer review of all `.sql` files. E2E tests executing as cross-tenant users. |
| Server Action concurrent race condition | Medium | High | Optimistic locking (`version` column) mandated in Tech Spec. E2E concurrency tests. |
| Edge Function timeout on Outbox | Medium | Medium | DLQ implementation. Keep dispatcher logic strictly to routing (fast). |
