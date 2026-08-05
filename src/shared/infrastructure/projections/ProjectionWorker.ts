import { IWorkerTask } from '../worker/WorkerEngine';
import { ProjectionScheduler, SchedulerMode } from './ProjectionScheduler';
import { ILogger } from '../../core/Logger';

export class ProjectionWorker implements IWorkerTask {
  readonly name = 'ProjectionWorker';

  constructor(
    private readonly scheduler: ProjectionScheduler,
    private readonly logger: ILogger
  ) {}

  async execute(signal: AbortSignal): Promise<void> {
    this.logger.info('Starting Projection Worker...');
    await this.scheduler.runScheduled(signal, SchedulerMode.REALTIME, async () => {
      // Pulls events from event stream/dispatcher and pushes to ProjectionRuntime
    });
  }
}
