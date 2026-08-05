import { ModuleRegistration } from '../../shared/infrastructure/di/ModuleRegistration';
import { IServiceCollection } from '../../shared/composition/DI';

export class FinancialModuleRegistration extends ModuleRegistration {
  readonly name = 'FinancialModule';

  registerModule(services: IServiceCollection): void {
    // Repositories
    // Handlers
    // Validators
    // Application Services
    // Policies
    // Specifications
    // Factories
    // Projection Builders
    // Health Checks
  }
}
