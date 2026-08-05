import { IConfiguration } from '../../core/Config';

export class EnvConfiguration implements IConfiguration {
  get<T>(key: string): T {
    return process.env[key] as unknown as T;
  }

  getString(key: string): string {
    return process.env[key] || '';
  }

  getNumber(key: string): number {
    return Number(process.env[key] || 0);
  }

  getBoolean(key: string): boolean {
    return process.env[key] === 'true';
  }

  has(key: string): boolean {
    return process.env[key] !== undefined;
  }
}
