import { IModule } from '../../composition/Registry';
import { IServiceCollection } from '../../composition/DI';

export abstract class ModuleRegistration implements IModule {
  abstract readonly name: string;
  abstract registerModule(services: IServiceCollection): void;
}
