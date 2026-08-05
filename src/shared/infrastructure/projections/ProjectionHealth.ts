import { IHealthCheck, HealthCheckResult, HealthStatus } from '../../composition/Health';

export class ProjectionRuntimeHealthCheck implements IHealthCheck {
  readonly name = 'Projection_Runtime';
  async check(): Promise<HealthCheckResult> { return { status: HealthStatus.Healthy }; }
}

export class ProjectionLagHealthCheck implements IHealthCheck {
  readonly name = 'Projection_Lag';
  async check(): Promise<HealthCheckResult> { return { status: HealthStatus.Healthy }; }
}

export class ProjectionSnapshotHealthCheck implements IHealthCheck {
  readonly name = 'Projection_Snapshots';
  async check(): Promise<HealthCheckResult> { return { status: HealthStatus.Healthy }; }
}
