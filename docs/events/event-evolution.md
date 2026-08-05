# Enterprise Event Evolution

## Versioning & Compatibility
Event versioning ensures that Domain Events can independently evolve over time. `EventUpcaster` transforms deprecated event formats on-the-fly when reading from the Event Store, enabling forwards-compatibility without requiring massive structural database updates.

## Migration
`EventMigration` manages chained structural transformations. Rather than destructive database migrations, immutable events maintain historical integrity while the `MigrationRegistry` provides a pipeline of `MigrationStep` definitions to modernize payloads dynamically for projectors or read models.

## Replay
A `ReplaySession` coordinates reading historical event logs from a specified `ReplayCursor` (timestamp or index sequence). Used exclusively to rebuild read-model projections from scratch or specific `ReplayCheckpoint` limits without modifying domain intent. 

## Integrity
Critical systems enforce non-repudiation. `EventIntegrityChecker`, `HashProvider`, and `SignatureProvider` detect tampering inside the historical event store, assuring zero unauthorized mutation has occurred on immutable past actions.

## Snapshots
`SnapshotPolicy` reduces massive load times by generating point-in-time materialized views of Aggregates. The event stream only replays events that occur *after* the `SnapshotVersion` via the `SnapshotResolver`.

## Future Evolution
These strict abstraction policies guarantee that the domain dictates exactly how its historical changes unfold, completely insulated from SQL JSON querying syntax, Prisma dependencies, or streaming protocol formats.
