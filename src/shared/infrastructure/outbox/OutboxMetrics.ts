export interface IOutboxMetrics {
  recordQueueLength(length: number): void;
  recordOldestPendingEvent(ageMs: number): void;
  recordProcessingDelay(delayMs: number): void;
  incrementRetryCount(): void;
  incrementDLQCount(): void;
  recordProcessingTime(durationMs: number): void;
  recordEventsPerSecond(count: number): void;
}
