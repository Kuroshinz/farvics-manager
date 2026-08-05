import { IHealthCheckProvider, HealthStatus } from '../shared/composition/Health';
import { ILogger } from '../shared/core/Logger';
import { IServiceProvider } from '../shared/composition/DI';

export class HealthBootstrap {
  static async validate(provider: IServiceProvider): Promise<void> {
    const logger = provider.resolve<ILogger>('ILogger');
    const healthProvider = provider.resolve<IHealthCheckProvider>('IHealthCheckProvider');
    
    logger.info('Running startup health checks...');
    const results = await healthProvider.runAll();
    
    let hasCriticalFailure = false;
    for (const [checkName, result] of Object.entries(results)) {
      if (result.status === HealthStatus.Unhealthy) {
        logger.fatal(`Health check failed: ${checkName}`, new Error(result.description));
        hasCriticalFailure = true;
      }
    }

    if (hasCriticalFailure) {
      throw new Error('Startup aborted due to critical health check failures.');
    }
    logger.info('All health checks passed.');
  }
}
