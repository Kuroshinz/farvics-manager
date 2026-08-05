# Outbox Dispatcher Runtime

## Execution Lifecycle
1. The `DispatcherRuntime` initializes the `DispatcherLoop` and periodic `WorkerCoordinator` lease-recovery jobs.
2. The `DispatcherLoop` requests a batch of `OutboxRow`s.
3. The `LeaseManager` acquires a distributed lock over the fetched batch IDs to prevent multi-worker collisions.
4. The `BatchProcessor` loops through the rows sequentially.
5. The `OrderingValidator` asserts strict `aggregateVersion` sequences.
6. The `ProcessingPipeline` or `ReplayPipeline` executes local projections and external integrations (blocked during replay).
7. Successes update the DB status to `PROCESSED`.
8. Failures are handled via the `RetryScheduler` (exponential backoff) or routed directly to `DeadLetterProcessor` if identified as poison messages.
9. Finally, the lease is released and the loop sleeps if empty, or repeats immediately.

## Replay Flow
When `ProcessingMode` is set to `REPLAY`, the system injects the `ReplayPipeline`. This bypasses external integration side-effects (e.g., stopping emails or bank webhooks from firing twice), but guarantees projections are updated sequentially up to the current stream head.

## Lease Coordination
Multiple horizontal dispatchers can be booted safely. The `ILeaseStore` maintains `expiresAt` timestamps mapping to `workerId`. If a worker dies mid-batch, the `WorkerCoordinator` identifies expired bounds via `recoverExpiredLeases()` and releases the locks back into the pool.
