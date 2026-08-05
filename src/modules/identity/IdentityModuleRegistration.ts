import { ModuleRegistration } from '../../shared/infrastructure/di/ModuleRegistration';
import { IServiceCollection } from '../../shared/composition/DI';

export class IdentityModuleRegistration extends ModuleRegistration {
  readonly name = 'IdentityModule';

  registerModule(services: IServiceCollection): void {
    // Repositories, Handlers, Validators
  }
}
