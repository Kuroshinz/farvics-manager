# AURA.MONEY - Architecture Change Log

## 1. Automation Loop Protection
- **Status**: ACCEPTED (Category A - Mandatory)
- **Rationale**: Infinite loops in the Automation Engine pose an existential risk (DDOS, cost overrun).
- **Impact**: Added `HopCount`, `CorrelationId`, `CausationId`, and Circuit Breakers to the Event Bus and Automation modules.

## 2. Optimistic Concurrency Control
- **Status**: ACCEPTED (Category A - Mandatory)
- **Rationale**: Financial data cannot tolerate Lost Update Anomalies.
- **Impact**: All Aggregate Roots now include `version` and `updatedAt`. Repositories enforce locking and throw `ConcurrencyException`.

## 3. Observability Expansion
- **Status**: ACCEPTED (Category A - Mandatory)
- **Rationale**: Required for production triage and distributed tracing.
- **Impact**: Upgraded Observability to a first-class Platform Capability.

## 4. Projection Rebuild Engine
- **Status**: PARTIALLY ACCEPTED (Category B - Required Before Prod)
- **Rationale**: A full Event Sourcing engine is premature.
- **Impact**: Outbox will retain events for a configurable window to allow limited replays and projection rebuilds, paving the way for a future Event Store.

## 5. Plugin Runtime Isolation
- **Status**: PARTIALLY ACCEPTED (Category B - Required Before Prod)
- **Rationale**: Building a Wasm sandbox is too complex for V1.
- **Impact**: V1 supports only compiled, trusted, first-party plugins. Interfaces are designed for future sandbox migration (Category C).
