# Composition Root Architecture

## Startup Flow
The bootstrapping process orchestrates the application startup lifecycle in a clean, predictable sequence:
1. IModuleDiscoverer resolves all active system modules.
2. The core IServiceCollection is initialized.
3. Modules invoke egisterModule(services).
4. The IServiceProvider container is built.
5. The IBootstrapper runs .initialize(provider).
6. Health checks are evaluated.
7. The application begins accepting requests.

## Registration Order
Dependencies must be registered from the inside out to avoid cross-layer pollution:
1. **Domain Registry**: Pure logic, stateless models, policies.
2. **Application Registry**: Pipeline behaviors, use cases, mediators.
3. **Infrastructure Registry**: External adapters, database context, email services.

## Dependency Graph & Rules
- Allowed Flow: Infrastructure -> Application -> Domain.
- Modules must NEVER instantiate dependencies directly (No 
ew Service()).
- Circular dependencies are detected during the container build phase and will throw a CircularDependencyException.
- Modules cannot directly register or inject implementations from other modules; they must depend strictly on platform contracts or events.

## Module Loading Strategy
Modules implement the IModule interface, self-registering their specific domain, application, and infrastructure registries via egisterModule. The IModuleDiscoverer can leverage filesystem scanning or manual boot lists depending on the environment (Serverless vs Long-running).

## Future IoC Integration
This architecture relies purely on interfaces (IServiceCollection, IServiceProvider). When an actual IoC library (such as TSyringe, Inversify, or Awilix) is introduced, it will implement these interfaces within the Composition Root. No application or domain code will change.
