export interface WorkerStatistics {
  readonly workerId: string;
  readonly startedAt: Date;
  processedCount: number;
  failedCount: number;
  dlqCount: number;
  leaseRenewals: number;
  totalProcessingDelayMs: number;
}

export class WorkerStatisticsTracker {
  constructor(private readonly stats: WorkerStatistics) {}

  recordSuccess(durationMs: number): void {
    this.stats.processedCount++;
    this.stats.totalProcessingDelayMs += durationMs;
  }

  recordFailure(): void {
    this.stats.failedCount++;
  }

  recordDlq(): void {
    this.stats.dlqCount++;
  }

  recordLeaseRenewal(): void {
    this.stats.leaseRenewals++;
  }

  getSnapshot(): WorkerStatistics {
    return { ...this.stats };
  }
}
