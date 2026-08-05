import { ILeaseManager } from './OutboxContracts';
import { DispatcherConfiguration } from './DispatcherConfiguration';
import { ILogger } from '../../core/Logger';

export class WorkerCoordinator {
  constructor(
    private readonly leaseManager: ILeaseManager,
    private readonly config: DispatcherConfiguration,
    private readonly logger: ILogger
  ) {}

  async recoverStaleLeases(): Promise<void> {
    try {
      await this.leaseManager.recoverExpiredLeases();
    } catch (error: unknown) {
      this.logger.error('Failed to recover stale leases', error as Error);
    }
  }
}
