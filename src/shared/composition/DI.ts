export enum ServiceLifetime {
  Singleton = 'Singleton',
  Scoped = 'Scoped',
  Transient = 'Transient'
}

export type Token<T> = symbol | string | { new (...args: any[]): T };
export type Factory<T> = (provider: IServiceProvider) => T;

export interface IServiceCollection {
  registerSingleton<T>(token: Token<T>, factory: Factory<T>): void;
  registerScoped<T>(token: Token<T>, factory: Factory<T>): void;
  registerTransient<T>(token: Token<T>, factory: Factory<T>): void;
}

export interface IServiceProvider {
  resolve<T>(token: Token<T>): T;
  tryResolve<T>(token: Token<T>): T | null;
  resolveMany<T>(token: Token<T>): T[];
}
