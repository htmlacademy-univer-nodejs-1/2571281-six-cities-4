import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import type { LoggerInterface } from '../libs/logger.interface.js';
import type { ConfigService } from '../config/config.service.js';
import { DatabaseClient } from '../database/database-client.interface.js';

@injectable()
export class Application {
  constructor(
    @inject(TYPES.Logger) private readonly logger: LoggerInterface,
    @inject(TYPES.Config) private readonly config: ConfigService,
    @inject(TYPES.DatabaseClient) private readonly dbClient: DatabaseClient,
  ) {}

  public async init(): Promise<void> {
    const port = this.config.get('PORT');
    const mongoUri = this.config.get('mongoUri');

    await this.dbClient.connect(mongoUri);
    this.logger.info(`Application initialised. Configured port: ${port}`);
  }
}
