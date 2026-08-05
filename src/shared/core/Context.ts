export interface RequestContext {
  readonly requestId: string;
  readonly correlationId: string;
  readonly actorId: string;
  readonly tenantId?: string;
  readonly locale: string;
  readonly timezone: string;
}

export interface AuditContext {
  readonly actor: string;
  readonly timestamp: Date;
  readonly source: string;
  readonly ip?: string;
  readonly userAgent?: string;
}

export interface ICorrelationProvider {
  createCorrelationId(): string;
  continueCorrelation(existingId: string): void;
  getCorrelationId(): string;
  trace<T>(operationName: string, fn: () => Promise<T>): Promise<T>;
}
