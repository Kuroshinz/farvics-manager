import { IHealthCheck, IHealthCheckProvider, HealthCheckResult, HealthStatus } from '../../composition/Health';

export class HealthCheckProvider implements IHealthCheckProvider {
  private checks: IHealthCheck[] = [];

  register(check: IHealthCheck): void {
    this.checks.push(check);
  }

  async runAll(): Promise<Record<string, HealthCheckResult>> {
    const results: Record<string, HealthCheckResult> = {};
    for (const check of this.checks) {
      try {
        results[check.name] = await check.check();
      } catch (e: any) {
        results[check.name] = { status: HealthStatus.Unhealthy, description: e.message };
      }
    }
    return results;
  }
}
