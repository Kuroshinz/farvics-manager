import { IServiceCollection } from '../../composition/DI';
import { ConsoleLogger } from '../logger/ConsoleLogger';
import { SystemClock } from '../providers/SystemClock';
import { EnvConfiguration } from '../config/EnvConfiguration';
import { InMemoryCache } from '../cache/InMemoryCache';
import { JsonSerializer } from '../serialization/JsonSerializer';
import { CryptoIdGenerator } from '../providers/CryptoIdGenerator';
import { HealthCheckProvider } from '../health/HealthCheckProvider';

export class DefaultServiceRegistry {
  static register(services: IServiceCollection): void {
    services.registerSingleton('ILogger', () => new ConsoleLogger());
    services.registerSingleton('IClock', () => new SystemClock());
    services.registerSingleton('IConfiguration', () => new EnvConfiguration());
    services.registerSingleton('ICache', () => new InMemoryCache());
    services.registerSingleton('ISerializer', () => new JsonSerializer());
    services.registerSingleton('IIdGenerator', () => new CryptoIdGenerator());
    services.registerSingleton('IHealthCheckProvider', () => new HealthCheckProvider());
  }
}
