# Module: Identity

## 1. Responsibilities
The Identity module is the foundational root of the AURA.MONEY platform. It handles:
- User authentication synchronization from Supabase Auth.
- Core profile management (first name, last name).
- Providing the `user_id` context required by every other module for multi-tenancy and ownership isolation.

## 2. Aggregate Roots
- **User**: The single aggregate root in this module. Represents a registered platform identity.

## 3. Domain Events
*(Future capability ready - Outbox pattern to be implemented)*
- `UserRegisteredEvent`
- `UserProfileUpdatedEvent`
- `UserDeactivatedEvent`

## 4. Boundaries
- **Inbound:** Receives auth webhooks/triggers from `auth.users` to provision `public.users`.
- **Outbound:** Exposes standard `user_id` context to Ledger, Automation, etc.
- **Isolation:** Does not depend on any business modules (Ledger, Analytics).

## 5. Dependencies
- **Supabase GoTrue (Auth):** Source of truth for credentials and JWTs.

## 6. Public Contracts
The Identity module exposes the `IUserRepository` for dependency injection and domain boundary interactions.
