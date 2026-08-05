import { IServiceCollection, Token } from '../../composition/DI';
import { IPipelineBehavior } from '../../../shared/application/Pipeline';

export class ServiceRegistrationExtensions {
  static registerPipelineBehavior<TReq, TRes>(
    services: IServiceCollection, 
    behaviorFactory: (provider: any) => IPipelineBehavior<TReq, TRes>
  ): void {
    // In our simplified DI container, resolveMany fetches multiple items if supported.
    // We register under a common token 'IPipelineBehavior'
    services.registerTransient('IPipelineBehavior', behaviorFactory);
  }
}
