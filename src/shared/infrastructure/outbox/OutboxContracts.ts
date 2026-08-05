export enum ProcessingState {
  PENDING = 'PENDING',
  LEASED = 'LEASED',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
  DLQ = 'DLQ'
}

export enum FailureCategory {
  TRANSIENT = 'TRANSIENT',
  POISON_MESSAGE = 'POISON_MESSAGE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  UNKNOWN = 'UNKNOWN'
}

export enum ProcessingMode {
  LIVE = 'LIVE',
  REPLAY = 'REPLAY',
  RECOVERY = 'RECOVERY'
}

export interface ProcessingToken {
  readonly value: string;
  readonly expiresAt: Date;
}

export interface DeliveryAttempt {
  readonly attemptedAt: Date;
  readonly error?: string;
  readonly category?: FailureCategory;
}

export interface Lease {
  readonly token: ProcessingToken;
  readonly workerId: string;
  readonly isActive: boolean;
}

export interface OutboxMessage {
  readonly eventId: string;
  readonly aggregateId: string;
  readonly aggregateVersion: number;
  readonly idempotencyKey: string;
  readonly state: ProcessingState;
  readonly lease?: Lease;
  readonly deliveryAttempts: DeliveryAttempt[];
}

export interface ILeaseManager {
  acquireLease(messageIds: string[], workerId: string, ttlMs: number): Promise<ProcessingToken>;
  renewLease(token: ProcessingToken, ttlMs: number): Promise<void>;
  releaseLease(token: ProcessingToken): Promise<void>;
  recoverExpiredLeases(): Promise<number>;
}

export interface IDeadLetterQueuePolicy {
  isPoisonMessage(error: any): boolean;
  shouldMoveToDLQ(attemptCount: number, error: any): boolean;
  categorizeFailure(error: any): FailureCategory;
}

export interface IOrderingGuarantee {
  verifySequence(aggregateId: string, version: number): Promise<boolean>;
}

export interface IReplaySafetyPolicy {
  canPublishIntegrationEvent(mode: ProcessingMode): boolean;
  canUpdateProjection(mode: ProcessingMode): boolean;
}
