import { ProcessingMode } from './OutboxContracts';

export interface RetryPolicyConfig {
  readonly maxAttempts: number;
  readonly baseBackoffMs: number;
  readonly maxBackoffMs: number;
  readonly useJitter: boolean;
}

export interface DispatcherConfiguration {
  readonly batchSize: number;
  readonly workerCount: number;
  readonly leaseTtlMs: number;
  readonly pollingIntervalMs: number;
  readonly metricsIntervalMs: number;
  readonly retryPolicy: RetryPolicyConfig;
  readonly replayMode: ProcessingMode;
  readonly featureFlags: Record<string, boolean>;
}
