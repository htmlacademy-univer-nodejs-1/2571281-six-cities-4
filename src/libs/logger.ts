import { pino, Logger as PinoInstance } from 'pino';
import { injectable } from 'inversify';
import { LoggerInterface } from './logger.interface.js';

@injectable()
export class PinoLogger implements LoggerInterface {
  private readonly logger: PinoInstance;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL ?? 'info',
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true, ignore: 'pid,hostname' } }
          : undefined
    });
  }

  info(msg: string): void {
    this.logger.info(msg);
  }

  error(msg: string, err?: unknown): void {
    this.logger.error({ err }, msg);
  }

  warn(msg: string): void {
    this.logger.warn(msg);
  }
}
