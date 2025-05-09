import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import type { LoggerInterface } from '../libs/logger.interface.js';
import type { ConfigService } from '../config/config.service.js';
import { DatabaseClient } from '../database/database-client.interface.js';
import express, { type Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller } from '../common/controller/controller.js';
import { HelloController } from '../modules/hello/hello.controller.js';


@injectable()
export class Application {
  constructor(
    @inject(TYPES.Logger) private readonly logger: LoggerInterface,
    @inject(TYPES.Config) private readonly config: ConfigService,
    @inject(TYPES.DatabaseClient) private readonly dbClient: DatabaseClient,
  ) {}

  private readonly app: Express = express();
  private readonly controllers: Controller[] = [];

  public async init(): Promise<void> {
    const port = this.config.get('PORT');
    const mongoUri = this.config.get('MONGO_URI');

    await this.dbClient.connect(mongoUri);

    this.app.use(express.json());
    this.app.get('/ping', (_req, res) => {
      res.sendStatus(StatusCodes.OK);
    });

    this.controllers.push(new HelloController());
    this.registerControllers();

    this.app.listen(port, () =>
      this.logger.info(`🟢 Express server is listening on port ${port}`),
    );
  }

  private registerControllers(): void {
    this.controllers.forEach((c) => {
      this.app.use('/', c.router);
      this.logger.info(
        `[Route] Controller ${c.constructor.name} mounted with ${c.router.stack.length} routes`,
      );
    });
  }
}
