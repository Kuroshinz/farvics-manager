import { IConfiguration } from '../shared/core/Config';
import { ILogger } from '../shared/core/Logger';

export class ConfigurationBootstrap {
  static validate(config: IConfiguration, logger: ILogger): void {
    logger.info('Validating configuration...');
    const requiredKeys = [
      'SUPABASE_URL',
      'SUPABASE_KEY',
      'JWT_SECRET',
      'NODE_ENV'
    ];

    const missingKeys: string[] = [];
    for (const key of requiredKeys) {
      if (!config.has(key) || config.getString(key).trim() === '') {
        missingKeys.push(key);
      }
    }

    if (missingKeys.length > 0) {
      const errorMsg = `Missing required configuration keys: ${missingKeys.join(', ')}`;
      logger.fatal(errorMsg);
      throw new Error(errorMsg);
    }
    logger.info('Configuration validated successfully.');
  }
}
