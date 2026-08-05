import { ModuleRegistration } from '../shared/infrastructure/di/ModuleRegistration';
import { IServiceCollection } from '../shared/composition/DI';
import { DefaultServiceRegistry } from '../shared/infrastructure/di/DefaultServiceRegistry';

export class PlatformModuleRegistration extends ModuleRegistration {
  readonly name = 'PlatformModule';

  registerModule(services: IServiceCollection): void {
    DefaultServiceRegistry.register(services);
    
    // Register UoW, Mediator, Outbox
    // services.registerSingleton('IMediator', (provider) => new Mediator(provider));
    // services.registerScoped('IUnitOfWork', (provider) => new SupabaseUnitOfWork(...));
  }
}
