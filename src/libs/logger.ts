import { pino, Logger as PinoInstance } from 'pino';
import { injectable } from 'inversify';

export interface Logger {
  info(msg: string): void;
  error(msg: string, err?: unknown): void;
}

@injectable()
export class PinoLogger implements Logger {
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
}
