import { logger } from '../libs/logger.js';

export class Application {
  public async init(): Promise<void> {
    logger.info('Application initialised');
  }
}
