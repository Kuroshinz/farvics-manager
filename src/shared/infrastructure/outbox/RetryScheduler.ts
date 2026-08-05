import { RetryPolicyConfig } from './DispatcherConfiguration';

export class RetryScheduler {
  constructor(private readonly config: RetryPolicyConfig) {}

  calculateNextAttempt(attemptCount: number): Date | null {
    if (attemptCount >= this.config.maxAttempts) {
      return null;
    }

    const backoff = Math.min(
      this.config.baseBackoffMs * Math.pow(2, attemptCount),
      this.config.maxBackoffMs
    );

    const jitter = this.config.useJitter ? Math.random() * backoff * 0.1 : 0;
    const finalDelayMs = backoff + jitter;

    return new Date(Date.now() + finalDelayMs);
  }

  isPermanentFailure(error: unknown): boolean {
    // Example: Poison message, missing schema, unrecoverable payload
    if (error instanceof Error && error.name === 'PoisonMessageError') {
      return true;
    }
    return false;
  }
}
