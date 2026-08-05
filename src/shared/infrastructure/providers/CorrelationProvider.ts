import { ICorrelationProvider } from '../../core/Context';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';

export class CorrelationProvider implements ICorrelationProvider {
  private storage = new AsyncLocalStorage<string>();

  createCorrelationId(): string {
    return randomUUID();
  }

  continueCorrelation(existingId: string): void {
    // Usually combined with middleware, we use trace for scoping
  }

  getCorrelationId(): string {
    return this.storage.getStore() || 'no-correlation-id';
  }

  async trace<T>(operationName: string, fn: () => Promise<T>): Promise<T> {
    const id = this.createCorrelationId();
    return this.storage.run(id, fn);
  }
}
