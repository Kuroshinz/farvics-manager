export interface OutboxRecord {
  id: string;
  aggregate_id: string;
  aggregate_type: string;
  event_type: string;
  payload: string;
  occurred_at: Date;
  processed_at?: Date;
  error?: string;
  retry_count?: number;
}

export class OutboxRepository {
  // In a real implementation this would inject a database connection or PrismaClient
  async saveMany(records: OutboxRecord[]): Promise<void> {
    // Save to DB
  }

  async getUnprocessed(batchSize: number = 50): Promise<OutboxRecord[]> {
    // SELECT * FROM outbox_events WHERE processed_at IS NULL ORDER BY occurred_at ASC LIMIT batchSize
    return [];
  }

  async markProcessed(id: string): Promise<void> {
    // UPDATE outbox_events SET processed_at = NOW() WHERE id = id
  }

  async markFailed(id: string, error: string): Promise<void> {
    // UPDATE outbox_events SET error = error, retry_count = retry_count + 1 WHERE id = id
  }
}
