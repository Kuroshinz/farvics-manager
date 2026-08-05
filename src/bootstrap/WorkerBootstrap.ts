import { IServiceProvider } from '../shared/composition/DI';
import { ILogger } from '../shared/core/Logger';
import { WorkerEngine } from '../shared/infrastructure/worker/WorkerEngine';
import { DispatcherRuntime } from '../shared/infrastructure/outbox/DispatcherRuntime';

export class WorkerBootstrap {
  static async start(provider: IServiceProvider, signal: AbortSignal): Promise<void> {
    const logger = provider.resolve<ILogger>('ILogger');
    logger.info('Starting background workers...');

    try {
      const dispatcher = provider.resolve<DispatcherRuntime>('DispatcherRuntime');
      await dispatcher.start();

      const workerEngine = provider.resolve<WorkerEngine>('WorkerEngine');
      await workerEngine.start();
      
      signal.addEventListener('abort', () => {
        logger.info('Graceful shutdown initiated for workers...');
        dispatcher.stop().catch(err => logger.error('Error stopping dispatcher', err as Error));
        workerEngine.stop().catch(err => logger.error('Error stopping worker engine', err as Error));
      });
      
      logger.info('Workers started successfully.');
    } catch (error) {
      logger.fatal('Failed to start background workers.', error as Error);
      throw error;
    }
  }
}
