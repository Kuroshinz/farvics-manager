# AURA.MONEY - Architecture Decision Records (ADR)

## ADR 001: Modular Monolith vs Microservices
**Decision**: Modular Monolith.
**Reasoning**: Microservices introduce distributed transaction complexity. We enforce boundaries internally so we can extract later if needed.

## ADR 002: Transactional Outbox for Events
**Decision**: Use Transactional Outbox.
**Reasoning**: Prevents dual-write failures. DB transaction guarantees event is persisted.
