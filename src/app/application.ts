import { logger } from '../libs/logger.js';
import { appConfig } from '../config/config.js';

export class Application {
  public async init(): Promise<void> {
    const port = appConfig.get('PORT');
    logger.info(`Application initialised. Configured port: ${port}`);
  }
}
