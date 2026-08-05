import { HealthCheckProvider } from '../health/HealthCheckProvider';
import { HealthStatus, HealthCheckResult } from '../../composition/Health';

describe('HealthCheckProvider', () => {
  it('runs all checks', async () => {
    const provider = new HealthCheckProvider();
    provider.register({
      name: 'Test',
      check: async () => ({ status: HealthStatus.Healthy })
    });
    const result = await provider.runAll();
    expect(result['Test'].status).toBe(HealthStatus.Healthy);
  });
});
