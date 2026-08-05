import { IUnitOfWork } from '../../core/UnitOfWork';
import { IMetrics } from '../../core/Metrics';
import { IRetryPolicy } from '../../core/Retry';
import { ITransactionalResource } from './ITransactionalResource';
import { PostgreSQLResource } from './PostgreSQLResource';
import { SerializableOperation } from './ITransactionExecutor';

export class SupabaseUnitOfWork implements IUnitOfWork {
  private resources: ITransactionalResource[] = [];
  private pgResource: PostgreSQLResource;
  private isActive = false;

  constructor(
    pgResource: PostgreSQLResource,
    private readonly metrics: IMetrics,
    private readonly retryPolicy: IRetryPolicy
  ) {
    this.pgResource = pgResource;
    this.resources.push(pgResource);
    // Future resources (Redis, Queue) would be pushed here
  }

  async begin(): Promise<void> {
    if (this.isActive) throw new Error('Transaction already active');
    this.isActive = true;
    for (const resource of this.resources) {
      await resource.begin();
    }
  }

  registerOperation(op: SerializableOperation): void {
    if (!this.isActive) throw new Error('No active transaction');
    this.pgResource.registerOperation(op);
  }

  async commit(idempotencyKey?: string): Promise<void> {
    if (!this.isActive) throw new Error('No active transaction');
    
    const timer = this.metrics.getTimer('db_transaction_duration');
    timer.start();

    try {
      await this.retryPolicy.execute(async () => {
        // Two-phase commit design approximation
        // Currently strictly commits PostgreSQL. 
        for (const resource of this.resources) {
           if (resource instanceof PostgreSQLResource) {
             await resource.commit(idempotencyKey);
           } else {
             await resource.commit();
           }
        }
      });
      
      this.metrics.getCounter('db_transaction_commits').increment();
      this.isActive = false;
    } catch (error: any) {
      this.metrics.getCounter('db_transaction_rollbacks').increment(1, { reason: error.code || 'unknown' });
      await this.rollback();
      throw error;
    } finally {
      timer.stop();
    }
  }

  async rollback(): Promise<void> {
    if (!this.isActive) return;
    this.isActive = false;
    for (const resource of this.resources) {
      await resource.rollback();
    }
  }
}
