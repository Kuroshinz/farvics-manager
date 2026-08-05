import { ILogger } from '../../core/Logger';

export class ConsoleLogger implements ILogger {
  private format(level: string, message: string, meta?: any) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    });
  }

  info(message: string, meta?: any): void {
    console.info(this.format('INFO', message, meta));
  }

  error(message: string, error?: Error, meta?: any): void {
    console.error(this.format('ERROR', message, { ...meta, error: error?.message, stack: error?.stack }));
  }

  warn(message: string, meta?: any): void {
    console.warn(this.format('WARN', message, meta));
  }

  debug(message: string, meta?: any): void {
    console.debug(this.format('DEBUG', message, meta));
  }

  fatal(message: string, error?: Error, meta?: any): void {
    console.error(this.format('FATAL', message, { ...meta, error: error?.message, stack: error?.stack }));
  }
}
