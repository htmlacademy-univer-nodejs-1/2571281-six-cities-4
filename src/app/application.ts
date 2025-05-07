import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import type { Logger } from '../libs/logger.js';
import type { ConfigService } from '../config/config.service.js';

@injectable()
export class Application {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.Config) private readonly config: ConfigService
  ) {}

  public async init(): Promise<void> {
    const port = this.config.get('PORT');
    this.logger.info(`Application initialised. Configured port: ${port}`);
  }
}
