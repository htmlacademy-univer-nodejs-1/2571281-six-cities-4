import { Logger } from '../core/logger/logger.interface.js';

export class Application {
  constructor(private readonly logger: Logger) {}

  public async init(): Promise<void> {
    this.logger.info('Приложение инициализировано');
  }
}
