export interface IRetryPolicy {
  readonly maxAttempts: number;
  readonly exponentialBackoff: boolean;
  execute<T>(operation: () => Promise<T>): Promise<T>;
  isRetryableError(error: Error): boolean;
}
