export enum SchedulerMode {
  REALTIME = 'REALTIME',
  REPLAY = 'REPLAY',
  RECOVERY = 'RECOVERY',
  BACKGROUND_REBUILD = 'BACKGROUND_REBUILD',
  SCHEDULED = 'SCHEDULED'
}

export class ProjectionScheduler {
  async runScheduled(signal: AbortSignal, mode: SchedulerMode, task: () => Promise<void>): Promise<void> {
    while (!signal.aborted) {
      try {
        await task();
        // A real scheduler would implement cron intervals or backoff depending on mode
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (err) {
        if (signal.aborted) break;
        // Pause before retry
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
  }
}
