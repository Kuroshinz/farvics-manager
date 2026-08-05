import { DispatcherConfiguration } from './DispatcherConfiguration';
import { WorkerCoordinator } from './WorkerCoordinator';
import { DispatcherLoop, IBatchProvider } from './DispatcherLoop';
import { WorkerStatistics, WorkerStatisticsTracker } from './WorkerStatistics';
import { ILogger } from '../../core/Logger';

export class DispatcherRuntime {
  private abortController = new AbortController();
  private isRunning = false;
  private metricsTimer?: NodeJS.Timeout;

  constructor(
    private readonly coordinator: WorkerCoordinator,
    private readonly loop: DispatcherLoop,
    private readonly statsTracker: WorkerStatisticsTracker,
    private readonly config: DispatcherConfiguration,
    private readonly logger: ILogger,
    private readonly workerId: string
  ) {}

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    this.logger.info(`Starting DispatcherRuntime [Worker: ${this.workerId}]`);

    this.metricsTimer = setInterval(() => {
      this.logger.info(`Worker Stats`, this.statsTracker.getSnapshot() as any);
    }, this.config.metricsIntervalMs);

    // Run coordinator background task
    setInterval(async () => {
      if (!this.abortController.signal.aborted) {
        await this.coordinator.recoverStaleLeases();
      }
    }, this.config.leaseTtlMs * 2);

    // Fire and forget main loop
    this.loop.run(this.abortController.signal).catch(err => {
      this.logger.fatal('DispatcherLoop crashed completely', err);
      this.stop();
    });
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    this.logger.info(`Stopping DispatcherRuntime [Worker: ${this.workerId}]`);
    this.isRunning = false;
    this.abortController.abort();
    if (this.metricsTimer) clearInterval(this.metricsTimer);
  }
}
