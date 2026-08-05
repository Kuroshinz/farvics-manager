# CQRS Projection Runtime Infrastructure

## Lifecycle
The `ProjectionRuntime` manages the strict loop ensuring every `IDomainEvent` dispatched from the Outbox hits its mapped `ProjectionBuilder`s sequentially. 
`ProjectionRegistry` binds event types to Builders dynamically to prevent hardcoding switch blocks. 

## Flow
1. **Event Reception**: Outbox runtime dispatches the event securely.
2. **Resolution**: `ProjectionRegistry` resolves all active Read-Model projectors.
3. **Application**: `ProjectionExecutor` executes `applyEvent` wrapping the domain structures into updated Read-Model states.
4. **Persistence**: The updated structural DTO alongside the `ProjectionCheckpoint` is saved instantly to the PostgreSQL Read-Model tables via `ProjectionRepository`.

## Replay and Recovery
- `ProjectionRecovery` interacts with the specific checkpoints stored per-projection, efficiently picking up from partial crashes.
- `ProjectionRepairRuntime` scans for split-brain projection states by verifying check-sums against the core aggregate stream and isolates broken aggregates for singular reconstruction.

## Snapshots
`ProjectionSnapshotStore` evaluates `ISnapshotPolicy` during execution. If thresholds hit (e.g. 500 events folded), the entire folded payload is frozen, allowing `Rebuild` workflows to instantly load massive histories in `O(1)` query complexity before finishing the tail end of the stream.

## Failure Recovery & Scaling
Parallel projectors scale seamlessly because the locking guarantees handled by the `LeaseManager` in the primary Outbox engine prevent duplicate delivery. Projections simply perform Upserts enforcing idempotent tracking against `eventId`.
