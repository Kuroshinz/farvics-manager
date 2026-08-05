import { IServiceProvider } from '../shared/composition/DI';
import { ILogger } from '../shared/core/Logger';

export class RuntimeBootstrap {
  static async initialize(provider: IServiceProvider): Promise<void> {
    const logger = provider.resolve<ILogger>('ILogger');
    logger.info('Initializing runtime pipelines...');
    
    // Explicitly resolving singletons to ensure pre-warming
    provider.resolve('IMediator');
    
    // Resolve all pipeline behaviors to guarantee instantiation order matches expectations
    provider.resolveMany('IPipelineBehavior');
    
    logger.info('Runtime initialized.');
  }
}
