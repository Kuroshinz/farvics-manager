export enum HealthStatus {
  Healthy = 'Healthy',
  Degraded = 'Degraded',
  Unhealthy = 'Unhealthy'
}

export interface HealthCheckResult {
  status: HealthStatus;
  description?: string;
}

export interface IHealthCheck {
  readonly name: string;
  check(): Promise<HealthCheckResult>;
}

export interface IHealthCheckProvider {
  register(check: IHealthCheck): void;
  runAll(): Promise<Record<string, HealthCheckResult>>;
}
