import { IServiceProvider } from '../../composition/DI';
import { ILogger } from '../../core/Logger';
import { IModuleDiscoverer, IModule } from '../../composition/Registry';
import { IHealthCheckProvider } from '../../composition/Health';

export interface IStartupValidator {
  validate(): Promise<void>;
}

export class Bootstrapper {
  constructor(
    private readonly provider: IServiceProvider,
    private readonly discoverer: IModuleDiscoverer,
    private readonly healthCheckProvider: IHealthCheckProvider,
    private readonly logger: ILogger,
    private readonly validator: IStartupValidator
  ) {}

  async initialize(): Promise<void> {
    this.logger.info('Starting bootstrapper sequence...');
    
    // 1. Validation
    await this.validator.validate();
    this.logger.info('Startup validation passed.');

    // 2. Discover Modules
    const modules: IModule[] = await this.discoverer.discover();
    
    // 3. Register Modules
    for (const mod of modules) {
      this.logger.info(`Loaded module: ${mod.name}`);
    }

    // 4. Health Checks
    const health = await this.healthCheckProvider.runAll();
    const hasUnhealthy = Object.values(health).some(h => h.status === 'Unhealthy');
    if (hasUnhealthy) {
      this.logger.fatal('Health checks failed during startup', new Error('Startup Health Check Failed'), { health });
      throw new Error('Bootstrapping failed due to unhealthy components');
    }

    this.logger.info('Application Ready.');
  }
}
