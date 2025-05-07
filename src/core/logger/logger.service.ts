import { pino, Logger as Pino } from 'pino';
import { Logger } from './logger.interface.js';

export class LoggerService implements Logger {
  private readonly logger: Pino;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL ?? 'info',
    });
  }

  info(message: string, ...params: unknown[]) {
    this.logger.info(message, ...params);
  }

  warn(message: string, ...params: unknown[]) {
    this.logger.warn(message, ...params);
  }

  error(message: string, ...params: unknown[]) {
    this.logger.error(message, ...params);
  }

  debug(message: string, ...params: unknown[]) {
    this.logger.debug(message, ...params);
  }
}

