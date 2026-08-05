import { IModuleDiscoverer, IModule } from '../shared/composition/Registry';
import { IdentityModuleRegistration } from '../modules/identity/IdentityModuleRegistration';
import { FinancialModuleRegistration } from '../modules/financial/FinancialModuleRegistration';
import { PlatformModuleRegistration } from '../platform/PlatformModuleRegistration';

export class ModuleLoader implements IModuleDiscoverer {
  async discover(): Promise<IModule[]> {
    // In a dynamic system, this reads from a config or scans directory tree.
    // For pure execution without hardcoded framework loops, we return the registered bounds explicitly.
    return [
      new PlatformModuleRegistration(),
      new IdentityModuleRegistration(),
      new FinancialModuleRegistration()
    ];
  }
}
