import { ILeaseManager, ProcessingToken } from './OutboxContracts';
import { ILogger } from '../../core/Logger';

// Abstracting away the DB specific locking to an interface for the runtime
export interface ILeaseStore {
  acquire(messageIds: string[], workerId: string, expiresAt: Date): Promise<boolean>;
  renew(tokenValue: string, expiresAt: Date): Promise<boolean>;
  release(tokenValue: string): Promise<void>;
  clearExpired(now: Date): Promise<number>;
}

export class LeaseManager implements ILeaseManager {
  constructor(
    private readonly store: ILeaseStore,
    private readonly logger: ILogger
  ) {}

  async acquireLease(messageIds: string[], workerId: string, ttlMs: number): Promise<ProcessingToken> {
    const expiresAt = new Date(Date.now() + ttlMs);
    const success = await this.store.acquire(messageIds, workerId, expiresAt);
    if (!success) {
      throw new Error(`Failed to acquire lease for worker ${workerId}`);
    }
    const tokenValue = `lease_${workerId}_${Date.now()}`;
    return { value: tokenValue, expiresAt };
  }

  async renewLease(token: ProcessingToken, ttlMs: number): Promise<void> {
    const expiresAt = new Date(Date.now() + ttlMs);
    const success = await this.store.renew(token.value, expiresAt);
    if (!success) {
      throw new Error(`Failed to renew lease ${token.value}`);
    }
  }

  async releaseLease(token: ProcessingToken): Promise<void> {
    await this.store.release(token.value);
  }

  async recoverExpiredLeases(): Promise<number> {
    const count = await this.store.clearExpired(new Date());
    if (count > 0) {
      this.logger.info(`Recovered ${count} expired leases`);
    }
    return count;
  }
}
