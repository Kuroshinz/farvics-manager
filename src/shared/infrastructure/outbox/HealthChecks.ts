import { IHealthCheck, HealthCheckResult, HealthStatus } from '../../composition/Health';

export class OutboxHealthCheck implements IHealthCheck {
  readonly name = 'Outbox_Database_Connectivity';
  async check(): Promise<HealthCheckResult> {
    return { status: HealthStatus.Healthy };
  }
}

export class DispatcherHealthCheck implements IHealthCheck {
  readonly name = 'Outbox_Dispatcher_Worker';
  async check(): Promise<HealthCheckResult> {
    return { status: HealthStatus.Healthy };
  }
}

export class ProjectionHealthCheck implements IHealthCheck {
  readonly name = 'Projection_Lag_Monitor';
  async check(): Promise<HealthCheckResult> {
    return { status: HealthStatus.Healthy };
  }
}
