# AURA.MONEY Architecture Design Document (ADD)

## 1. Executive Summary
AURA.MONEY is an enterprise-grade, AI-powered personal finance platform. This document defines the Phase 0 foundational architecture. The system is designed to be highly scalable, modular, and extensible, ensuring that future capabilities (AI, Automation, Analytics) can integrate seamlessly without architectural rewrites.

### Core Principles
1. **Platform First:** Build reusable foundational capabilities before business logic.
2. **Hexagonal & Clean Architecture:** Infrastructure is an interchangeable adapter; the domain is permanent. Dependencies always point inward.
3. **Module Independence:** The system acts as a Modular Monolith where any business module can be extracted into a standalone microservice in the future.
4. **Hybrid Event-Driven Architecture:** The backend acts as the Source of Truth using a Transactional Outbox pattern. The frontend is strictly a reactive consumer.

---

## 2. Architectural Paradigms

### 2.1 Domain-Driven Modular Monolith
The application operates within a single Next.js monorepo but is strictly partitioned into business modules and a cross-cutting platform layer.

**The Dependency Rule:**
`Presentation -> Application -> Domain <- Infrastructure`
*   **Domain:** Contains Entities, Value Objects, Domain Events, and Repository Interfaces. Depends on nothing.
*   **Application:** Contains Use Cases, Application Services, and external module contracts. Depends only on Domain.
*   **Presentation:** UI components, API routes, Controllers. Depends on Application.
*   **Infrastructure:** Database implementations (Supabase clients), 3rd-party API adapters. Depends on Domain/Application abstractions.

**Inter-Module Communication:**
Modules may never access each other's databases or infrastructure directly. Communication is strictly handled via:
1.  Shared Domain Interfaces / Application Contracts.
2.  Asynchronous Domain Events (Event Bus).

### 2.2 The Platform Layer
A dedicated `src/platform/` layer provides cross-cutting capabilities that any business module can consume. These are not business modules; they are infrastructure primitives.
*   Identity & Authorization (Supabase Auth, Permissions)
*   Configuration & Environment
*   Observability (Logging, Tracing, Metrics)
*   Feature Flags
*   Caching & Rate Limiting
*   Event Dispatcher (Outbox Poller / Webhook Receiver)

---

## 3. Event-Driven Architecture (EDA)

The core of AURA.MONEY's extensibility is its EDA, powered by the **Transactional Outbox Pattern**.

### 3.1 Event Lifecycle
1.  **Commit:** A business transaction successfully updates business tables and inserts a serialized event into the `outbox_events` table in the *same database transaction*.
2.  **Dispatch:** A Supabase Database Webhook (or pg_cron) pushes the outbox row to the Next.js/Edge Platform Event Dispatcher.
3.  **Fan-out:** The Dispatcher routes the event to subscribed adapters (AI, Automation, Notifications, Realtime for Frontend).

### 3.2 Delivery Guarantees & Subscriber Responsibilities
*   **At-least-once Delivery:** The system guarantees an event will be delivered.
*   **Idempotency:** Every consumer/subscriber MUST be idempotent. Duplicate events must not corrupt business state.
*   **Outbox Processing Capabilities:** The platform includes Retries, Dead Letter Queues (DLQ), Exponential Backoff, Poison Message Detection, and Replay tooling.

### 3.3 Universal Event Schema
Events are immutable public contracts. Changes require a schema version bump.
```typescript
interface DomainEvent<T = unknown> {
  eventId: string;          // UUID v4
  aggregateId: string;      // UUID of the resource (e.g., Transaction ID)
  aggregateType: string;    // e.g., 'Transaction'
  aggregateVersion: number; // For optimistic concurrency
  eventType: string;        // e.g., 'TransactionCreated'
  payload: T;               // Strongly typed payload
  occurredAt: string;       // ISO 8601 UTC timestamp
  actor: string;            // User ID or System ID that initiated the action
  correlationId: string;    // Trace ID across the entire lifecycle
  causationId: string;      // ID of the event/command that caused this
  schemaVersion: string;    // e.g., '1.0'
  tenantId?: string;        // Future-proofing for multi-tenant organizations
  metadata?: Record<string, unknown>; // Browser info, IP, etc.
}
```

---

## 4. Project Directory Structure

```text
aura-money/
├── src/
│   ├── platform/                 # Cross-cutting infrastructure
│   │   ├── auth/                 # Identity, sessions
│   │   ├── events/               # Outbox dispatcher, DLQ, Event interfaces
│   │   ├── logger/               # Observability, audit trails
│   │   └── config/               # Environment variables
│   │
│   ├── modules/                  # Business Domains
│   │   ├── ledger/               # Accounts, Transactions, Categories
│   │   │   ├── domain/           # Entities, Value Objects, Domain Events
│   │   │   ├── application/      # Use Cases, Contracts
│   │   │   ├── infrastructure/   # Repositories (Supabase), Adapters
│   │   │   └── presentation/     # UI Components, Routes specific to Ledger
│   │   │
│   │   ├── automation/           # Event listeners, Rules engine
│   │   ├── ai/                   # Inference adapters, OCR processing
│   │   └── analytics/            # Reusable reporting engine
│   │
│   ├── shared/                   # Global UI, design system, tokens
│   │   ├── components/           # shadcn/ui, base components
│   │   ├── styles/               # Tailwind CSS, themes
│   │   └── utils/                # formatting, purely functional helpers
│   │
│   └── app/                      # Next.js App Router (Composition Root)
│       ├── (auth)/               # Login, Register pages
│       ├── (dashboard)/          # Shell layout, navigation
│       └── api/                  # API routes (composition of module use cases)
```

---

## 5. Security & Extensibility

*   **Row Level Security (RLS):** Enforced at the Supabase PostgreSQL level. Infrastructure adapters pass the authenticated `actor` context to ensure DB-level isolation.
*   **Replaceable Infrastructure:** Event Publishers, AI providers, and Storage interfaces are injected adapters. Migrating from Edge Functions to Kafka requires zero changes to the `domain/` or `application/` layers.
*   **Testing Strategy:** 
    *   *Unit Tests (Vitest):* Heavy coverage on `domain/` and `application/` layers.
    *   *Integration Tests:* Validating `infrastructure/` adapters against Supabase local instances.
    *   *E2E Tests (Playwright):* Happy path user flows traversing the `app/` composition root.
