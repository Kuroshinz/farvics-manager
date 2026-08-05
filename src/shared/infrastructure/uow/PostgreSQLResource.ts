import { ITransactionalResource } from './ITransactionalResource';
import { ITransactionExecutor, SerializableOperation } from './ITransactionExecutor';

export class PostgreSQLResource implements ITransactionalResource {
  readonly name = 'PostgreSQL';
  private operations: SerializableOperation[] = [];
  private isActive = false;

  constructor(private readonly executor: ITransactionExecutor) {}

  registerOperation(op: SerializableOperation): void {
    if (!this.isActive) throw new Error('Resource transaction is not active');
    this.operations.push(op);
  }

  getOperationsCount(): number {
    return this.operations.length;
  }

  async begin(): Promise<void> {
    if (this.isActive) throw new Error('Resource already active');
    this.isActive = true;
    this.operations = [];
  }

  async commit(idempotencyKey?: string): Promise<void> {
    if (!this.isActive) throw new Error('Resource not active');
    try {
      await this.executor.executeTransaction(this.operations, idempotencyKey);
      this.isActive = false;
      this.operations = [];
    } catch (error) {
      this.isActive = false;
      this.operations = [];
      throw error;
    }
  }

  async rollback(): Promise<void> {
    this.isActive = false;
    this.operations = [];
  }
}
