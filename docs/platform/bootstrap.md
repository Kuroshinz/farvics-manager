# Application Bootstrap & Module Registration

## Startup Sequence
The exact bootstrapping phase follows strict structural rules designed to fail-fast:
1. **Configuration**: Parses and validates all `SUPABASE_KEY`, `JWT_SECRET`, etc. `ConfigurationBootstrap` guarantees the env exists.
2. **DI Container**: The `ApplicationBuilder` instantiates the raw `ServiceContainer`.
3. **Module Loading**: `ModuleLoader` discovers (statically or dynamically) `PlatformModuleRegistration`, `IdentityModuleRegistration`, `FinancialModuleRegistration`.
4. **Registration**: Every module maps its components (`Repositories`, `Handlers`, `Application Services`).
5. **Runtime Pre-warming**: `RuntimeBootstrap` explicitly resolves core Singletons (like `IMediator` and `IPipelineBehavior` chains) to map the execution paths.
6. **Health Checks**: `HealthBootstrap` guarantees no `Critical` subsystem is offline.
7. **Workers**: `WorkerBootstrap` mounts the `DispatcherRuntime` and `WorkerEngine` polling loops tied natively to a central `AbortSignal`.

## Pipeline Extension Guide
The execution pipeline is registered strictly in: `Logging -> Metrics -> Audit -> Validation -> Authorization -> Retry -> Transaction -> Event Publishing`. 
To add an extension, inject `ServiceRegistrationExtensions.registerPipelineBehavior` during `PlatformModuleRegistration`.

## Worker & Shutdown Lifecycle
All worker engines consume a shared Node `AbortSignal` triggered on `SIGTERM` or `SIGINT`. `WorkerBootstrap.start()` attaches an event listener invoking `.stop()` across all runtimes, draining queues gracefully before process exit.
