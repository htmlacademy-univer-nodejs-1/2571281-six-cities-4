import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import type { LoggerInterface } from '../libs/logger.interface.js';
import type { ConfigService } from '../config/config.service.js';
import { DatabaseClient } from '../database/database-client.interface.js';
import express, { type Express } from 'express';
import { Controller } from '../common/controller/controller.js';
import { container } from '../di/container.js';
import { UserController } from '../modules/user/user.controller.js';
import { OfferController } from '../modules/offer/offer.controller.js';
import { FavoriteController } from '../modules/favorite/favorite.controller.js';
import { AuthController } from '../modules/auth/auth.controller.js';
import { ExceptionFilter } from '../common/errors/exception.filter.js';
import { CommentController } from '../modules/comment/comment.controller.js';


@injectable()
export class Application {
  constructor(
    @inject(TYPES.Logger) private readonly logger: LoggerInterface,
    @inject(TYPES.Config) private readonly config: ConfigService,
    @inject(TYPES.DatabaseClient) private readonly dbClient: DatabaseClient,
    @inject(TYPES.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter
  ) {}

  private readonly app: Express = express();
  private readonly controllers: Controller[] = [];

  public async init(): Promise<void> {
    const port = this.config.get('PORT');
    const mongoUri = this.config.get('MONGO_URI');

    await this.dbClient.connect(mongoUri);

    this.registerMiddlewares();

    this.controllers.push(
      container.get(UserController),
      container.get(OfferController),
      container.get(FavoriteController),
      container.get(AuthController),
      container.get(CommentController)
    );
    this.registerControllers();

    this.app.use(this.exceptionFilter.catch);

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

  private registerMiddlewares(): void {
    this.app.use(express.json());
  }
}
