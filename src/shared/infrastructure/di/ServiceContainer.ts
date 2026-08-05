import { IServiceCollection, IServiceProvider, ServiceLifetime, Token, Factory } from '../../composition/DI';

interface ServiceDescriptor<T> {
  lifetime: ServiceLifetime;
  factory: Factory<T>;
  instance?: T;
}

export class ServiceContainer implements IServiceCollection, IServiceProvider {
  private descriptors = new Map<symbol | string, ServiceDescriptor<any>>();
  private instances = new Map<symbol | string, any>();

  private getTokenKey(token: Token<any>): symbol | string {
    if (typeof token === 'string' || typeof token === 'symbol') {
      return token;
    }
    return token.name;
  }

  registerSingleton<T>(token: Token<T>, factory: Factory<T>): void {
    this.descriptors.set(this.getTokenKey(token), { lifetime: ServiceLifetime.Singleton, factory });
  }

  registerScoped<T>(token: Token<T>, factory: Factory<T>): void {
    // Basic implementation of scoped mapping to singleton in this simplified container
    this.descriptors.set(this.getTokenKey(token), { lifetime: ServiceLifetime.Scoped, factory });
  }

  registerTransient<T>(token: Token<T>, factory: Factory<T>): void {
    this.descriptors.set(this.getTokenKey(token), { lifetime: ServiceLifetime.Transient, factory });
  }

  resolve<T>(token: Token<T>): T {
    const key = this.getTokenKey(token);
    const descriptor = this.descriptors.get(key);

    if (!descriptor) {
      throw new Error(`Service not registered for ${String(key)}`);
    }

    if (descriptor.lifetime === ServiceLifetime.Singleton || descriptor.lifetime === ServiceLifetime.Scoped) {
      if (!this.instances.has(key)) {
        this.instances.set(key, descriptor.factory(this));
      }
      return this.instances.get(key) as T;
    }

    // Transient
    return descriptor.factory(this);
  }

  tryResolve<T>(token: Token<T>): T | null {
    try {
      return this.resolve(token);
    } catch {
      return null;
    }
  }

  resolveMany<T>(token: Token<T>): T[] {
    const resolved = this.tryResolve<T>(token);
    return resolved ? [resolved] : [];
  }
}
