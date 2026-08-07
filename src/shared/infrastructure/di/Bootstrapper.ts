
import { ServiceContainer } from './ServiceContainer';
import { PlatformModuleRegistration } from '../../../platform/PlatformModuleRegistration';
import { FinancialModuleRegistration } from '../../../modules/financial/FinancialModuleRegistration';
import { IdentityModuleRegistration } from '../../../modules/identity/IdentityModuleRegistration';

let containerInstance: ServiceContainer | null = null;

export function getContainer(): ServiceContainer {
  if (!containerInstance) {
    containerInstance = new ServiceContainer();
    const platform = new PlatformModuleRegistration();
    const financial = new FinancialModuleRegistration();
    const identity = new IdentityModuleRegistration();
    
    platform.registerModule(containerInstance);
    financial.registerModule(containerInstance);
    identity.registerModule(containerInstance);
  }
  return containerInstance;
}
