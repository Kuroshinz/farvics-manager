import { IStartupValidator } from './Bootstrapper';
import { IConfiguration } from '../../core/Config';

export class StartupValidator implements IStartupValidator {
  constructor(private readonly config: IConfiguration) {}

  async validate(): Promise<void> {
    const requiredEnv = ['NODE_ENV']; // e.g. 'DATABASE_URL', 'JWT_SECRET'
    for (const env of requiredEnv) {
      if (!this.config.has(env)) {
        throw new Error(`Missing required configuration: ${env}`);
      }
    }
    // Validation for Database connectivity and migrations would go here
  }
}
