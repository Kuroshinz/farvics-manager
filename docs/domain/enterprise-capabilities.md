# Enterprise Domain Capabilities

## Strategy Pattern
Encapsulates families of algorithms (e.g., `DepreciationStrategy`, `InterestCalculationStrategy`, `PostingStrategy`). This allows business calculations to vary independently from the clients that use them without bleeding logic into application services.

## Policy Pattern
`BusinessPolicy` defines complex validation or business logic spanning multiple aggregates. Policies can check if they are applicable to a context and enforce invariants.

## Rule Pattern
`BusinessRule` represents atomic, testable invariants. Instead of throwing raw exceptions immediately, Rules allow the domain to return collections of broken constraints via `DomainValidator`.

## History Pattern
Supports event sourcing and deep auditing. Contracts like `AggregateHistory`, `ChangeSet`, and `AuditTrail` ensure full reconstruction of state transitions and accountability for sensitive financial operations.

## Conflict Resolution
When offline clients synchronize or concurrent processes clash, the `ConflictResolver` applies a specific `MergePolicy` to determine if a structural merge can occur automatically or if intervention is required.
