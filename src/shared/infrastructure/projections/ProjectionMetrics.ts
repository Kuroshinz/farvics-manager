export interface IProjectionMetrics {
  recordLatency(ms: number): void;
  recordThroughput(eventsPerSec: number): void;
  recordReplayDuration(ms: number): void;
  recordRebuildDuration(ms: number): void;
  recordLag(events: number): void;
  recordSnapshotSize(bytes: number): void;
  incrementFailureCount(): void;
  incrementRecoveryCount(): void;
}

export class ProjectionMetricsTracker implements IProjectionMetrics {
  recordLatency(ms: number): void {}
  recordThroughput(eventsPerSec: number): void {}
  recordReplayDuration(ms: number): void {}
  recordRebuildDuration(ms: number): void {}
  recordLag(events: number): void {}
  recordSnapshotSize(bytes: number): void {}
  incrementFailureCount(): void {}
  incrementRecoveryCount(): void {}
}
