import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import type { LoggerInterface } from '../libs/logger.interface.js';
import type { ConfigService } from '../config/config.service.js';
import { DatabaseClient } from '../database/database-client.interface.js';
import express, { type Express } from 'express';
import { StatusCodes } from 'http-status-codes';


@injectable()
export class Application {
  constructor(
    @inject(TYPES.Logger) private readonly logger: LoggerInterface,
    @inject(TYPES.Config) private readonly config: ConfigService,
    @inject(TYPES.DatabaseClient) private readonly dbClient: DatabaseClient,
  ) {}

  private readonly app: Express = express();

  public async init(): Promise<void> {
    const port = this.config.get('PORT');
    const mongoUri = this.config.get('MONGO_URI');

    await this.dbClient.connect(mongoUri);

    this.app.use(express.json());
    this.app.get('/ping', (_req, res) => {
      res.sendStatus(StatusCodes.OK);
    });

    this.app.listen(port, () =>
      this.logger.info(`🟢 Express server is listening on port ${port}`),
    );
  }

}
