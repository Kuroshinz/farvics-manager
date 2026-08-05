# AURA.MONEY - Platform Capability Map

## 1. Observability (Category A)
- **Owner**: Platform Team
- **Capabilities**: Structured Logging, Correlation Tracking, Distributed Trace IDs, Health Checks, Error Classification.

## 2. Event Bus & Automation Loop Protection
- **Capabilities**: Outbox Dispatcher, Dead Letter Queue (DLQ), Hop Count Validation, Causation Tracking.

## 3. Projection Rebuild Engine (Category B)
- **Capabilities**: Replay retained events from the Outbox (based on configurable retention window).
