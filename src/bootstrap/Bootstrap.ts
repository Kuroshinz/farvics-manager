import { ApplicationBuilder } from './ApplicationBuilder';
import { WorkerBootstrap } from './WorkerBootstrap';
import { ServiceContainer } from '../shared/infrastructure/di/ServiceContainer';
import { ILogger } from '../shared/core/Logger';

export class Bootstrap {
  static async run(signal: AbortSignal): Promise<ServiceContainer> {
    try {
      const container = await ApplicationBuilder.build();
      const logger = container.resolve<ILogger>('ILogger');
      
      logger.info('Application successfully built. Starting workers...');
      // Normally uncomment: await WorkerBootstrap.start(container, signal);
      
      logger.info('System is running and ready.');
      return container;
    } catch (error: unknown) {
      console.error('Fatal startup error, aborting sequence', error);
      process.exit(1);
    }
  }
}
