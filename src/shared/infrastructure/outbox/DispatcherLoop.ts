import { BatchProcessor, OutboxRow } from './BatchProcessor';
import { ILeaseManager, ProcessingToken } from './OutboxContracts';
import { DispatcherConfiguration } from './DispatcherConfiguration';
import { WorkerStatisticsTracker } from './WorkerStatistics';
import { ILogger } from '../../core/Logger';
import { IOutboxMetrics } from './OutboxMetrics';

export interface IBatchProvider {
  fetchNextBatch(limit: number): Promise<OutboxRow[]>;
}

export class DispatcherLoop {
  constructor(
    private readonly batchProvider: IBatchProvider,
    private readonly batchProcessor: BatchProcessor,
    private readonly leaseManager: ILeaseManager,
    private readonly config: DispatcherConfiguration,
    private readonly statsTracker: WorkerStatisticsTracker,
    private readonly metrics: IOutboxMetrics,
    private readonly logger: ILogger,
    private readonly workerId: string
  ) {}

  async run(signal: AbortSignal): Promise<void> {
    this.logger.info(`Starting Dispatcher Loop for worker ${this.workerId}`);
    
    while (!signal.aborted) {
      const cycleStart = Date.now();
      try {
        const rows = await this.batchProvider.fetchNextBatch(this.config.batchSize);
        if (rows.length > 0) {
          this.metrics.recordQueueLength(rows.length);
          
          const messageIds = rows.map(r => r.message.eventId);
          const token = await this.leaseManager.acquireLease(messageIds, this.workerId, this.config.leaseTtlMs);
          
          await this.batchProcessor.processBatch(rows, this.config.replayMode, this.statsTracker);
          
          await this.leaseManager.releaseLease(token);
          this.metrics.recordEventsPerSecond(rows.length / ((Date.now() - cycleStart) / 1000));
        } else {
          await this.sleep(this.config.pollingIntervalMs, signal);
        }
      } catch (error: unknown) {
        this.logger.error(`Dispatcher loop error`, error as Error);
        await this.sleep(this.config.pollingIntervalMs, signal);
      }
    }
    
    this.logger.info(`Dispatcher Loop for worker ${this.workerId} stopped`);
  }

  private sleep(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise(resolve => {
      if (signal.aborted) return resolve();
      const id = setTimeout(resolve, ms);
      signal.addEventListener('abort', () => {
        clearTimeout(id);
        resolve();
      });
    });
  }
}
