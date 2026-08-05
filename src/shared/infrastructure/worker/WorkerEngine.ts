import { ILogger } from '../../core/Logger';

export interface IWorkerTask {
  name: string;
  execute(signal: AbortSignal): Promise<void>;
}

export class WorkerEngine {
  private abortController = new AbortController();
  private isRunning = false;

  constructor(
    private readonly tasks: IWorkerTask[],
    private readonly logger: ILogger,
    private readonly pollIntervalMs: number = 5000
  ) {}

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    this.logger.info('Starting Worker Engine');
    
    // Fire and forget loops for each task
    for (const task of this.tasks) {
      this.runLoop(task);
    }
  }

  async stop(): Promise<void> {
    this.logger.info('Stopping Worker Engine');
    this.isRunning = false;
    this.abortController.abort();
  }

  private async runLoop(task: IWorkerTask): Promise<void> {
    let consecutiveFailures = 0;
    
    while (this.isRunning && !this.abortController.signal.aborted) {
      try {
        await task.execute(this.abortController.signal);
        consecutiveFailures = 0; // reset on success
        await this.sleep(this.pollIntervalMs);
      } catch (error: any) {
        if (this.abortController.signal.aborted) break;
        
        consecutiveFailures++;
        this.logger.error(`Worker Task ${task.name} failed`, error);
        
        // Exponential backoff up to 60 seconds
        const backoff = Math.min(1000 * Math.pow(2, consecutiveFailures), 60000);
        await this.sleep(backoff);
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
      const timeout = setTimeout(resolve, ms);
      this.abortController.signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }
}
