# Testing Matrix

| Feature | Unit | Integration (Local Supabase) | E2E (Playwright) |
| :--- | :--- | :--- | :--- |
| **Auth** | Utils | RLS Triggers | Login flow |
| **Accounts** | Repositories, Domain | RLS, Server Actions | Create Account flow |
| **Transactions** | Repositories, Val | Outbox insert, Actions | Create TX flow |
| **Outbox Dispatcher**| Payload formatting | Webhook trigger | Async event delivery |
