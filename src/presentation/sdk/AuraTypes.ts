export interface AuraClientOptions {
  endpoint: string;
  token?: string;
  timeoutMs?: number;
  retries?: number;
}

export interface AuraResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details: unknown;
  };
  meta: {
    latencyMs: number;
    correlationId: string;
  };
}
