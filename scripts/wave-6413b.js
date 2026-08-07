const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src');

// 1. ProductionTelemetry & AuthorizationGuard
const infraPath = path.join(root, 'shared', 'infrastructure', 'api');
const prodTelemetryCode = `
import { IActionTelemetry, ActionContext } from './ApiCore';
export class ProductionTelemetry implements IActionTelemetry {
  start(actionName: string, context: ActionContext): void {
    console.log(\`[TELEMETRY] \${actionName} started\`, { correlationId: context.correlationId, userId: context.userId, tenantId: context.tenantId });
  }
  recordSuccess(actionName: string, durationMs: number): void {
    console.log(\`[TELEMETRY] \${actionName} SUCCESS (\${durationMs}ms)\`);
  }
  recordFailure(actionName: string, error: unknown, durationMs: number): void {
    console.error(\`[TELEMETRY] \${actionName} FAILURE (\${durationMs}ms)\`, error);
  }
}
`;
fs.writeFileSync(path.join(infraPath, 'ProductionTelemetry.ts'), prodTelemetryCode);

const authGuardCode = `
import { AuthorizationGuard as BaseAuthGuard, ActionContext } from './ApiCore';
import { createClient } from '../../supabase/server';

export class AuthorizationGuard extends BaseAuthGuard {
  async authorize(context: ActionContext, requiredRoles: string[]): Promise<boolean> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session && requiredRoles.length > 0) return false;
    if (requiredRoles.length === 0) return true;
    return requiredRoles.some(role => context.roles.includes(role));
  }
}
`;
fs.writeFileSync(path.join(infraPath, 'AuthorizationGuard.ts'), authGuardCode);

// 2. DI Bootstrapper
const diBootstrapperCode = `
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
`;
fs.writeFileSync(path.join(root, 'shared', 'infrastructure', 'di', 'Bootstrapper.ts'), diBootstrapperCode);

// 3. Update PlatformModuleRegistration
const pRegPath = path.join(root, 'platform', 'PlatformModuleRegistration.ts');
let pRegContent = fs.readFileSync(pRegPath, 'utf8');
pRegContent = `
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

export class PlatformModuleRegistration extends ModuleRegistration {
  readonly name = 'PlatformModule';

  registerModule(services: IServiceCollection): void {
    DefaultServiceRegistry.register(services);
    
    services.registerSingleton('IMediator', (provider) => new Mediator(provider));
    services.registerScoped('IUnitOfWork', (provider) => new SupabaseUnitOfWork(new SupabaseRpcTransactionExecutor()));
    
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
`;
fs.writeFileSync(pRegPath, pRegContent);
