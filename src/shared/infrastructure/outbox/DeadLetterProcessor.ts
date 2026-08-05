import { OutboxMessage, FailureCategory, ProcessingState } from './OutboxContracts';
import { ILogger } from '../../core/Logger';

export interface IDLQStore {
  moveToDLQ(messageId: string, reason: string, stack: string, attemptCount: number, timestamp: Date, workerId: string, correlationId: string): Promise<void>;
}

export class DeadLetterProcessor {
  constructor(
    private readonly store: IDLQStore,
    private readonly logger: ILogger
  ) {}

  async processFailure(message: OutboxMessage, error: unknown, workerId: string, correlationId: string): Promise<void> {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error && error.stack ? error.stack : '';
    const attempts = message.deliveryAttempts.length;

    await this.store.moveToDLQ(
      message.eventId,
      errorMsg,
      stack,
      attempts,
      new Date(),
      workerId,
      correlationId
    );

    this.logger.error(`Message ${message.eventId} moved to DLQ`, error as Error, {
      eventId: message.eventId,
      aggregateId: message.aggregateId,
      workerId,
      correlationId,
      attempts
    });
  }
}
