import { OutboxMessage, ProcessingMode, ProcessingState } from './OutboxContracts';
import { ProcessingPipeline } from './ProcessingPipeline';
import { ReplayPipeline } from './ReplayPipeline';
import { OrderingValidator } from './OrderingValidator';
import { RetryScheduler } from './RetryScheduler';
import { DeadLetterProcessor } from './DeadLetterProcessor';
import { WorkerStatisticsTracker } from './WorkerStatistics';
import { ILogger } from '../../core/Logger';

// Representing the row fetched from DB
export interface OutboxRow {
  message: OutboxMessage;
  payloadStr: string;
}

export interface IMessageStore {
  markProcessed(messageId: string): Promise<void>;
  updateRetry(messageId: string, nextAttempt: Date): Promise<void>;
}

export class BatchProcessor {
  constructor(
    private readonly pipeline: ProcessingPipeline,
    private readonly replayPipeline: ReplayPipeline,
    private readonly orderingValidator: OrderingValidator,
    private readonly retryScheduler: RetryScheduler,
    private readonly dlqProcessor: DeadLetterProcessor,
    private readonly messageStore: IMessageStore,
    private readonly logger: ILogger,
    private readonly workerId: string
  ) {}

  async processBatch(rows: OutboxRow[], mode: ProcessingMode, stats: WorkerStatisticsTracker): Promise<void> {
    for (const row of rows) {
      const { message, payloadStr } = row;
      const startTime = Date.now();

      try {
        const isInSequence = await this.orderingValidator.verifySequence(message.aggregateId, message.aggregateVersion);
        if (!isInSequence) {
          this.logger.warn(`Out of order message detected: ${message.eventId}`, { aggregateId: message.aggregateId });
          // Typically we skip and let a retry policy handle it once the prerequisite event is processed
          continue; 
        }

        if (mode === ProcessingMode.LIVE) {
          await this.pipeline.process(message, payloadStr);
        } else {
          await this.replayPipeline.process(message, payloadStr, mode);
        }

        await this.messageStore.markProcessed(message.eventId);
        stats.recordSuccess(Date.now() - startTime);

      } catch (error: unknown) {
        stats.recordFailure();
        if (this.retryScheduler.isPermanentFailure(error)) {
          await this.dlqProcessor.processFailure(message, error, this.workerId, message.idempotencyKey);
          stats.recordDlq();
        } else {
          const nextAttempt = this.retryScheduler.calculateNextAttempt(message.deliveryAttempts.length + 1);
          if (nextAttempt) {
            await this.messageStore.updateRetry(message.eventId, nextAttempt);
          } else {
            await this.dlqProcessor.processFailure(message, error, this.workerId, message.idempotencyKey);
            stats.recordDlq();
          }
        }
      }
    }
  }
}
