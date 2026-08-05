# AURA.MONEY - Architecture Design Document (ADD)

## 1. Vision
Build a long-term AI Financial Platform supporting millions of users, while maintaining pragmatic, modular engineering.

## 2. Engineering Principles
- Platform First
- Strict Boundaries (Hexagonal & Clean Architecture)
- Pragmatic Extensibility (Avoid premature complexity)
- At-least-once Event Delivery with Loop Protection

## 3. Architecture Style
- **Modular Monolith**: Single deployment, strict internal module boundaries.
- **Domain Driven Design (DDD)**: Business logic is the core. Every Aggregate Root MUST implement Optimistic Concurrency Control (`version`, `updatedAt`).
- **CQRS (Light)**: Separation of commands and queries. Projections are eventually consistent.
- **Event Driven Architecture**: Transactional Outbox pattern.

## 4. Automation & Loop Protection (Category A)
To prevent recursive automation triggers, the event bus implements:
- `CorrelationId` & `CausationId` tracking across all events.
- `HopCount` (Max Depth = 5).
- Rule Circuit Breakers and duplicate detection.

## 5. Plugin Architecture (Category B)
- **V1**: Compile-time, trusted first-party plugins only. Architectural isolation without runtime sandboxing.
- **V2 (Future)**: Wasm/Isolates for third-party marketplace execution.

## 6. Observability (Category A)
First-class platform capability including Structured Logging, Distributed Trace IDs, Metrics, and Audit Trails.
