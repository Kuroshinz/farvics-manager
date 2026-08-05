export interface FarvicsClientOptions {
  endpoint: string;
  token?: string;
  timeoutMs?: number;
  retries?: number;
}

export interface FarvicsResponse<T> {
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

