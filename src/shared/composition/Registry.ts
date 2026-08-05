import { IServiceCollection, IServiceProvider } from './DI';

export interface IDomainRegistry {
  register(services: IServiceCollection): void;
}

export interface IApplicationRegistry {
  register(services: IServiceCollection): void;
}

export interface IInfrastructureRegistry {
  register(services: IServiceCollection): void;
}

export interface IModule {
  readonly name: string;
  registerModule(services: IServiceCollection): void;
}

export interface IModuleDiscoverer {
  discover(): Promise<IModule[]>;
}

export interface IBootstrapper {
  initialize(provider: IServiceProvider): Promise<void>;
  shutdown(provider: IServiceProvider): Promise<void>;
  runHealthChecks(provider: IServiceProvider): Promise<void>;
}
