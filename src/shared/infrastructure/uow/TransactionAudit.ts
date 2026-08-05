export interface TransactionOperation {
  readonly table: string;
  readonly action: string;
}

export interface TransactionResult {
  readonly success: boolean;
  readonly error?: string;
}

export interface TransactionAudit {
  readonly transactionId: string;
  readonly actor: string;
  readonly correlationId: string;
  readonly causationId: string;
  readonly durationMs: number;
  readonly retryCount: number;
  readonly affectedAggregates: string[];
  readonly operationCount: number;
  readonly result: TransactionResult;
}

export interface IAuditRepository {
  save(audit: TransactionAudit): Promise<void>;
}
