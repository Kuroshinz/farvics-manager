import { IModule } from '../../shared/composition/Registry';
import { IServiceCollection } from '../../shared/composition/DI';

export class IdentityModule implements IModule {
  readonly name = 'Identity';

  registerModule(services: IServiceCollection): void {
    // Future identity registrations
  }
}
