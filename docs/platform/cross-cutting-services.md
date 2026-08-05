# Cross-Cutting Platform Services

## Responsibilities
Provides reusable, infrastructure-agnostic contracts for configuration, contexts (request, audit, correlation), errors, validation, retry, metrics, caching, and serialization.

## Dependency Rules
- Fully abstract layer.
- Dependencies always point inward.
- Domain modules depend on these services, never the other way around.
- No direct framework references (no Next.js, no Prisma, etc.).

## Usage Examples
- Inject IConfiguration to retrieve app config safely.
- Use ICorrelationProvider to wrap async operations.
- Return Result<T> instead of throwing for expected errors.

## Extension Strategy
- Infrastructure layers implement these interfaces (e.g. RedisCache implements ICache).
- Event Bus adapters will consume IDomainEvent directly.

## Future Integrations
- Outbox pattern for publishing IDomainEvent.
- Prometheus/Datadog for IMetrics.
- Winston/Pino for logging implementations.
