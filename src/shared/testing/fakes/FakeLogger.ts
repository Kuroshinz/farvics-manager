import { ILogger } from '../../core/Logger';

export class FakeLogger implements ILogger {
  public logs: { level: string; message: string; meta?: any; error?: Error }[] = [];

  info(message: string, meta?: any): void {
    this.logs.push({ level: 'INFO', message, meta });
  }

  error(message: string, error?: Error, meta?: any): void {
    this.logs.push({ level: 'ERROR', message, meta, error });
  }

  warn(message: string, meta?: any): void {
    this.logs.push({ level: 'WARN', message, meta });
  }

  debug(message: string, meta?: any): void {
    this.logs.push({ level: 'DEBUG', message, meta });
  }

  fatal(message: string, error?: Error, meta?: any): void {
    this.logs.push({ level: 'FATAL', message, meta, error });
  }
  
  clear(): void {
    this.logs = [];
  }
}
