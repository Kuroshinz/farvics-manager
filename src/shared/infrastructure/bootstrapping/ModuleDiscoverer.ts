import { IModuleDiscoverer, IModule } from '../../composition/Registry';

export class StaticModuleDiscoverer implements IModuleDiscoverer {
  constructor(private readonly registeredModules: IModule[]) {}

  async discover(): Promise<IModule[]> {
    return this.registeredModules;
  }
}
