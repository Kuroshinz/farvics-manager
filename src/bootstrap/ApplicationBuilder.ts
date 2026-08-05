import { ServiceContainer } from '../shared/infrastructure/di/ServiceContainer';
import { IConfiguration } from '../shared/core/Config';
import { ILogger } from '../shared/core/Logger';
import { ConfigurationBootstrap } from './ConfigurationBootstrap';
import { ModuleLoader } from './ModuleLoader';
import { HealthBootstrap } from './HealthBootstrap';
import { RuntimeBootstrap } from './RuntimeBootstrap';
import { WorkerBootstrap } from './WorkerBootstrap';

export class ApplicationBuilder {
  static async build(): Promise<ServiceContainer> {
    const container = new ServiceContainer();
    
    // 1. Core Config & Logger fallback logic
    // For bootstrap, we manually resolve core utilities before the container is fully baked
    const configModule = new (require('../shared/infrastructure/config/EnvConfiguration').EnvConfiguration)();
    const loggerModule = new (require('../shared/infrastructure/logger/ConsoleLogger').ConsoleLogger)();
    
    container.registerSingleton('IConfiguration', () => configModule);
    container.registerSingleton('ILogger', () => loggerModule);

    ConfigurationBootstrap.validate(configModule, loggerModule);

    // 2. DI Container & Module Discovery
    const loader = new ModuleLoader();
    const modules = await loader.discover();
    for (const mod of modules) {
      mod.registerModule(container);
      loggerModule.info(`Registered module: ${mod.name}`);
    }

    // Pipeline registration is handled via PlatformModuleRegistration usually
    
    // 3. Runtime Initialization
    await RuntimeBootstrap.initialize(container);

    // 4. Health Checks
    await HealthBootstrap.validate(container);

    return container;
  }
}
