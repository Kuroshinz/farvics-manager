# CQRS Projections

## Projection Lifecycle
A projection subscribes to the event stream, reading domain events and folding them into a dedicated read-model state. The lifecycle moves through distinct `ProjectionState` statuses: `RUNNING`, `PAUSED`, `REBUILDING`, and `FAILED`. 

## Replay
Replaying involves re-feeding historical events into a projection logic to reconstruct its state. The `ProjectionRebuilder` facilitates this either completely from scratch or efficiently from the last known good offset.

## Repair
If inconsistencies are identified via `ProjectionRepairService.detectAnomalies()`, specific segments or identities within a projection can be surgically recalculated without dropping the entire dataset.

## Snapshot
The `ProjectionSnapshot` stores a materialized version of the projection state alongside its `ProjectionVersion` and `ProjectionCursor`. Snapshots drastically reduce the time needed to rebuild an aggregate projection by acting as an advanced baseline.

## Versioning
`ProjectionVersion` ensures optimistic concurrency control on the read-side, guaranteeing that events are applied exactly once and strictly in chronological order.

## Checkpoint
A `ProjectionCheckpoint` marks the exact offset (via `ProjectionCursor`) processed by the read-model. If the system crashes, projectors seamlessly resume from the last valid checkpoint.

## Recovery
`ProjectionConflictResolver` mitigates split-brain or stale-read issues. Recovery utilizes the `ProjectionRebuilder` and snapshots to automatically restore a projection into a `RUNNING` state after experiencing a `FAILED` state.
