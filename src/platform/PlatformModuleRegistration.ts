
import { ModuleRegistration } from '../shared/infrastructure/di/ModuleRegistration';
import { IServiceCollection } from '../shared/composition/DI';
import { DefaultServiceRegistry } from '../shared/infrastructure/di/DefaultServiceRegistry';
import { Mediator } from '../shared/infrastructure/mediator/Mediator';
import { SupabaseUnitOfWork } from '../shared/infrastructure/uow/SupabaseUnitOfWork';
import { SupabaseRpcTransactionExecutor } from '../shared/infrastructure/uow/SupabaseRpcTransactionExecutor';
import { ActionExecutor } from '../shared/infrastructure/api/ActionExecutor';
import { ProductionTelemetry } from '../shared/infrastructure/api/ProductionTelemetry';
import { AuthorizationGuard } from '../shared/infrastructure/api/AuthorizationGuard';
import { ActionRateLimiter, IdempotencyGuard } from '../shared/infrastructure/api/ApiCore';
import { ValidationExecutor } from '../shared/infrastructure/api/ApiMappers';

import { PostgreSQLResource } from '../shared/infrastructure/uow/PostgreSQLResource';

export class PlatformModuleRegistration extends ModuleRegistration {
  readonly name = 'PlatformModule';

  registerModule(services: IServiceCollection): void {
    DefaultServiceRegistry.register(services);
    
    services.registerSingleton('IMediator', (provider) => new Mediator(provider));
    services.registerScoped('IUnitOfWork', (provider) => new SupabaseUnitOfWork(new PostgreSQLResource(new SupabaseRpcTransactionExecutor()), {} as any, {} as any));
    
    services.registerSingleton('IActionTelemetry', () => new ProductionTelemetry());
    services.registerSingleton('AuthorizationGuard', () => new AuthorizationGuard());
    services.registerSingleton('IActionRateLimiter', () => new ActionRateLimiter());
    services.registerSingleton('IIdempotencyGuard', () => new IdempotencyGuard());
    services.registerSingleton('ValidationExecutor', () => new ValidationExecutor());
    
    services.registerSingleton('ActionExecutor', (provider) => new ActionExecutor(
      provider.resolve('IMediator') as any,
      provider.resolve('IActionTelemetry') as any,
      provider.resolve('IActionRateLimiter') as any,
      provider.resolve('AuthorizationGuard') as any,
      provider.resolve('IIdempotencyGuard') as any,
      provider.resolve('ValidationExecutor') as any
    ));
  }
}
