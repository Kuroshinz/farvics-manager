# Financial Domain Aggregates

## Aggregate Boundaries
The core transactional bounds of the financial domain are represented by Aggregates:
- **AccountAggregate**: Tracks root account limits, state, and identity.
- **JournalAggregate**: Maintains the integrity of double-entry boundaries (Draft, Posted, Reversed).
- **BudgetAggregate**: Maintains limits and tracks real-time usage via event projections.
- **CategoryAggregate**: Maintains hierarchical structural relationships securely.
- **GoalAggregate**: Tracks saving limits and milestone achievements securely.

## Repository Responsibilities
Repositories exist **only** as abstract boundaries mapping generic definitions (like `IAccountRepository`).
- They expose purely business methods (`findBySpecification`).
- No internal infrastructure concepts (like Prisma or SQL pagination) are permitted in these contracts.

## Factory Usage
Because restoring Aggregates from an event stream or persistent state is complex, `AccountFactory`, `JournalFactory`, etc., hide the initialization complexity.

## Specification Pattern
The Domain dictates filtering constraints explicitly through `AccountSpecification`, `JournalSpecification`, etc. These allow filtering rules to be tested entirely in-memory using arrays before passing them down to be mapped by Infrastructure repositories.

## Snapshot Strategy
Snapshots are explicit, immutable representations (`JournalSnapshot`, `BudgetSnapshot`).
They optimize reads (allowing restoring from an event stream instantly), provide audit history trails, and isolate conflicting resolutions.
