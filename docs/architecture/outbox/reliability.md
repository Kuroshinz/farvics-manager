# Enterprise Outbox Reliability Architecture

## Exactly Once Semantics
Every emitted event is wrapped in an `OutboxMessage` capturing an `IdempotencyKey`. The Outbox runtime strictly verifies keys before execution, ensuring the exact execution guarantees. Once processed, it transitions permanently to `PROCESSED`.

## Strict Ordering
The `IOrderingGuarantee` enforces sequence checks per `aggregateId`. A worker cannot pick up `Version N` unless `Version N-1` is officially marked `PROCESSED`. This blocks all out-of-order race conditions natively.

## Dead Letter Queue (DLQ) & Poison Messages
The `IDeadLetterQueuePolicy` filters `FailureCategory.POISON_MESSAGE` (e.g. malformed JSON) immediately routing them to `DLQ` without retries, freeing up the queue. Transient failures rely on an exponential backoff until the `Maximum Attempts` limit pushes them to the DLQ.

## Worker Leases
To support multiple horizontal dispatcher instances, the `ILeaseManager` utilizes distributed locking. Messages switch to `LEASED` with a bounded `ProcessingToken`. If a worker dies, `recoverExpiredLeases()` strips the lock and restores the message to `PENDING`.

## Replay Safety
Via the `IReplaySafetyPolicy`, the system is context-aware via `ProcessingMode` (`LIVE`, `REPLAY`, `RECOVERY`). During `REPLAY`, integration event publishing is strictly blocked, limiting side effects entirely to Projection building.

## Metrics & Telemetry
Deep observability covers Queue Lengths, Processing Delays, Events/Sec, and DLQ growth rates alerting engineers immediately when processing slips behind thresholds.
